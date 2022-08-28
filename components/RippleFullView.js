import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const Ripple = ({children, open, setOpen}) => {
  const [count, setCount] = useState(false);
  const radius = useSharedValue(100);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const finalWidth = useSharedValue(0);
  const finalHeight = useSharedValue(0);
  const finalRadius = useSharedValue(0);

  useEffect(() => {
    if (open) {
      finalWidth.value = 100;
      finalHeight.value = 100;
      finalRadius.value = 0;
      width.value = 0;
      height.value = 0;
      radius.value = 350;
    } else {
      finalWidth.value = 0;
      finalHeight.value = 0;
      finalRadius.value = 350;
      radius.value = 100;
    }
  });

  const rStyle = useAnimatedStyle(() => {
    width.value = withTiming(finalWidth.value, {
      duration: open ? 300 : 2500,
    });
    height.value = withTiming(finalHeight.value, {duration: open ? 800 : 600});
    radius.value = withTiming(
      finalRadius.value,
      {duration: open ? 1300 : 900},
      // runOnJS(closeSelf),
    );

    return {
      width: width.value + '%',
      height: height.value + '%',
      borderTopStartRadius: radius.value,
      backgroundColor: 'orange',
      position: 'absolute',
      opacity: 1,
      justifyContent: 'center',
      alignItems: 'center',
      bottom: 0,
      right: 0,
    };
  });
  return (
    <Animated.View style={[rStyle]}>
      {open ? <View>{children}</View> : null}
    </Animated.View>
  );
};

export default Ripple;
