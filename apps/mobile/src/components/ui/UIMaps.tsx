/* eslint-disable max-lines */
import React, { useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Linking, Platform } from 'react-native';
import { Image } from 'expo-image';
import MapView, { type LatLng, Marker, type Region, type UserLocationChangeEvent, PROVIDER_GOOGLE, PROVIDER_DEFAULT } from 'react-native-maps';
import Animated, { Easing, runOnJS, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Location from 'expo-location';
import * as Haptics from 'expo-haptics';
import globalStyles from '@/styles/global';
import { calculateDistance } from '@/lib/utils/map';
import { BRANCHES_LOCATIONS_MOCK, TEL_AVIV_REGION, VISIBILITY_RADIUS_KM } from '@/lib/data/consts/map';
import { UISvg } from './UISvg';
import { UIText } from './UIText';

export const UIMaps = () => {
	const [mapRegion, setMapRegion] = useState<Region>(TEL_AVIV_REGION);
	const [userCurrentLocation, setUserCurrentLocation] = useState<LatLng | null>(null);
	const [distanceFromUserToSelectedMarker, setDistanceFromUserToSelectedMarker] = useState<number | null>(null);
	const [selectedMarker, setSelectedMarker] = useState<LatLng | null>(null);
	const [errorMsg, setErrorMsg] = useState<string | null>(null);
	const shouldRenderActionBox = !!userCurrentLocation || !!distanceFromUserToSelectedMarker;

	const mapViewRef = useRef<MapView | null>(null);

	const translateY = useSharedValue(300);
	const opacity = useSharedValue(0);
	const bottom = useSharedValue(12);
	const currentLocationButtonOpacity = useSharedValue(1);

	const selectedMarkerAnimatedStyle = useAnimatedStyle(() => {
		return {
			transform: [{ translateY: translateY.value }],
			opacity: opacity.value,
		};
	});

	const currentLocationButtonAnimatedStyle = useAnimatedStyle(() => {
		return {
			bottom: bottom.value,
			opacity: currentLocationButtonOpacity.value,
		};
	});

	useEffect(() => {
		(async () => {
			const { status } = await Location.requestForegroundPermissionsAsync();

			if (status !== 'granted') {
				setErrorMsg('Permission to access location was denied');

				return;
			}
		})();
	}, []);

	const handleMarkerPress = (location: LatLng) => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
		setSelectedMarker(location);
		translateY.value = withTiming(0, {
			duration: 500,
			easing: Easing.out(Easing.exp),
		});
		opacity.value = withTiming(1, {
			duration: 500,
			easing: Easing.out(Easing.exp),
		});
		bottom.value = withTiming(175, {
			duration: 500,
			easing: Easing.out(Easing.exp),
		});

		if (mapViewRef.current) {
			mapViewRef.current.animateToRegion(
				{
					latitude: location.latitude,
					longitude: location.longitude,
					latitudeDelta: 0.0922,
					longitudeDelta: 0.0421,
				},
				1000,
			);
		}

		if (userCurrentLocation) {
			setDistanceFromUserToSelectedMarker(calculateDistance(userCurrentLocation, location));
		}
	};

	const handleClosePress = () => {
		translateY.value = withTiming(300, {
			duration: 500,
			easing: Easing.in(Easing.exp),
		});
		opacity.value = withTiming(
			0,
			{
				duration: 500,
				easing: Easing.in(Easing.exp),
			},
			() => {
				runOnJS(setSelectedMarker)(null);
				runOnJS(setDistanceFromUserToSelectedMarker)(null);
			},
		);
		bottom.value = withTiming(12, {
			duration: 500,
			easing: Easing.in(Easing.exp),
		});
	};

	const handleNavigatePress = (app: 'gett' | 'waze' | 'moovit') => {
		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);

		if (!selectedMarker) {
			return;
		}

		const { latitude, longitude } = selectedMarker;
		let url = '';

		switch (app) {
			case 'gett': {
				url = `gett://order?pickup_latitude=${userCurrentLocation?.latitude}&pickup_longitude=${userCurrentLocation?.longitude}&dropoff_latitude=${latitude}&dropoff_longitude=${longitude}`;

				break;
			}

			case 'waze': {
				url = `waze://?ll=${latitude},${longitude}&navigate=yes`;

				break;
			}

			case 'moovit': {
				url = `moovit://directions?dest_lat=${latitude}&dest_lon=${longitude}`;

				break;
			}

			default: {
				console.warn(`Unsupported app: ${app}`);

				return;
			}
		}

		Linking.openURL(url);
	};

	const handleCurrentLocationPress = () => {
		if (!userCurrentLocation || !mapViewRef.current) return;

		Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

		if (selectedMarker) {
			// Set the map view to include both the user's current location and the selected location
			const minLat = Math.min(userCurrentLocation.latitude, selectedMarker.latitude);
			const maxLat = Math.max(userCurrentLocation.latitude, selectedMarker.latitude);
			const minLong = Math.min(userCurrentLocation.longitude, selectedMarker.longitude);
			const maxLong = Math.max(userCurrentLocation.longitude, selectedMarker.longitude);

			mapViewRef.current.fitToCoordinates(
				[
					{ latitude: minLat, longitude: minLong },
					{ latitude: maxLat, longitude: maxLong },
				],
				{
					animated: true,
					edgePadding: {
						top: 100,
						right: 100,
						bottom: 300,
						left: 100,
					},
				},
			);
		} else {
			// Animate to the user's current location only
			mapViewRef.current.animateToRegion(
				{
					latitude: userCurrentLocation.latitude,
					longitude: userCurrentLocation.longitude,
					latitudeDelta: 0.1822,
					longitudeDelta: 0.0842,
				},
				1000,
			);
		}
	};

	const handleRegionChangeComplete = (region: Region) => {
		if (!userCurrentLocation) return;

		const distance = calculateDistance(userCurrentLocation, {
			latitude: region.latitude,
			longitude: region.longitude,
		});

		if (distance <= VISIBILITY_RADIUS_KM && !selectedMarker) {
			currentLocationButtonOpacity.value = withTiming(0, {
				duration: 500,
				easing: Easing.out(Easing.exp),
			});
		} else {
			currentLocationButtonOpacity.value = withTiming(1, {
				duration: 500,
				easing: Easing.out(Easing.exp),
			});
		}
	};

	const onChangeUserLocation = (location: UserLocationChangeEvent) => {
		if (location.nativeEvent.error) {
			setErrorMsg(location.nativeEvent.error.message);

			return;
		}

		if (!location.nativeEvent.coordinate) {
			setErrorMsg('Location not found');

			return;
		}

		setUserCurrentLocation({
			latitude: location.nativeEvent.coordinate.latitude,
			longitude: location.nativeEvent.coordinate.longitude,
		});

		if (!mapRegion) {
			setMapRegion({
				latitude: location.nativeEvent.coordinate.latitude,
				longitude: location.nativeEvent.coordinate.longitude,
				latitudeDelta: 0.1822,
				longitudeDelta: 0.0842,
			});

			// mapViewRef.current.animateToRegion(
			// 	{
			// 		latitude: location.nativeEvent.coordinate.latitude,
			// 		longitude: location.nativeEvent.coordinate.longitude,
			// 		latitudeDelta: 0.1822,
			// 		longitudeDelta: 0.0842,
			// 	},
			// 	1000,
			// );
		}
	};

	if (errorMsg) {
		return <UIText>{errorMsg}</UIText>;
	}

	return (
		<View className="flex-1">
			<MapView
				ref={mapViewRef}
				showsUserLocation
				showsMyLocationButton
				showsTraffic
				userInterfaceStyle="light"
				className="flex-1"
				initialRegion={mapRegion}
				provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : PROVIDER_DEFAULT}
				userLocationCalloutEnabled
				userLocationAnnotationTitle="המיקום שלי"
				loadingEnabled
				onUserLocationChange={onChangeUserLocation}
				onRegionChangeComplete={handleRegionChangeComplete}
			>
				{BRANCHES_LOCATIONS_MOCK.map((location, index) => (
					<Marker key={index} coordinate={location} onPress={() => handleMarkerPress(location)}>
						<UISvg
							className={location === selectedMarker ? 'h-14 w-14' : 'h-10 w-10'}
							name={location === selectedMarker ? 'selectedMapMarker' : 'leumitBrandLogoOnly'}
						/>
					</Marker>
				))}
			</MapView>
			{selectedMarker && (
				<Animated.View
					className="absolute bottom-4 left-4 right-4 items-center justify-between rounded-xl bg-white p-4"
					style={[selectedMarkerAnimatedStyle, globalStyles.shadowBox]}
				>
					<View className="flex h-min w-full flex-row-reverse justify-between">
						<TouchableOpacity onPress={handleClosePress}>
							<UISvg name="close" className="fill-purpleText h-3 w-3" />
						</TouchableOpacity>
						<UIText className="font-RubikSemiBold text-grayPrimary mb-3 text-sm">איך תרצו לנווט למרכז הרפואי?</UIText>
					</View>
					<View className="flex w-full flex-row items-center justify-around gap-9">
						<TouchableOpacity className="flex items-center" onPress={() => handleNavigatePress('moovit')}>
							<Image source="moovit-logo" className="h-16 w-16" />
							<UIText className="text-grayPrimary text-sm">Moovit</UIText>
						</TouchableOpacity>
						<TouchableOpacity className="flex items-center" onPress={() => handleNavigatePress('waze')}>
							<Image source="waze-logo" className="h-16 w-16" />
							<UIText className="text-grayPrimary text-sm">Waze</UIText>
						</TouchableOpacity>

						<TouchableOpacity className="flex items-center" onPress={() => handleNavigatePress('gett')}>
							<Image source="gett-logo" className="h-16 w-16 rounded-xl border border-[#4E5A63]" />
							<UIText className="text-grayPrimary text-sm">Gett</UIText>
						</TouchableOpacity>
					</View>
				</Animated.View>
			)}
			{shouldRenderActionBox && (
				<Animated.View className="absolute bottom-2 right-2 flex flex-row" style={[currentLocationButtonAnimatedStyle, globalStyles.shadowBox]}>
					{selectedMarker && (
						<View className="mr-2 rounded-xl bg-white p-4" style={globalStyles.shadowBox}>
							<UIText className="text-grayPrimary text-sm">{`${distanceFromUserToSelectedMarker?.toFixed(2)} ק״מ ממך`}</UIText>
						</View>
					)}
					<TouchableOpacity className="rounded-full bg-white p-2" onPress={handleCurrentLocationPress}>
						<UISvg name={selectedMarker ? 'path' : 'currentLocation'} className="h-10 w-10" />
					</TouchableOpacity>
				</Animated.View>
			)}
		</View>
	);
};
