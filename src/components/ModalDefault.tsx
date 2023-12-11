/**
 * Imports
 */
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import {
  getGridObjectBasedOnCellIndex,
  updateSelectedCell,
  showCellHintImagesOnCurrentSelectedCell,
  decreaseScoreOnCurrentSelectedCell,
  showCellHintNamesOnCurrentSelectedCell
} from '@/redux/features/gridObjectSlice'
import { closeModal } from '@/redux/features/modalSlice'

// Types
import type { GridObjectType } from '@/types/GridObjectType'
import type { RootState } from '@/redux/store'

// Components
import Image from 'next/image'
import AutocompleteDefault from '@/components/AutocompleteDefault'

// Utilities
import parsedCategory from '@/utilities/parsedCategory'
import createArrayRange from '@/utilities/createArrayRange'

export default function ModalDefault () {
  /**
   * Redux
   */
  const gridObject = useSelector((state: RootState) => state.gridObjectReducer.gridObject)
  const currentlySelectedCell = useSelector((state: RootState) => state.gridObjectReducer.currentlySelectedCell)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Methods
   */
  function getCurrentlySelectedCellGridObject() {
    return getGridObjectBasedOnCellIndex(currentlySelectedCell)(gridObject) as GridObjectType
  }

  // Determine if the villager image hint button is disabled or not
  function disableVillagerImageHint () {
    return isVillagerHintShowing() || currentScore() < 2
  }

  // Determine if the villager name hint is button disabled or not
  function disableVillagerNameHint() {
    return isVillagerNameShowing() || currentScore() < 2
  }

  // Check to see if village image hint is showing
  function isVillagerHintShowing() {
    return getCurrentlySelectedCellGridObject()?.isShowingHintImages
  }

  // Check to see if village name hint is showing
  function isVillagerNameShowing() {
    return getCurrentlySelectedCellGridObject()?.isShowingHintName
  }

  // Gran the row and col category
  function rowAndColCategories() {
    const { category_row: rowCategory, category_col: colCategory } = getCurrentlySelectedCellGridObject() || { category_row: null, category_col: null }
    return {
      rowCategory,
      colCategory
    }
  }

  // Get all the valid villager for the currently selected cell
  function getValidVillagers() {
    const targetVillagers = getCurrentlySelectedCellGridObject()?.villagers
    if (targetVillagers.length > 0) {
      return [...targetVillagers]
    }
    return targetVillagers
  }

  // Get the max score for the currently selected cell
  function getCurrentMaxScore() {
    return getCurrentlySelectedCellGridObject()?.maxScore
  }

  // Get the current score for the currently selected cell
  function currentScore() {
    return getCurrentlySelectedCellGridObject()?.currentScore
  }

  /**
   * Events
   */
  // Determines what happens when user closes the modal
  function onCloseClick () {
    // Reset selected cell
    dispatch(updateSelectedCell(-1))

    // Close modal
    dispatch(closeModal())
  }

  // Show villager imge hint
  function showVillagerHint () {
    // Show villager image hint
    dispatch(showCellHintImagesOnCurrentSelectedCell())

    // Decrease the counter count
    dispatch(decreaseScoreOnCurrentSelectedCell())
  }

  // Show villager name hint
  function showNameHint () {
    // Show villager image hint
    dispatch(showCellHintNamesOnCurrentSelectedCell())

    // Decrease the counter count
    dispatch(decreaseScoreOnCurrentSelectedCell())
  }

  /**
   * Methods
   */
  // Update the given villager name to be a hint
  function updateVillagerNameToBeAHint (villagerName: string) {
    // Take the second letter and on and update them to be a '-' character
    const updatedHintNameForHint = villagerName
      .slice(1)
      .split('')
      .map(character => character === ' ' ? character : '-')
      .join('')

    // Combine first letter of the villager name with the 'updatedHintNameForHint'
    return villagerName[0] + updatedHintNameForHint
  }

  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/30 flex justify-center p-0 sm:p-8"
      onClick={() => onCloseClick()}
    >
      <div
        className="min-w-auto md:min-w-[500px] flex flex-col relative h-full overflow-hidden bg-white text-black p-4 rounded-lg w-full sm:w-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Close button */}
        <div
          className="absolute w-8 h-8 rounded-lg bg-gray-700 cursor-pointer top-4 right-4"
          onClick={() => onCloseClick()}
        />
        {/* Modal title */}
        <div className="font-bold text-base">
          Pick a villager
        </div>
        {/* Modal category */}
        {
          (rowAndColCategories()?.rowCategory?.value || rowAndColCategories()?.colCategory?.value) &&
          <div>
            Category: {parsedCategory(rowAndColCategories()?.rowCategory?.value)} / {parsedCategory(rowAndColCategories()?.colCategory?.value)}
          </div>
        }

        {/* Score counter */}
        <div>
          <div className="mr-4">
            Counter:
          </div>

          <div className="flex gap-1">
            {createArrayRange(getCurrentMaxScore()).map((scoreIndex) => {
              return (
              <div key={scoreIndex}>
                <div className={`rounded-full w-4 h-4 ${scoreIndex >= currentScore() ? 'bg-red-500' : 'bg-green-500'}`} />
              </div>
              )
            })}
          </div>
        </div>

        {/* Hint buttons */}
        <div className="flex px-0 py-2">
          <div className="mr-4">
            Hint:
          </div>
          <button
            disabled={disableVillagerImageHint()}
            onClick={() => showVillagerHint()}
          >
            Show possible villagers
          </button>
          {
            isVillagerHintShowing() &&
            <button
              disabled={disableVillagerNameHint()}
              className="ml-2"
              onClick={() => showNameHint()}
            >
              Show name hint
            </button>
          }
        </div>

        {/* Villager image/name hint */}
        {
          isVillagerHintShowing() &&
          <div className="max-h-[200px] flex overflow-x-auto overflow-y-hidden gap-1 flex-shrink-0 py-4 px-0">
          {getValidVillagers().map((villager) => {
            return (
              <div
                key={villager.name}
                className="flex flex-col"
              >
                {/* Villager image hint */}
                <div className="w-[80px] h-[100px] bg-blue-300 flex basis-[100px] flex-shrink-0 flex-grow-0 rounded-lg justify-center">
                  <Image
                    src={villager.image_url}
                    alt="villager image"
                    className="h-full w-auto p-1"
                    width={130}
                    height={130}
                  />
                </div>
                {/* Villager name hint */}
                {
                  isVillagerNameShowing() &&
                  <div className="text-center flex-grow-0">
                    {updateVillagerNameToBeAHint(villager.name)}
                  </div>
                }
              </div>
            )
          })}
          </div>
        }

        {/* Villager name input */}
        <AutocompleteDefault />
      </div>
    </div>
  )
}