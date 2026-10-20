import { useEffect, useRef, useState } from 'react';

const RESET_MS = 2500;

export type CopyStatus = 'idle' | 'copied' | 'failed';

export function useCopyToClipboard() {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const timer = useRef<number>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const copy = async (text: string) => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(text);
      setStatus('copied');
    } catch {
      setStatus('failed');
    }
    timer.current = window.setTimeout(() => setStatus('idle'), RESET_MS);
  };

  return { status, copy };
}
