import type { LatLng } from 'react-native-maps';

const EARTH_RADIUS = 6371; // Earth's radius in kilometers

export const calculateDistance = (loc1: LatLng, loc2: LatLng) => {
	const toRad = (value: number) => (value * Math.PI) / 180;
	const R = EARTH_RADIUS;

	const dLat = toRad(loc2.latitude - loc1.latitude);
	const dLong = toRad(loc2.longitude - loc1.longitude);

	const a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(loc1.latitude)) * Math.cos(toRad(loc2.latitude)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

	return R * c;
};
