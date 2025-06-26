import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const slides = [
  {
    id: '1',
    title: 'Welcome To Vitalis',
    highlight: 'Reliable Medical Guidance',
    description:
      'Check your symptoms and get instant, verified recommendations from our AI-powered chatbot.',
    image: require('../assets/onboarding1.png'),
  },
  {
    id: '2',
    title: 'AI-Powered Guidance',
    highlight: '',
    description: 'Get probable insights. Not a diagnosis.',
    image: require('../assets/onboarding2.png'),
  },
  {
    id: '3',
    title: 'Skip the Wait!',
    highlight: '',
    description: 'Get answers right away from our AI chatbot.',
    image: require('../assets/onboarding3.png'),
  },
];

const OnboardingScreen = () => {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef();

  const handleNext = () => {
    if (currentIndex < slides.length - 1) {
      flatListRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.replace('/home');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.slide}>
      {/* Top blue half box */}
      <View style={styles.topHalf}>
        <Image source={item.image} style={styles.image} />
      </View>

      {/* Text content */}
      <View style={styles.bottomHalf}>
        <Text style={styles.title}>
          {item.title.includes('Vitalis') ? (
            <>
              Welcome To <Text style={styles.highlightBlue}>Vitalis</Text>
              {'\n'}Where You Get{' '}
              <Text style={styles.highlightBlue}>Reliable Medical Guidance</Text> Anytime, Anywhere.
            </>
          ) : (
            item.title
          )}
        </Text>
        <Text style={styles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipButton}
        onPress={() => router.replace('/guestChat')}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      {/* Onboarding slides */}
      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onScroll={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
      />

      {/* Dot indicators */}
      <View style={styles.dotsContainer}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: index === currentIndex ? '#00A3FF' : '#ccc' },
            ]}
          />
        ))}
      </View>

      {/* Next / Done button */}
      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={{ fontSize: 24, color: '#fff' }}>{'➔'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E6FAF4',
  },
  slide: {
    width,
    alignItems: 'center',
  },
  topHalf: {
    backgroundColor: '#B3E5FC',
    width: '100%',
    height: height * 0.55,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: width * 0.9,
    height: width * 0.9,
    resizeMode: 'contain',
  },
  bottomHalf: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
  },
  highlightBlue: {
    color: '#00A3FF',
  },
  description: {
    fontSize: 19,
    textAlign: 'center',
    marginTop: 10,
    color: '#555',
  },
  skipButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
  },
  skipText: {
  color: '#000',
  fontSize: 18, // adjust this to make it bigger or smaller (default ~14)
  fontWeight: '600', // optional, for slight boldness
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 55,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  nextButton: {
    position: 'absolute',
    bottom: 40,
    right: 30,
    backgroundColor: '#00A3FF',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default OnboardingScreen;
