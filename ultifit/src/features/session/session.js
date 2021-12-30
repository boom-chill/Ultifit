import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sessions: []
}

export const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    addSessions: (state, action) => {
        state.sessions = action.payload
    },
    deleteSessions: (state, action) => {
        state.sessions = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addSessions, deleteSessions } = sessionSlice.actions

export default sessionSlice.reducer