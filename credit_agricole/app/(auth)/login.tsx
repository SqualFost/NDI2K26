import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert, // Import de l'alerte
  Keyboard
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
// Assure-toi que le chemin est bon selon ton projet
import { login } from '@/api/utilisateur'; 

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // 1. Petite validation avant d'envoyer
    if (!email || !password) {
      Alert.alert("Oups", "Merci de remplir tous les champs.");
      return;
    }

    Keyboard.dismiss();
    setLoading(true);

    try {
      // Appel de ta fonction API corrigée juste avant
      const user = await login({ email, password });
      
      console.log("Connecté !", user);
      
      // 2. Utiliser replace au lieu de push pour ne pas pouvoir revenir en arrière
      router.replace('/(tabs)'); 
      
    } catch (e) {
      console.error("Erreur de connexion", e);
      // Affiche l'erreur renvoyée par ton API (ex: "Utilisateur non trouvé")
      Alert.alert("Erreur de connexion", e.message || "Vérifiez vos identifiants.");
    } finally {
      setLoading(false);
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
        keyboardType="email-address" // Clavier optimisé pour les emails
      />

      <TextInput
        style={styles.input}
        placeholder="Mot de passe"
        secureTextEntry
        value={password}
        onChangeText={setPassword} // C'ETAIT L'ERREUR PRINCIPALE ICI
      />

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]} // Style si chargement
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
            {loading ? "Connexion..." : "Se connecter"}
        </Text>
      </TouchableOpacity>

      {/* Inscription */}
      <TouchableOpacity
        onPress={() => router.push('/(auth)/register')}
        style={styles.linkBox}
      >
        <Text style={styles.link}>
            Pas de compte ? S'inscrire
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
  buttonDisabled: {
    backgroundColor: '#8bada5', // Couleur plus claire quand ça charge
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