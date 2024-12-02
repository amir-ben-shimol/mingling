import express from 'express';
import { createNotificationHandler, deleteNotificationHandler } from '../controllers/notification-controller';

const router = express.Router();

router.post('/create', createNotificationHandler);

router.delete('/delete/:notificationId', deleteNotificationHandler);

export default router;
