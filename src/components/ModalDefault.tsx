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
import ScoreContainer from '@/components/ScoreContainer'
import ButtonDefault from '@/components/ButtonDefault'

// Utilities
import parsedCategory from '@/utilities/parsedCategory'

// Styles
import styles from '@/styles/componentModal.module.scss'

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
        className={`${styles['c-modal__container']} min-w-auto md:min-w-[500px] flex flex-col relative h-full overflow-hidden bg-white text-black w-full sm:w-auto border-primary border-4`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-secondary border-b-4 border-solid border-primary py-2 px-4 flex justify-between">
          {/* Modal title */}
          <div className="font-mono uppercase font-bold text-base">
            Pick a villager
          </div>

          {/* Close button */}
          <div
            className="w-8 cursor-pointer hover:text-white text-right"
            onClick={() => onCloseClick()}
          >
            x
          </div>
        </div>

        {/* Modal main */}
        <div className="p-4 font-mono text-sm flex flex-col gap-2">
          {/* Modal category */}
          {
            (rowAndColCategories()?.rowCategory?.value || rowAndColCategories()?.colCategory?.value) &&
            <div>
              Category: <span className="font-bold">{parsedCategory(rowAndColCategories()?.rowCategory?.value)}</span> / <span className="font-bold">{parsedCategory(rowAndColCategories()?.colCategory?.value)}</span>
            </div>
          }

          {/* Score counter */}
          <div className="flex">
            <div className="mr-4">
              Counter:
            </div>

            <div className="flex gap-1 items-center">
              <ScoreContainer
                maxScore={getCurrentMaxScore()}
                currentScore={currentScore()}
              />
            </div>
          </div>

          {/* Hint buttons */}
          <div className="flex flex-col gap-2 px-0 py-2">
            <div>
              Hint:
            </div>
            <ButtonDefault
              buttonText="Show possible villagers"
              onClick={() => showVillagerHint()}
              isDisabled={disableVillagerImageHint()}
            />
            {
              isVillagerHintShowing() &&
              <ButtonDefault
                buttonText="Show name hint"
                onClick={() => showNameHint()}
                isDisabled={disableVillagerNameHint()}
              />
            }
          </div>

          {/* Villager image/name hint */}
          {
            isVillagerHintShowing() &&
            <div className="max-h-[200px] flex overflow-x-auto overflow-y-hidden gap-2 flex-shrink-0 py-4 px-0">
              {getValidVillagers().map((villager) => {
                return (
                  <div
                    key={villager.name}
                    className="flex flex-col"
                  >
                    {/* Villager image hint */}
                    <div className="w-[80px] h-[100px] bg-white border-2 border-primary flex basis-[100px] flex-shrink-0 flex-grow-0 rounded-lg justify-center">
                      <Image
                        src={villager.image_url}
                        alt="villager image"
                        className="h-full w-auto p-2"
                        width={130}
                        height={130}
                      />
                    </div>
                    {/* Villager name hint */}
                    {
                      isVillagerNameShowing() &&
                      <div className="text-center flex-grow-0 mt-2 tracking-widest font-mono">
                        {updateVillagerNameToBeAHint(villager.name)}
                      </div>
                    }
                  </div>
                )
              })}
            </div>
          }

        </div>

        {/* Villager name input */}
        <AutocompleteDefault />
      </div>
    </div>
  )
}