'use client'

/**
 * Imports
 */
// React
import { useDispatch, useSelector } from 'react-redux'
import React, { useEffect } from 'react'

// Redux
import { AppDispatch, RootState } from '@/redux/store'
import { setupVillagerStore, increaseGamesFinishedStat } from '@/redux/features/villagersSlice'

// Components
import GameStats from '@/components/GameStats'
import ModalPickAVillager from '@/components/ModalPickAVillager'
import GameGrid from '@/components/GameGrid'
import ModalHowToPlay from '@/components/ModalHowToPlay'

export default function Home() {
  /**
   * Redux
   */
  const isGridSetup = useSelector((state: RootState) => state.gridObjectReducer.isGridSetup);
  const isGridFilledIn = useSelector((state: RootState) => state.gridObjectReducer.isGridFilledIn);
  const currentPlayerScore = useSelector((state: RootState) => state.gridObjectReducer.currentPlayerScore);
  const currentGameMaxScore = useSelector((state: RootState) => state.gridObjectReducer.currentGameMaxScore);
  const isPickAVillagerModalActive = useSelector((state: RootState) => state.modalReducer.isPickAVillagerModalActive);
  const isHowToPlayModalActive = useSelector((state: RootState) => state.modalReducer.isHowToPlayModalActive);
  const dispatch = useDispatch<AppDispatch>();

  /**
   * Hooks
   */
  useEffect(
    () => {
      dispatch(setupVillagerStore());
    },
    [dispatch]
  );

  // useEffect(
  //   () => {
  //     if (isGridSetup && isGridFilledIn) {
  //       console.log('test here', isGridFilledIn, isGridSetup);
  //       dispatch(increaseGamesFinishedStat());
  //     }
  //   },
  //   [isGridSetup]
  // );

  return (
    <main>
      {/* Game grid */}
      <div className="p-4">
        <GameGrid />
      </div>

      {!isGridSetup &&
        <div className="text-sm text-center mt-4 font-mono uppercase text-white">Setting up Game</div>
      }

      {isGridSetup &&
        <div className="flex flex-col gap-2 items-center mt-4 mb-8">
          {/* Current player score */}
          <div  className="font-mono text-white font-bold uppercase">
            <span className="text-sm">Current score:</span> {currentPlayerScore} / {currentGameMaxScore}
          </div>
        </div>
      }

      {/* Villager stats */}
      {isGridSetup && 
        <GameStats />
      }

      {/* Modals */}
      {isPickAVillagerModalActive && <ModalPickAVillager />}
      {isHowToPlayModalActive && <ModalHowToPlay />}
    </main>
  )
}
