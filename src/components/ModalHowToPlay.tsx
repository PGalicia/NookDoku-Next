'use client'
/**
 * Imports
 */
// React
import Image from 'next/image'

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
      <div className="p-4 font-mono overflow-x-scroll">
        {/* TLDR */}
        <p className="text-lg mb-6"><span className="font-bold">TLDR:</span> Fill in all the boxes in the grid with the Villagers who match the personality, species, gender, and/or game appearance!</p>

        {/* Overview */}
        <h4 className="uppercase text-2xl font-bold mb-2">Overview.</h4>
        <p className="mb-4">Each box will have one row and one column category. Using the image below as an example, the column category would be Cranky and the row category would be Lion.</p>
        <p className="mb-4">The box also contains a marker on the top right (ie the 3 little circles) that shows how many chances you have left in filling out the box.</p>
        <p className="mb-4">What do the box colors mean?</p>
        <ul className="list-disc pl-8 mb-8">
          <li className="pb-2"><span className="font-bold">White</span>: There are multiple villagers that fits this category</li>
          <li className="pb-2"><span className="font-bold">Yellow</span>: There is ONE villager that fits this category</li>
          <li><span className="font-bold">Black</span>: There is NO villager that fits this category</li>
        </ul>

        <Image src="/howToPlay/cell.png" alt="cell" width={500} height={300} className="mx-auto mt-8 mb-12 border-2 border-primary rounded" />

        {/* Hints */}
        <h4 className="uppercase text-2xl font-bold mb-2">Hints.</h4>
        <p className="mb-4">For each box, you have 3 chances to get the right answer. You can guess three times or you can you can use some of those chances to get a hint.</p>
        <p className="mb-4">Available hints:</p>
        <ul className="list-disc pl-8 mb-8">
          <li className="pb-2"><span className="font-bold">Show possible villagers</span>: Will show an image of all the valid villagers that fits the category.</li>
          <li className="pb-2"><span className="font-bold">Show name hint</span>: Will show the first letter of the shown villager’s name. This hint will only be available once the Show possible villagers hint has been used.</li>
        </ul>

        <Image src="/howToPlay/hints.png" alt="cell" width={500} height={300} className="mx-auto mt-8 mb-12 border-2 border-primary rounded" />

        {/* Scoring */}
        <h4 className="uppercase text-2xl font-bold mb-2">Scoring.</h4>
        <p className="mb-4">White cells:</p>
        <ul className="list-disc pl-8 mb-4">
          <li className="pb-2"><span className="font-bold">+30</span> points when answered correctly on the <span className="font-bold">first</span> try</li>
          <li className="pb-2"><span className="font-bold">+20</span> points when answered correctly on the <span className="font-bold">second</span> try</li>
          <li className="pb-2"><span className="font-bold">+10</span> points when answered correctly on the <span className="font-bold">third</span> try</li>
        </ul>
        <p className="mb-4">Yellow Boxes [only one valid answer so the stakes are higher!]:</p>
        <ul className="list-disc pl-8 mb-8">
          <li className="pb-2"><span className="font-bold">+60</span> points when answered correctly on the <span className="font-bold">first</span> try</li>
          <li className="pb-2"><span className="font-bold">+40</span> points when answered correctly on the <span className="font-bold">second</span> try</li>
          <li className="pb-2"><span className="font-bold">+20</span> points when answered correctly on the <span className="font-bold">third</span> try</li>
        </ul>

      </div>
    </ModalDefault>
  )
}