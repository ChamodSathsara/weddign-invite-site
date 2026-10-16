import { useEffect, useState } from 'react';
import { getCountdown, type CountdownValue } from '../utils/countdown';

export function useCountdown(): CountdownValue {
  const [value, setValue] = useState(() => getCountdown(new Date()));
  useEffect(() => {
    const id = window.setInterval(() => setValue(getCountdown(new Date())), 1000);
    return () => window.clearInterval(id);
  }, []);
  return value;
}