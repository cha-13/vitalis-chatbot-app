import React, { useState, useEffect } from 'react';
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, Feather } from '@expo/vector-icons';
import {
  createUserWithEmailAndPassword,
  signInWithCredential,
  GoogleAuthProvider,
  updateProfile, 
} from 'firebase/auth';
import { auth } from '../firebaseConfig';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { SafeAreaView } from 'react-native-safe-area-context';

WebBrowser.maybeCompleteAuthSession();

const CreateAccount = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fullName, setFullName] = useState('');

  const isValidGmail = (email) => {
    const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return regex.test(email);
  };

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
          Alert.alert('Success', 'Signed up with Google!');
          router.push('/');
        })
        .catch((error) => {
          Alert.alert('Error', error.message);
        });
    }
  }, [response]);

  const handleSignUp = async () => {
    if (!email || !password || !fullName) {
      Alert.alert('Validation Error', 'Please fill in all fields.');
      return;
    }

    if (!isValidGmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid Gmail address (e.g., yourname@gmail.com).');
      return;
    }

    if (password.length < 8) {
      Alert.alert('Password Too Short', 'Password must be at least 8 characters.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // full name to Firebase profile
      await updateProfile(user, {
        displayName: fullName,
      });

      Alert.alert('Success', 'Account created!');
      router.push('/Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CFFFE5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 20}
      >
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
      
          <View style={styles.topHalf}>
            <Image
              source={require('../assets/createacc.png')}
              style={styles.topImage}
            />
          </View>

          
          <Text style={styles.title}>Create Account</Text>

          
          <TextInput
            style={styles.input}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />

          
          <TextInput
            style={styles.input}
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          
          <View style={styles.passwordWrapper}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Password must be 8 characters"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? 'eye' : 'eye-off'} size={22} color="#000" />
            </TouchableOpacity>
          </View>

          
          <TouchableOpacity style={styles.button} onPress={handleSignUp}>
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          
          <View style={{ alignItems: 'center' }}>
            <Text style={styles.linkText}>
              Already have an account?{' '}
              <Text style={styles.linkHighlight} onPress={() => router.push('/Login')}>
                Login
              </Text>
            </Text>
          </View>

          
          <Text style={styles.orText}>or</Text>

          {/*  Google Signup */}
          <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
            <AntDesign name="google" size={20} color="#000" style={{ marginRight: 8 }} />
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          
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
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CreateAccount;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5',
  },
  topHalf: {
    backgroundColor: '#B3E5FC',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topImage: {
    width: 300,
    height: 300,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'left',
    paddingHorizontal: 20,
    marginTop: 30,
    marginBottom: 10,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 20,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  eyeIcon: {
    padding: 10,
    position: 'absolute',
    right: 20,
  },
  button: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    marginVertical: 10,
    color: '#555',
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
  },
  googleText: {
    color: '#000',
    fontSize: 16,
  },
  linkText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'center',
  },
  linkHighlight: {
    color: '#000',
    fontWeight: 'bold',
  },
  termsText: {
    fontSize: 12,
    color: '#555',
    textAlign: 'center',
    marginHorizontal: 20,
  },
});
