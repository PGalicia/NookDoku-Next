import type { CellIndexMappingType } from '@/types/CellIndexMappingType'
import { GRID_SIZE } from '@/constants/GridSettings'

const CELL_INDEX_MAPPING: CellIndexMappingType = {}

// Build the cell mapping object based on the given grid size
let sizeTracker = 0

for (let row = 0; row < GRID_SIZE; row++) {
  for (let col = 0; col < GRID_SIZE; col++) {
    CELL_INDEX_MAPPING[sizeTracker] = { row, col }
    sizeTracker++
  }
}

export default CELL_INDEX_MAPPING
