import React, {useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import MultiTrack, {useSliderData} from '../components/MultiTrackSlider';
const MultiTrackSlider = () => {
  const [open, setOpen] = useState(false);
  const {sliderValue, color, setSliderdata} = useSliderData();
  return (
    <View style={[styles.container]}>
      <MultiTrack
        // onKnobLongPress={() => alert('Knob Press')}
        initialData={{
          step: 0.0,
        }}
        key={1}
        draggable={true}
        setSliderdata={setSliderdata}
        showTip={true} //trainingDate <= new Date()} //training.rpe ? true : null}
        // onGestureEnd={() => alert('Gesture End')}
        tipComponent={(index, data) => {
          return (
            <View style={[styles.tipStyle]}>
              <Text numberOfLines={1} adjustsFontSizeToFit={true}>
                {/* {training.rpe?.rpeNumber} */}
                {sliderValue}
              </Text>
              <Text numberOfLines={1} adjustsFontSizeToFit={true}>
                {color}
              </Text>
              <Text numberOfLines={3} adjustsFontSizeToFit={true}>
                desc
              </Text>
            </View>
          );
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dddddd',
    paddingHorizontal: 20,
  },
  tipStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
});

export default MultiTrackSlider;
