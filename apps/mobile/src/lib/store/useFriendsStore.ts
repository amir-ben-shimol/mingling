// src/lib/store/useFriendsStore.ts
import { create } from 'zustand';
import type { FriendDetails } from '@mingling/types';

type State = {
	readonly friendsList: FriendDetails[];
};

type Action = {
	readonly setFriendsList: (friends: FriendDetails[] | ((friends: FriendDetails[]) => FriendDetails[])) => void;
	readonly resetStore: () => void;
};

type FriendsStore = State & Action;

const useFriendsStore = create<FriendsStore>((set, get) => ({
	friendsList: [],

	setFriendsList: (friends) => {
		const currentFriendsList = typeof friends === 'function' ? friends(get().friendsList) : friends;

		set({ friendsList: currentFriendsList });
	},

	resetStore: () => {
		set({ friendsList: [] });
	},
}));

export { useFriendsStore };
