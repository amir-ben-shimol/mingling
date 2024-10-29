import React, { memo } from 'react';
import { Dimensions } from 'react-native';
import RenderHtml from 'react-native-render-html';

const { width } = Dimensions.get('window');

const UIHtmlRenderer = ({
	fontSize = 14,
	html,
	textAlign = 'left',
	extraStyles,
}: {
	fontSize?: number;
	html: string;
	textAlign?: 'left' | 'right' | 'auto' | 'center' | 'justify' | undefined;
	extraStyles?: object;
}) => {
	return (
		<RenderHtml
			systemFonts={['Rubik']}
			tagsStyles={{
				p: {
					fontFamily: 'Rubik',
					fontWeight: '400',
					textAlign,
					color: '#4E5A63',
					fontSize,
					...extraStyles,
				},
			}}
			contentWidth={width}
			source={{ html }}
			enableExperimentalMarginCollapsing
		/>
	);
};

export default memo(UIHtmlRenderer);
