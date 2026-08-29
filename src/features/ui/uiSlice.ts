import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Mode = 'light' | 'dark';

function getInitialMode(): Mode {
  const stored = localStorage.getItem('theme-mode');
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia?.('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
}

interface UiState {
  mode: Mode;
}

const initialState: UiState = {
  mode: getInitialMode(),
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleMode(state) {
      state.mode = state.mode === 'dark' ? 'light' : 'dark';
      localStorage.setItem('theme-mode', state.mode);
    },
    setMode(state, action: PayloadAction<Mode>) {
      state.mode = action.payload;
      localStorage.setItem('theme-mode', state.mode);
    },
  },
});

export const { toggleMode, setMode } = uiSlice.actions;
export default uiSlice.reducer;
