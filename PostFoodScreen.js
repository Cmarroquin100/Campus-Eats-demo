import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from '../theme';
import { LOCATIONS } from '../data/mockData';

const TIMER_OPTIONS = ['15 Min', '30 Min', '1 Hour'];

export default function PostFoodScreen({ navigation }) {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('30 Min');

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowCustomLocation(loc === 'Other (custom)');
  };

  const handleNotify = () => {
    // Prototype: just go back to feed
    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TextInput
          style={styles.input}
          placeholder="Event Name"
          placeholderTextColor={colors.placeholder}
          value={eventName}
          onChangeText={setEventName}
        />

        <Text style={styles.label}>Location</Text>
        <View style={styles.locationList}>
          {LOCATIONS.map((loc) => (
            <TouchableOpacity
              key={loc}
              style={[
                styles.locationOption,
                location === loc && styles.locationOptionActive,
              ]}
              onPress={() => handleLocationSelect(loc)}
            >
              <Text
                style={[
                  styles.locationOptionText,
                  location === loc && styles.locationOptionTextActive,
                ]}
              >
                {loc}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {showCustomLocation && (
          <TextInput
            style={[styles.input, styles.customInput]}
            placeholder="Enter building or place"
            placeholderTextColor={colors.placeholder}
            value={customLocation}
            onChangeText={setCustomLocation}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Room Number (e.g. 204)"
          placeholderTextColor={colors.placeholder}
          value={roomNumber}
          onChangeText={setRoomNumber}
          keyboardType="default"
        />

        <TextInput
          style={[styles.input, styles.description]}
          placeholder="3 Cheese Pizzas, 1 Tray of Cookies, Water bottles."
          placeholderTextColor={colors.placeholder}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.photoBox}>
          <Text style={styles.photoIcon}>📷</Text>
          <Text style={styles.photoLabel}>Take Photo</Text>
        </TouchableOpacity>

        <Text style={styles.label}>How long is this available?</Text>
        <View style={styles.timerRow}>
          {TIMER_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.timerBtn,
                selectedTimer === opt && styles.timerBtnActive,
              ]}
              onPress={() => setSelectedTimer(opt)}
            >
              <Text
                style={[
                  styles.timerBtnText,
                  selectedTimer === opt && styles.timerBtnTextActive,
                ]}
              >
                {opt}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleNotify}>
          <Text style={styles.submitButtonText}>Notify Students</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  label: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 16,
    color: colors.secondary,
    backgroundColor: colors.white,
    marginBottom: 16,
  },
  customInput: { marginTop: 8 },
  description: {
    height: 100,
    paddingTop: 12,
    textAlignVertical: 'top',
  },
  photoBox: {
    height: 160,
    borderWidth: 2,
    borderColor: colors.border,
    borderRadius: 12,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  photoIcon: { fontSize: 40, marginBottom: 8 },
  photoLabel: { fontSize: 16, color: colors.placeholder },
  locationList: { marginBottom: 16 },
  locationOption: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    marginBottom: 8,
  },
  locationOptionActive: {
    borderColor: colors.primary,
    backgroundColor: 'rgba(206, 17, 38, 0.08)',
  },
  locationOptionText: { fontSize: 16, color: colors.secondary },
  locationOptionTextActive: { color: colors.primary, fontWeight: '600' },
  timerRow: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  timerBtn: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: colors.tagBg,
    minWidth: 90,
  },
  timerBtnActive: { backgroundColor: colors.primary },
  timerBtnText: { fontSize: 14, color: colors.secondary, textAlign: 'center' },
  timerBtnTextActive: { color: colors.white, fontWeight: '600' },
  submitButton: {
    height: 52,
    backgroundColor: colors.primary,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  submitButtonText: { color: colors.white, fontSize: 18, fontWeight: '700' },
});
