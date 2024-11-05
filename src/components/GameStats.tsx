/**
 * Imports
 */
// Redux
import { RootState } from '@/redux/store'
import { useSelector } from 'react-redux'

// Components
import Image from 'next/image'

// Styles
import styles from '@/styles/componentGameStats.module.scss'

interface CountProps {
  count: number;
  maxChar: number;
}

function Counter ({ count = 0, maxChar }: CountProps) {
  let isAPlaceholder = true;

  // Format the count to adhere to the design
  // For example, if count is 12 we want to covert it to an array of string and prepend it with the designated amount of zeroes
  // (ie ['0','0','0','0','0','0','1', '2'])
  function reformatStatsCount (count: number): string[] {
    const countString = count.toString();
    const countCharLength = countString.length;
    const howManyZeroesWeNeed = maxChar - countCharLength;

    const finalArr = new Array(howManyZeroesWeNeed).fill('0');
    finalArr.push(...countString.split(''));

    return finalArr;
  }
  

  return reformatStatsCount(count).map((num, index) => {
    if (num !== '0') {
      isAPlaceholder = false;
    }

    return (
      <span
        key={index}
        className={`${isAPlaceholder ? 'font-normal text-white/50' : 'font-bold text-white'}`}
      >{num}</span>
    )
  })
}

export default function GameStats () {
  const gameStats = useSelector((state: RootState) => state.villagersReducer.gameStats)
  const allVillagersData = useSelector((state: RootState) => state.villagersReducer.allVillagersData);

  /**
   * Methods
   */
  // Grab the villager image based on the given villager name
  function grabVillagerImage (name: string) {
    return allVillagersData
      .find(villager => villager.name.toLowerCase() === name.toLowerCase())
      ?.image_url || ''
  }

  return (
    <div className={`${styles['c-gameStats']} mx-auto rounded font-mono p-4`}>
      {/* Stats */}
      <div className="uppercase font-bold text-center text-white mb-4 text-3xl">Statistics</div>

      <div className={`${styles['c-gameStats__main']} grid gap-8 uppercase justify-center mb-8`}>
        {/* Played */}
        <div className="text-center text-white w-full">
          <div className="font-bold text-5xl">
            <Counter count={gameStats.gamesPlayed} maxChar={3} />
          </div>
          <div>Played</div>
        </div>

        {/* Top score */}
        <div className="text-center text-white w-full">
          <div className="font-bold text-5xl">
            <Counter count={gameStats.highScore} maxChar={3} />
          </div>
          <div>Top score</div>
        </div>

        {/* Number of games finished */}
        <div className="text-center text-white w-full">
          <div className="font-bold text-5xl">
            <Counter count={gameStats.gamesFinished} maxChar={3} />
          </div>
          <div>Games finished</div>
        </div>

        {/* Number of resets */}
        <div className="text-center text-white w-full">
          <div className="font-bold text-5xl">
            <Counter count={gameStats.resetsUsed} maxChar={3} />
          </div>
          <div>Resets used</div>
        </div>
      </div>

      {/* Most used villagers */}
      <div className="uppercase font-bold text-white mb-2">Most used villagers</div>

      <div className={`${styles['c-gameStats__used']} grid gap-4 justify-between`}>
        {
          gameStats?.villagers && gameStats.villagers.slice(0, 10).map((villager, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1 w-[96px]`}
            >
              {/* Image */}
              <div className="w-100 aspect-[3/4] overflow-hidden border-white border-2 rounded">
                {
                  grabVillagerImage(villager.name) &&
                  <Image
                    src={grabVillagerImage(villager.name)}
                    alt={villager.name}
                    // className="h-full w-auto"
                    className="h-full object-contain p-2"
                    loading="lazy"
                    width={130}
                    height={130}
                  />
                }
              </div>

            {/* Stats */}
              <div className="uppercase font-bold flex justify-between">
                <Counter count={villager.count} maxChar={8} />
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}