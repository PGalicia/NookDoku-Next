import type { CategoryType } from '@/types/CategoryType'
import type { VillagerType } from '@/types/VillagerType'

export type GridObjectType = {
  row: number,
  col: number,
  category_row: CategoryType,
  category_col: CategoryType,
  villagers: VillagerType[],
  isShowingHintImages: boolean,
  isShowingHintName: boolean,
  maxScore: number,
  currentScore: number,
  isComplete: boolean
}
