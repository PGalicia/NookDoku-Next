'use client'
/**
 * Imports
 */
// Componets
import ModalDefault from '@/components/ModalDefault';

// Redux
import { useDispatch } from 'react-redux';
import { closeHowToPlayModal } from '@/redux/features/modalSlice';

// Types
import type { AppDispatch } from '@/redux/store';

export default function ModalHowToPlay () {
  const dispatch = useDispatch<AppDispatch>();

  function onCloseClick () {
    dispatch(closeHowToPlayModal());
  }

  return (
    <ModalDefault
      name="How to play"
      onCloseClick={() => onCloseClick()}
    >
      <div>Test</div>
    </ModalDefault>
  )
}