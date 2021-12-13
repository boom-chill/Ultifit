import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    accessToken: null,
    user: null,
    register: null,
}

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.register = {
        username: action.payload.username,
      }
    },
    addUser: (state, action) => {
      state.user = action.payload.data

      state.accessToken = action.payload.accessToken
    },
    deleteUser: (state, action) => {
      state.user = null
      state.accessToken = null
    },
  },
})

// Action creators are generated for each case reducer function
export const { addUser, deleteUser, registerUser } = userSlice.actions

export default userSlice.reducer