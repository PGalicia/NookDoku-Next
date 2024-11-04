/**
 * Props typing
 */
interface ButtonDefaultProps {
  buttonText: string;
  onClick: () => void;
  isSecondary?: boolean;
  isDisabled?: boolean;
}

export default function ButtonDefault ({ buttonText, onClick, isSecondary = false, isDisabled = false }: ButtonDefaultProps) {
  // Adjust button classes based on if secondary or disabled
  const backgroundColor = isSecondary ? 'bg-white' : 'bg-primary';
  const borderClasses = 'border-2 border-primary';
  const textColor = isSecondary ? 'text-primary' : 'text-white';
  const hoverColor = isSecondary
    ? 'hover:bg-primary hover:text-white'
    : 'hover:bg-white hover:text-primary';
  const defaultClasses = 'text-center p-2 rounded font-bold transition-colors';

  const buttonClasses = isDisabled
    ? `bg-gray-300 text-gray-500 border-2 border-gray-300 cursor-not-allowed ${defaultClasses}`
    : `${backgroundColor} ${borderClasses} ${textColor} ${defaultClasses} ${hoverColor}`;

  return (
    <button
      className={buttonClasses}
      disabled={isDisabled}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}
