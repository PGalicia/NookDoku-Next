/**
 * Imports
 */
// Utilities
import createArrayRange from '@/utilities/createArrayRange'

export default function ScoreContainer({ maxScore, currentScore }: { maxScore: number, currentScore: number }) {
  /**
   * Methods
   */
  function extraScoreClassNames (index: number, cellScore: number) {
    if (index >= cellScore) {
      return 'bg-red-500'
    } else {
      return 'bg-green-500'
    }
  }

  return (
    <>
      {createArrayRange(maxScore).map((scoreIndex) => {
          return (
            <div
              key={`Score: ${scoreIndex}`}
              className={`rounded-full h-2 w-2 ${extraScoreClassNames(scoreIndex, currentScore)}`}
            />
          )
        })
      }
    </>
  )
}