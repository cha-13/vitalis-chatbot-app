import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      const hasSeenOnboarding = await AsyncStorage.getItem('hasSeenOnboarding');

      if (hasSeenOnboarding === 'true') {
        router.replace('/Home');
      } else {
        router.replace('/onboarding');
      }
    };

    checkOnboardingStatus();
  }, []);

  return null;
}
