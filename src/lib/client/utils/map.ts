import type { DistrictInfo } from '../map-data';
import * as THREE from 'three';

export const generateDistrictShape = (
	district: DistrictInfo,
	cornerRadius: number,
	insetDistance: number
): [THREE.Shape, THREE.Vector2] => {
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

	return [shape, centroid];
};

export const generateDistrictTexture = (district: DistrictInfo) => {
	const canvas = document.createElement('canvas');
	const context = canvas.getContext('2d')!;

	canvas.width = 1200;
	canvas.height = 300;

	context.fillStyle = 'rgba(0, 0, 0, 0.99)';
	context.fillRect(0, 0, canvas.width, canvas.height);

	context.fillStyle = `#${district.color.toString(16).padStart(6, '0')}`;
	context.fillRect(0, 0, 32, canvas.height);

	const fontSans = getComputedStyle(document.documentElement).getPropertyValue('--font-sans');
	context.font = `500 128px ${fontSans}`;
	context.fillStyle = '#ffffff';
	context.textAlign = 'left';
	context.textBaseline = 'top';
	context.fillText(district.name, 96, 56);

	context.font = `300 64px ${fontSans}`;
	context.textBaseline = 'bottom';
	context.fillText(`Lvl. ${district.levelRange[0]} - ${district.levelRange[1]}`, 96, canvas.height - 56);

	const texture = new THREE.CanvasTexture(canvas);
	texture.needsUpdate = true;

	return texture;
};
