import { configureStore } from '@reduxjs/toolkit'
import userReducer from '../features/user/user'
import foodReducer from '../features/food/food'
import historyReducer from '../features/histories/histories'

export const store = configureStore({
  reducer: {
    user: userReducer,
    food: foodReducer,
    history: historyReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    serializableCheck: false
  }),
})