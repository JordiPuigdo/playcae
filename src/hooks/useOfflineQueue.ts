import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckInRequest, CheckOutRequest } from "@/types/accessHistory";
import { AccessService } from "@/services/access.service";

export interface QueuedOperation {
  id: string;
  type: "checkin" | "checkout";
  payload: CheckInRequest | CheckOutRequest;
  workerName: string;
  queuedAt: number;
}

interface OfflineQueueState {
  queue: QueuedOperation[];
  isSyncing: boolean;
  enqueue: (op: Omit<QueuedOperation, "id">) => void;
  syncQueue: () => Promise<{ synced: number; failed: number }>;
  clearQueue: () => void;
}

const accessService = new AccessService();

export const useOfflineQueue = create<OfflineQueueState>()(
  persist(
    (set, get) => ({
      queue: [],
      isSyncing: false,

      enqueue: (op) => {
        const item: QueuedOperation = {
          ...op,
          id: crypto.randomUUID(),
        };
        set((state) => ({ queue: [...state.queue, item] }));
      },

      syncQueue: async () => {
        const { queue, isSyncing } = get();
        if (isSyncing || queue.length === 0) return { synced: 0, failed: 0 };

        set({ isSyncing: true });
        let synced = 0;
        let failed = 0;
        const remaining: QueuedOperation[] = [];

        for (const op of queue) {
          try {
            const payloadWithNote = {
              ...op.payload,
              notes: op.payload.notes
                ? `${op.payload.notes} [offline:${op.queuedAt}]`
                : `[offline:${op.queuedAt}]`,
            };

            if (op.type === "checkin") {
              await accessService.checkIn(payloadWithNote as CheckInRequest);
            } else {
              await accessService.checkOut(payloadWithNote as CheckOutRequest);
            }
            synced++;
          } catch {
            failed++;
            remaining.push(op);
          }
        }

        set({ queue: remaining, isSyncing: false });
        return { synced, failed };
      },

      clearQueue: () => set({ queue: [] }),
    }),
    {
      name: "kiosk-offline-queue",
    }
  )
);
