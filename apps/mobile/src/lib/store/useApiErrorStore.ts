import { create } from 'zustand';

type State = {
	readonly status: number | null;
	readonly message: string | null;
	readonly hasError: boolean;
	readonly isRetrying: boolean;
};

type Actions = {
	readonly setApiError: (status: number, message: string) => void;
	readonly setIsRetrying: (isRetrying: boolean) => void;
	readonly clearApiError: () => void;
};

type ApiErrorStore = State & Actions;

const useApiErrorStore = create<ApiErrorStore>((set) => ({
	status: null,
	message: null,
	hasError: false,
	isRetrying: false,

	setApiError: (status: number, message: string) => {
		set({
			status,
			message,
			hasError: true,
		});
	},

	setIsRetrying: (isRetrying: boolean) => {
		set({ isRetrying });
	},

	clearApiError: () => {
		set({
			status: null,
			message: null,
			hasError: false,
			isRetrying: false,
		});
	},
}));

export { useApiErrorStore };
