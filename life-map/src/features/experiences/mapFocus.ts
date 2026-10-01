import { create } from 'zustand';

/**
 * Map selection + "fly to" requests, shared between screens:
 * e.g. "Add" or a detail screen asks Explore to focus an experience.
 */
type MapFocusState = {
  selectedId: string | null;
  /** Incremented on every request so the same id can be focused twice. */
  request: { id: string; seq: number } | null;
  select: (id: string | null) => void;
  focus: (id: string) => void;
};

export const useMapFocus = create<MapFocusState>((set) => ({
  selectedId: null,
  request: null,
  select: (selectedId) => set({ selectedId }),
  focus: (id) => set((s) => ({ selectedId: id, request: { id, seq: (s.request?.seq ?? 0) + 1 } })),
}));
