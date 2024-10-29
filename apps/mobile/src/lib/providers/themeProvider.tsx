import React, { createContext, useContext, useState, type ReactNode } from 'react';
import type { ScrollEvent } from '@/types/ui/scroll';

type HeaderTheme = 'dark' | 'light';

type ThemeContextType = {
	readonly theme: HeaderTheme;
	readonly setTheme: (theme: HeaderTheme) => void;
	readonly setThemeOnScroll: (event: ScrollEvent) => void;
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [theme, setTheme] = useState<HeaderTheme>('dark');

	const setThemeOnScroll = (event: ScrollEvent) => {
		const { contentOffset } = event.nativeEvent;

		const scrollTop = contentOffset.y;

		if (scrollTop > 20) {
			setTheme('light');
		} else {
			setTheme('dark');
		}
	};

	return <ThemeContext.Provider value={{ theme, setTheme, setThemeOnScroll }}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
	const context = useContext(ThemeContext);

	if (!context) {
		throw new Error('useTheme must be used within a ThemeProvider');
	}

	return context;
};
