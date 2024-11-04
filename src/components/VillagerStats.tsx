/**
 * Imports
 */
// Redux
import { AppDispatch, RootState } from '@/redux/store'
import { fillInVillagerStats } from '@/redux/features/villagersSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect } from 'react'

// Components
import Image from 'next/image'

export default function VillagerStats() {
  const villagerStats = useSelector((state: RootState) => state.villagersReducer.villagerStats)
  const allVillagersData = useSelector((state: RootState) => state.villagersReducer.allVillagersData)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Hooks
   */
  useEffect(
    () => {
      dispatch(fillInVillagerStats())
    },
    [dispatch]
  );

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
    <div className="c-villagerStats">
      {
        villagerStats && villagerStats.map((villager, index) => (
          <div
            key={index}
            className="grid grid-cols-[min-content_minmax(0,_1fr)] gap-2 bg-gray-300 m-2 p-2 rounded"
          >
            <div className="h-32 w-32 bg-blue-300 p-4 rounded flex justify-center row-span-2">
              {
                grabVillagerImage(villager.name) &&
                <Image
                  src={grabVillagerImage(villager.name)}
                  alt={villager.name}
                  className="h-full w-auto"
                  loading="lazy"
                  width={130}
                  height={130}
                />
              }
            </div>
            <div>Name: {villager.name}</div>
            <div>Count: {villager.count}</div>
          </div>
        ))
      }
    </div>
  );
}