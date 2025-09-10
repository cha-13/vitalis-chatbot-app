import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import React, { useState, useRef } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const GuestChat = () => {
  const [inputText, setInputText] = useState('');
  const [guestId] = useState(uuidv4());
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const router = useRouter();
  const scrollRef = useRef(null);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const question = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: question }]);
    setInputText('');
    setIsTyping(true);

    // ✨ simulate typing delay + backend fetch
    setTimeout(async () => {
      try {
        const res = await fetch("https://ada6bf509d73.ngrok-free.app/ask", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question,
            userId: guestId,
          }),
        });

        const data = await res.json();
        setMessages(prev => [...prev, { sender: 'bot', text: data.answer }]);
      } catch (error) {
        console.error("Guest chat error:", error);
        setMessages(prev => [...prev, { sender: 'bot', text: "⚠️ Failed to connect to server." }]);
      }
      setIsTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 500); // short delay before showing response
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CCFFE5' }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
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
                <Image source={require('../assets/icon.png')} style={styles.logo} />
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

        {/* CHAT BODY */}
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 20 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
          keyboardShouldPersistTaps="handled"
        >
          {/* Greeting */}
          <View style={styles.avatarWrapper}>
            <Image source={require('../assets/icon.png')} style={styles.avatar} />
          </View>
          <View style={styles.botBubble}>
            <Text style={styles.botText}>
              Hey, nice to meet you! I'm Vitalis, your friendly virtual health assistant. I can help you analyze symptoms, give health tips, and provide general wellness advice. Feel free to ask me anything!
            </Text>
          </View>

          {/* Messages */}
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

          {/* ✅ Typing indicator like chat.jsx */}
          {isTyping && (
            <View style={styles.botBubble}>
              <Text style={styles.botText}>Vitalis is typing...</Text>
            </View>
          )}
        </ScrollView>

        {/* INPUT BOX */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Ask anything"
            value={inputText}
            onChangeText={setInputText}
            placeholderTextColor="#B2BEB5"
          />
          <TouchableOpacity
            style={[styles.sendButton, isTyping && { opacity: 0.5 }]}
            onPress={handleSend}
            disabled={isTyping}
          >
            <Ionicons name="arrow-forward" size={20} color="#000" />
          </TouchableOpacity>
        </View>

        {/* FOOTER */}
        <Text style={styles.footerText}>
          By messaging Vitalis, you agree to our{' '}
          <Text style={styles.linkText} onPress={() => router.push('/terms-of-service')}>
            Terms of Service
          </Text>{' '}
          and read our{' '}
          <Text style={styles.linkText} onPress={() => router.push('/PrivacyPolicy')}>
            Privacy Policy
          </Text>.
        </Text>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default GuestChat;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
    marginBottom: 12,
    maxWidth: '75%',      
    marginLeft: 10,       
    marginRight: 40,
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
    maxWidth: '75%',      
    marginLeft: 40,       
    marginRight: 10,
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
    marginBottom: 8,
    marginHorizontal: 16,
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
