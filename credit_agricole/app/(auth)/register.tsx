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
import { Utilisateur } from '@/constants/data';
import { addUser } from '@/api/utilisateur';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [prenom, setPrenom] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');


  const handleRegister = () => {
    const user:Utilisateur = {
      id: 0,
      nom: name,
      prenom: prenom,
      email: email,
      mot_de_passe: password
    };
    addUser(user);
    router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>Inscription</Text>

      <TextInput
        style={styles.input}
        placeholder="Nom"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Prenom"
        value={prenom}
        onChangeText={setPrenom}
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirmer mot de passe"
        secureTextEntry
        value={confirm}
        onChangeText={setConfirm}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleRegister}
      >
        <Text style={styles.buttonText}>S inscrire</Text>
      </TouchableOpacity>

      {/* Retour login */}
      <TouchableOpacity
        onPress={() => router.back()}
        style={styles.linkBox}
      >
        <Text style={styles.link}>
          Déjà un compte ? Se connecter
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
    marginBottom: 35,
  },

  input: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5f3f5',
  },

  button: {
    backgroundColor: '#397262',
    padding: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 10,
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
