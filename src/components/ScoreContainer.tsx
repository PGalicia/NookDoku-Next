/**
 * Imports
 */
// Utilities
import createArrayRange from '@/utilities/createArrayRange'

interface ScoreContainerProps {
  maxScore: number;
  currentScore: number;
  onlyOne?: boolean;
}

export default function ScoreContainer({ maxScore, currentScore, onlyOne = false }: ScoreContainerProps) {
  /**
   * Variables
   */
  // Will determine which border color to use based on onlyOne param
  const borderColor = onlyOne ? 'border-secondary' : 'border-white';

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
              className={`rounded-full h-3 w-3 border-2 ${extraScoreClassNames(scoreIndex, currentScore)} ${borderColor}`}
            />
          )
        })
      }
    </>
  )
}