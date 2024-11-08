/* eslint-disable max-lines */
import { v4 as uuidv4 } from 'uuid';
import type { Server, Socket } from 'socket.io';
import {
	createGroup,
	addGroupToAvailableGroups,
	setSocketGroupId,
	getSocketGroupId,
	getGroup,
	updateGroup,
	deleteGroup,
	removeGroupFromAvailableGroups,
	getAvailableGroupToMatch,
	deleteSocketUser,
	setSocketUser,
	setUserSocket,
	getUserIdBySocketId,
	setUserOnlineStatus,
	deleteUserSocket,
	deleteSocketGroupId,
} from '../helpers/redis-helpers';
import { emitFriendUpdate } from '../helpers/socket-emitters';
import type { GroupData } from '../types/playground';

export function configureSockets(io: Server) {
	io.on('connection', (socket: Socket) => {
		// Function to match groups
		async function matchGroup(groupId: string) {
			const group = await getGroup(groupId);

			if (!group || !group.inPlayground || group.inChat) {
				return;
			}

			// Try to find another group to match
			const partnerGroupId = await getAvailableGroupToMatch(groupId);

			if (partnerGroupId) {
				// Remove both groups from availableGroups
				await removeGroupFromAvailableGroups(groupId);
				await removeGroupFromAvailableGroups(partnerGroupId);

				const partnerGroup = await getGroup(partnerGroupId);

				if (partnerGroup && partnerGroup.inPlayground && !partnerGroup.inChat) {
					// Update both groups to be in chat with each other
					await updateGroup(groupId, { inChat: true, chatPartnerGroupId: partnerGroupId });
					await updateGroup(partnerGroupId, { inChat: true, chatPartnerGroupId: groupId });

					// Notify all members in both groups
					const groupMemberSocketIds = Array.from(group.memberSocketIds);
					const partnerGroupMemberSocketIds = Array.from(partnerGroup.memberSocketIds);

					groupMemberSocketIds.forEach((socketId) => {
						io.to(socketId).emit('matched', {
							partnerGroupId: partnerGroupId,
							partnerSocketIds: partnerGroupMemberSocketIds,
						});
					});

					partnerGroupMemberSocketIds.forEach((socketId) => {
						io.to(socketId).emit('matched', {
							partnerGroupId: groupId,
							partnerSocketIds: groupMemberSocketIds,
						});
					});
				} else {
					// Partner group is not available, add back to availableGroups
					await addGroupToAvailableGroups(groupId);
				}
			} else {
				// No partner group found, group remains in availableGroups
				// Do nothing
			}
		}

		// User joins the playground
		socket.on('joinPlayground', async (userId: string) => {
			console.log(`User ${userId} joined the playground with socket ${socket.id}`);

			const groupId = uuidv4();

			const groupData: GroupData = {
				groupId,
				memberSocketIds: new Set([socket.id]),
				inPlayground: true,
				inChat: false,
				chatPartnerGroupId: null,
			};

			await createGroup(groupId, groupData);
			await addGroupToAvailableGroups(groupId);
			await setSocketGroupId(socket.id, groupId);

			// Try to match the group
			await matchGroup(groupId);
		});

		// User leaves the playground
		socket.on('leavePlayground', async () => {
			console.warn('User left the playground');

			const groupId = await getSocketGroupId(socket.id);

			if (!groupId) return;

			const group = await getGroup(groupId);

			if (!group) return;

			// Remove socketId from group's memberSocketIds
			group.memberSocketIds.delete(socket.id);
			await updateGroup(groupId, { memberSocketIds: group.memberSocketIds });

			await deleteSocketGroupId(socket.id);

			if (group.memberSocketIds.size === 0) {
				// Delete the group
				await deleteGroup(groupId);
				await removeGroupFromAvailableGroups(groupId);
			} else {
				// Update the group's members
				const memberSocketIds = Array.from(group.memberSocketIds);

				memberSocketIds.forEach((socketId) => {
					io.to(socketId).emit('groupUpdated', {
						groupId: group.groupId,
						memberSocketIds: memberSocketIds,
					});
				});
			}

			// Remove group from availableGroups
			await removeGroupFromAvailableGroups(groupId);

			// Notify partner group if in chat
			if (group.inChat && group.chatPartnerGroupId) {
				const partnerGroupId = group.chatPartnerGroupId;
				const partnerGroup = await getGroup(partnerGroupId);

				if (partnerGroup) {
					await updateGroup(partnerGroupId, { inChat: false, chatPartnerGroupId: null });

					// Notify partner group members that the partner has left
					const partnerMemberSocketIds = Array.from(partnerGroup.memberSocketIds);

					partnerMemberSocketIds.forEach((socketId) => {
						io.to(socketId).emit('partnerLeft');
					});

					// Add partner group back to availableGroups if they are still in the playground
					if (partnerGroup.inPlayground) {
						await addGroupToAvailableGroups(partnerGroupId);
						// Try to match the partner group
						await matchGroup(partnerGroupId);
					}
				}
			}

			await updateGroup(groupId, { inChat: false, chatPartnerGroupId: null, inPlayground: false });
		});

		// Handle 'nextUser' event
		socket.on('nextUser', async () => {
			console.log('Entered NEXT USER');
			const groupId = await getSocketGroupId(socket.id);

			if (!groupId) return;

			const group = await getGroup(groupId);

			if (!group) return;

			if (!group.inChat || !group.chatPartnerGroupId) {
				// The group is not currently in a chat
				return;
			}

			const partnerGroupId = group.chatPartnerGroupId;
			const partnerGroup = await getGroup(partnerGroupId);

			// Notify all members in both groups that the chat has ended
			const groupMemberSocketIds = Array.from(group.memberSocketIds);

			groupMemberSocketIds.forEach((socketId) => {
				io.to(socketId).emit('chatEnded');
			});

			if (partnerGroup) {
				const partnerMemberSocketIds = Array.from(partnerGroup.memberSocketIds);

				partnerMemberSocketIds.forEach((socketId) => {
					io.to(socketId).emit('chatEnded');
				});

				// Reset partner group's state
				await updateGroup(partnerGroupId, { inChat: false, chatPartnerGroupId: null });

				// Add partner group back to availableGroups if they are still in the playground
				if (partnerGroup.inPlayground) {
					await addGroupToAvailableGroups(partnerGroupId);
					// Try to match the partner group
					await matchGroup(partnerGroupId);
				}
			}

			// Reset our group's state
			await updateGroup(groupId, { inChat: false, chatPartnerGroupId: null });

			// Add our group back to availableGroups if we are still in the playground
			if (group.inPlayground) {
				await addGroupToAvailableGroups(groupId);
				// Try to match the group again
				await matchGroup(groupId);
			}
		});

		// Handle 'mergeGroups' event
		socket.on('mergeGroups', async () => {
			console.log(`Merge request initiated by socket ${socket.id}`);
			const socketGroupId = await getSocketGroupId(socket.id);

			if (!socketGroupId) return;

			const group = await getGroup(socketGroupId);

			if (!group) return;

			const partnerGroupId = group.chatPartnerGroupId;

			if (!partnerGroupId) return;

			const partnerGroup = await getGroup(partnerGroupId);

			if (!partnerGroup) return;

			// Send 'mergeRequest' to all members of the partner group
			const partnerMemberSocketIds = Array.from(partnerGroup.memberSocketIds);

			partnerMemberSocketIds.forEach((socketId) => {
				io.to(socketId).emit('mergeRequest', { fromGroupId: group.groupId });
			});
		});

		// Handle 'mergeResponse' event
		socket.on('mergeResponse', async ({ accepted, fromGroupId }) => {
			console.log(`Merge response from socket ${socket.id}: ${accepted}`);
			const socketGroupId = await getSocketGroupId(socket.id);

			if (!socketGroupId) return;

			const group = await getGroup(socketGroupId);

			if (!group) return;

			const requestingGroupId = fromGroupId;

			const requestingGroup = await getGroup(requestingGroupId);

			if (!requestingGroup) return;

			if (accepted) {
				// Proceed to merge the groups
				const newGroupId = uuidv4();
				const newMemberSocketIds = new Set([...group.memberSocketIds, ...requestingGroup.memberSocketIds]);

				const newGroupData: GroupData = {
					groupId: newGroupId,
					memberSocketIds: newMemberSocketIds,
					inPlayground: true,
					inChat: false,
					chatPartnerGroupId: null,
				};

				await createGroup(newGroupId, newGroupData);
				await addGroupToAvailableGroups(newGroupId);

				// Update socketGroupId mappings
				for (const socketId of newMemberSocketIds) {
					await setSocketGroupId(socketId, newGroupId);
				}

				// Notify all members
				const memberSocketIds = Array.from(newMemberSocketIds);

				memberSocketIds.forEach((socketId) => {
					io.to(socketId).emit('groupUpdated', {
						groupId: newGroupId,
						memberSocketIds: memberSocketIds,
						isMerged: true,
					});
				});

				// Delete old groups
				await deleteGroup(group.groupId);
				await deleteGroup(requestingGroup.groupId);
				await removeGroupFromAvailableGroups(group.groupId);
				await removeGroupFromAvailableGroups(requestingGroup.groupId);

				// Notify that they are looking for a match together
				memberSocketIds.forEach((socketId) => {
					io.to(socketId).emit('lookingForMatchTogether');
				});

				// Attempt to match groups again
				await matchGroup(newGroupId);
			} else {
				// Merge declined, notify the requesting group
				const requestingMemberSocketIds = Array.from(requestingGroup.memberSocketIds);

				requestingMemberSocketIds.forEach((socketId) => {
					io.to(socketId).emit('mergeDeclined');
				});
			}
		});

		// Handle signaling for WebRTC connections
		socket.on('signal', ({ to, data }) => {
			io.to(to).emit('signal', { from: socket.id, data });
		});

		// Handle chat messages
		socket.on('chatMessage', ({ to, message }) => {
			io.to(to).emit('chatMessage', message);
		});

		// Handle disconnects
		socket.on('disconnect', async () => {
			console.log(`User with socket ${socket.id} disconnected`);

			// Handle the user leaving the playground
			const groupId = await getSocketGroupId(socket.id);

			if (groupId) {
				const group = await getGroup(groupId);

				if (group) {
					// Remove socketId from group's memberSocketIds
					group.memberSocketIds.delete(socket.id);
					await updateGroup(groupId, { memberSocketIds: group.memberSocketIds });

					await deleteSocketGroupId(socket.id);

					if (group.memberSocketIds.size === 0) {
						// Delete the group
						await deleteGroup(groupId);
						await removeGroupFromAvailableGroups(groupId);
					} else {
						// Update the group's members
						const memberSocketIds = Array.from(group.memberSocketIds);

						memberSocketIds.forEach((socketId) => {
							io.to(socketId).emit('groupUpdated', {
								groupId: group.groupId,
								memberSocketIds: memberSocketIds,
							});
						});
					}

					// Remove group from availableGroups
					await removeGroupFromAvailableGroups(groupId);

					// Notify partner group if in chat
					if (group.inChat && group.chatPartnerGroupId) {
						const partnerGroupId = group.chatPartnerGroupId;
						const partnerGroup = await getGroup(partnerGroupId);

						if (partnerGroup) {
							await updateGroup(partnerGroupId, { inChat: false, chatPartnerGroupId: null });

							// Notify partner group members that the partner has left
							const partnerMemberSocketIds = Array.from(partnerGroup.memberSocketIds);

							partnerMemberSocketIds.forEach((socketId) => {
								io.to(socketId).emit('partnerLeft');
							});

							// Add partner group back to availableGroups if they are still in the playground
							if (partnerGroup.inPlayground) {
								await addGroupToAvailableGroups(partnerGroupId);
								// Try to match the partner group
								await matchGroup(partnerGroupId);
							}
						}
					}

					await updateGroup(groupId, { inChat: false, chatPartnerGroupId: null, inPlayground: false });
				}
			}

			// Handle user disconnection
			await deleteSocketUser(socket.id); // Removes the socket-user mapping from Redis
			const userId = await getUserIdBySocketId(socket.id);

			if (userId) {
				await setUserOnlineStatus(userId, false);
				await deleteUserSocket(userId);
				emitFriendUpdate(io, userId, { isOnline: false });
			}
		});

		// Map userId to socketId in Redis upon initial login
		socket.on('login', async ({ userId }) => {
			await setUserSocket(userId, socket.id); // Maps userId to socketId in Redis
			await setSocketUser(socket.id, userId); // Maps socketId to userId in Redis
			await setUserOnlineStatus(userId, true);
			emitFriendUpdate(io, userId, { isOnline: true });
		});

		// Remove socket-user mapping from Redis on logout
		socket.on('logout', async () => {
			console.log(`User with socket ${socket.id} logged out`);
			await deleteSocketUser(socket.id); // Removes the socket-user mapping from Redis
			const userId = await getUserIdBySocketId(socket.id);

			if (userId) {
				await setUserOnlineStatus(userId, false);
				await deleteUserSocket(userId);
				emitFriendUpdate(io, userId, { isOnline: false });
			}
		});

		// When app moves to background, set user as offline
		socket.on('app-background', async (userId) => {
			await setUserOnlineStatus(userId, false);
			emitFriendUpdate(io, userId, { isOnline: false });
		});

		// When app moves to foreground, set user as online
		socket.on('app-foreground', async (userId) => {
			await setUserOnlineStatus(userId, true);
			emitFriendUpdate(io, userId, { isOnline: true });
		});
	});
}
