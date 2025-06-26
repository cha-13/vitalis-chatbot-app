import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const PrivacyPolicy = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdate}>Last Update:</Text>

        <Text style={styles.paragraph}>
          Welcome to Vitalis! Your privacy is important to us. This Privacy Policy explains how we collect, use, and protect your information when using our AI-Driven Chatbot for Virtual Health Assistance and Symptom Analysis.
        </Text>

        <Text style={styles.sectionTitle}>Information We Collect</Text>
        <Text style={styles.paragraph}>
          We only collect the necessary information to provide and improve our services. The types of data we collect include:
             {'\n'}· User Input Data: When you interact with our chatbot, we collect the text input you provide, including health-related inquiries and symptoms.
             {'\n'}· Account Information (if applicable): If you create an account, we collect basic details such as your name, email address, and password.
        </Text>

        <Text style={styles.sectionTitle}>How We Use Your Information</Text>
        <Text style={styles.paragraph}>
          We use the collected information to:
            {'\n'}· Provide accurate health-related responses based on chatbot interactions.
            {'\n'}· Improve the AI model and enhance user experience.
            {'\n'}· Ensure the security and reliability of our services.
        </Text>

        <Text style={styles.sectionTitle}>Data Security</Text>
        <Text style={styles.paragraph}>
          We implement appropriate security measures to protect your data. Your information is stored securely and is not shared with third parties without your consent, except as required by law.
        </Text>

        <Text style={styles.sectionTitle}>Third-Party Services</Text>
        <Text style={styles.paragraph}>
          Our app does not currently integrate with third-party tracking services or external advertisers.
        </Text>

        <Text style={styles.sectionTitle}>Your Rights</Text>
        <Text style={styles.paragraph}>
          You have the right to:
             {'\n'}· Access, update, or delete your data (if applicable).
             {'\n'}· Opt-out of data collection features in future updates.
             {'\n'}· For any requests, contact us at [Insert Contact Email]
        </Text>

        <Text style={styles.sectionTitle}>Changes to This Policy</Text>
        <Text style={styles.paragraph}>
          We may update this Privacy Policy from time to time. Any changes will be communicated through app updates or notifications.
        </Text>


        {/* You can add more sections as needed */}
      </ScrollView>
    </View>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#CCFFE5', // green background
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#CCFFE5',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 12,
    color: '#000',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  lastUpdate: {
    fontWeight: '600',
    marginBottom: 10,
    color: '#000',
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 6,
    fontWeight: 'bold',
    fontSize: 16,
    color: '#000',
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 22,
    color: '#000',
  },
});

