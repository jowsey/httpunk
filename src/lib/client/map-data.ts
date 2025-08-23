import * as THREE from 'three';

export interface MapCameraState {
	target: THREE.Vector3;
	position: THREE.Vector3;
	rotation: THREE.Quaternion;
}

export interface DistrictInfo {
	color: number;
	points: THREE.Vector2[];
}

export const districts: DistrictInfo[] = [
	{
		color: 0xa3e635,
		points: [
			new THREE.Vector2(1500, -2000),
			new THREE.Vector2(2250, -1250),
			new THREE.Vector2(1925, -500),
			new THREE.Vector2(2100, 50),
			new THREE.Vector2(2000, 700),
			new THREE.Vector2(1025, 1150),
			new THREE.Vector2(650, 1100),
			new THREE.Vector2(800, 175),
			new THREE.Vector2(0, -875),
			new THREE.Vector2(375, -1425)
		]
	},
	{
		color: 0x86efac,
		points: [
			new THREE.Vector2(0, -875),
			new THREE.Vector2(800, 175),
			new THREE.Vector2(650, 1100),
			new THREE.Vector2(200, 1725),
			new THREE.Vector2(-575, 1825),
			new THREE.Vector2(-1175, 1275),
			new THREE.Vector2(-1925, 1200),
			new THREE.Vector2(-2125, 725),
			new THREE.Vector2(-1500, 0),
			new THREE.Vector2(-1625, -875),
			new THREE.Vector2(-2000, -925),
			new THREE.Vector2(-2050, -1425),
			new THREE.Vector2(-1575, -1825),
			new THREE.Vector2(-1275, -1825),
			new THREE.Vector2(-975, -1625),
			new THREE.Vector2(-350, -1750)
		]
	},
	{
		color: 0xfde047,
		points: [
			new THREE.Vector2(-2050, -1425),
			new THREE.Vector2(-2750, -1975),
			new THREE.Vector2(-3075, -2575),
			new THREE.Vector2(-4500, -3325),
			new THREE.Vector2(-4500, -4500),
			new THREE.Vector2(-1500, -4500),
			new THREE.Vector2(-1150, -3350),
			new THREE.Vector2(-1225, -2925),
			new THREE.Vector2(-850, -2425),
			new THREE.Vector2(-650, -2000),
			new THREE.Vector2(-600, -1700),
			new THREE.Vector2(-975, -1625),
			new THREE.Vector2(-1275, -1825),
			new THREE.Vector2(-1575, -1825)
		]
	},
	{
		color: 0xfdba74,
		points: [
			new THREE.Vector2(1000, -3200),
			new THREE.Vector2(1275, -2575),
			new THREE.Vector2(1275, -2075),
			new THREE.Vector2(1400, -1950),
			new THREE.Vector2(375, -1425),
			new THREE.Vector2(0, -875),
			new THREE.Vector2(-350, -1750),
			new THREE.Vector2(-600, -1700),
			new THREE.Vector2(-650, -2000),
			new THREE.Vector2(-850, -2425),
			new THREE.Vector2(-1225, -2925),
			new THREE.Vector2(-1150, -3350),
			new THREE.Vector2(-1500, -4500),
			new THREE.Vector2(1000, -4500)
		]
	},
	{
		color: 0xf87171,
		points: [
			new THREE.Vector2(2250, -1250),
			new THREE.Vector2(2950, -1275),
			new THREE.Vector2(3775, -450),
			new THREE.Vector2(4500, -450),
			new THREE.Vector2(4500, -4500),
			new THREE.Vector2(1000, -4500),
			new THREE.Vector2(1000, -3200),
			new THREE.Vector2(1275, -2575),
			new THREE.Vector2(1275, -2075),
			new THREE.Vector2(1400, -1950),
			new THREE.Vector2(1500, -2000)
		]
	},
	{
		color: 0xdc2626,
		points: [
			new THREE.Vector2(1500, 2300),
			new THREE.Vector2(2000, 1800),
			new THREE.Vector2(3150, 1575),
			new THREE.Vector2(4500, 2150),
			new THREE.Vector2(4500, 4500),
			new THREE.Vector2(2500, 4500)
		]
	},
	{
		color: 0x991b1b,
		points: [
			new THREE.Vector2(-500, 2700),
			new THREE.Vector2(1500, 2300),
			new THREE.Vector2(2500, 4500),
			new THREE.Vector2(-1100, 4500)
		]
	},
	{
		color: 0x880909,
		points: [
			new THREE.Vector2(-4500, 4500),
			new THREE.Vector2(-4500, 2500),
			new THREE.Vector2(-4175, 2150),
			new THREE.Vector2(-3000, 1900),
			new THREE.Vector2(-1500, 2200),
			new THREE.Vector2(-500, 2700),
			new THREE.Vector2(-1100, 4500)
		]
	}
];
