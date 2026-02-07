import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // TEMP (à remplacer par vraie auth)
    if (email && password) {
      router.replace('/(tabs)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Connexion</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
      >
        <Text style={styles.buttonText}>Se connecter</Text>
      </TouchableOpacity>
      {/* Inscription */}
    <TouchableOpacity
    onPress={() => router.push('/(auth)/register')}
    style={styles.linkBox}
    >
    <Text style={styles.link}>
        Pas de compte ? S inscrire
    </Text>
    </TouchableOpacity>


    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#f5f9f3',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#397262',
    textAlign: 'center',
    marginBottom: 40,
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5f3f5',
  },

  button: {
    backgroundColor: '#397262',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
  },

  buttonText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },

  linkBox: {
  marginTop: 25,
  alignItems: 'center',
  },

  link: {
  color: '#397262',
  fontWeight: '600',
  },

});