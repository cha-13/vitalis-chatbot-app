import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const router = useRouter();

  const handleSend = () => {
    if (!inputText.trim()) return;
    setInputText('');
  };

  return (
  <KeyboardAvoidingView
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
  >
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.leftHeaderContainer}>
          <TouchableOpacity style={styles.newChatButton}>
            <Ionicons name="create-outline" size={18} color="#000" />
          </TouchableOpacity>
          <View style={styles.logoTextContainer}>
            <View style={styles.logoCircle}>
            <Image
              source={require('../assets/icon.png')}
              style={styles.logo}
            />
            </View>
            <Text style={styles.headerTitle}>Vitalis</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton}
          onPress={() => router.push('/Login')}
          >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <Image
          source={require('../assets/icon.png')}
          style={styles.avatar}
        />
      </View>

      {/* Bot greeting message */}
      <View style={styles.botBubble}>
        <Text style={styles.botText}>
          Hey, nice to meet you! I'm Vitalis, your friendly virtual health assistant. I can help you analyze symptoms, give health tips, and provide general wellness advice. Feel free to ask me anything!
        </Text>
      </View>

      {/* Input bar */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Ask anything"
          value={inputText}
          onChangeText={setInputText}
          placeholderTextColor="#B2BEB5"
        />
        <TouchableOpacity style={styles.sendButton} onPress={handleSend}>
          <Ionicons name="arrow-forward" size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <Text style={styles.footerText}>
        By messaging Vitalis, you agree to our{' '}
        <Text
         style={styles.linkText}
         onPress={() => router.push('/terms-of-service')}
         >
          Terms of Service
          </Text>{' '}
          and read our{' '}
        <Text
         style={styles.linkText}
         onPress={() => router.push('/PrivacyPolicy')}
         >
          Privacy Policy
          </Text>.
      </Text>
    </ScrollView>
  </KeyboardAvoidingView>
);
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  logoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logo: {
    width: 50,
    height: 50,
    resizeMode: 'contain',
    marginBottom: -15,
  },
  logoCircle: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: '#B0E0E6', 
  justifyContent: 'center',
  alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  leftHeaderContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  gap: 8, 
},
  newChatButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  justifyContent: 'center',
  alignItems: 'center',
  marginRight: 15,
  },
  
  loginButton: {
    backgroundColor: '#DFFFEF',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#00C896',
  },
  loginText: {
    color: '#000',
    fontWeight: '600',
  },
  avatarWrapper: {
  backgroundColor: '#B0E0E6', 
  width: 160,
  height: 160,
  borderRadius: 90,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center',
  marginBottom: 24,
},
  avatar: {
    width: 250,
    height: 250,
    alignSelf: 'center',
    resizeMode: 'contain',
    marginTop: 60,
  },
  botBubble: {
    backgroundColor: '#FBEFFF',
    padding: 16,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  botText: {
    fontSize: 16,
    color: '#000',
  },
  inputContainer: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 25,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginTop: 'auto',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#000',
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#fff',
    padding: 8,
    borderRadius: 20,
  },
  footerText: {
    fontSize: 12,
    textAlign: 'center',
    color: '#666',
    marginBottom: 0,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#000',
  },
});
