import React from 'react';
import {StyleSheet, View} from 'react-native';
import {TapGestureHandler} from 'react-native-gesture-handler';
import Animated, {
  measure,
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedRef,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {circle} from 'react-native/Libraries/Animated/Easing';

const Ripple = ({parentStyle, onTap, children}) => {
  const centerX = useSharedValue(0);
  const centerY = useSharedValue(0);
  const width = useSharedValue(0);
  const height = useSharedValue(0);
  const rippleOpacity = useSharedValue(1);
  const scale = useSharedValue(0);
  const aRef = useAnimatedRef();
  const eventHandler = useAnimatedGestureHandler({
    onStart: (event, ctx) => {
      const layoutInfo = measure(aRef);

      width.value = layoutInfo.width;
      height.value = layoutInfo.height;
      centerX.value = event.x;
      centerY.value = event.y;
      rippleOpacity.value = 1;
      scale.value = 0;
      scale.value = withTiming(1, {duration: 3000});
    },
    onActive: () => {
      if (onTap) runOnJS(onTap)();
      // console.log('Go To Hell');
      //it error on onTap func call becuSE ON ACTIVE IS WORKLET CANT CALL NORMAL JAVASCRIPT FUNC CALL
      // runOnJS(onTap());
    },
    // onEnd: (event, ctx) => {
    //   rippleOpacity.value = withTiming(0, {duration: 1000});
    //   // scale.value = withTiming(0, {duration: 2000});
    // },
    //if ny error occur on finsih always call but on end not call
    onFinish: (event, ctx) => {
      rippleOpacity.value = withTiming(0, {duration: 1000});
      // scale.value = withTiming(0, {duration: 2000});
    },
  });

  const rStyle = useAnimatedStyle(() => {
    //measure is also worklet

    console.log('------');
    console.log(width.value);
    console.log(width.value ** 2);
    console.log(width.value * 2);

    const cricleRadius = Math.sqrt(width.value ** 2 + height.value ** 2);
    const translateX = centerX.value - cricleRadius;
    const translateY = centerY.value - cricleRadius;
    console.log('[][][][][][][][]][]');
    console.log(cricleRadius);
    return {
      width: cricleRadius * 2,
      height: cricleRadius * 2,
      borderRadius: cricleRadius,
      backgroundColor: 'red',
      position: 'absolute',
      opacity: rippleOpacity.value,
      top: 0,
      left: 0,
      //Here Order Matter
      transform: [{translateX}, {translateY}, {scale: scale.value}],
    };
  });
  return (
    <View ref={aRef} style={parentStyle}>
      <TapGestureHandler onGestureEvent={eventHandler}>
        <Animated.View style={[parentStyle, {overflow: 'hidden'}]}>
          <View>{children}</View>
          <Animated.View style={rStyle} />
        </Animated.View>
      </TapGestureHandler>
    </View>
  );
};

const styles = StyleSheet.create({});

export default Ripple;
