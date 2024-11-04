/**
 * Imports
 */
// Redux
import { AppDispatch, RootState } from '@/redux/store'
import { useDispatch, useSelector } from 'react-redux'

// Components
import Image from 'next/image'

export default function VillagerStats() {
  const villagerStats = useSelector((state: RootState) => state.villagersReducer.villagerStats).slice(0, 3);
  const allVillagersData = useSelector((state: RootState) => state.villagersReducer.allVillagersData);

  function sizeClassBasedOnRank (rank: number): string {
    if (rank === 1) {
      return 'scale-125';
    } else if (rank === 2) {
      return 'scale-110';
    } else {
      return '';
    }
  }

  /**
   * Methods
   */
  // Grab the villager image based on the given villager name
  function grabVillagerImage (name: string) {
    return allVillagersData
      .find(villager => villager.name.toLowerCase() === name.toLowerCase())
      ?.image_url || ''
  }

  function reformatCount (count: number): string[] {
    const maxChar = 8;
    const countCharLength = count.toString().length;
    const howManyZeroesWeNeed = maxChar - countCharLength;

    const finalArr = new Array(howManyZeroesWeNeed).fill('0');
    finalArr.push(count.toString());

    return finalArr;
  }

  return (
    <div className="mx-auto rounded font-mono p-4 w-fit">
      <div className="uppercase font-bold text-white mb-2">Most used villagers</div>
      <div className="flex gap-2 justify-between">
        {
          villagerStats && villagerStats.map((villager, index) => (
            <div
              key={index}
              className={`flex flex-col gap-1 w-[96px]`}
            >
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

              <div className="uppercase font-bold flex justify-between">
                {
                  reformatCount(villager.count).map((num, index) => (
                    <span className={`${num === '0' ? 'font-normal text-white/50' : 'font-bold text-white'}`}>{num}</span>
                  ))
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
}