// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: 'AIzaSyAcrphFix_ptwAHhJ1OP1Ckx_NFknBN7h0',
  authDomain: 'vitalis-7186b.firebaseapp.com',
  projectId: 'vitalis-7186b',
  storageBucket: 'vitalis-7186b.appspot.com',
  messagingSenderId: '638167981907',
  appId: '1:638167981907:web:b8c588023f1461ead94ba6',
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export { auth };
