import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    histories: []
}

export const historiesSlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    addHistories: (state, action) => {
        state.histories = action.payload
    },
    deleteHistories: (state, action) => {
        state.histories = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addHistories, deleteHistories } = historiesSlice.actions

export default historiesSlice.reducer