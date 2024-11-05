/**
 * Imports
 */
// Redux
import { createSlice, PayloadAction, createSelector } from '@reduxjs/toolkit'

// Types
import type { GridObjectType } from '@/types/GridObjectType';
import type { SelectedAnwerType } from '@/types/SelectedAnwerType';

// Constants
import CELL_INDEX_MAPPING from '@/constants/CellIndexMapping'

/**
 * Private functions
 */
function _determineGridCellIndex (rowIndex: number, colIndex: number) {
  for (const key in CELL_INDEX_MAPPING) {
    const { row, col } = CELL_INDEX_MAPPING[key]
    if (row === rowIndex && col === colIndex) {
      return parseInt(key)
    }
  }

  throw new Error('Target key does not exist. Cannot build grid')
}

function _showHint (currentGridObject: GridObjectType[], targetGridObject: GridObjectType, isImage: boolean = true) {
  const { row: targetRow, col: targetCol } = targetGridObject
  const gridObjectCopy = currentGridObject
  const targetIndex = gridObjectCopy.findIndex(({ row, col }) => row === targetRow && col === targetCol)

  if (targetIndex !== -1) {
    if (isImage) {
      targetGridObject.isShowingHintImages = true
    } else {
      targetGridObject.isShowingHintName = true
    }

    gridObjectCopy[targetIndex] = targetGridObject

    return gridObjectCopy
  }

  return currentGridObject
}

function _getGridObjectBasedOnCellIndex (index: number, gridObject: GridObjectType[]) {
  if (index < 0) {
    return null
  }

  const { row: targetRow, col: targetCol } = CELL_INDEX_MAPPING[index]

  return gridObject.find((obj: GridObjectType) => obj.row === targetRow && obj.col === targetCol) as GridObjectType
}

/**
 * Initial State
 */
const initialState = {
  gridObject: [] as GridObjectType[],
  currentlySelectedCell: -1,
  selectedAnswers: [] as SelectedAnwerType[],
  isGridFilledIn: false,
  isGridSetup: false,
  hasGameStarted: false,
  currentPlayerScore: 0,
  currentGameMaxScore: 0
}

/**
 * Slice
 */
export const gridObject = createSlice({
  name: 'gridObject',
  initialState,
  reducers: {
    addToGridObject: (state, item: PayloadAction<GridObjectType[]>) => {
      state.gridObject = item.payload
    },
    updateSelectedCell: (state, cellIndex: PayloadAction<number>) => {
      state.currentlySelectedCell = cellIndex.payload
    },
    showCellHintImagesOnCurrentSelectedCell: (state) => {
      const { gridObject, currentlySelectedCell } = state
      const targetGridObject: GridObjectType | null = _getGridObjectBasedOnCellIndex(currentlySelectedCell, gridObject)

      if (targetGridObject) {
        state.gridObject = _showHint(gridObject, targetGridObject)
      }
    },
    showCellHintNamesOnCurrentSelectedCell: (state) => {
      const { gridObject, currentlySelectedCell } = state
      const targetGridObject: GridObjectType | null = _getGridObjectBasedOnCellIndex(currentlySelectedCell, gridObject)
      
      if (targetGridObject) {
        state.gridObject = _showHint(gridObject, targetGridObject, false)
      }
    },
    decreaseScoreOnCurrentSelectedCell: (state) => {
      const { gridObject, currentlySelectedCell } = state
      const targetGridObject: GridObjectType | null = _getGridObjectBasedOnCellIndex(currentlySelectedCell, gridObject)

      if (!targetGridObject) {
        return
      }

      const { row: targetRow, col: targetCol } = targetGridObject
      const gridObjectCopy = gridObject
      const targetIndex = gridObjectCopy.findIndex(({ row, col }) => row === targetRow && col === targetCol)
  
      if (targetIndex !== -1) {
        // Calculate new score
        const newScore = Math.max(0, targetGridObject.currentScore - 1)

        // Update new score
        targetGridObject.currentScore = newScore

        // Determine if cell needs to be locked
        targetGridObject.isComplete = targetGridObject.currentScore === 0

        // // Decrease player score
        // state.currentPlayerScore -= 1
  
        gridObjectCopy[targetIndex] = targetGridObject
  
        state.gridObject = gridObjectCopy
      }
    },
    markThatTheTargetGridObjectIsComplete: (state) => {
      const { gridObject, currentlySelectedCell } = state
      const targetGridObject: GridObjectType | null = _getGridObjectBasedOnCellIndex(currentlySelectedCell, gridObject)

      if (!targetGridObject) {
        return
      }

      const { row: targetRow, col: targetCol } = targetGridObject
      const gridObjectCopy = gridObject
      const targetIndex = gridObjectCopy.findIndex(({ row, col }) => row === targetRow && col === targetCol)

      if (targetIndex !== -1) {
        // Mark that the cell is completed
        targetGridObject.isComplete = true
  
        gridObjectCopy[targetIndex] = targetGridObject
  
        // Update gridObject
        state.gridObject = gridObjectCopy

        // Adjust multiplier if the grid object only has one possible answer
        const scoreMultiplier = targetGridObject.villagers.length === 1
          ? 20
          : 10;

        // Update current player score
        state.currentPlayerScore += (targetGridObject.currentScore * scoreMultiplier);
      }
    },
    updateFillInGridStatus: (state, status: PayloadAction<boolean>) => {
      state.isGridFilledIn = status.payload
    },
    addToSelectedAnswers: (state, answer: PayloadAction<SelectedAnwerType>) => {
      state.selectedAnswers.push(answer.payload)
    },
    markGridAsReady: (state) => {
      state.isGridSetup = true
    },
    markGameHasStarted: (state) => {
      state.hasGameStarted = true
    },
    updatePlayerScore: (state, score: PayloadAction<number>) => {
      state.currentPlayerScore = score.payload
    },
    updateCurrentGameMaxScore: (state, score: PayloadAction<number>) => {
      state.currentGameMaxScore = score.payload
    }
  }
})

export const isGameComplete = (gridObject: GridObjectType[]) => (
  gridObject.every(({ isComplete }: GridObjectType) => {
    return isComplete
  })
)

export const getGridCellIndex = (rowIndex: number, colIndex: number) => (
  _determineGridCellIndex(rowIndex, colIndex)
)

export const getCurrentCellVillagerCount = (rowIndex: number, colIndex: number) => (
  createSelector(
    (gridObject: GridObjectType[]) => gridObject,
    (gridObject) => {
      return gridObject
        .find((obj: GridObjectType) => obj.row === rowIndex && obj.col === colIndex)
        ?.villagers
        ?.length || -1
    }
  )
)

export const getGridObjectBasedOnCellIndex = (index: number) => (
  createSelector(
    (gridObject: GridObjectType[]) => gridObject,
    (gridObject) => _getGridObjectBasedOnCellIndex(index, gridObject)
  )
)

export const {
  addToGridObject,
  updateSelectedCell,
  showCellHintImagesOnCurrentSelectedCell,
  showCellHintNamesOnCurrentSelectedCell,
  decreaseScoreOnCurrentSelectedCell,
  updateFillInGridStatus,
  addToSelectedAnswers,
  markGameHasStarted,
  markGridAsReady,
  markThatTheTargetGridObjectIsComplete,
  updatePlayerScore,
  updateCurrentGameMaxScore
} = gridObject.actions
export default gridObject.reducer