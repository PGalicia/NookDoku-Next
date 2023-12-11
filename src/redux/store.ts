import { configureStore } from '@reduxjs/toolkit'

import villagersReducer from '@/redux/features/villagersSlice'
import gridObjectReducer from '@/redux/features/gridObjectSlice'
import modalReducer from '@/redux/features/modalSlice'

export const store = configureStore({
  reducer: {
    villagersReducer,
    gridObjectReducer,
    modalReducer
  }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch