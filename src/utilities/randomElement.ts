/**
 * Pick a random element in an array
 */
export const randomElement = (array: any[]): any => {
  const randomIndex = Math.floor(Math.random() * array.length)
  return array[randomIndex]
}

export default randomElement