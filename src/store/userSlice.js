import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const loadUser = createAsyncThunk('user/load', async () => {
  const response = await fetch('http://localhost:3001/currentUser/');
  const data = await response.json();

  return data;
});

const userSlice = createSlice({
  name: 'user',
  initialState: {
    image: {},
    username: '',
  },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(loadUser.fulfilled, (state, action) => {
      state.image = action.payload.image;
      state.username = action.payload.username;
    });
  },
});

export default userSlice;
