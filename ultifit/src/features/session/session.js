import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    sessions: [],
    startSession: {
      exercises: [],
      name: '',
      praticeTime: 0,
      restTime: 0,
    },
    openStartSession: false,
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
    addStartSession: (state, action) => {
      state.startSession = action.payload
    },
    deleteStartSession: (state, action) => {
      state.startSession = {
        exercises: [],
        name: '',
        praticeTime: 0,
        restTime: 0,
      }
    },
    openStartSession: (state, action) => {
      state.openStartSession = true
    },
    closeStartSession: (state, action) => {
      state.openStartSession = false
    }
  },
})

// Action creators are generated for each case reducer function
export const { addSessions, deleteSessions, addStartSession, deleteStartSession, openStartSession, closeStartSession } = sessionSlice.actions

export default sessionSlice.reducer