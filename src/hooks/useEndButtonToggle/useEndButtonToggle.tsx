import { useState, useCallback } from 'react';
import useVideoContext from '../useVideoContext/useVideoContext';

export default function useEndButtonToggle() {
  const { room } = useVideoContext();
  const [isEnded, setState] = useState<boolean>(false);

  const toggleEnded = useCallback(() => {
    room.disconnect();
    setState(true);
  }, [room]);

  return [isEnded, toggleEnded] as const;
}
