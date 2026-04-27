"use client";

import { create } from "zustand";
import { UserNotification } from "@/types/notification";
import { NotificationService } from "@/services/notification.service";

interface NotificationState {
  notifications: UserNotification[];
  unreadCount: number;
  isLoading: boolean;

  addNotification: (notification: UserNotification) => void;
  setNotifications: (notifications: UserNotification[]) => void;
  setUnreadCount: (count: number) => void;
  fetchUnreadCount: () => Promise<void>;
  fetchNotifications: (onlyUnread?: boolean) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

const service = new NotificationService();

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  addNotification: (notification) =>
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: state.unreadCount + 1,
    })),

  setNotifications: (notifications) => set({ notifications }),

  setUnreadCount: (count) => set({ unreadCount: count }),

  fetchUnreadCount: async () => {
    try {
      const res = await service.getUnreadCount();
      set({ unreadCount: res.data ?? 0 });
    } catch {
      // Silently ignore — badge stays at previous value
    }
  },

  fetchNotifications: async (onlyUnread = false) => {
    set({ isLoading: true });
    try {
      const res = await service.getNotifications(onlyUnread);
      set({ notifications: res.data ?? [] });
    } catch {
      // Silently ignore
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await service.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === id ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch {
      // Silently ignore
    }
  },

  markAllAsRead: async () => {
    try {
      await service.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch {
      // Silently ignore
    }
  },
}));
