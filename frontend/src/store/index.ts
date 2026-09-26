import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AppState {
  currentUser: any | null;
  activeWorkspace: any | null;
  activeProject: any | null;
  notification: { message: string; type: 'success' | 'error' | 'info' } | null;
}

const initialState: AppState = {
  currentUser: { email: 'admin@example.com', full_name: 'Senior Admin', role: 'admin' },
  activeWorkspace: { id: 1, name: 'Default Workspace' },
  activeProject: null,
  notification: null,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<any>) => {
      state.currentUser = action.payload;
    },
    setActiveWorkspace: (state, action: PayloadAction<any>) => {
      state.activeWorkspace = action.payload;
    },
    setActiveProject: (state, action: PayloadAction<any>) => {
      state.activeProject = action.payload;
    },
    setNotification: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' } | null>) => {
      state.notification = action.payload;
    },
  },
});

export const { setCurrentUser, setActiveWorkspace, setActiveProject, setNotification } = appSlice.actions;

export const store = configureStore({
  reducer: {
    app: appSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
