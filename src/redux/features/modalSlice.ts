/**
 * Imports
 */
// Redux
import { createSlice } from "@reduxjs/toolkit";

/**
 * Inital State
 */
const initialState = {
  isPickAVillagerModalActive: false,
  isHowToPlayModalActive: false,
  isEndOfGameModalActive: false
}

/**
 * Slice
 */
const modal = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    // Pick a villager
    openPickAVillagerModal: (state) => {
      state.isPickAVillagerModalActive = true
    },
    closePickAVillagerModal: (state) => {
      state.isPickAVillagerModalActive = false
    },
    
    // How to play
    openHowToPlayModal: (state) => {
      state.isHowToPlayModalActive = true
    },
    closeHowToPlayModal: (state) => {
      state.isHowToPlayModalActive = false
    }
  }
})

export const {
  openPickAVillagerModal,
  closePickAVillagerModal,
  openHowToPlayModal,
  closeHowToPlayModal
} = modal.actions
export default modal.reducer