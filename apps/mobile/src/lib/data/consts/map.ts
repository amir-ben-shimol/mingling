import type { LatLng, Region } from 'react-native-maps';

export const TEL_AVIV_REGION: Region = {
	latitude: 32.0853, // Central Tel Aviv
	longitude: 34.7818, // Central Tel Aviv
	latitudeDelta: 0.5, // Adjusted for a 50 km radius
	longitudeDelta: 0.5, // Adjusted for a 50 km radius
};

export const BRANCHES_LOCATIONS_MOCK: LatLng[] = [
	{ latitude: 32.0853, longitude: 34.7818 }, // Central Tel Aviv
	{ latitude: 32.0736, longitude: 34.7885 }, // Old North Tel Aviv
	{ latitude: 32.0626, longitude: 34.776 }, // Florentin
	{ latitude: 32.072, longitude: 34.8032 }, // Ramat Aviv
	{ latitude: 32.0834, longitude: 34.8335 }, // Herzliya (just outside Tel Aviv)
	{ latitude: 32.1093, longitude: 34.8555 }, // Ramat Hasharon
	{ latitude: 32.1674, longitude: 34.8435 }, // Kfar Saba
	{ latitude: 32.1755, longitude: 34.9066 }, // Ra'anana
	{ latitude: 32.0158, longitude: 34.7874 }, // Bat Yam
	{ latitude: 32.0324, longitude: 34.7507 }, // Holon
	{ latitude: 32.0523, longitude: 34.7722 }, // Jaffa
	{ latitude: 31.9706, longitude: 34.7925 }, // Rishon LeZion
	{ latitude: 32.1821, longitude: 34.9073 }, // Hod HaSharon
	{ latitude: 32.3199, longitude: 34.8532 }, // Netanya
	{ latitude: 32.1848, longitude: 34.8708 }, // Petah Tikva
	{ latitude: 31.7683, longitude: 35.2137 }, // Jerusalem
	{ latitude: 32.0788, longitude: 34.7806 }, // Givatayim
	{ latitude: 32.0682, longitude: 34.8247 }, // Bnei Brak
	{ latitude: 32.0902, longitude: 34.8143 }, // Ramat Gan
	{ latitude: 31.2525, longitude: 34.7915 }, // Be'er Sheva
	{ latitude: 31.0461, longitude: 34.8516 }, // Eilat 1
	{ latitude: 29.5569, longitude: 34.9519 }, // Eilat 2
	{ latitude: 32.794, longitude: 34.9896 }, // Haifa
	{ latitude: 32.9255, longitude: 35.29 }, // Akko
	{ latitude: 32.7945, longitude: 35.0827 }, // Kiryat Bialik
	{ latitude: 32.6762, longitude: 35.2497 }, // Nazareth
	{ latitude: 32.6946, longitude: 35.3035 }, // Afula
	{ latitude: 33.0078, longitude: 35.0947 }, // Nahariya
	{ latitude: 32.8163, longitude: 34.9885 }, // Kiryat Yam
	{ latitude: 32.9209, longitude: 35.0795 }, // Shlomi
	{ latitude: 33.2056, longitude: 35.5703 }, // Metula
	{ latitude: 32.0625, longitude: 34.7786 }, // Tel Aviv - Rothschild
	{ latitude: 32.0764, longitude: 34.8016 }, // Tel Aviv - Arlozorov
	{ latitude: 31.5497, longitude: 34.5962 }, // Ashdod
	{ latitude: 32.2239, longitude: 34.9485 }, // Tzur Yigal
	{ latitude: 32.3475, longitude: 34.9126 }, // Pardesiya
	{ latitude: 32.4969, longitude: 34.8958 }, // Hadera
	{ latitude: 32.9833, longitude: 35.2113 }, // Karmiel
];

export const VISIBILITY_RADIUS_KM = 2.5;
