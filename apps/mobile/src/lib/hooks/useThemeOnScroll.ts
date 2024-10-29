import { useState, useRef } from 'react';
import type { ScrollView } from 'react-native';
import type { ScrollEvent } from '../types/ui/scroll';

type HeaderTheme = 'light' | 'dark';

/**
 * A custom React hook that changes the theme of a header based on the scroll position of a ScrollView.
 *
 * @param {HeaderTheme} initialTheme - The initial theme to be applied to the header before any scrolling occurs.
 * @returns {object} - The current theme of the header and the scroll position.
 *
 * This hook listens for scroll events on a ScrollView. If the scroll position is greater than 50 pixels,
 * it sets the theme to 'light'. Otherwise, it reverts to the initial theme passed as a parameter.
 */
const useThemeOnScroll = (
	initialTheme: HeaderTheme,
): {
	theme: HeaderTheme;
	scrollPosition: number;
	scrollViewRef: React.RefObject<ScrollView>;
	handleScroll: (event: ScrollEvent) => void;
} => {
	const [theme, setTheme] = useState<HeaderTheme>(initialTheme);
	const [scrollPosition, setScrollPosition] = useState(0);
	const scrollViewRef = useRef<ScrollView>(null);

	const handleScroll = (event: ScrollEvent) => {
		const scrollTop = event.nativeEvent.contentOffset.y;

		if (scrollTop > 50) {
			setTheme('light');
		} else {
			setTheme(initialTheme);
		}

		setScrollPosition(scrollTop);
	};

	return { theme, scrollPosition, scrollViewRef, handleScroll };
};

export default useThemeOnScroll;
