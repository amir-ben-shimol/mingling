// tailwind.config.js
const colors = require('./src/styles/colors.cjs');

module.exports = {
	content: ['./src/**/*.{js,ts,jsx,tsx}', './src/app/**/*.{js,ts,jsx,tsx}', './src/lib/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			fontFamily: {
				RubikBlack: ['Rubik-Black'],
				RubikBold: ['Rubik-Bold'],
				RubikExtraBold: ['Rubik-ExtraBold'],
				RubikLight: ['Rubik-Light'],
				RubikMedium: ['Rubik-Medium'],
				Rubik: ['Rubik-Regular'],
				RubikSemiBold: ['Rubik-SemiBold'],
			},
			colors: {
				purplePrimary: `rgb(${colors.purplePrimary} / <alpha-value>)`,
				pinkPrimary: `rgb(${colors.pinkPrimary} / <alpha-value>)`,
				pinkLight: `rgb(${colors.pinkLight} / <alpha-value>)`,
				pinkBorder: `rgb(${colors.pinkBorder} / <alpha-value>)`,
				bluePrimary: `rgb(${colors.bluePrimary} / <alpha-value>)`,
				blueSecondery: `rgb(${colors.blueSecondery} / <alpha-value>)`,
				blueAccent: `rgb(${colors.blueAccent} / <alpha-value>)`,
				greenPrimary: `rgb(${colors.greenPrimary} / <alpha-value>)`,
				purpleText: `rgb(${colors.purpleText} / <alpha-value>)`,
				blueText: `rgb(${colors.blueText} / <alpha-value>)`,
				blueDarkText: `rgb(${colors.blueDarkText} / <alpha-value>)`,
				grayPrimary: `rgb(${colors.grayPrimary} / <alpha-value>)`,
				offWhite: `rgb(${colors.offWhite} / <alpha-value>)`,
				white: `rgb(${colors.white} / <alpha-value>)`,
				black: `rgb(${colors.black} / <alpha-value>)`,
				error: `rgb(${colors.error} / <alpha-value>)`,
				success: `rgb(${colors.success} / <alpha-value>)`,
			},
			// boxShadow: {
			// 	modal: '0px -6px 20px 0px rgba(0, 0, 0, 0.00)',
			// 	loginForm: '0px 0px 20px 0px rgba(149, 173, 201, 0.25)',
			// 	card: '0px 0px 20px 0px rgba(149, 173, 201, 0.25)',
			// 	shadowButton: '0px 2px 10px 0px rgba(154, 63, 130, 0.30)',
			// },
			height: {
				'voice-recorder-height': '50px',
				'100%': '100%',
			},
			borderRadius: {
				'20': '20px',
				'button': '44px',
				'4xl': '30px',
			},
			backgroundColor: {
				card: 'rgba(245, 239, 245, 0.5)',
				lightGray: '#f8f8f8',
				lightPurple: '#f5eff5',
			},
		},
	},
	plugins: [],
};
