import { store } from '../store.js'; 

const themeKey = 'theme';

export const ThemeMode = {
  Light: '0',
  Dark: '1'
}

export const theme = {
  currentMode: ThemeMode.Light,

  initialisation() {
    this.setMode(store.getKey(themeKey) || ThemeMode.Light);
  },

  setMode(mode: string) {
    this.currentMode = mode;
    store.setKey(themeKey, mode);
    document.body.style.setProperty('--is-dark-mode', mode);
  },
  
  toggleMode() {
    const newTheme = this.currentMode === ThemeMode.Light ? ThemeMode.Dark : ThemeMode.Light;
    this.setMode(newTheme);
  }
}