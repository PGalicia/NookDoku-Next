/**
 * Imports
 */
import Link from 'next/link';

interface LinkDefaulProps {
  url: string;
  text: string;
  isExternal?: boolean;
}

export default function LinkDefault ({ url, text, isExternal = false }: LinkDefaulProps) {
  const defaultClassNames = [
    'font-mono',
    'uppercase',
    'text-sm',
    'underline-offset-4',
    'hover:underline',
    'hover:text-secondary',
  ].join(' ');

  if (isExternal) {
    return <a className={defaultClassNames} href={url} target="_blank">{text}</a>
  } else {
    return <Link className={defaultClassNames} href={url}>{text}</Link>
  }
}