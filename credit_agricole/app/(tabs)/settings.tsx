import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Settings() {
  const [isBiometric, setIsBiometric] = React.useState(true);
  const [isNotifications, setIsNotifications] = React.useState(true);

  const SettingItem = ({ icon, label, onPress, color = "#4e8076", rightElement = null }) => (
      <TouchableOpacity style={styles.item} onPress={onPress}>
        <View style={styles.itemLeft}>
          <View style={[styles.iconContainer, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
          </View>
          <Text style={styles.itemLabel}>{label}</Text>
        </View>
        {rightElement ? rightElement : <Ionicons name="chevron-forward" size={20} color="#ccc" />}
      </TouchableOpacity>
  );

  return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Réglages</Text>
        </View>

        {/* SECTION : MON COMPTE */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>MON COMPTE</Text>
          <View style={styles.card}>
            <SettingItem
                icon="person-outline"
                label="Informations personnelles"
                onPress={() => {}}
            />
            <View style={styles.separator} />
            <SettingItem
                icon="shield-checkmark-outline"
                label="Sécurité et mot de passe"
                onPress={() => {}}
                color="#366d50"
            />
          </View>
        </View>

        {/* SECTION : PARAMÈTRES APPLICATION */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PARAMÈTRES APPLICATION</Text>
          <View style={styles.card}>
            <SettingItem
                icon="finger-print-outline"
                label="Connexion biométrique"
                color="#4d9397"
                rightElement={
                  <Switch
                      value={isBiometric}
                      onValueChange={setIsBiometric}
                      trackColor={{ false: "#e5f3f5", true: "#4e8076" }}
                  />
                }
            />
            <View style={styles.separator} />
            <SettingItem
                icon="notifications-outline"
                label="Notifications alertes"
                rightElement={
                  <Switch
                      value={isNotifications}
                      onValueChange={setIsNotifications}
                      trackColor={{ false: "#e5f3f5", true: "#4e8076" }}
                  />
                }
            />
          </View>
        </View>

        {/* BOUTON DÉCONNEXION */}
        <TouchableOpacity style={styles.logoutButton}>
          <Ionicons name="log-out-outline" size={20} color="#d54640" />
          <Text style={styles.logoutText}>Se déconnecter</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Projet Nuit de l'ISEN - N2T</Text>
      </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f9f3',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#FFF',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#397262',
  },
  section: {
    marginTop: 25,
    paddingHorizontal: 15,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4e8076',
    marginBottom: 8,
    marginLeft: 5,
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemLabel: {
    fontSize: 16,
    color: '#333',
  },
  separator: {
    height: 1,
    backgroundColor: '#e5f3f5',
    marginLeft: 60,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
    marginHorizontal: 20,
    padding: 15,
    borderRadius: 12,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#d5464020',
  },
  logoutText: {
    color: '#d54640',
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 16,
  },
  version: {
    textAlign: 'center',
    color: '#4e8076',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 40,
    opacity: 0.6,
  }
});