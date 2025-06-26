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
import { auth } from '../firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

const Chat = () => {
  const [inputText, setInputText] = useState('');
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const user = auth.currentUser;
  const router = useRouter();

  const handleSend = () => {
    if (!inputText.trim()) return;
    const newMessage = { text: inputText, sender: 'user' };
    setCurrentChat((prev) => [...prev, newMessage]);

    // Save to history 
    if (isNewChat) {
      const firstFewWords = inputText.trim().split(' ').slice(0, 3).join(' ') + ' tips';
      setChatHistory((prev) => [...prev, { title: firstFewWords, messages: [newMessage] }]);
      setIsNewChat(false);
    } else {
      
      setChatHistory((prev) => {
        const updated = [...prev];
        updated[updated.length - 1].messages.push(newMessage);
        return updated;
      });
    }

    setInputText('');
  };

  const handleNewChat = () => {
    setCurrentChat([]);
    setIsNewChat(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#CFFFE5' }}>
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
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

        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <Image
            source={require('../assets/icon.png')}
            style={styles.avatar}
          />
        </View>

        {/* greeting message */}
        <View style={styles.botBubble}>
          <Text style={styles.botText}>
            Hey, nice to meet you! I'm Vitalis, your friendly virtual health assistant. I can help
            you analyze symptoms, give health tips, and provide general wellness advice. Feel free
            to ask me anything!
          </Text>
        </View>

        {/* Chat History */}
        {currentChat.map((msg, index) => (
          <View
            key={index}
            style={[styles.botBubble, msg.sender === 'user' && styles.userBubble]}
          >
            <Text style={styles.botText}>{msg.text}</Text>
          </View>
        ))}

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

      </ScrollView>

      {/* Sidebar Modal */}
      {sidebarVisible && (
        <TouchableOpacity
          style={styles.sidebarOverlay}
          activeOpacity={1}
          onPressOut={() => setSidebarVisible(false)}
        >
          <TouchableOpacity
            style={styles.sidebar}
            activeOpacity={1}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Sidebar Content */}
            <View style={styles.sidebarHeader}>
              <View style={styles.profileWrapper}>
                <Image
                  source={user?.photoURL ? { uri: user.photoURL } : require('../assets/icon.png')}
                  style={styles.profileIcon}
                />
                <Text style={styles.userName}>{user?.displayName || 'User'}</Text>
              </View>
              <TouchableOpacity
                onPress={() => {
                  setSidebarVisible(false);
                  router.push('/settings');
                }}
              >
                <Feather name="settings" size={24} color="#000" />
              </TouchableOpacity>
            </View>

            <View style={styles.historyContainer}>
              <Text style={styles.historyTitle}>Chat History</Text>
              {chatHistory.map((item, i) => (
                <View key={i} style={styles.historyItem}>
                  <Text style={styles.historyText}>{item.title}</Text>
                </View>
              ))}
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
  gap: 8, // or use marginRight manually
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
  userBubble: {
    backgroundColor: '#B0E0E6',
    alignSelf: 'flex-end',
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
    marginTop: 30,
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
  closeSidebar: {
    marginTop: 20,
    color: 'blue',
    textAlign: 'center',
  },
  scrollViewContent: {
  flexGrow: 1,
  justifyContent: 'flex-start',
  paddingBottom: 20,
  },

});
