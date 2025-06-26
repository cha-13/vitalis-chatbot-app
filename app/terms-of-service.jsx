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

const TermsOfService = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Terms of Service</Text>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.lastUpdate}>Last Update:</Text>

        <Text style={styles.paragraph}>
          Welcome to [Chatbot Name], an AI-driven virtual health assistant
          designed to provide health-related guidance and symptom analysis. By
          creating an account and using our services, you agree to the following
          Terms of Service. Please read them carefully before proceeding.
        </Text>

        <Text style={styles.sectionTitle}>Acceptance of Terms</Text>
        <Text style={styles.paragraph}>
          By accessing or using [Chatbot Name], you agree to comply with these
          Terms of Service. If you do not agree with any part of these terms,
          please do not use our service.
        </Text>

        <Text style={styles.sectionTitle}>Eligibility</Text>
        <Text style={styles.paragraph}>
          To use our services, you must be at least 13 years old. If you are
          under 18, you must obtain consent from a parent or legal guardian.
        </Text>

        <Text style={styles.sectionTitle}>Account Registration and Security</Text>
        <Text style={styles.paragraph}>
          You are responsible for maintaining the confidentiality of your
          account credentials. Any unauthorized use of your account should be
          reported immediately. We reserve the right to suspend or terminate 
          accounts found in violation of these terms, particularly in cases of fraudulent or harmful activities.
        </Text>

        <Text style={styles.sectionTitle}>Use of Service</Text>
        <Text style={styles.paragraph}>
          You agree to use [Chatbot Name] responsibly and ethically. When using our services, you must not:
             {'\n'}· Provide false or misleading information.
             {'\n'}· Attempt to hack, disrupt, or exploit the system.
             {'\n'}· Use the chatbot for unauthorized purposes, including medical emergencies or illegal activities.
        </Text>

        <Text style={styles.sectionTitle}>Health Disclaimer</Text>
        <Text style={styles.paragraph}>
          [Chatbot Name] is not a licensed medical professional and does not 
          provide medical diagnosis or treatment. Any health-related information
          provided by the chatbot is for informational purposes only and should 
          not be considered a substitute for professional medical advice. Always consult a licensed 
          healthcare provider for serious health concerns.
        </Text>

        <Text style={styles.sectionTitle}>Privacy and Data Handling</Text>
        <Text style={styles.paragraph}>
          Your privacy is important to us. Personal data collected during your use of the platform will be handled in accordance with our Privacy Policy. Non-personal data may be collected to improve the performance and functionality of the chatbot. Personal health information will not be shared with third parties without your explicit consent unless required by law.
        </Text>

        <Text style={styles.sectionTitle}>Changes to Terms</Text>
        <Text style={styles.paragraph}>
          We reserve the right to modify these Terms of Service at any time. Significant changes will be communicated through email or in-app notifications. Your continued use of the service after updates indicates acceptance of the revised terms.
        </Text>

        <Text style={styles.sectionTitle}>Account Suspension or Termination</Text>
        <Text style={styles.paragraph}>
          We may suspend or terminate your account if you violate these terms, engage in fraudulent or harmful activities, or if required by law or security concerns.
        </Text>

        <Text style={styles.sectionTitle}>Content and Service Limitations</Text>
        <Text style={styles.paragraph}>
          By using our services, you understand and agree that:
             {'\n'}· The chatbot's output may not always be accurate or reliable.
             {'\n'}· We do not guarantee uninterrupted service availability.
             {'\n'}· The chatbot should not be used for urgent medical conditions.
        </Text>

        <Text style={styles.sectionTitle}>Limitation of Liability</Text>
        <Text style={styles.paragraph}>
          By using our services, you understand and agree that:
             {'\n'}· The chatbot's output may not always be accurate or reliable.
             {'\n'}· We do not guarantee uninterrupted service availability.
             {'\n'}· The chatbot should not be used for urgent medical conditions.
        </Text>

        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.paragraph}>
          For any questions or concerns regarding these Terms of Service, please contact us at:  [Insert Contact Information]
        </Text>

        {/* You can add more sections as needed */}
      </ScrollView>
    </View>
  );
};

export default TermsOfService;

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

