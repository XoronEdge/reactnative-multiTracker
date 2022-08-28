import {useEffect, useRef, useState} from 'react';

const useTicker = () => {
  const [ticker, setTicker] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setTicker(s => {
        if (s === 2) {
          return 1;
        }
        return s + 1;
      });
    }, 1500);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return ticker;
};

export default useTicker;
