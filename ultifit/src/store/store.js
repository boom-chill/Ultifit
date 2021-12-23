import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/user'
import foodReducer from '../features/food/food'

export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})