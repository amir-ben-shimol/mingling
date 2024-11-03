import { create } from 'zustand';

import type { FriendDetails } from '@mingling/types';

type State = {
	readonly friendsList: FriendDetails[];
};

type Action = {
	readonly setFriendsList: (friends: FriendDetails[]) => void;
	readonly resetStore: () => void;
};

type FriendsStore = State & Action;

const useFriendsStore = create<FriendsStore>((set) => ({
	friendsList: [],

	setFriendsList: (friends) => {
		set(() => ({
			friendsList: friends,
		}));
	},

	resetStore: () => {
		set({ friendsList: [] });
	},
}));

export { useFriendsStore };
