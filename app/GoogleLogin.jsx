
import React, { useEffect, useState } from 'react';
import { Button, Alert, View, ActivityIndicator } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { useRouter } from 'expo-router';

WebBrowser.maybeCompleteAuthSession();

export default function GoogleLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '638167981907-6oe7t14fs0dpmfhkvh02v0kh22uv0f36.apps.googleusercontent.com',
    androidClientId: '638167981907-9gqatva2si9tnrfaqprlp7n9lgvj5ob4.apps.googleusercontent.com',
    webClientId: '638167981907-su5pdjo6pf8airb43qncdr8kcslg5n9m.apps.googleusercontent.com',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);

      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'Logged in with Google!');
          router.push('/home');
        })
        .catch((error) => {
          Alert.alert('Authentication Error', error.message);
        });
    } else if (response?.type === 'error') {
      Alert.alert('Google Login Failed', 'Something went wrong.');
    }
  }, [response]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Button
          title="Sign in with Google"
          disabled={!request}
          onPress={() => {
            if (request) {
              setLoading(true);
              promptAsync()
                .catch((err) => {
                  console.error('Prompt Error:', err);
                  Alert.alert('Error', 'Failed to open Google login');
                })
                .finally(() => setLoading(false));
            }
          }}
        />
      )}
    </View>
  );
}
