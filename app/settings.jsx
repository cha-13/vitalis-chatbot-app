import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Modal } from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { auth, db } from '../firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import { deleteUser } from 'firebase/auth';

const Settings = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({ name: '', photo: null });
  const [showDeleteModal, setShowDeleteModal] = useState(false);

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

  const confirmDelete = async () => {
    const user = auth.currentUser;
    if (!user) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      setShowDeleteModal(false);
      router.replace('/Login');
    } catch (error) {
      console.error("Error deleting account:", error);
    }
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

      {/* Delete Account */}
      <TouchableOpacity style={styles.deleteBtn} onPress={() => setShowDeleteModal(true)}>
        <Ionicons name="trash-outline" size={24} color="#fff" />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>

      {/* 🔥 Custom Delete Confirmation Modal */}
      <Modal
        transparent={true}
        visible={showDeleteModal}
        animationType="fade"
        onRequestClose={() => setShowDeleteModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons name="warning-outline" size={40} color="red" />
            <Text style={styles.modalTitle}>Delete Account</Text>
            <Text style={styles.modalMessage}>
              Are you sure you want to permanently delete your account? This action cannot be undone.
            </Text>

            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowDeleteModal(false)}>
                <Text style={styles.cancelText}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmBtn} onPress={confirmDelete}>
                <Text style={styles.confirmText}>DELETE!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginBottom: 20,
  },
  signOutText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#FF4C4C',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  deleteText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  // 🔥 Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 8,
    color: '#000',
  },
  modalMessage: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#E5E5E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelText: {
    color: '#000',
    fontWeight: '600',
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#FF4C4C',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
