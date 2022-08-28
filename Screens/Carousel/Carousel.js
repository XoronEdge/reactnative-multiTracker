import React, {useEffect, useRef, useState} from 'react';
import {View, Text, StyleSheet, Dimensions, Image} from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import useTicker from './useTicker';

const screenWidth = Dimensions.get('screen').width;
const screenHeight = Dimensions.get('screen').height;

const cards = [
  {title: 'AAA', color: 'red', imageSrc: require('../../assets/caro1.png')},
  {title: 'BBB', color: 'orange', imageSrc: require('../../assets/caro1.png')},
  {title: 'CCC', color: 'purple', imageSrc: require('../../assets/caro1.png')},
  {
    title: 'DDD',
    color: 'sandybrown',
    imageSrc: require('../../assets/caro1.png'),
  },
  {title: 'EEE', color: 'black', imageSrc: require('../../assets/caro1.png')},
  {title: 'FFF', color: 'yellow', imageSrc: require('../../assets/caro1.png')},
];

const transitionDuration = 800;
const opacityDuration = 1000;

const Carousel = () => {
  const tick = useTicker();
  const [currentCard, setCurrentCard] = useState(cards[0]);
  const [nextCard, setNextCard] = useState(cards[1]);
  const currentIndex = useRef(2);
  const redOpacity = useSharedValue(1);
  const redTransX = useSharedValue(0);
  const redActualOpacity = useSharedValue(1);
  const redActualTransX = useSharedValue(0);
  const orangeOpacity = useSharedValue(1);
  const orangeTransX = useSharedValue(0);
  const orangeActualOpacity = useSharedValue(1);
  const orangeActualTransX = useSharedValue(0);

  const toggleCard = cardType => {
    if (cardType === 'next') {
      setNextCard(cards[currentIndex.current]);
    } else {
      setCurrentCard(cards[currentIndex.current]);
    }
    if (currentIndex.current === cards.length - 1) {
      currentIndex.current = 0;
    } else {
      currentIndex.current = currentIndex.current + 1;
    }
  };

  const redStyle = useAnimatedStyle(() => {
    redActualOpacity.value = withTiming(redOpacity.value, {
      duration: opacityDuration,
    });
    redActualTransX.value = withTiming(
      redTransX.value,
      {duration: tick === 2 ? transitionDuration : 0},
      finsihed => {
        if (finsihed && orangeOpacity.value === 0 && tick === 2) {
          orangeTransX.value = 0;
          orangeOpacity.value = 1;
          runOnJS(toggleCard)('next');
        }
      },
    );

    return {
      opacity: redActualOpacity.value,
      transform: [{translateX: redActualTransX.value}],
      zIndex: tick === 2 ? 2 : 1,
    };
  });

  // return {transform: [{translateX}, {translateY}, {scale: scale.value}]};
  const orangeStyle = useAnimatedStyle(() => {
    orangeActualOpacity.value = withTiming(orangeOpacity.value, {
      duration: opacityDuration,
    });
    orangeActualTransX.value = withTiming(
      orangeTransX.value,
      {duration: tick === 1 ? transitionDuration : 0},
      finsihed => {
        if (finsihed && redOpacity.value === 0 && tick === 1) {
          redTransX.value = screenWidth;
          redOpacity.value = 1;
          runOnJS(toggleCard)('current');
        }
      },
    );

    return {
      opacity: orangeActualOpacity.value,
      transform: [{translateX: orangeActualTransX.value}],
      zIndex: tick === 1 ? 2 : 1,
    };
  });

  useEffect(() => {
    if (tick === 1) {
      orangeActualTransX.value = screenWidth;
      orangeTransX.value = 0;
      redActualOpacity.value = 1;
      redOpacity.value = 0;
    } else if (tick === 2) {
      redActualTransX.value = screenWidth;
      redTransX.value = 0;
      orangeActualOpacity.value = 1;
      orangeOpacity.value = 0;
    }
  }, [tick]);

  return (
    <View style={[styles.cardsContainer]}>
      <Animated.View style={[styles.cardContainer, redStyle]}>
        <Image
          source={currentCard.imageSrc}
          resizeMode="cover"
          style={styles.caroImage}
        />
      </Animated.View>
      <Animated.View style={[styles.cardContainer, orangeStyle]}>
        <Image
          source={nextCard.imageSrc}
          resizeMode="cover"
          style={styles.caroImage}
        />
      </Animated.View>
    </View>
  );
};

export default Carousel;

const styles = StyleSheet.create({
  container: {
    width: screenWidth,
    height: 400,
    marginTop: 80,
  },
  cardsContainer: {
    flexDirection: 'row',
    width: screenWidth * 2,
    height: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  cardContainer: {
    width: screenWidth,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
  },

  caroImage: {
    width: '100%',
    height: '100%',
  },
});
