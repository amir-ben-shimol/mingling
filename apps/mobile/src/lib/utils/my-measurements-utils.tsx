enum MeasurementsType {
	BloodPressure = 1,
	Pulse = 2,
	Heat = 3,
	Weight = 4,
	Height = 5,
	HeadCircumference = 6,
	Length = 8,
	BreathingRate = 9,
	Setoratzia = 10,
	Bmi = 15,
}

// export const getMeasurementImage = (type: MeasurementsType) => {
// 	switch (type) {
// 		case MeasurementsType.BloodPressure: {
// 			return "blood-pressure";
// 		}
// 		case MeasurementsType.Pulse: {
// 			return "heart-rate";
// 		}
// 		case MeasurementsType.Heat: {
// 			return "heat";
// 		}
// 		case MeasurementsType.Weight: {
// 			return "weight";
// 		}
// 		case MeasurementsType.Height: {
// 			return "height";
// 		}
// 		case MeasurementsType.HeadCircumference: {
// 			return "head-circumference";
// 		}
// 		case MeasurementsType.Length: {
// 			return "length";
// 		}
// 		case MeasurementsType.BreathingRate: {
// 			return "breathing";
// 		}
// 		case MeasurementsType.Setoratzia: {
// 			return "storazia";
// 		}
// 		case MeasurementsType.Bmi: {
// 			return "bmi";
// 		}
// 	}
// };

export function getMeasurementTitle(type: MeasurementsType): string {
	switch (type) {
		case MeasurementsType.BloodPressure: {
			return 'לחץ דם';
		}
		case MeasurementsType.Pulse: {
			return 'דופק';
		}
		case MeasurementsType.Heat: {
			return 'חום';
		}
		case MeasurementsType.Weight: {
			return 'משקל';
		}
		case MeasurementsType.Height: {
			return 'גובה';
		}
		case MeasurementsType.HeadCircumference: {
			return 'היקף ראש';
		}
		case MeasurementsType.Length: {
			return 'אורך';
		}
		case MeasurementsType.BreathingRate: {
			return 'נשימה';
		}
		case MeasurementsType.Setoratzia: {
			return 'סטורזציה';
		}
		case MeasurementsType.Bmi: {
			return 'BMI';
		}
		default: {
			return '';
		}
	}
}
