'use client'
/**
 * Imports
 */
// Redux
import { useDispatch, useSelector } from 'react-redux'
import {
  getGridCellIndex,
  getGridObjectBasedOnCellIndex,
  getCurrentCellVillagerCount,
  updateSelectedCell,
  isGameComplete,
  updateFillInGridStatus
} from '@/redux/features/gridObjectSlice'
import { openPickAVillagerModal } from '@/redux/features/modalSlice'
import { increaseGamesFinishedStat, updateTopScore } from '@/redux/features/villagersSlice'

// Components
import Image from 'next/image'
import ScoreContainer from '@/components/ScoreContainer'

// Styles
import styles from '@/styles/componentGameGrid.module.scss'

// Types
import type { GridObjectType } from '@/types/GridObjectType'
import type { SelectedAnwerType } from '@/types/SelectedAnwerType'
import type { RootState, AppDispatch } from '@/redux/store'

// Constants
import { GRID_SIZE } from '@/constants/GridSettings'

// Utilities
import parsedCategory from '@/utilities/parsedCategory'
import createArrayRange from '@/utilities/createArrayRange'
import { useEffect } from 'react'

export default function GameGrid () {
  /**
   * Redux
   */
  const gridObject = useSelector((state: RootState) => state.gridObjectReducer.gridObject)
  const isGridSetup = useSelector((state: RootState) => state.gridObjectReducer.isGridSetup)
  const selectedAnswers = useSelector((state: RootState) => state.gridObjectReducer.selectedAnswers)
  const currentPlayerScore = useSelector((state: RootState) => state.gridObjectReducer.currentPlayerScore)
  const gameStats = useSelector((state: RootState) => state.villagersReducer.gameStats)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Constants
   */
  const gridCategoryHeightClass = 'min-h-[24px]'
  const gridLoadingColor = 'bg-white'

  /**
   * Hooks
   */
  useEffect(
    () => {
      // Increase game stats when game is complete
      if (gridObject.length > 0 && isGameComplete(gridObject)) {
        dispatch(increaseGamesFinishedStat());
        dispatch(updateFillInGridStatus(true));

        // Update top score if it beats your old score
        if (currentPlayerScore > gameStats.highScore) {
          dispatch(updateTopScore(currentPlayerScore))
        }
      }
    },
    [gridObject]
  )

  /**
   * Methods
   */
  // Find the row/col category based on the given index
  function findRowOrColumnCategory (type: 'row'|'col', index: number): string | undefined {
    // Grab the `category_row` or `category_col` based on the given index
    const category = gridObject.find((obj: GridObjectType) => obj[type] === index)?.[`category_${type}`]?.value || ''

    // Clean up the category and return it
    return parsedCategory(category)
  }

  // Find the image url of a villager based on the given cell index
  function findCellVillagerImage (index: number): string | undefined {
    return selectedAnswers.find((obj: SelectedAnwerType) => obj.cellIndex === index)?.villager?.image_url
  }

  // Determine the current score of a grid cell
  function determineCellScore (row: number, col: number) {
    const targetIndex = getGridCellIndex(row, col)
    const targetGridObject = getGridObjectBasedOnCellIndex(targetIndex)(gridObject)
    return targetGridObject?.currentScore
  }

  // Determine the max score of a grid cell
  function determineCellMaxScore (row: number, col: number) {
    const targetIndex = getGridCellIndex(row, col)
    const targetGridObject = getGridObjectBasedOnCellIndex(targetIndex)(gridObject)
    return targetGridObject?.maxScore || 0
  }

  // Determine the if the given cell is lock or not
  // Cell gets lock when user weren't able to answer it
  function isTargetCellLocked (row: number, col: number) {
    const targetIndex = getGridCellIndex(row, col)
    const targetGridObject = getGridObjectBasedOnCellIndex(targetIndex)(gridObject)
    return targetGridObject?.isComplete
  }

  function onGridClick (rowIndex: number, colIndex: number) {
    // Grab the cell index based on the given row and index
    const index = getGridCellIndex(rowIndex, colIndex)

    // If current cell is not lock AND the user hasn't answer that cell AND there is a valid answer for that cell...
    if (
      !isTargetCellLocked(rowIndex, colIndex) &&
      selectedAnswers.findIndex((obj: SelectedAnwerType) => obj.cellIndex === index) === -1 &&
      getCurrentCellVillagerCount(rowIndex, colIndex)(gridObject) > 0
    ) {
      // Mark the clicked cell as the currenly selected one
      dispatch(updateSelectedCell(index))

      // Open "Pick a villager" modal
      dispatch(openPickAVillagerModal())
    }
  }

  return (
    <div
      className={`${styles['c-grid']} grid gap-4 justify-center`}
    >
      {createArrayRange(GRID_SIZE + 1, true).map((rowIndex) => {
        return createArrayRange(GRID_SIZE + 1, true).map((colIndex) => {
          if (rowIndex === 1 && colIndex === 1) {
            // Empty top left grid cell
            return <div key={`EmptyCell: ${rowIndex}-${colIndex}`} />
          } else if (rowIndex === 1) {
            // Column category
            return (
              <div
                key={`ColumnCategory: ${rowIndex}-${colIndex}`}
                className={`${gridCategoryHeightClass} font-mono text-white font-bold uppercase text-sm`}
              >
                {findRowOrColumnCategory('col', colIndex - 2)}
              </div>
            )
          } else if (rowIndex > 1 && colIndex === 1) {
            // Row category
            return (
              <div
                key={`RowCategory: ${rowIndex}-${colIndex}`}
              >
                <div className={`${styles['c-grid__rowCat']} ${gridCategoryHeightClass} font-mono text-white font-bold uppercase text-sm leading-tight`}>
                  {findRowOrColumnCategory('row', rowIndex - 2)}
                </div>
              </div>
            )
          } else {
            const villagerCount = getCurrentCellVillagerCount(rowIndex - 2, colIndex - 2)(gridObject);
            const cellVillagerNameImage = findCellVillagerImage(getGridCellIndex(rowIndex - 2, colIndex - 2));
            const cellScore = determineCellScore(rowIndex - 2, colIndex - 2);

            const extraCellClassNames = () => {
              let extraClassnames = [
                'hover:scale-105',
                'cursor-pointer'
              ]

              if (!isGridSetup) {
                return [...extraClassnames, gridLoadingColor].join(' ')
              } else if (villagerCount === 1) {
                return [...extraClassnames, 'bg-secondary'].join(' ')
              } else if (villagerCount > 1) {
                return [...extraClassnames,'bg-white'].join(' ')
              } else {
                return ['bg-black', 'cursor-not-allowed'].join(' ')
              }
            }

            const wrongAnimationCellClassName = cellScore === 0 ? styles['c-grid__cell--wrong'] : '';
            const correctAnimationCellClassName = cellVillagerNameImage ? styles['c-grid__cell--correct'] : '';

            // Villager cell
            return (
              <div
                key={`RegularCell: ${rowIndex}-${colIndex}`}
                className={`${styles['c-grid__cell']} transition-transform flex relative rounded-md p-4 items-center justify-center ${extraCellClassNames()} ${wrongAnimationCellClassName} ${correctAnimationCellClassName}`}
                onClick={() => onGridClick(rowIndex - 2, colIndex - 2)}
              >
                {/* Villager image */}
                {cellVillagerNameImage && 
                  <Image
                    src={cellVillagerNameImage!}
                    alt=""
                    className="w-full h-auto object-contain"
                    width={130}
                    height={130}
                  />
                }
      
                {/* Score counter */}
                {villagerCount > 0 &&
                  <div className="c-grid__scores flex text-black gap-0.5 right-1 -top-1 absolute">
                    <ScoreContainer
                      maxScore={determineCellMaxScore(rowIndex - 2, colIndex - 2)}
                      currentScore={cellScore!}
                      onlyOne={villagerCount === 1}
                    />
                  </div>
                }
              </div>
            )
          }
        })
      })}
    </div>
  )
}