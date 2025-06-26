import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';
import { updateProfile } from 'firebase/auth';


// Replace these with your actual avatar image paths
const avatars = [
  require('../assets/avatars/a1.png'),
  require('../assets/avatars/a2.png'),
  require('../assets/avatars/a3.png'),
  require('../assets/avatars/a4.png'),
  require('../assets/avatars/a5.png'),
  require('../assets/avatars/a6.png'),
  require('../assets/avatars/a7.png'),
  require('../assets/avatars/a8.png'),
  require('../assets/avatars/a9.png'),
  require('../assets/avatars/a10.png'),
];

const EditProfile = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const [nickname, setNickname] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(null);

  const handleSave = async () => {
    try {
      await updateProfile(user, {
        displayName: nickname,
        photoURL: selectedAvatar ? Image.resolveAssetSource(selectedAvatar).uri : user?.photoURL,
      });
      Alert.alert('Success', 'Profile updated!');
      router.back(); // Go back to previous page
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      {/* 🔙 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      {/* 🧑 Profile Picture Preview */}
      <View style={styles.centered}>
        <Image
          source={selectedAvatar || (user?.photoURL ? { uri: user.photoURL } : require('../assets/icon.png'))}
          style={styles.profileImage}
        />
      </View>


      {/* ✏️ Nickname */}
      <Text style={styles.label}>Nickname</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter nickname"
        value={nickname}
        onChangeText={setNickname}
      />

      {/* 🖼️ Avatar Picker */}
      <Text style={styles.label}>Choose your avatar</Text>
      <View style={styles.avatarContainer}>
        {avatars.map((avatar, index) => (
          <TouchableOpacity key={index} onPress={() => setSelectedAvatar(avatar)}>
            <Image
              source={avatar}
              style={[
                styles.avatar,
                selectedAvatar === avatar && styles.selectedAvatar,
              ]}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* 💾 Save Button */}
      <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
        <Text style={styles.saveButtonText}>Save</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 40,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#000',
  },
  centered: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#B0E0E6',
  },
  label: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
    color: '#000',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
  },
  avatarContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedAvatar: {
    borderColor: '#000',
  },
  saveButton: {
    backgroundColor: '#000',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
