import express from 'express';
import * as friendController from '../controllers/friend-controller';

const router = express.Router();

router.post('/request', friendController.sendFriendRequest);
router.post('/response', friendController.respondToFriendRequest);
router.delete('/remove-friend/:friendId', friendController.removeFriend);
router.get('/friends-list', friendController.getFriendsList);

export default router;
