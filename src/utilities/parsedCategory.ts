/**
 * Imports
 */
// Constants
import { CATEGORY_MAPPING } from '@/constants/CategoryMapping'

// Utilities
import capitalizeLetter from '@/utilities/capitalizeLetter'

export const parsedCategory = (category: string): string => {
  // If it exist in CATEGORY_MAPPING, then use that
  // This to make sure I do not show the acronym (eg 'Animal Crossing' instead of 'ac')
  // For everything else, return category as capitalizing it
  return category && CATEGORY_MAPPING[category]
    ? CATEGORY_MAPPING[category]
    : capitalizeLetter(category)
}

export default parsedCategory