import React from 'react';
import {StyleSheet, View} from 'react-native';
import MultiTrackSlider from './Screens/MultiTrackSlider';
const App = () => {
  return (
    <View style={[styles.container]}>
      <MultiTrackSlider />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
