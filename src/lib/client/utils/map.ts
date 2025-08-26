import type { DistrictInfo } from '../map-data';
import * as THREE from 'three';
import offsetPolygon from 'offset-polygon';

const computeArithmeticMean = (pts: THREE.Vector2[]): THREE.Vector2 => {
	const sum = pts.reduce((acc, pt) => acc.add(pt), new THREE.Vector2(0, 0));
	return sum.divideScalar(pts.length);
};

const computePolygonCentroid = (pts: THREE.Vector2[]): THREE.Vector2 => {
	if (pts.length === 0) return new THREE.Vector2(0, 0);

	// points/lines fallback
	if (pts.length < 3) return computeArithmeticMean(pts);

	let area = 0;
	let cx = 0;
	let cy = 0;

	for (let i = 0; i < pts.length; i++) {
		const curr = pts[i];
		const next = pts[(i + 1) % pts.length];
		const cross = curr.x * next.y - next.x * curr.y;

		area += cross;
		cx += (curr.x + next.x) * cross;
		cy += (curr.y + next.y) * cross;
	}

	// degenerate polygon fallback
	if (Math.abs(area) < 1e-8) return computeArithmeticMean(pts);

	const scale = 1 / (3 * area);
	return new THREE.Vector2(cx * scale, cy * scale);
};

export const generateDistrictShape = (
	district: DistrictInfo,
	cornerRadius: number,
	insetDistance: number
): [THREE.Shape, THREE.Vector2] => {
	const shape = new THREE.Shape();
	let points = district.points;

	const offsetPoints = offsetPolygon(points, -insetDistance);
	points = offsetPoints.map((p) => new THREE.Vector2(p.x, p.y));

	const centroid = computePolygonCentroid(points);

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
