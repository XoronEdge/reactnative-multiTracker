import {useState} from 'react';

const useSliderData = () => {
  const [sliderValue, setSliderValue] = useState(0);
  const [color, setColor] = useState('');

  const setSliderdata = data => {
    switch (data.type) {
      case 'color':
        setColor(data.value);
        break;
      default:
        setSliderValue(data.value);
        break;
    }
  };
  return {sliderValue, color, setSliderdata};
};

export default useSliderData;
