import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { TouchableOpacity, Text, View, StyleSheet, Modal } from 'react-native';
import { colors } from './theme';

import HomeFeedScreen from './screens/HomeFeedScreen';
import PostFoodScreen from './screens/PostFoodScreen';

const Stack = createNativeStackNavigator();

function HomeFeedWithMenu({ navigation }) {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <HomeFeedScreen
        navigation={{
          ...navigation,
          openDrawer: () => setMenuVisible(true),
        }}
      />
      <Modal
        visible={menuVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          style={styles.menuOverlay}
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View style={styles.menuCard}>
            <Text style={styles.menuTitle}>Menu</Text>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => {
                setMenuVisible(false);
                navigation.navigate('PostFood');
              }}
            >
              <Text style={styles.menuItemText}>Post Leftovers</Text>
              <Text style={styles.menuItemHint}>Add available free food</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.menuItem}
              onPress={() => setMenuVisible(false)}
            >
              <Text style={styles.menuItemText}>Close</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator
        initialRouteName="HomeFeed"
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: colors.white },
        }}
      >
        <Stack.Screen name="HomeFeed" component={HomeFeedWithMenu} />
        <Stack.Screen
          name="PostFood"
          component={PostFoodScreen}
          options={{
            headerShown: true,
            headerTitle: 'Post Leftovers',
            headerTitleStyle: { color: colors.secondary, fontWeight: '700' },
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  menuOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-start',
    paddingTop: 100,
    paddingHorizontal: 24,
  },
  menuCard: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  menuItemText: { fontSize: 16, color: colors.primary, fontWeight: '600' },
  menuItemHint: { fontSize: 12, color: colors.placeholder, marginTop: 2 },
});
