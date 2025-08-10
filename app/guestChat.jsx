import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
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
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const Home = () => {
  const [inputText, setInputText] = useState('');
  const [guestId] = useState(uuidv4());
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const question = inputText;

    // Show user message immediately
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await fetch("https://e2e5c5265c1a.ngrok-free.app/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          userId: guestId
        })
      });

      const data = await res.json();

      // Simulate typing delay
      setTimeout(() => {
        setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
        setIsTyping(false);
      }, 1000);

    } catch (error) {
      console.error("Guest chat error:", error);
      setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Failed to connect to server." }]);
      setIsTyping(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#CCFFE5' }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 20}
    >
      {/* HEADER */}
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

        <TouchableOpacity
          style={styles.loginButton}
          onPress={() => router.push('/Login')}
        >
          <Text style={styles.loginText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Avatar + Greeting (Fixed above chat area) */}
      <View style={styles.topSection}>
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.avatar}
          />
        </View>
        <View style={styles.botBubble}>
          <Text style={styles.botText}>
            Hey, nice to meet you! I'm Vitalis, your friendly virtual health assistant. I can help you analyze symptoms, give health tips, and provide general wellness advice. Feel free to ask me anything!
          </Text>
        </View>
      </View>

      {/* MESSAGES - Scrollable only here */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        {messages.map((msg, index) => (
          <View
            key={index}
            style={[
              styles.messageBubble,
              msg.sender === 'user' ? styles.userBubble : styles.botBubble
            ]}
          >
            <Text style={styles.messageText}>{msg.text}</Text>
          </View>
        ))}

        {isTyping && (
          <View style={styles.botBubble}>
            <ActivityIndicator size="small" color="#555" />
          </View>
        )}
      </ScrollView>

      {/* INPUT BOX - Fixed at bottom */}
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

      {/* FOOTER */}
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
    </KeyboardAvoidingView>
  );
};

export default Home;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 50,
    backgroundColor: '#CCFFE5',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
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
  topSection: {
    backgroundColor: '#CCFFE5',
    paddingHorizontal: 16,
    paddingVertical: 10,
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
    marginBottom: 10,
  },
  botText: {
    fontSize: 16,
    color: '#000',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#CCFFE5',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 16,
    marginVertical: 4,
    maxWidth: '80%',
  },
  userBubble: {
    backgroundColor: '#DFFFEF',
    alignSelf: 'flex-end',
  },
  messageText: {
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
    marginHorizontal: 16,
    marginBottom: 8,
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
    marginBottom: 10,
  },
  linkText: {
    textDecorationLine: 'underline',
    color: '#000',
  },
});
