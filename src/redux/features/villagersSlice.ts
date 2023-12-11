/**
 * Imports
 */
// Redux
import {
  createSlice,
  createAsyncThunk,
  PayloadAction
} from '@reduxjs/toolkit'
import type { RootState } from '@/redux/store'
import {
  addToGridObject,
  markGridAsReady,
  updatePlayerScore,
  addToSelectedAnswers,
  getGridCellIndex
} from '@/redux/features/gridObjectSlice'

// Types
import type { VillagerType, VillagerStatsType } from '@/types/VillagerType'
import type { SelectedAnwerType } from '@/types/SelectedAnwerType'
import type { CategoryType } from '@/types/CategoryType'
import type { CategoriesType } from '@/types/CategoriesType'
import type { GridObjectType } from '@/types/GridObjectType'

// Constants
import { GRID_CATEGORIES, GRID_SIZE } from '@/constants/GridSettings'
import { LOCAL_STORAGE_KEY } from '@/constants/LocalStorageKey'
import { QUERY_PARAM_FILL_IN_GRID } from '@/constants/GridSettings'
import villagerData from '@/constants/villagers.json'

// Utilities
import randomElement from '@/utilities/randomElement'

/**
 * Initial State
 */
const initialState = {
  allVillagersData: [] as VillagerType[],
  villagerStats: [] as VillagerStatsType[],
  gridCategories: {} as CategoriesType
}

/**
 * Slice
 */
export const villagers = createSlice({
  name: 'villagers',
  initialState,
  reducers: {
    increaseVillagerStat: (state, villagerName: PayloadAction<string>) => {
      // Grab target villager based on their name
      const targetVillager = state.villagerStats.find(villager => villager.name.toLowerCase() === villagerName.payload.toLowerCase())
  
      // If the target villager exists...
      if (targetVillager) {
        // Increase villager use count
        targetVillager.count++
  
        // Stringify the object and set it to the local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(state.villagerStats))

        // Update villagerStats
        state.villagerStats = state.villagerStats.sort((a: VillagerStatsType, b: VillagerStatsType) => b.count - a.count)
      }
    }
  },
  extraReducers: (builder) => {
    // builder.addCase(setupVillagerStore.fulfilled, (state, villagersData: PayloadAction<VillagerType[]>) => {
    builder.addCase(setupVillagerStore.fulfilled, (_, newState: PayloadAction<any>) => {
      return newState.payload
    }),
    builder.addCase(fillInVillagerStats.fulfilled, (state, selectedAnswers: PayloadAction<SelectedAnwerType[]>) => {
      // If villager stats is already setup, no need to re-setup again
      if (state.villagerStats.length > 0) {
        return
      }

      // Grab the stringify json object in the local storage
      let villagerStatsRaw = localStorage.getItem(LOCAL_STORAGE_KEY)

      // If the object is not there...
      if (!villagerStatsRaw) {
        // Grab the entirety of the villagers and update it so that each object would contain a name and count property
        const parsedVillagerData: VillagerStatsType[] = state.allVillagersData.map(({ name }) => ({
          name,
          count: 0
        }))

        // Stringify the object and set it to the local storage
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedVillagerData))

        // Grab the stringfy json object
        villagerStatsRaw = JSON.stringify(parsedVillagerData)
      }

      // Parse the stringify json object
      const villagerStatsProcessed = JSON.parse(villagerStatsRaw as string)

      // Loop through each selectedAnswers...
      selectedAnswers.payload.forEach((answer) => {
        // Grab the target villager based on the name
        const villagerName = answer.villager.name
        const targetVillager = villagerStatsProcessed.find((villager: VillagerStatsType) => villager.name.toLowerCase() === villagerName.toLowerCase())

        // Increase the count of that targeted villager
        targetVillager.count += 1
      })

      // Update the object in the local storage
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(villagerStatsProcessed))

      return {
        ...state,
        // Set the villager object to 'villagerStats' to be displayed and sort it from highest to lowest count
        villagerStats: villagerStatsProcessed.sort((a: VillagerStatsType, b: VillagerStatsType) => b.count - a.count)
      }
    })
  }
})

