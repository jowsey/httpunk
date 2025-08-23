<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
	import { ViewportGizmo } from 'three-viewport-gizmo';
	import { dev } from '$app/environment';
	import { onMount } from 'svelte';
	import { districts, type MapCameraState } from '$lib/client/map-data';

	const cameraRotSpeed = -0.1;
	const cameraStartingHeight = 3000;
	const cameraStartingRadius = 2500;
	const cameraFov = 40;
	const hologramOpacity = 0.35;
	const enableDevTools = false;

	let renderer: THREE.WebGLRenderer;
	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let composer: EffectComposer;
	let controls: OrbitControls;
	let gizmo: ViewportGizmo | undefined;

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
			gizmo?.update();
		}

		controls.update(deltaTime);
		composer.render(deltaTime);
		gizmo?.render();
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
		overlayGroup.renderOrder = -1;
		scene.add(overlayGroup);

		const overlayMaterial = new THREE.MeshPhysicalMaterial({
			metalness: 0.5,
			transparent: true,
			opacity: 0.5,
			side: THREE.BackSide,
			depthWrite: false
		});

		const cornerRadius = 50;
		const insetDistance = 8;

		for (const district of districts) {
			const shape = new THREE.Shape();
			let points = district.points;

			const centroid = points.reduce((acc, p) => acc.add(p), new THREE.Vector2()).divideScalar(points.length);
			points = points.map((p) => p.clone().sub(p.clone().sub(centroid).normalize().multiplyScalar(insetDistance)));

			points.forEach((point, i) => {
				const prev = points[(i - 1 + points.length) % points.length];
				const next = points[(i + 1) % points.length];

				const cornerStart = point.clone().add(prev.clone().sub(point).normalize().multiplyScalar(cornerRadius));
				const cornerEnd = point.clone().add(next.clone().sub(point).normalize().multiplyScalar(cornerRadius));

				if (i === 0) {
					shape.moveTo(cornerStart.x, cornerStart.y);
				} else {
					shape.lineTo(cornerStart.x, cornerStart.y);
				}

				shape.quadraticCurveTo(point.x, point.y, cornerEnd.x, cornerEnd.y);
			});

			const geometry = new THREE.ShapeGeometry(shape);
			geometry.rotateX(Math.PI / 2);

			const overlayMesh = new THREE.Mesh(geometry, overlayMaterial.clone());
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
		camera = new THREE.PerspectiveCamera(
			cameraFov,
			mapContainer.clientWidth / mapContainer.clientHeight,
			0.1,
			1_000_000
		);

		controls = new OrbitControls(camera, renderer.domElement);
		controls.enableDamping = true;
		controls.minDistance = 1000;
		controls.maxDistance = 5000;
		controls.maxTargetRadius = 5000;
		controls.maxPolarAngle = Math.PI / 2 - 0.35;
		controls.screenSpacePanning = false;
		controls.mouseButtons = {
			LEFT: THREE.MOUSE.PAN,
			MIDDLE: THREE.MOUSE.DOLLY,
			RIGHT: THREE.MOUSE.ROTATE
		};
		controls.autoRotate = true;
		controls.autoRotateSpeed = cameraRotSpeed;
		controls.zoomToCursor = true;

		const mapCamera = JSON.parse(localStorage.getItem('mapCamera') || 'null') as MapCameraState | null;

		if (mapCamera?.position && mapCamera?.rotation && mapCamera?.target) {
			controls.target.copy(mapCamera.target);
			camera.position.copy(mapCamera.position);
			camera.setRotationFromQuaternion(mapCamera.rotation);
		} else {
			const center = districts[0].points
				.reduce((acc, p) => acc.add(p), new THREE.Vector2())
				.divideScalar(districts[0].points.length);
			const center3D = new THREE.Vector3(center.x, 0, center.y);
			const offset = new THREE.Vector3(-cameraStartingRadius, cameraStartingHeight, cameraStartingRadius);

			controls.target.copy(center3D);
			camera.position.copy(center3D.clone().add(offset));
			camera.lookAt(center.x, 100, center.y);
		}

		controls.update();

		const gridSize = 10_000;
		const unitsPerSegment = 100;
		const gridHelper = new THREE.GridHelper(gridSize, gridSize / unitsPerSegment);
		gridHelper.material.transparent = true;
		gridHelper.material.opacity = 0.1;
		gridHelper.position.set(0, -1, 0);
		scene.add(gridHelper);

		if (dev && enableDevTools) {
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
			localStorage.setItem(
				'mapCamera',
				JSON.stringify({
					position: camera.position,
					rotation: camera.quaternion,
					target: controls.target
				} as MapCameraState)
			);
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

			gizmo?.dispose();
			controls.dispose();
			scene.clear();
			renderer.dispose();
			composer.dispose();
		};
	});
</script>

<div bind:this={mapContainer} class="absolute inset-0 -z-50 h-dvh w-dvw">
	<canvas bind:this={mapCanvas}></canvas>
</div>

<div class="w-fit bg-neutral-950/85 px-6 py-2 select-none">
	<p class="text-3xl font-bold">Jobs</p>
</div>
