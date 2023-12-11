/**
 * Capitalize the given string
 */
export const capitalizeLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export default capitalizeLetter
