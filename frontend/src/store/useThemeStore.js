import { create } from 'zustand';

const useThemeStore = create((set) => ({
  darkMode: localStorage.getItem('kopiku-dark') === 'true',

  toggleDarkMode: () => set((state) => {
    const newMode = !state.darkMode;
    localStorage.setItem('kopiku-dark', newMode);
    if (newMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
    return { darkMode: newMode };
  }),

  initTheme: () => set((state) => {
    if (state.darkMode) {
      document.body.classList.add('dark');
    }
    return state;
  })
}));

export default useThemeStore;
