import React, { useRef, useState, useEffect } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, Image,
  KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [activeChatIndex, setActiveChatIndex] = useState(null);
  const [userData, setUserData] = useState({ name: 'User', photo: null });
  const [isBotTyping, setIsBotTyping] = useState(false);
  const scrollRef = useRef(null);
  const user = auth.currentUser;
  const router = useRouter();

  // Load user display name and photo
  useEffect(() => {
    if (user) {
      setUserData({
        name: user.displayName || 'User',
        photo: user.photoURL || null,
      });
    }
  }, [user]);

  // Load saved chats from Firestore on mount
  useEffect(() => {
    if (user) {
      const fetchChats = async () => {
        const userRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          // Filter out cleared chats
          setChatHistory((data.chatHistory || []).filter(chat => !chat.cleared));
        }
      };
      fetchChats();
    }
  }, [user]);

  const saveChatToFirestore = async (updatedHistory) => {
    if (!user) return;
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, { chatHistory: updatedHistory }, { merge: true });
  };

  const handleSend = async () => {
    if (!inputText.trim() || !user) return;

    const userMessage = { text: inputText, sender: 'user' };
    let updatedHistory = [...chatHistory];
    let chatIndex = activeChatIndex;

    // Add user message
    setCurrentChat(prev => [...prev, userMessage]);
    setInputText('');
    setIsBotTyping(true);

    if (isNewChat) {
      const title = inputText.trim().slice(0, 40);
      const newChat = {
        title,
        messages: [userMessage],
        createdAt: new Date().toISOString(),
      };
      updatedHistory.push(newChat);
      chatIndex = updatedHistory.length - 1;
      setActiveChatIndex(chatIndex);
      setIsNewChat(false);
    } else {
      updatedHistory[chatIndex].messages.push(userMessage);
    }

    setChatHistory(updatedHistory);
    saveChatToFirestore(updatedHistory);

    setTimeout(async () => {
      try {
        const response = await fetch('https://9f39569a4b7e.ngrok-free.app/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            question: inputText,
            userId: user.uid,
          }),
        });

        const data = await response.json();
        const botMessage = {
          text: data.answer || '❌ ' + data.error || '⚠️ Something went wrong.',
          sender: 'bot',
        };

        const updatedCurrent = [...currentChat, userMessage, botMessage];
        updatedHistory[chatIndex].messages.push(botMessage);
        setCurrentChat(updatedCurrent);
        setChatHistory(updatedHistory);
        saveChatToFirestore(updatedHistory);
      } catch (error) {
        console.error('Chat fetch error:', error);
        const errorMessage = { text: '⚠️ Failed to connect to server.', sender: 'bot' };
        setCurrentChat(prev => [...prev, errorMessage]);
      }

      setIsBotTyping(false);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    }, 400);
  };

  const handleNewChat = () => {
    setCurrentChat([]);
    setIsNewChat(true);
    setActiveChatIndex(null);
  };

  const handleHistoryClick = (index) => {
    setCurrentChat(chatHistory[index].messages);
    setActiveChatIndex(index);
    setIsNewChat(false);
    setSidebarVisible(false);
  };

  // ✅ Clear All Chat History
  const handleClearAll = async () => {
    if (!user) return;

    // Mark as cleared but not deleted
    const updated = chatHistory.map(chat => ({ ...chat, cleared: true }));

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { chatHistory: updated }, { merge: true });

    // Update UI
    setChatHistory([]);
    setCurrentChat([]);
    setIsNewChat(true);
    setActiveChatIndex(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CFFFE5' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setSidebarVisible(true)}>
              <Ionicons name="menu" size={28} color="#000" />
            </TouchableOpacity>
            <View style={styles.logoTextContainer}>
              <View style={styles.logoCircle}>
                <Image source={require('../assets/icon.png')} style={styles.logo} />
              </View>
              <Text style={styles.headerTitle}>Vitalis</Text>
            </View>
            <TouchableOpacity style={styles.newChatButton} onPress={handleNewChat}>
              <Ionicons name="create-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Chat Body */}
          <ScrollView
            ref={scrollRef}
            style={styles.scrollView}
            contentContainerStyle={{ paddingBottom: 20 }}
            onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.avatarWrapper}>
              <Image source={require('../assets/icon.png')} style={styles.avatar} />
            </View>
            <View style={styles.botBubble}>
              <Text style={styles.botText}>
                Hey, nice to meet you! I'm Vitalis, your friendly virtual health assistant. Ask away!
              </Text>
            </View>
            {currentChat.map((msg, index) => (
              <View key={index} style={[styles.botBubble, msg.sender === 'user' && styles.userBubble]}>
                <Text style={styles.botText}>{msg.text}</Text>
              </View>
            ))}

            {isBotTyping && (
              <View style={styles.botBubble}>
                <Text style={styles.botText}>Vitalis is typing...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask anything"
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor="#B2BEB5"
            />
            <TouchableOpacity
              style={[styles.sendButton, isBotTyping && { opacity: 0.5 }]}
              onPress={handleSend}
              disabled={isBotTyping}
            >
              <Ionicons name="arrow-forward" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Sidebar */}
        {sidebarVisible && (
          <TouchableOpacity style={styles.sidebarOverlay} activeOpacity={1} onPressOut={() => setSidebarVisible(false)}>
            <TouchableOpacity style={styles.sidebar} activeOpacity={1} onPress={(e) => e.stopPropagation()}>
              <View style={styles.sidebarHeader}>
                <View style={styles.profileWrapper}>
                  <Image source={userData.photo ? { uri: userData.photo } : require('../assets/icon.png')}
                    style={styles.profileIcon}
                  />
                  <Text style={styles.userName}>{userData.name}</Text>
                </View>
                <TouchableOpacity onPress={() => {
                  setSidebarVisible(false);
                  router.push('/settings');
                }}>
                  <Feather name="settings" size={24} color="#000" />
                </TouchableOpacity>
              </View>

              <View style={styles.historyContainer}>
                <Text style={styles.historyTitle}>Chat History</Text>
                <ScrollView
                  style={{ flex: 1 }}
                  contentContainerStyle={{ paddingBottom: 20 }}
                  showsVerticalScrollIndicator={false}
                >
                  {chatHistory.map((item, i) => (
                    <TouchableOpacity key={i} onPress={() => handleHistoryClick(i)} style={styles.historyItem}>
                      <Text style={styles.historyText}>{item.title}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>

                {/* ✅ Clear Button */}
                <TouchableOpacity style={styles.clearButton} onPress={handleClearAll}>
                  <Text style={styles.clearButtonText}>Clear Chat History</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
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
  newChatButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
    marginLeft: 10,       
    marginRight: 40,
  },
  userBubble: {
    backgroundColor: '#B0E0E6',
    alignSelf: 'flex-end',
    marginLeft: 40,       
    marginRight: 10
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
  sidebarOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.3)',
    zIndex: 999,
  },
  sidebar: {
    backgroundColor: '#B0E0E6',
    width: '80%',
    height: '100%',
    padding: 20,
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    zIndex: 1000,
  },
  sidebarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  profileWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  historyContainer: {
    flex: 1,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  historyItem: {
    backgroundColor: '#CFFFE5',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  historyText: {
    color: '#000',
  },
  clearButton: {
    backgroundColor: '#FF6B6B',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  clearButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
