import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    foods: []
}

export const foodSlice = createSlice({
  name: 'food',
  initialState,
  reducers: {
    addFoods: (state, action) => {
        state.foods = action.payload
    },
    deleteFoods: (state, action) => {
        state.foods = []
    },
  },
})

// Action creators are generated for each case reducer function
export const { addFoods, deleteFoods } = foodSlice.actions

export default foodSlice.reducer