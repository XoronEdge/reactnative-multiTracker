import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {
  PanGestureHandler,
  TouchableNativeFeedback,
} from 'react-native-gesture-handler';
import Animated, {
  runOnJS,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
} from 'react-native-reanimated';

const getRang = parts =>
  parts.reduce((acc, item, index) => {
    if (index === 0) {
      acc.push(item);
      return acc;
    }
    acc.push(acc[index - 1] + item);
    return acc;
  }, []);

const ACTUAL_KNOB_WIDTH = 40;
const VIEW_KNOB_WIDTH = ACTUAL_KNOB_WIDTH - 14;
const MAX_RANGE = 10;

const MultiTrackSlider = ({
  initialData = {step: 0},
  setSliderdata,
  draggable = true,
  showTip = false,
  tipText = '',
  tipComponent = null,
  onGestureEnd,
  onKnobLongPress,
  percentList = [
    {value: 10, color: 'red'},
    {value: 25, color: 'orange'},
    {value: 35, color: 'blue'},
    {value: 15, color: 'brown'},
    {value: 10, color: 'purple'},
    {value: 5, color: 'yellow'},
  ],
}) => {
  const [color, setColor] = useState({color: percentList[0].color, level: 0});
  const [sliderData, setSliderData] = useState(initialData.step);
  const [isSliderTip, setIsSliderTip] = useState(false);
  const [slideWidth, setSlideWidth] = useState(0);
  const [parts, setParts] = useState([]);
  const [ranger, setRanger] = useState([]);
  const indexTrackerRef = useRef(0);
  const sliderRange = slideWidth - ACTUAL_KNOB_WIDTH + 15;
  const oneStepValue = sliderRange / MAX_RANGE;
  const translateX = useSharedValue(initialData.step * oneStepValue);
  const isSliding = useSharedValue(false);
  const stepText = useDerivedValue(() => {
    const step = Math.ceil(translateX.value / (oneStepValue + 3));
    return String(step);
  });

  const scrollTranslationStyle = useAnimatedStyle(() => {
    return {transform: [{translateX: translateX.value}]};
  });
  const scrollTranslationStyle2 = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX:
            translateX.value < 50
              ? translateX.value
              : translateX.value > slideWidth - 60
              ? translateX.value - 96
              : translateX.value - 50,
        },
      ],
    };
  });

  const matcher = value => {
    const index = ranger.findIndex(range => {
      return value + VIEW_KNOB_WIDTH / 1.2 < range;
    });
    if (indexTrackerRef.current !== index) {
      indexTrackerRef.current = index;
      setColor({color: percentList[index < 0 ? 0 : index].color, level: index});
    }
  };
  useDerivedValue(() => {
    runOnJS(matcher)(translateX.value);
  });
  useDerivedValue(() => {
    runOnJS(setSliderData)(stepText.value);
  });
  const onDraggedSuccess = () => {
    console.log('dragged');
  };
  const toggleTip = value => {
    setIsSliderTip(value);
  };
  const onGestureEvent = useAnimatedGestureHandler({
    onStart: (_, ctx) => {
      ctx.offsetX = translateX.value;
      runOnJS(toggleTip)(true);
    },
    onActive: (event, ctx) => {
      const clamp = (value, lowerBound, upperBound) => {
        return Math.min(Math.max(lowerBound, value), upperBound);
      };
      isSliding.value = true;
      const data = clamp(
        event.translationX + ctx.offsetX,
        0,
        slideWidth - ACTUAL_KNOB_WIDTH + 15,
      );
      translateX.value = data;
    },
    onEnd: () => {
      isSliding.value = false;
      runOnJS(toggleTip)(false);
      if (translateX.value > slideWidth - ACTUAL_KNOB_WIDTH) {
        runOnJS(onDraggedSuccess)();
      }
      if (onGestureEnd) {
        runOnJS(onGestureEnd)();
      }
    },
  });

  useEffect(() => {
    setSliderdata({type: 'value', value: sliderData});
  }, [sliderData, setSliderdata]);

  useEffect(() => {
    setSliderdata({type: 'color', value: color.color});
  }, [color.color, setSliderdata]);

  const handleKnobClick = () => {
    if (onKnobLongPress) {
      onKnobLongPress(true);
    }
  };
  const sliderTipStyle = {
    backgroundColor: isSliderTip ? '#ffff' : 'transparent',
  };
  const onLayout = ({nativeEvent}) => {
    const width = nativeEvent.layout.width;
    const pt = percentList.map(pl => {
      return (pl.value * width) / 100;
    });
    translateX.value =
      initialData.step * ((width - ACTUAL_KNOB_WIDTH + 15) / MAX_RANGE);
    stepText.value = String(Math.ceil(translateX.value / (oneStepValue + 3)));
    setSlideWidth(width);
    setParts(pt);
    setRanger(getRang(pt));
  };

  return (
    <View style={styles.container} onLayout={onLayout}>
      <View style={[styles.slider]}>
        <View style={styles.progress}>
          {parts.map((part, index) => {
            const colorStyle = {backgroundColor: percentList[index].color};
            return (
              <Animated.View key={index} style={[colorStyle, {width: part}]} />
            );
          })}
        </View>
        <Animated.View
          style={[
            styles.tipContainer,
            scrollTranslationStyle2,
            sliderTipStyle,
          ]}>
          {showTip && isSliderTip && (tipText || tipComponent) ? (
            tipComponent ? (
              tipComponent(setIsSliderTip, color)
            ) : (
              <Text>{tipText}</Text>
            )
          ) : null}
        </Animated.View>

        <PanGestureHandler enabled={draggable} onGestureEvent={onGestureEvent}>
          <Animated.View style={[styles.outerKnob, scrollTranslationStyle]}>
            <TouchableNativeFeedback
              disabled={!showTip}
              onLongPress={handleKnobClick}
              onPress={() => setIsSliderTip(!isSliderTip)}>
              <View style={[styles.knob]} />
            </TouchableNativeFeedback>
          </Animated.View>
        </PanGestureHandler>
      </View>
    </View>
  );
};

export default MultiTrackSlider;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 12,
  },
  slider: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  progress: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    height: 10,
  },
  progress1: {
    backgroundColor: '#B5008D',
  },
  progress2: {
    backgroundColor: '#7646FF',
  },
  progress3: {
    backgroundColor: 'green',
  },
  progress4: {
    backgroundColor: 'yellow',
  },
  progress5: {
    backgroundColor: 'orange',
  },
  progress6: {
    backgroundColor: 'red',
  },
  knob: {
    height: VIEW_KNOB_WIDTH,
    width: VIEW_KNOB_WIDTH,
    borderRadius: ACTUAL_KNOB_WIDTH / 2,
    backgroundColor: '#ffff',
  },
  outerKnob: {
    height: ACTUAL_KNOB_WIDTH,
    width: ACTUAL_KNOB_WIDTH,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: 'transparent',
  },
  tipContainer: {
    position: 'absolute',
    top: -100,
    height: 90,
    width: 120,
    borderRadius: ACTUAL_KNOB_WIDTH / 2,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 1,
  },
});
