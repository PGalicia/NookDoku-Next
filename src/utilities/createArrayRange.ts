// Create an array range with the option to start at index of 1
export default function createArrayRange (arrayLength: number, startAtOne: boolean = false) {
  return Array.from({ length: arrayLength }, (_, index) => (startAtOne ? index + 1 : index))
}