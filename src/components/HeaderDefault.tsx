'use client'
/**
 * Imports
 */
// Redux
import { openHowToPlayModal } from '@/redux/features/modalSlice';

// Components
import LinkDefault from '@/components/LinkDefault';
import { useDispatch } from 'react-redux';

// Types
import type { AppDispatch } from '@/redux/store';

export default function HeaderDefault () {
  const dispatch = useDispatch<AppDispatch>();

  return (
    <div className="flex flex-col text-white py-6 gap-2">
      {/* Title */}
      <h1 className="text-4xl font-mono text-center uppercase font-bold px-4">NookDoku</h1>

      <div className="flex justify-center gap-8">
        {/* How to play button */}
        <button
          className="font-mono uppercase text-sm underline-offset-4 hover:underline hover:text-secondary"
          onClick={() => dispatch(openHowToPlayModal())}
        >
          How to play
        </button>

        {/* Donate button */}
        <LinkDefault
          url="https://buymeacoffee.com/patrickgalicia"
          text="Donate ❤️"
          isExternal={true}
        />
      </div>
    </div>
  );
}
