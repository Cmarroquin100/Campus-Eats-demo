import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
  Modal,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from './theme';
import { LOCATIONS } from './MaryvilleData';

const TIMER_OPTIONS = ['15 Min', '30 Min', '1 Hour'];
const STOCK_PHOTO_OPTIONS = [
  'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
];

export default function PostFoodScreen({ navigation, onAddPost }) {
  const [eventName, setEventName] = useState('');
  const [location, setLocation] = useState('');
  const [showCustomLocation, setShowCustomLocation] = useState(false);
  const [customLocation, setCustomLocation] = useState('');
  const [roomNumber, setRoomNumber] = useState('');
  const [description, setDescription] = useState('');
  const [selectedTimer, setSelectedTimer] = useState('30 Min');
  const [selectedPhotoUri, setSelectedPhotoUri] = useState(null);
  const [showStockPicker, setShowStockPicker] = useState(false);

  const handleLocationSelect = (loc) => {
    setLocation(loc);
    setShowCustomLocation(loc === 'Other (custom)');
  };

  const handleNotify = () => {
    const title = eventName.trim();
    const baseLocation = showCustomLocation ? customLocation.trim() : location;
    const room = roomNumber.trim();

    if (!title || !baseLocation) {
      Alert.alert('Missing info', 'Please add an event name and location.');
      return;
    }

    const timerMins =
      selectedTimer === '15 Min' ? 15 : selectedTimer === '30 Min' ? 30 : 60;
    const formattedLocation = room ? `${baseLocation}, Room ${room}` : baseLocation;

    onAddPost?.({
      id: `${Date.now()}`,
      title,
      location: formattedLocation,
      building: baseLocation,
      timerMins,
      tag: title.toLowerCase().includes('vegetarian') ? 'Vegetarian' : null,
      lowQuantity: false,
      description: description.trim(),
      imageUri: selectedPhotoUri,
      imagePlaceholder: !selectedPhotoUri,
    });

    navigation.goBack();
  };

  const launchCamera = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Camera access needed', 'Please allow camera access to take photos.');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  const launchLibrary = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Library access needed', 'Please allow photo library access.');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled) {
      setSelectedPhotoUri(result.assets[0]?.uri ?? null);
    }
  };

  const openPhotoOptions = () => {
    Alert.alert('Add Photo', 'Choose a photo source', [
      { text: 'Take Photo', onPress: launchCamera },
      { text: 'Photo Library', onPress: launchLibrary },
      { text: 'Stock Photos', onPress: () => setShowStockPicker(true) },
      { text: 'Cancel', style: 'cancel' },
    ]);
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

        <TouchableOpacity style={styles.photoBox} onPress={openPhotoOptions}>
          {selectedPhotoUri ? (
            <Image source={{ uri: selectedPhotoUri }} style={styles.photoPreview} />
          ) : (
            <>
              <Text style={styles.photoIcon}>📷</Text>
              <Text style={styles.photoLabel}>Tap to add a photo</Text>
            </>
          )}
        </TouchableOpacity>
        <View style={styles.photoActionsRow}>
          <TouchableOpacity style={styles.photoActionButton} onPress={launchCamera}>
            <Text style={styles.photoActionText}>Take Photo</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.photoActionButton} onPress={launchLibrary}>
            <Text style={styles.photoActionText}>Photo Library</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.photoActionButton}
            onPress={() => setShowStockPicker(true)}
          >
            <Text style={styles.photoActionText}>Stock Photos</Text>
          </TouchableOpacity>
        </View>

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
      <Modal visible={showStockPicker} transparent animationType="fade">
        <View style={styles.stockOverlay}>
          <View style={styles.stockModalCard}>
            <Text style={styles.stockModalTitle}>Choose a Stock Photo</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {STOCK_PHOTO_OPTIONS.map((photoUri) => (
                <TouchableOpacity
                  key={photoUri}
                  onPress={() => {
                    setSelectedPhotoUri(photoUri);
                    setShowStockPicker(false);
                  }}
                >
                  <Image source={{ uri: photoUri }} style={styles.stockThumb} />
                </TouchableOpacity>
              ))}
            </ScrollView>
            <TouchableOpacity
              style={styles.stockCloseButton}
              onPress={() => setShowStockPicker(false)}
            >
              <Text style={styles.stockCloseText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  photoPreview: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  photoIcon: { fontSize: 40, marginBottom: 8 },
  photoLabel: { fontSize: 16, color: colors.placeholder },
  photoActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginTop: -10,
    marginBottom: 24,
  },
  photoActionButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  photoActionText: {
    fontSize: 12,
    color: colors.secondary,
    fontWeight: '600',
  },
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
  stockOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  stockModalCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 14,
  },
  stockModalTitle: {
    fontSize: 16,
    color: colors.secondary,
    fontWeight: '700',
    marginBottom: 10,
  },
  stockThumb: {
    width: 95,
    height: 95,
    borderRadius: 10,
    marginRight: 10,
  },
  stockCloseButton: {
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  stockCloseText: {
    color: colors.secondary,
    fontWeight: '600',
  },
});
