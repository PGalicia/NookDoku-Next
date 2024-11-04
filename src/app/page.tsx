'use client'

/**
 * Imports
 */
// React
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect, useState } from 'react'

// Redux
import { isGameComplete, markGridAsReady } from '@/redux/features/gridObjectSlice'
import { AppDispatch, RootState } from '@/redux/store'
import { setupVillagerStore } from '@/redux/features/villagersSlice'

// Components
import VillagerStats from '@/components/VillagerStats'
import ModalDefault from '@/components/ModalDefault'
import GameGrid from '@/components/GameGrid'
import ButtonDefault from '@/components/ButtonDefault'

// Styles
import styles from '@/styles/pageIndex.module.scss'

export default function Home() {
  /**
   * Redux
   */
  const gridObject = useSelector((state: RootState) => state.gridObjectReducer.gridObject)
  const isGridSetup = useSelector((state: RootState) => state.gridObjectReducer.isGridSetup)
  const currentPlayerScore = useSelector((state: RootState) => state.gridObjectReducer.currentPlayerScore)
  const currentGameMaxScore = useSelector((state: RootState) => state.gridObjectReducer.currentGameMaxScore)
  const isModalActive = useSelector((state: RootState) => state.modalReducer.isModalActive)
  const dispatch = useDispatch<AppDispatch>()

  /**
   * Constants
   */
  const gridScrollClass = styles['p-index__container']
  const gridScrollRightToggleClass = styles['p-index__container--right--toggle']
  const gridScrollLeftToggleClass = styles['p-index__container--left--toggle']

  /**
   * States
   */
  const [showVillagerStatsModule, setShowVillagerStatsModule] = useState<boolean>(false)
  const [gridContainerClasses, setGridContainerClasses] = useState<string[]>([gridScrollClass])

  /**
   * Hooks
   */
  useEffect(
    () => {
      dispatch(setupVillagerStore());
    },
    [dispatch]
  );

  /**
   * Methods
   */
  function handleGamGridScroll(event: React.UIEvent<HTMLDivElement, UIEvent>) {
    const { scrollWidth, scrollLeft, clientWidth } = event.currentTarget

    if ((scrollWidth - scrollLeft) === clientWidth) {
      setGridContainerClasses([...gridContainerClasses, gridScrollRightToggleClass])
    } else if (scrollLeft === 0) {
      setGridContainerClasses([gridScrollClass])
    } else {
      setGridContainerClasses([gridScrollClass, gridScrollLeftToggleClass])
    }
  }

  return (
    <main className={styles['p-index']}>
      {/* Game grid */}
      <div className={`${gridContainerClasses.join(' ')}`}>
        <div
          className="p-4 overflow-y-hidden overflow-x-scroll"
          onScroll={handleGamGridScroll}
        >
          <GameGrid />
        </div>
      </div>

      {!isGridSetup &&
        <div className="text-center italic mt-4">Setting up Game</div>
      }

      {isGridSetup &&
        <div className="flex flex-col gap-2 items-center">
          {/* Current player score */}
          <div  className="font-mono text-white font-bold uppercase">
            <span className="text-sm">Current score:</span> {currentPlayerScore} / {currentGameMaxScore}
          </div>

          {/* Stats button toggle */}
          <ButtonDefault
            buttonText="Toggle villager stats"
            onClick={() => setShowVillagerStatsModule(!showVillagerStatsModule)}
            isSecondary={true}
          />
        </div>
      }

      {/* Villager stats */}
      {/* {isGridSetup && (isGameComplete(gridObject) || showVillagerStatsModule) && 
        <VillagerStats />
      } */}
      <VillagerStats />

      {/* Modal */}
      {isModalActive && <ModalDefault />}
    </main>
  )
}
