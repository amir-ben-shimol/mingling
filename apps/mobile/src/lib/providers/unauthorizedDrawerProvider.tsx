import React, { createContext, useContext, useState } from 'react';

type DrawerContextProps = {
	isWelcomeVisible: boolean;
	setIsWelcomeVisible: (visible: boolean) => void;
};

const DrawerContext = createContext<DrawerContextProps | undefined>(undefined);

export const useUnauthorizedDrawer = () => {
	const context = useContext(DrawerContext);

	if (!context) {
		throw new Error('useUnauthorizedDrawer must be used within a DrawerProvider');
	}

	return context;
};

export const UnauthorizedDrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	const [isWelcomeVisible, setIsWelcomeVisible] = useState(true);

	return <DrawerContext.Provider value={{ isWelcomeVisible, setIsWelcomeVisible }}>{children}</DrawerContext.Provider>;
};
