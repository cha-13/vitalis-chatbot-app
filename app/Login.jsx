import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signInWithCredential, GoogleAuthProvider, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: '638167981907-su5pdjo6pf8airb43qncdr8kcslg5n9m.apps.googleusercontent.com',
    androidClientId: '638167981907-9gqatva2si9tnrfaqprlp7n9lgvj5ob4.apps.googleusercontent.com',
    webClientId: '638167981907-jbng40fn7hkvq8uu5mqh484b1os52q1c.apps.googleusercontent.com',
    redirectUri: 'https://auth.expo.io/@cha_091303/vitalisapp',
    useProxy: true,
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.authentication;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(() => {
          Alert.alert('Success', 'Logged in with Google!');
          router.push('/');
        })
        .catch((error) => {
          Alert.alert('Login Error', error.message);
        });
    }
  }, [response]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CFFFE5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.topHalf}>
              <View style={styles.leftTop}>
                <Text style={styles.welcomeText}>Welcome{'\n'}back!</Text>
              </View>
              <View style={styles.imageWrapper}>
                <Image source={require('../assets/login.png')} style={styles.topImage} />
              </View>
            </View>

            <View style={styles.formWrapper}>
              <Text style={styles.loginTitle}>Login</Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your email"
                placeholderTextColor="#aaa"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, { flex: 1, marginBottom: 0, borderWidth: 0 }]}
                  placeholder="Enter password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Feather
                    name={showPassword ? 'eye' : 'eye-off'}
                    size={24}
                    color="#555"
                    style={styles.eyeIcon}
                  />
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => {
                  if (!email || !password) {
                    Alert.alert('Error', 'Please enter both email and password');
                    return;
                  }

                  signInWithEmailAndPassword(auth, email, password)
                    .then(() => {
                      Alert.alert('Success', 'Logged in!');
                      router.push('/chat');
                    })
                    .catch((error) => {
                      Alert.alert('Login Failed', error.message);
                    });
                }}
              >
                <Text style={styles.continueText}>Continue</Text>
              </TouchableOpacity>

              <Text style={styles.linkText}>
                Don’t have an account?{' '}
                <Text style={styles.linkHighlight} onPress={() => router.push('/CreateAccount')}>
                  Create account
                </Text>
              </Text>

              <Text style={styles.orText}>or</Text>

              <TouchableOpacity
                style={[styles.googleButton, !request && { backgroundColor: '#ccc' }]}
                onPress={() => {
                  if (request) {
                    promptAsync();
                  } else {
                    Alert.alert('Please wait', 'Google Login is still setting up...');
                  }
                }}
                disabled={!request}
              >
                <AntDesign name="google" size={20} color="#000" />
                <Text style={styles.googleText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            <View style={{ padding: 20 }}>
              <Text style={styles.termsText}>
                By clicking continue, you agree to our{' '}
                <Text style={styles.linkHighlight} onPress={() => router.push('/terms-of-service')}>
                  Terms of Service
                </Text>{' '}
                and{' '}
                <Text style={styles.linkHighlight} onPress={() => router.push('/PrivacyPolicy')}>
                  Privacy Policy
                </Text>.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CFFFE5',
  },
  formWrapper: {
    paddingHorizontal: 20,
    marginTop: 0,
  },
  topHalf: {
    backgroundColor: '#B3E5FC',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    width: '100%',
    height: '40%',
    flexDirection: 'row',
    padding: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  leftTop: {
    flex: 1,
    justifyContent: 'center',
  },
  welcomeText: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#000',
  },
  imageWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  topImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  loginTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
    paddingHorizontal: 10,
    marginTop: -10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  eyeIcon: {
    marginLeft: 10,
  },
  continueButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    textAlign: 'center',
    fontSize: 14,
    marginBottom: 0,
    color: '#000',
  },
  linkHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    marginVertical: 10,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  googleText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#000',
  },
  termsText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginTop: -10,
  },
});
