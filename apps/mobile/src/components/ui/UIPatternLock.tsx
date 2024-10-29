import React, { useState, useCallback, useEffect } from 'react';
import { View, Dimensions, Pressable } from 'react-native';
import { PanGestureHandler, State, type PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
import Svg, { Line } from 'react-native-svg';
import * as Haptics from 'expo-haptics';

const { width } = Dimensions.get('window');
const DEFAULT_CIRCLE_SIZE = 40;
const DEFAULT_INNER_CIRCLE_SIZE = 20;
const DEFAULT_PATTERN_SIZE = 3;
const DEFAULT_COLOR = '#D4E6EC';

type UIPatternLockProps = {
	readonly value: number[];
	readonly circleSize?: number;
	readonly innerCircleSize?: number;
	readonly patternSize?: number;
	readonly circleColor?: string;
	readonly lineColor?: string;
	readonly hapticFeedback?: boolean;
	readonly onChange: (pattern: number[]) => void;
	readonly resetPattern?: () => void;
};

const generateInitialCircles = (patternSize: number) => {
	const circles = [];

	for (let row = 0; row < patternSize; row++) {
		for (let col = 0; col < patternSize; col++) {
			circles.push({
				id: row * patternSize + col,
				x: (width / (patternSize + 1)) * (col + 1),
				y: (width / (patternSize + 1)) * (row + 1),
				isSelected: false,
			});
		}
	}

	return circles;
};

export const UIPatternLock: React.FC<UIPatternLockProps> = ({
	value = [],
	circleSize = DEFAULT_CIRCLE_SIZE,
	innerCircleSize = DEFAULT_INNER_CIRCLE_SIZE,
	patternSize = DEFAULT_PATTERN_SIZE,
	circleColor = DEFAULT_COLOR,
	lineColor = DEFAULT_COLOR,
	hapticFeedback = true,
	onChange = () => {},
	resetPattern,
}) => {
	const [circles, setCircles] = useState(generateInitialCircles(patternSize));
	const [pattern, setPattern] = useState<number[]>(value);
	const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number }[]>([]);

	useEffect(() => {
		setPattern(value);
	}, [value]);

	const internalResetPattern = useCallback(() => {
		setCircles(generateInitialCircles(patternSize));
		setPattern([]);
		setLines([]);

		if (resetPattern) {
			resetPattern();
		}
	}, [patternSize, resetPattern]);

	const handleGesture = useCallback(
		(event: PanGestureHandlerGestureEvent) => {
			const { x, y } = event.nativeEvent;

			if (event.nativeEvent.state === State.BEGAN || event.nativeEvent.state === State.ACTIVE) {
				circles.forEach((circle) => {
					if (
						!circle.isSelected &&
						x > circle.x - circleSize / 2 &&
						x < circle.x + circleSize / 2 &&
						y > circle.y - circleSize / 2 &&
						y < circle.y + circleSize / 2
					) {
						circle.isSelected = true;

						if (hapticFeedback) {
							Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Soft);
						}

						if (pattern.length > 0) {
							const lastCircle = circles.find((c) => c.id === pattern[pattern.length - 1]);

							if (lastCircle) {
								setLines((prevLines) => [...prevLines, { x1: lastCircle.x, y1: lastCircle.y, x2: circle.x, y2: circle.y }]);
							}
						}

						setPattern((prevPattern) => [...prevPattern, circle.id]);
						onChange([...pattern, circle.id]);
					}
				});
				setCircles([...circles]);
			} else if (event.nativeEvent.state === State.END || event.nativeEvent.state === State.CANCELLED) {
				internalResetPattern();
			}
		},
		[circles, pattern, circleSize, hapticFeedback, onChange, internalResetPattern],
	);

	const handleOutsidePress = () => {
		internalResetPattern();
	};

	return (
		<Pressable style={{ flex: 1 }} onPress={handleOutsidePress}>
			<View className="flex-1 items-center justify-center bg-white" style={{ direction: 'ltr' }}>
				<PanGestureHandler minDist={0} onGestureEvent={handleGesture}>
					<View className="relative" style={{ width: width, height: width }}>
						<Svg className="absolute inset-0">
							{lines.map((line, index) => (
								<Line key={index} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2} stroke={lineColor} strokeWidth="5" />
							))}
						</Svg>
						{circles.map((circle) => (
							<View
								key={circle.id}
								className="absolute items-center justify-center border-2"
								style={{
									left: circle.x - circleSize / 2,
									top: circle.y - circleSize / 2,
									borderColor: circleColor,
									width: circleSize,
									height: circleSize,
									borderRadius: circleSize / 2,
								}}
							>
								{circle.isSelected && (
									<View
										className="rounded-full"
										style={{
											backgroundColor: circleColor,
											width: innerCircleSize,
											height: innerCircleSize,
											borderRadius: innerCircleSize / 2,
										}}
									/>
								)}
							</View>
						))}
					</View>
				</PanGestureHandler>
			</View>
		</Pressable>
	);
};
