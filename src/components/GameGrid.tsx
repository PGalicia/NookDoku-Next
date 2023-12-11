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
  updateSelectedCell
} from '@/redux/features/gridObjectSlice'
import { openModal } from '@/redux/features/modalSlice'

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

export default function GameGrid () {
  /**
   * Redux
   */
  const gridObject = useSelector((state: RootState) => state.gridObjectReducer.gridObject)
  const isGridSetup = useSelector((state: RootState) => state.gridObjectReducer.isGridSetup)
  const selectedAnswers = useSelector((state: RootState) => state.gridObjectReducer.selectedAnswers)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Constants
   */
  const gridCategoryHeightClass = 'min-h-[24px]'
  const gridLoadingColor = 'bg-gray-200'

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

      // Open modal
      dispatch(openModal())
    }
  }

  return (
    <div
      className={`${styles['c-grid']} grid gap-2 relative w-fit left-1/2`}
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
                className={`rounded-lg ${gridCategoryHeightClass} ${isGridSetup ? '' : gridLoadingColor }`}
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
                <div className={`rounded-lg ${gridCategoryHeightClass} ${isGridSetup ? '' : gridLoadingColor }`}>
                  {findRowOrColumnCategory('row', rowIndex - 2)}
                </div>
              </div>
            )
          } else {
            const extraCellClassNames = () => {
              const villagerCount = getCurrentCellVillagerCount(rowIndex - 2, colIndex - 2)(gridObject)

              let extraClassnames = [
                'hover:scale-105',
                'cursor-pointer'
              ]

              if (!isGridSetup) {
                return [...extraClassnames, gridLoadingColor].join(' ')
              } else if (villagerCount === 1) {
                return [...extraClassnames, 'bg-violet-500'].join(' ')
              } else if (villagerCount > 1) {
                return [...extraClassnames,'bg-blue-300'].join(' ')
              } else {
                return ['bg-black', 'cursor-not-allowed'].join(' ')
              }
            }

            // Villager cell
            return (
              <div
                key={`RegularCell: ${rowIndex}-${colIndex}`}
                className={`transition-transform flex relative rounded-lg p-4 justify-center aspect-square ${extraCellClassNames()}`}
                onClick={() => onGridClick(rowIndex - 2, colIndex - 2)}
              >
                {/* Villager image */}
                {findCellVillagerImage(getGridCellIndex(rowIndex - 2, colIndex - 2)) && 
                  <Image
                    src={findCellVillagerImage(getGridCellIndex(rowIndex - 2, colIndex - 2))!}
                    alt=""
                    className="w-auto h-full"
                    width={130}
                    height={130}
                  />
                }
      
                {/* Score counter */}
                {getCurrentCellVillagerCount(rowIndex - 2, colIndex - 2)(gridObject) > 0 &&
                  <div className="c-grid__scores flex gap-1 text-black right-2 top-2 absolute">
                    <ScoreContainer
                      maxScore={determineCellMaxScore(rowIndex - 2, colIndex - 2)}
                      currentScore={determineCellScore(rowIndex - 2, colIndex - 2)!}
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