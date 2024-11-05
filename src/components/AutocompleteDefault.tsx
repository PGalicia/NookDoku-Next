/**
 * Imports
 */
// Redux
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch } from '@/redux/store'
import {
  getGridObjectBasedOnCellIndex,
  decreaseScoreOnCurrentSelectedCell,
  addToSelectedAnswers,
  markGameHasStarted
  } from '@/redux/features/gridObjectSlice'
import { increaseGamesPlayedStat, increaseVillagerStat } from '@/redux/features/villagersSlice'
import { closePickAVillagerModal } from '@/redux/features/modalSlice'

// Types
import type { VillagerType } from '@/types/VillagerType'
import type { RootState } from '@/redux/store'

// Utilities
import capitalizeLetter from '@/utilities/capitalizeLetter'

// React
import { useEffect, useState } from 'react'
import { useRef } from 'react'

export default function AutocompleteDefault() {
  /**
   * State
   */
  const [inputText, setInputText] = useState('');
  const [chosenIndex, setChosenIndex] = useState(0);
  const inputField = useRef<HTMLInputElement | null>(null);

  /**
   * Redux
   */
  const allVillagersData = useSelector((state: RootState) => state.villagersReducer.allVillagersData)
  const gridObject = useSelector((state: RootState) => state.gridObjectReducer.gridObject)
  const hasGameStarted = useSelector((state: RootState) => state.gridObjectReducer.hasGameStarted)
  const currentlySelectedCell = useSelector((state: RootState) => state.gridObjectReducer.currentlySelectedCell)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Hooks
   */
  useEffect(() => {
    // If the inputValue element exists, then focus on that input
    if (inputField.current) {
      inputField.current.focus()
    }
  }, [])

  /**
   * Actions
   */
  function resultList() {
    return [...new Set(allVillagersData.map((villager) => {
      return villager.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
    }).filter((name: string) => {
      return name.includes(inputText)
    }))]
  }

  // Update the chosen index based on where the user hovers to
  function onMouseEnter (index: number) {
    setChosenIndex(index)
  }

  // Reset chosen index when input is updated
  function onInputUpdate (event: React.ChangeEvent<HTMLInputElement>) {
    setInputText(event.target.value)
    setChosenIndex(0)
  }

  function onKeyPressEvent(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowUp') {
      setChosenIndex(chosenIndex - 1)
    } else if ((event.key === 'ArrowDown')) {
      setChosenIndex(chosenIndex + 1)
    } else if ((event.key === 'Enter')) {
      onVillagerClick()
    }
  }

  // Determine what happens when users click on a villager
  function onVillagerClick () {
    // Grab the list of villagers
    const suggestions = resultList() || []

    // If there is no list, return
    if (suggestions.length === 0) {
      return
    }

    
    // Grab the target villager
    const name = suggestions[chosenIndex]
    const targetVillager = allVillagersData.find((villager: VillagerType) => villager.name.toLowerCase() === name.toLowerCase()) as VillagerType

    // Grab the target gridObject
    const targetGridObject = getGridObjectBasedOnCellIndex(currentlySelectedCell)(gridObject)!
    const validVillagers: VillagerType[] = targetGridObject?.villagers

    // Check to see if targetVillager is in the target gridObject (ie user choose a correct answer)
    if (validVillagers?.some(villager => villager.name.toLowerCase() === targetVillager?.name.toLowerCase())) {
      // Add the villager to 'selectedAnswers' list. This is to prevent user from accessing an already answered cell
      dispatch(addToSelectedAnswers({
        cellIndex: currentlySelectedCell,
        villager: targetVillager
      }))

      // Increase the villager count
      dispatch(increaseVillagerStat(targetVillager.name))

      // Close Pick a villager modal
      dispatch(closePickAVillagerModal())
    } else {
      // If the user chose a wrong answer then decrease their points
      dispatch(decreaseScoreOnCurrentSelectedCell())

      // If the currentScore reaches zero, then close the Pick a villager modal
      if ((targetGridObject?.currentScore - 1) <= 0) {
        dispatch(closePickAVillagerModal())
      }
    }

    // Increase games played count at the beginning of the game
    if (!hasGameStarted) {
      dispatch(markGameHasStarted())
      dispatch(increaseGamesPlayedStat())
    }
    
  }

  // Split the given villager name to allow to be target for css styling
  function splitVillagerNameToAllowStyling (name: string) {
    // Grab the starting index in villager name based on what is on the input
    const targetStringIndex = name.indexOf(inputText)

    // Capitalize the villager name
    const capitalizeName = capitalizeLetter(name)

    // Will hold the list of string that makes up the villager name
    const splitString = []

    // If the target index is not in the beginning of the text, add the first portion of the name to the list
    // This check is to prevent adding an broken string into the list if the target index is 0
    if (targetStringIndex > 0) {
      splitString.push(capitalizeName.substring(0, targetStringIndex))
    }

    splitString.push(
      // Add in the portion of the villager name that matches the input
      capitalizeName.substring(targetStringIndex, targetStringIndex + inputText.length),

      // Add in the rest of the villagerName if any
      capitalizeName.substring(targetStringIndex + inputText.length)
    )

    // Return the parsed villager name
    return splitString
  }

  return (
    <>
      <input
        ref={inputField}
        value={inputText}
        className="h-12 text-base rounded py-4 px-2 border-black/10 border-2 border-solid mx-4"
        placeholder="Villager name"
        onChange={onInputUpdate}
        onKeyDown={onKeyPressEvent}
      />

      {/* Suggestion list */}
      <ul className="h-full rounded-lg bg-white text-black py-4 px-0 overflow-y-scroll list-none font-mono mx-4">
        {resultList().map((suggestion, index) => (
          <li
            key={`${suggestion}-${index}`}
            className={`rounded-lg cursor-pointer py-1 px-2 ${index === chosenIndex ? 'font-bold bg-black/10' : ''}`}
            onClick={() => onVillagerClick()}
            onMouseEnter={() => onMouseEnter(index)}
          >
            {splitVillagerNameToAllowStyling(suggestion).map((block, index) => (
              <span
                key={`Suggestion: ${index}`}
                className={block.toLowerCase() === inputText.toLowerCase() ? 'underline' : ''}
              >
                {block}
              </span>
            ))}
          </li>
        ))}
      </ul>
    </>
  )
}