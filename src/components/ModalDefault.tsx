/**
 * Imports
 */
// Styles
import styles from '@/styles/componentModal.module.scss';

interface ModalDefaultProps {
  children: React.ReactNode;
  name: string;
  onCloseClick: () => void;
}

export default function ModalDefault ({ name, children, onCloseClick }: ModalDefaultProps) {
  return (
    <div
      className="fixed top-0 bottom-0 left-0 right-0 bg-black/30 flex justify-center p-0 sm:p-8"
      onClick={() => onCloseClick()}
    >
      <div
        className={`${styles['c-modal__container']} min-w-auto md:min-w-[500px] flex flex-col relative h-full overflow-hidden bg-white text-black w-full sm:w-auto border-primary border-4`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="bg-secondary border-b-4 border-solid border-primary py-2 px-4 flex justify-between">
          {/* Modal title */}
          <div className="font-mono uppercase font-bold text-base">
            {name}
          </div>

          {/* Close button */}
          <div
            className="w-8 cursor-pointer hover:text-white text-right"
            onClick={() => onCloseClick()}
          >
            x
          </div>
        </div>

        {children}
      </div>
    </div>
  )
}