export const setupVillagerStore = createAsyncThunk(
  'villagers/setupVillagerStore',
  async (_, { dispatch, getState }) => {
    let villagersData = villagerData

    await fetch('https://api.nookipedia.com/villagers', {
      headers: {
        'X-API-KEY': `${process.env.NEXT_PUBLIC_NOOKEIPEDIA_API_KEY}`
      }
    })
      .then(response => response.json())
      .then((data) => {
        villagersData = data
      })
      .catch(() => {
        villagersData = villagerData
      })

    // Valid and Invalid media
    const validMedia: string[] = []
    const invalidMedia: string[] = ['WA', 'DNM', 'E_PLUS', 'FILM']

    const villagerSpecies: CategoryType[] = []
    const villagerPersonalities: CategoryType[] = []

    villagersData.forEach(({ species, personality, appearances }) => {
      // Add species if the does not exists in villagerSpecies
      if (!villagerSpecies.some(category => category.value.toLowerCase() === species.toLowerCase())) {
        villagerSpecies.push({
          type: GRID_CATEGORIES.species,
          value: species.toLowerCase()
        })
      }

      // Add personality if the does not exists in villagerPersonalities
      if (!villagerPersonalities.some(category => category.value.toLowerCase() === personality.toLowerCase())) {
        villagerPersonalities.push({
          type: GRID_CATEGORIES.personality,
          value: personality.toLowerCase()
        })
      }

      // If a media does not already exist in validMedia and is not in invalidMedia, add to validMedia
      appearances.forEach((media) => {
        if (!validMedia.includes(media) && !invalidMedia.includes(media)) {
          validMedia.push(media)
        }
      })
    })

    const gridCategories = {
      species: villagerSpecies,
      personality: villagerPersonalities,
      gender: [
        {
          type: GRID_CATEGORIES.gender,
          value: 'male'
        },
        {
          type: GRID_CATEGORIES.gender,
          value: 'female'
        }
      ],
      game: validMedia.map(game => ({
        type: GRID_CATEGORIES.game,
        value: game.toLowerCase()
      }))
    }

    // Column can only have PERSONALITIES and GENDERS
    const columnPossibleCategories = gridCategories[GRID_CATEGORIES.personality]
    const lastColumnPossibleCategories = gridCategories[GRID_CATEGORIES.gender]
    // Row can only have SPECIES and (certain) GAMES
    const rowPossibleCategories = gridCategories[GRID_CATEGORIES.species]
    const lastRowPossibleCategories = gridCategories[GRID_CATEGORIES.game]
  
    // List of chosen category in row and col
    const chosenCategoryRow: CategoryType[] = []
    const chosenCategoryCol: CategoryType[] = []
  
    // Will hold the list of grid object
    const gridObjectList: GridObjectType[] = []
  
    // Pick a random category in 'categoriesToPickFrom' and that is not in 'alreadyChosenCategories'
    const pickARandomCategory = (categoriesToPickFrom: CategoryType[], alreadyChosenCategories: CategoryType[]): CategoryType => {
      return randomElement(categoriesToPickFrom.filter(current => !alreadyChosenCategories.some(existing => existing.value === current.value)))
    }
  
    // Will hold image url to preload
    const allSelectedVillagersImageUrls: string[] = []

    // Will hold the max player score during setup
    let totalPlayerScore = 0

    // Is grid filled in
    const isGridFilledIn = new URLSearchParams(window.location.search).get(QUERY_PARAM_FILL_IN_GRID) !== null
  
    // Loop through the rows based on 'GRID_SIZE'
    for (let row = 0; row < GRID_SIZE; row++) {
      // Pick a random row category
      const currentRowCategoryChoices = row === (GRID_SIZE - 1) ? lastRowPossibleCategories : rowPossibleCategories
      const rowCategory: CategoryType = pickARandomCategory(currentRowCategoryChoices, chosenCategoryRow)
  
      // Include chosen category to chosenCategoryRow to determine which one has been chosen so far
      chosenCategoryRow.push(rowCategory)
  
      // Loop through the colums based on 'GRID_SIZE'
      for (let col = 0; col < GRID_SIZE; col++) {
        const categoryObject = gridObjectList.find(obj => obj.col === col)
        let colCategory: CategoryType
  
        // If there is already a category object, use that to determine colCategory
        // Else, just yet pick one using similar logic for picking the row category
        if (categoryObject) {
          colCategory = categoryObject.category_col
        } else {
          const currentColCategoryChoices = col === (GRID_SIZE - 1) ? lastColumnPossibleCategories : columnPossibleCategories
          colCategory = pickARandomCategory(currentColCategoryChoices, chosenCategoryCol)
  
          chosenCategoryCol.push(colCategory as CategoryType)
        }
  
        // Figure out villagers that fit this category and randomize the array order
        // to prevent players from easily figuring out a villager name based on its position in the array
        const validVillagers = (villagersData as VillagerType[]).filter((villager) => {
          if (rowCategory.type === GRID_CATEGORIES.game) {
            return villager.appearances.includes(rowCategory.value.toUpperCase()) &&
              (villager[(colCategory.type as keyof VillagerType)] as string).toLowerCase() === colCategory.value.toLowerCase()
          } else {
            return (villager[(rowCategory.type as keyof VillagerType)] as string).toLowerCase() === rowCategory.value.toLowerCase() &&
            (villager[(colCategory.type as keyof VillagerType)] as string).toLowerCase() === colCategory.value.toLowerCase()
          }
        }).sort(() => 0.5 - Math.random())
        
        // Initial cell score
        const initialCellScore = validVillagers.length > 0 ? 3 : 0
  
        // Create the gridObject based on the information above
        const currentGridObject = {
          row,
          col,
          category_row: rowCategory,
          category_col: colCategory,
          villagers: validVillagers,
          isShowingHintImages: false,
          isShowingHintName: false,
          maxScore: initialCellScore,
          currentScore: initialCellScore,
          isComplete: validVillagers.length === 0 || isGridFilledIn
        }

        totalPlayerScore += initialCellScore
  
        // Save gridObject in a list to keep track what categories has been used
        gridObjectList.push(currentGridObject)
  
        if (validVillagers.length > 0) {
          validVillagers.forEach((villager) => {
            if (!allSelectedVillagersImageUrls.includes(villager.image_url)) {
              allSelectedVillagersImageUrls.push(villager.image_url)
            }
          })
        }
  
        // If the right queryParam is showing, fill in grid
        if (validVillagers.length > 0 && isGridFilledIn) {
          dispatch(addToSelectedAnswers({
            cellIndex: getGridCellIndex(row, col),
            villager: validVillagers[0]
          }))
        }
      }
    }

    // Update grid state
    dispatch(addToGridObject(gridObjectList))
    dispatch(markGridAsReady())
    dispatch(updatePlayerScore(totalPlayerScore))

    return {
      villagerStats: [],
      allVillagersData: villagersData,
      gridCategories
    }
  }
)

export const fillInVillagerStats = createAsyncThunk(
  'villagers/fillInVillagerStats',
  (_, { getState }) => {
    return (getState() as RootState).gridObjectReducer.selectedAnswers;
  }
)

export const { increaseVillagerStat } = villagers.actions
export default villagers.reducer