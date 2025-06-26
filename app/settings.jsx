import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth } from '../firebaseConfig';

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', photo: null });

  useEffect(() => {
    const user = auth.currentUser;
    setUserData({
      name: user?.displayName || 'User',
      photo: user?.photoURL || null,
    });
  }, []);

  const handleSignOut = async () => {
    await auth.signOut();
    router.replace('/Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      {/* User Info */}
      <View style={styles.profileSection}>
        <Image
          source={userData.photo ? { uri: userData.photo } : require('../assets/icon.png')}
          style={styles.profileImage}
        />
        <Text style={styles.userName}>{userData.name}</Text>
      </View>

      {/* Edit Profile */}
      <TouchableOpacity style={styles.editProfileBtn} onPress={() => router.push('/edit-profile')}>
        <Feather name="edit" size={20} color="#000" />
        <Text style={styles.editText}>Edit Profile</Text>
      </TouchableOpacity>

      {/* Sign Out */}
      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
        <Ionicons name="exit-outline" size={24} color="red" />
        <Text style={styles.signOutText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Settings;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 50,
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: 50,
    marginBottom: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#B0E0E6',
  },
  userName: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 30,
  },
  editText: {
    fontSize: 16,
    color: '#000',
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FFECEC',
    padding: 12,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
});
