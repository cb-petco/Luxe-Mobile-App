import { Notification, NotificationType } from '../types';
import { mockNotifications } from '../data/mockData';

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

class NotificationService {
  private notifications: Notification[] = [...mockNotifications];
  private notificationIdCounter = mockNotifications.length + 1;

  async getNotifications(userId: string): Promise<Notification[]> {
    await delay(200);
    return this.notifications
      .filter(notif => notif.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getUnreadCount(userId: string): Promise<number> {
    await delay(100);
    return this.notifications.filter(notif => notif.userId === userId && !notif.read).length;
  }

  async markAsRead(notificationId: string): Promise<void> {
    await delay(150);
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
    }
  }

  async markAllAsRead(userId: string): Promise<void> {
    await delay(200);
    this.notifications
      .filter(notif => notif.userId === userId)
      .forEach(notif => {
        notif.read = true;
      });
  }

  async createNotification(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    tripId?: string
  ): Promise<Notification> {
    const notification: Notification = {
      id: `notif-${String(this.notificationIdCounter).padStart(3, '0')}`,
      userId,
      type,
      title,
      message,
      read: false,
      tripId,
      createdAt: new Date().toISOString(),
    };

    this.notificationIdCounter++;
    this.notifications.unshift(notification);

    return notification;
  }
}

export const notificationService = new NotificationService();
