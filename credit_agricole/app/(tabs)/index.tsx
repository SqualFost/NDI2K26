import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function CreateProject() {
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Form states
  const [projectName, setProjectName] = useState('');
  const [projectDesc, setProjectDesc] = useState('');
  const [budget, setBudget] = useState('');
  const [category, setCategory] = useState('');
  const [location, setLocation] = useState('');

  const nextStep = () => {
    if (step < totalSteps) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const progress = (step / totalSteps) * 100;

  return (
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
        >
          {/* HEADER : Flèche + Barre de progression dynamique */}
          <View style={styles.header}>
            <TouchableOpacity onPress={prevStep} style={styles.backButton} disabled={step === 1}>
              <Ionicons name="arrow-back" size={24} color={step === 1 ? "#CCC" : "#397262"} />
            </TouchableOpacity>

            <View style={styles.progressContainer}>
              <View style={[styles.progressBar, { width: `${progress}%` }]} />
            </View>

            <Text style={styles.stepIndicator}>{step}/{totalSteps}</Text>
          </View>

          <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={false}
          >
            {/* ÉTAPE 1 : DESCRIPTION GÉNÉRALE */}
            {step === 1 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Décrivez-nous votre projet</Text>

                  <View style={styles.inputSection}>
                    <Label icon="briefcase-outline" text="Nom du Projet" />
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Dons d'ordinateurs recyclés"
                        value={projectName}
                        onChangeText={setProjectName}
                    />
                  </View>

                  <View style={styles.inputSection}>
                    <Label icon="create-outline" text="Description" />
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Décrivez votre objectif..."
                        multiline={true}
                        numberOfLines={4}
                        value={projectDesc}
                        onChangeText={setProjectDesc}
                    />
                  </View>
                </View>
            )}

            {/* ÉTAPE 2 : BUDGET ET FINANCEMENT */}
            {step === 2 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Quel est votre besoin ?</Text>

                  <View style={styles.inputSection}>
                    <Label icon="cash-outline" text="Budget estimé (€)" />
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: 5000"
                        keyboardType="numeric"
                        value={budget}
                        onChangeText={setBudget}
                    />
                  </View>

                  <View style={styles.infoCard}>
                    <Ionicons name="information-circle-outline" size={20} color="#447fab" />
                    <Text style={styles.infoText}>
                      Le Crédit Agricole peut vous accompagner via des prêts à taux zéro ou des subventions locales.
                    </Text>
                  </View>
                </View>
            )}

            {/* ÉTAPE 3 : CATÉGORIE */}
            {step === 3 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Secteur d'activité</Text>

                  <View style={styles.categoryGrid}>
                    {['Environnement', 'Social', 'Culture', 'Économie'].map((cat) => (
                        <TouchableOpacity
                            key={cat}
                            style={[styles.categoryCard, category === cat && styles.categoryCardSelected]}
                            onPress={() => setCategory(cat)}
                        >
                          <Ionicons
                              name={cat === 'Environnement' ? 'leaf-outline' : 'people-outline'}
                              size={24}
                              color={category === cat ? '#FFF' : '#397262'}
                          />
                          <Text style={[styles.categoryText, category === cat && styles.categoryTextSelected]}>{cat}</Text>
                        </TouchableOpacity>
                    ))}
                  </View>
                </View>
            )}

            {/* ÉTAPE 4 : LOCALISATION & VALIDATION */}
            {step === 4 && (
                <View style={styles.stepWrapper}>
                  <Text style={styles.title}>Où se situe le projet ?</Text>

                  <View style={styles.inputSection}>
                    <Label icon="location-outline" text="Ville ou Département" />
                    <TextInput
                        style={styles.input}
                        placeholder="Ex: Alpes-Maritimes"
                        value={location}
                        onChangeText={setLocation}
                    />
                  </View>

                  <View style={styles.summaryCard}>
                    <Text style={styles.summaryTitle}>Récapitulatif</Text>
                    <Text style={styles.summaryItem}>📋 {projectName || "Non défini"}</Text>
                    <Text style={styles.summaryItem}>💰 {budget ? `${budget} €` : "Non défini"}</Text>
                    <Text style={styles.summaryItem}>📍 {location || "Non défini"}</Text>
                  </View>
                </View>
            )}
          </ScrollView>

          {/* BOUTON FIXE EN BAS */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.nextButton} onPress={nextStep}>
              <Text style={styles.nextButtonText}>
                {step === totalSteps ? "SOUMETTRE" : "SUIVANT"}
              </Text>
              <Ionicons name={step === totalSteps ? "checkmark-circle" : "chevron-forward"} size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
  );
}

// Petit composant interne pour les labels
const Label = ({ icon, text }) => (
    <View style={styles.labelRow}>
      <Ionicons name={icon} size={18} color="#4e8076" style={{ marginRight: 8 }} />
      <Text style={styles.label}>{text}</Text>
    </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f9f3' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: { padding: 5 },
  progressContainer: {
    flex: 1,
    height: 6,
    backgroundColor: '#e5f3f5',
    borderRadius: 10,
    marginLeft: 15,
    marginRight: 10,
    overflow: 'hidden',
  },
  progressBar: { height: '100%', backgroundColor: '#397262' },
  stepIndicator: { fontSize: 12, fontWeight: 'bold', color: '#4e8076' },

  scrollContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 120 },
  stepWrapper: { width: '100%' },
  title: { fontSize: 22, fontWeight: '700', color: '#397262', marginBottom: 25 },

  inputSection: { marginBottom: 20 },
  labelRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 14, fontWeight: '600', color: '#4e8076' },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#e5f3f5',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
  },
  textArea: { height: 100, textAlignVertical: 'top' },

  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#e5f3f5',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center'
  },
  infoText: { flex: 1, marginLeft: 10, fontSize: 13, color: '#447fab', lineHeight: 18 },

  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  categoryCard: {
    width: '48%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e5f3f5',
  },
  categoryCardSelected: { backgroundColor: '#397262', borderColor: '#397262' },
  categoryText: { marginTop: 8, fontWeight: '600', color: '#397262' },
  categoryTextSelected: { color: '#FFF' },

  summaryCard: { backgroundColor: '#FFF', padding: 20, borderRadius: 15, marginTop: 10 },
  summaryTitle: { fontWeight: 'bold', color: '#397262', marginBottom: 15, fontSize: 16 },
  summaryItem: { marginBottom: 10, fontSize: 15, color: '#555' },

  footer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 25,
    paddingBottom: 100,
    backgroundColor: '#f5f9f3'
  },
  nextButton: {
    backgroundColor: '#397262',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 18,
    borderRadius: 30,
    elevation: 4,
  },
  nextButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700', marginRight: 10 },
});