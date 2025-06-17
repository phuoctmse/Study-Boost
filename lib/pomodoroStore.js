import { create } from 'zustand';

export const usePomodoroStore = create((set, get) => ({
  secondsLeft: 0,
  isRunning: false,
  setSecondsLeft: (s) => set({ secondsLeft: s }),
  setIsRunning: (r) => set({ isRunning: r }),
  decrement: () => set(state => ({ secondsLeft: state.secondsLeft - 1 })),
  formatTime: (s) => {
    if (isNaN(s) || s < 0) return '00:00';
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  },
})); 