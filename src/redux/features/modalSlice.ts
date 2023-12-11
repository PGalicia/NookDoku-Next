/**
 * Imports
 */
// Redux
import { createSlice } from "@reduxjs/toolkit";

/**
 * Inital State
 */
const initialState = {
  isModalActive: false  
}

/**
 * Slice
 */
const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openModal: (state) => {
      state.isModalActive = true
    },
    closeModal: (state) => {
      state.isModalActive = false
    }
  }
})

export const { openModal, closeModal } = modal.actions
export default modal.reducer