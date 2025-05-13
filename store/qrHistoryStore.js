import { create } from "zustand";
export const useQrHistoryStore = create((set) => {
  return {
    qrHistory: [],
    addQrToHistory: (qr) => {
      set((state) => ({
        qrHistory: [...state.qrHistory, qr],
      }));
    },
    clearQrHistory: () => {
      set({ qrHistory: [] });
    },
  };
});
