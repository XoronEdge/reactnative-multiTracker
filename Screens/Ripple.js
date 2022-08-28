import React, {useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import RippleFullView from './components/RippleFullView';
const Ripple = () => {
  const [open, setOpen] = useState(false);
  return (
    <View style={[styles.container]}>
      {open ? null : (
        <View style={styles.btnContainer}>
          <Pressable onPress={() => setOpen(true)}>
            <Text>Open It</Text>
          </Pressable>
        </View>
      )}
      <RippleFullView setOpen={setOpen} open={open}>
        <Pressable onPress={() => setOpen(false)}>
          <Text>Close It</Text>
        </Pressable>
      </RippleFullView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  btnContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ripple: {
    width: 200.0,
    height: 200.0,
    backgroundColor: 'white',
    shadowOpacity: 0.3,
    shadowOffset: {width: 0, height: 0},
    shadowRadius: 10,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Ripple;
