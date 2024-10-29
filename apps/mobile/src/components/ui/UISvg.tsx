import React from 'react';
import { Pressable, View } from 'react-native';
import { SvgXml } from 'react-native-svg';
import { icons } from '@/data/icons';

type Props = {
	readonly name: keyof typeof icons;
	readonly className?: string;
	readonly style?: object;
	readonly fill?: string;
	readonly stroke?: string;
	readonly strokeWidth?: number;
	readonly onClick?: () => void;
};

export const UISvg = (props: Props) => {
	const clickHandler = () => {
		props.onClick && props.onClick();
	};

	const iconData = icons[props.name];
	const [viewBox, svgContent] = iconData;

	const modifiedSvgContent = svgContent?.replace(/currentColor/g, props.fill || '#000');

	const svgXmlData = `
		<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBox}">
			${modifiedSvgContent}
		</svg>
	`;

	if (props.onClick) {
		return (
			<Pressable className={`h-5 w-5 ${props.className}`} style={props.style} onPress={clickHandler}>
				<SvgXml xml={svgXmlData} width="100%" height="100%" fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth} />
			</Pressable>
		);
	}

	return (
		<View className={`h-5 w-5 ${props.className}`} style={props.style}>
			<SvgXml xml={svgXmlData} width="100%" height="100%" fill={props.fill} stroke={props.stroke} strokeWidth={props.strokeWidth} />
		</View>
	);
};
