import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  token: string | null;
  username: string | null;
}

const initialState: AuthState = {
  token: localStorage.getItem('admin-token'),
  username: localStorage.getItem('admin-username'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<{ token: string; username: string }>) {
      state.token = action.payload.token;
      state.username = action.payload.username;
      localStorage.setItem('admin-token', action.payload.token);
      localStorage.setItem('admin-username', action.payload.username);
    },
    signOut(state) {
      state.token = null;
      state.username = null;
      localStorage.removeItem('admin-token');
      localStorage.removeItem('admin-username');
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
