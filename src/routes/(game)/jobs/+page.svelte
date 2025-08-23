<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { ViewportGizmo } from 'three-viewport-gizmo';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';

	interface DistrictInfo {
		color: number;
		points: THREE.Vector2[];
	}

	const cameraRotSpeed = 0.1;
	const cameraStartingHeight = 3000;
	const cameraStartingRadius = 2500;
	const cameraLookAtTarget = new THREE.Vector3(0, 100, 0);
	const cameraFov = 55;
	const hologramOpacity = 0.35;

	const districts: DistrictInfo[] = [
		{
			color: 0x55ff55,
			points: [
				new THREE.Vector2(1500, -2000),
				new THREE.Vector2(2250, -1250),
				new THREE.Vector2(1750, -500),
				new THREE.Vector2(2100, 50),
				new THREE.Vector2(2000, 700),
				new THREE.Vector2(1000, 1150),
				new THREE.Vector2(675, 1100),
				new THREE.Vector2(775, 250),
				new THREE.Vector2(0, -900),
				new THREE.Vector2(375, -1425)
			]
		}
	];

	let renderer: THREE.WebGLRenderer;
	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let composer: EffectComposer;
	let controls: OrbitControls;
	let gizmo: ViewportGizmo;

	let mapContainer: HTMLDivElement;
	let mapCanvas: HTMLCanvasElement;

	let lastTime: number | undefined = undefined;
	const animate = (time: number) => {
		if (!mapContainer) return; // component unmounted, can happen in HMR (?)

		// time in sec since last frame
		const deltaTime = (time - (lastTime ?? time)) / 1000;
		lastTime = time;

		scene.getObjectByName('city')?.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const material = (child as THREE.Mesh).material as THREE.MeshPhysicalMaterial;
				if (material.opacity < hologramOpacity) {
					material.opacity += 0.01 * deltaTime;
				}
			}
		});

		const canvasWidth = renderer.domElement.width;
		const canvasHeight = renderer.domElement.height;

		const containerWidth = mapContainer.clientWidth;
		const containerHeight = mapContainer.clientHeight;

		if (canvasWidth !== containerWidth || canvasHeight !== containerHeight) {
			renderer.setSize(containerWidth, containerHeight);
			renderer.setPixelRatio(window.devicePixelRatio);
			composer.setSize(containerWidth, containerHeight);
			composer.setPixelRatio(window.devicePixelRatio);

			camera.aspect = containerWidth / containerHeight;
			camera.updateProjectionMatrix();
			gizmo.update();
		}

		controls.update(deltaTime);
		composer.render(deltaTime);
		gizmo.render();
	};

	onMount(() => {
		scene = new THREE.Scene();

		const ambientLight = new THREE.AmbientLight(0xffffff, 1);
		scene.add(ambientLight);

		const hologramMaterial = new THREE.MeshPhysicalMaterial({
			color: 0x88e3ff,
			emissive: 0x0000ff,
			emissiveIntensity: 1.8,
			transparent: true,
			side: THREE.DoubleSide,
			depthWrite: false,
			blending: THREE.AdditiveBlending
		});

		// Load city model
		const loader = new GLTFLoader();
		loader.setMeshoptDecoder(MeshoptDecoder);
		loader.load('/3d/city-compressed.glb', (gltf) => {
			gltf.scene.name = 'city';
			gltf.scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = hologramMaterial;
					(child.material as THREE.MeshPhysicalMaterial).opacity = 0;
				}
			});

			scene.add(gltf.scene);
		});

		// District overlays
		const overlayGroup = new THREE.Group();
		overlayGroup.name = 'districtOverlays';
		overlayGroup.renderOrder = 1;
		scene.add(overlayGroup);

		const overlayMaterial = new THREE.MeshBasicMaterial({
			transparent: true,
			opacity: 0.25,
			side: THREE.DoubleSide,
			depthWrite: false
		});

		for (const district of districts) {
			const shape = new THREE.Shape();
			const points = district.points;
			const curveRadius = 64;

			shape.moveTo(points[0].x, points[0].y);
			for (let i = 1; i < points.length + 1; i++) {
				const p0 = points[(i - 1) % points.length];
				const p1 = points[i % points.length];
				const p2 = points[(i + 1) % points.length];

				const v0 = new THREE.Vector2().subVectors(p1, p0).normalize();
				const v1 = new THREE.Vector2().subVectors(p2, p1).normalize();

				const angle = Math.acos(THREE.MathUtils.clamp(v0.dot(v1), -1, 1));
				const distance = curveRadius / Math.tan(angle / 2);

				const start = new THREE.Vector2().copy(p1).sub(v0.multiplyScalar(distance));
				const end = new THREE.Vector2().copy(p1).add(v1.multiplyScalar(distance));

				shape.lineTo(start.x, start.y);
				shape.quadraticCurveTo(p1.x, p1.y, end.x, end.y);
			}

			const geometry = new THREE.ShapeGeometry(shape);
			geometry.rotateX(Math.PI / 2);

			const overlayMesh = new THREE.Mesh(geometry, overlayMaterial);
			overlayMesh.material.color.set(district.color);
			overlayGroup.add(overlayMesh);
		}

		// Renderer
		renderer = new THREE.WebGLRenderer({
			alpha: true,
			antialias: true,
			canvas: mapCanvas,
			logarithmicDepthBuffer: true
		});
		renderer.setSize(mapContainer.clientWidth, mapContainer.clientHeight);
		renderer.setPixelRatio(window.devicePixelRatio);
		renderer.setAnimationLoop(animate);

		renderer.toneMapping = THREE.ACESFilmicToneMapping;

		// Camera
		camera = new THREE.PerspectiveCamera(cameraFov, mapContainer.clientWidth / mapContainer.clientHeight, 0.1, 100_000);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.screenSpacePanning = false;
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.PAN,
			MIDDLE: THREE.MOUSE.DOLLY,
			RIGHT: THREE.MOUSE.ROTATE
		};
		// controls.autoRotate = true;
		controls.autoRotateSpeed = cameraRotSpeed;
		controls.zoomToCursor = true;
		controls.update();

		let mapCameraPosition = JSON.parse(localStorage.getItem('mapCameraPosition') || 'null');
		let mapCameraRotation = JSON.parse(localStorage.getItem('mapCameraRotation') || 'null');
		let mapCameraTarget = JSON.parse(localStorage.getItem('mapCameraTarget') || 'null');

		if (mapCameraPosition && mapCameraRotation && mapCameraTarget) {
			camera.position.copy(mapCameraPosition);
			camera.setRotationFromQuaternion(mapCameraRotation);
			controls.target.copy(mapCameraTarget);
		} else {
			camera.position.x = -cameraStartingRadius;
			camera.position.y = cameraStartingHeight;
			camera.position.z = cameraStartingRadius;
			camera.lookAt(cameraLookAtTarget);
		}

		if (dev) {
			const gridSize = 10_000;
			const unitsPerSegment = 500;
			const gridHelper = new THREE.GridHelper(gridSize, gridSize / unitsPerSegment);
			scene.add(gridHelper);

			gizmo = new ViewportGizmo(camera, renderer);
			gizmo.attachControls(controls);
		}

		// Composer
		composer = new EffectComposer(renderer);
		composer.setSize(mapContainer.clientWidth, mapContainer.clientHeight);
		composer.setPixelRatio(window.devicePixelRatio);

		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		const outputPass = new OutputPass();
		composer.addPass(outputPass);

		const saveCameraState = () => {
			localStorage.setItem('mapCameraPosition', JSON.stringify(camera.position));
			localStorage.setItem('mapCameraRotation', JSON.stringify(camera.quaternion));
			localStorage.setItem('mapCameraTarget', JSON.stringify(controls.target));
		};

		window.addEventListener('beforeunload', saveCameraState);

		return () => {
			window.removeEventListener('beforeunload', saveCameraState);
			saveCameraState();

			scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();
					child.material.dispose();
				}
			});

			renderer.setAnimationLoop(null);

			scene.clear();
			renderer.dispose();
			composer.dispose();
			controls.dispose();
			gizmo.dispose();
		};
	});
</script>

<div bind:this={mapContainer} class="absolute inset-0 -z-50 h-dvh w-dvw">
	<canvas bind:this={mapCanvas}></canvas>
</div>

<div class="w-fit bg-neutral-950/85 px-6 py-2">
	<p class="text-3xl font-bold">Jobs</p>
</div>
