import React, { createContext, useContext, useState, useRef, useEffect, type ReactNode } from 'react';
import { Modal } from 'react-native';
import { UILoader } from '@/ui/UILoader';

const AUTO_REMOVE_LOADER_TIMEOUT = 30000; // After 30 seconds the loader will be removed automatically

type LoaderContextType = {
	showLoader: () => void;
	removeLoader: () => void;
	triggerLoader: (isLoading: boolean) => void;
};

const LoaderContext = createContext<LoaderContextType | undefined>(undefined);

export const LoaderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
	const [isVisible, setIsVisible] = useState(false);
	const loaderTimeoutRef = useRef<number | null>(null);

	useEffect(() => {
		return () => {
			if (loaderTimeoutRef.current !== null) {
				clearTimeout(loaderTimeoutRef.current);
				loaderTimeoutRef.current = null;
			}
		};
	}, []);

	const clearLoaderTimeout = () => {
		if (loaderTimeoutRef.current !== null) {
			clearTimeout(loaderTimeoutRef.current);
			loaderTimeoutRef.current = null;
		}
	};

	const removeLoader = () => {
		setIsVisible(false);
		clearLoaderTimeout();
	};

	const showLoader = () => {
		setIsVisible(true);
		clearLoaderTimeout();
		loaderTimeoutRef.current = setTimeout(() => {
			removeLoader();
		}, AUTO_REMOVE_LOADER_TIMEOUT) as unknown as number;
	};

	const triggerLoader = (isLoading: boolean) => {
		if (isLoading) {
			showLoader();
		} else {
			removeLoader();
		}
	};

	return (
		<LoaderContext.Provider value={{ showLoader, removeLoader, triggerLoader }}>
			{children}
			<Modal transparent animationType="fade" visible={isVisible} onRequestClose={() => {}}>
				<UILoader />
			</Modal>
		</LoaderContext.Provider>
	);
};

export const useLoader = (): LoaderContextType => {
	const context = useContext(LoaderContext);

	if (context === undefined) {
		throw new Error('useLoader must be used within a LoaderProvider');
	}

	return context;
};
