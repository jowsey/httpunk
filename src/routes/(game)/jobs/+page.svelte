<script lang="ts">
	import * as THREE from 'three';
	import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
	import { MeshoptDecoder } from 'three/addons/libs/meshopt_decoder.module.js';
	import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
	import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
	import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
	import { onMount } from 'svelte';

	const cameraRotSpeed = -0.000025;
	const cameraRadius = 2500;
	const cameraHeight = 2500;
	const cameraLookAtTarget = new THREE.Vector3(0, 100, 0);
	const cameraFov = 55;

	let renderer: THREE.WebGLRenderer;
	let camera: THREE.PerspectiveCamera;
	let scene: THREE.Scene;
	let composer: EffectComposer;

	let mapContainer: HTMLDivElement;
	let mapCanvas: HTMLCanvasElement;

	const hologramOpacity = 0.35;

	let lastTime: number | undefined = undefined;
	const animate = (time: number) => {
		if (!mapContainer) return; // component unmounted, can happen in HMR (?)

		// time in sec since last frame
		const deltaTime = (time - (lastTime ?? time)) / 1000;
		lastTime = time;

		scene.traverse((child) => {
			if (child instanceof THREE.Mesh) {
				const material = child.material as THREE.MeshPhysicalMaterial;
				if (material.opacity < hologramOpacity) {
					material.opacity += 0.01 * deltaTime;
				}
			}
		});

		// todo look into https://threejs.org/docs/#examples/en/controls/OrbitControls for manual control
		camera.position.x = cameraLookAtTarget.x + Math.sin(time * cameraRotSpeed) * cameraRadius;
		camera.position.z = cameraLookAtTarget.z + Math.cos(time * cameraRotSpeed) * cameraRadius;
		camera.lookAt(cameraLookAtTarget);

		const width = mapContainer.clientWidth;
		const height = mapContainer.clientHeight;
		camera.aspect = width / height;
		camera.updateProjectionMatrix();

		renderer.setSize(width, height);
		composer.setSize(width, height);
		composer.render(deltaTime);
	};

	onMount(() => {
		const mapAspect = mapContainer.clientWidth / mapContainer.clientHeight;

		camera = new THREE.PerspectiveCamera(cameraFov, mapAspect, 0.1, 10000);
		camera.position.y = cameraHeight;

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

		const loader = new GLTFLoader();
		loader.setMeshoptDecoder(MeshoptDecoder);
		loader.load('/3d/city-compressed.glb', (gltf) => {
			scene.add(gltf.scene);

			scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.material = hologramMaterial;
					(child.material as THREE.MeshPhysicalMaterial).opacity = 0;
				}
			});
		});

		renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, canvas: mapCanvas });
		renderer.setSize(mapContainer.clientWidth, mapContainer.clientHeight);
		renderer.setAnimationLoop(animate);

		// renderer.toneMapping = THREE.NeutralToneMapping;
		renderer.toneMapping = THREE.ACESFilmicToneMapping;

		composer = new EffectComposer(renderer);
		const renderPass = new RenderPass(scene, camera);
		composer.addPass(renderPass);

		// looks cool but for some reason darkens the background colour quite a bit which is not ideal
		// const bloomPass = new UnrealBloomPass(
		// 	new THREE.Vector2(mapContainer.clientWidth, mapContainer.clientHeight),
		// 	0.2,
		// 	0.1,
		// 	0.85
		// );
		// composer.addPass(bloomPass);

		const outputPass = new OutputPass();
		composer.addPass(outputPass);

		return () => {
			// todo check if there's anything else we need to dispose
			scene.traverse((child) => {
				if (child instanceof THREE.Mesh) {
					child.geometry.dispose();
					if (child.material instanceof THREE.Material) {
						child.material.dispose();
					}
				}
			});

			scene.clear();
			renderer.dispose();
			composer.dispose();
		};
	});
</script>

<div class="flex w-full items-center justify-between">
	<p class="text-3xl font-bold">Jobs</p>
	<p>Find work around the city.</p>
</div>

<div bind:this={mapContainer} class="absolute top-32 left-0 -z-50 h-dvh w-dvw">
	<div class="absolute -top-8 left-0 h-8 w-full shadow-lg shadow-neutral-950"></div>
	<canvas bind:this={mapCanvas}></canvas>
</div>

<!-- explicitly reserve space for absolute div^ -->
<div class="mt-24 h-dvh"></div>

<p>this is some placeholder text</p>
