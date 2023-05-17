import { configureStore } from '@reduxjs/toolkit';
import userSlice from './userSlice';
import commentSlice from './commentsSlice';

const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    comments: commentSlice.reducer,
  },
});

export default store;
