import { create } from "zustand";

const useInterviewContentStore = create((set) => ({
  content: "",
  updateContent: () =>
    set((state: { content: string }) => ({
      content: state.content,
    })),
}));
