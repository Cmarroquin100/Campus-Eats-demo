import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors } from './theme';

import HomeFeedScreen from './Home Feed Screen';
import PostFoodScreen from './PostFoodScreen';
import { MOCK_FOOD_POSTS } from './MaryvilleData';

const Stack = createNativeStackNavigator();
const ADMIN_CREDENTIALS = {
  email: 'admin@live.maryville.edu',
  password: 'admin123',
};
const STUDENT_CREDENTIALS = {
  email: 'student@live.maryville.edu',
  password: 'student123',
};

function LoginScreen({ onLogin }) {
  const [mode, setMode] = useState('student');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = () => {
    const enteredEmail = email.trim().toLowerCase();
    const enteredPassword = password;
    const expected =
      mode === 'admin' ? ADMIN_CREDENTIALS : STUDENT_CREDENTIALS;

    const valid =
      enteredEmail === expected.email &&
      enteredPassword === expected.password;

    if (!valid) {
      setError(
        mode === 'admin'
          ? 'Invalid admin credentials.'
          : 'Invalid student credentials.'
      );
      return;
    }

    setError('');
    onLogin({ role: mode, email: expected.email });
  };

  return (
    <KeyboardAvoidingView
      style={styles.loginContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>Campus Eats</Text>
        <Text style={styles.loginSubtitle}>Sign in to continue</Text>

        <View style={styles.loginModeRow}>
          <TouchableOpacity
            style={[
              styles.loginModeButton,
              mode === 'student' && styles.loginModeButtonActive,
            ]}
            onPress={() => setMode('student')}
          >
            <Text
              style={[
                styles.loginModeText,
                mode === 'student' && styles.loginModeTextActive,
              ]}
            >
              Student
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.loginModeButton,
              mode === 'admin' && styles.loginModeButtonActive,
            ]}
            onPress={() => setMode('admin')}
          >
            <Text
              style={[
                styles.loginModeText,
                mode === 'admin' && styles.loginModeTextActive,
              ]}
            >
              Admin
            </Text>
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        {error ? <Text style={styles.loginError}>{error}</Text> : null}

        <TouchableOpacity style={styles.loginSubmit} onPress={handleSubmit}>
          <Text style={styles.loginSubmitText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.loginHint}>
          Admin: {ADMIN_CREDENTIALS.email} / {ADMIN_CREDENTIALS.password}
        </Text>
        <Text style={styles.loginHint}>
          Student demo: {STUDENT_CREDENTIALS.email} / {STUDENT_CREDENTIALS.password}
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

function HomeFeedWithMenu({ navigation, posts, onSelectPost, onOpenNotifications }) {
  const [menuVisible, setMenuVisible] = useState(false);
  return (
    <>
      <HomeFeedScreen
        posts={posts}
        onSelectPost={onSelectPost}
        onOpenNotifications={onOpenNotifications}
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

function PostDetailsScreen({ route }) {
  const { post } = route.params ?? {};

  if (!post) {
    return (
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsTitle}>Post unavailable</Text>
      </View>
    );
  }

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>{post.title}</Text>
      <Text style={styles.detailsLocation}>Location: {post.location}</Text>
      <Text style={styles.detailsTimer}>Ends in {post.timerMins} mins</Text>
      {post.tag ? <Text style={styles.detailsTag}>Tag: {post.tag}</Text> : null}
      {post.description ? (
        <Text style={styles.detailsDescription}>{post.description}</Text>
      ) : null}
    </View>
  );
}

function NotificationsScreen({ route }) {
  const { posts = [] } = route.params ?? {};
  const soonEnding = posts.filter((post) => post.timerMins <= 30).slice(0, 10);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View style={styles.detailsContainer}>
      <Text style={styles.detailsTitle}>Notifications</Text>
      <Text style={styles.noticeSectionLabel}>Notification Settings</Text>
      <View style={styles.noticeSettingsCard}>
        <View>
          <Text style={styles.noticeTitle}>Push notifications</Text>
          <Text style={styles.noticeBody}>
            {notificationsEnabled ? 'Enabled' : 'Disabled'}
          </Text>
        </View>
        <TouchableOpacity
          style={[
            styles.noticeToggleButton,
            notificationsEnabled && styles.noticeToggleButtonActive,
          ]}
          onPress={() => setNotificationsEnabled((prev) => !prev)}
        >
          <Text
            style={[
              styles.noticeToggleButtonText,
              notificationsEnabled && styles.noticeToggleButtonTextActive,
            ]}
          >
            {notificationsEnabled ? 'Disable' : 'Enable'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.noticeSectionLabel}>Recent Alerts</Text>
      {soonEnding.length === 0 ? (
        <View style={styles.noticeEmptyState}>
          <Text style={styles.detailsDescription}>No alerts right now.</Text>
        </View>
      ) : (
        soonEnding.map((post) => (
          <View key={post.id} style={styles.noticeHistoryCard}>
            <Text style={styles.noticeTitle}>{post.title}</Text>
            <Text style={styles.noticeBody}>
              {post.location} - Ends in {post.timerMins} mins
            </Text>
          </View>
        ))
      )}
    </View>
  );
}

export default function App() {
  const [posts, setPosts] = useState(MOCK_FOOD_POSTS);
  const [session, setSession] = useState(null);

  const handleAddPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

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
        <Stack.Screen name="HomeFeed">
          {(screenProps) => (
            <HomeFeedWithMenu
              {...screenProps}
              posts={posts}
              onSelectPost={(post) =>
                screenProps.navigation.navigate('PostDetails', { post })
              }
              onOpenNotifications={() =>
                screenProps.navigation.navigate('Notifications', { posts })
              }
            />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="PostFood"
          options={{
            headerShown: true,
            headerTitle: 'Post Leftovers',
            headerTitleStyle: { color: colors.secondary, fontWeight: '700' },
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
          }}
        >
          {(screenProps) => (
            <PostFoodScreen {...screenProps} onAddPost={handleAddPost} />
          )}
        </Stack.Screen>
        <Stack.Screen
          name="PostDetails"
          options={{
            headerShown: true,
            headerTitle: 'Food Post',
            headerTitleStyle: { color: colors.secondary, fontWeight: '700' },
            headerBackTitle: 'Back',
            headerTintColor: colors.primary,
          }}
          component={PostDetailsScreen}
        />
        <Stack.Screen
          name="Notifications"
          component={NotificationsScreen}
          options={{
            headerShown: true,
            headerTitle: 'Notifications',
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
  loginContainer: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  loginCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 18,
    backgroundColor: colors.cardBg,
  },
  loginTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 6,
    textAlign: 'center',
  },
  loginSubtitle: {
    fontSize: 14,
    color: colors.secondary,
    textAlign: 'center',
    marginBottom: 14,
  },
  loginModeRow: {
    flexDirection: 'row',
    marginBottom: 12,
    gap: 8,
  },
  loginModeButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  loginModeButtonActive: {
    borderColor: colors.primary,
    backgroundColor: '#FFF5F6',
  },
  loginModeText: {
    color: colors.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  loginModeTextActive: {
    color: colors.primary,
  },
  loginInput: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 46,
    marginBottom: 10,
    backgroundColor: colors.white,
    color: colors.secondary,
  },
  loginError: {
    color: colors.danger,
    fontSize: 13,
    marginBottom: 8,
  },
  loginSubmit: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  loginSubmitText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 16,
  },
  loginHint: {
    marginTop: 10,
    fontSize: 12,
    color: colors.placeholder,
    textAlign: 'center',
  },
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
  detailsContainer: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  detailsTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 12,
  },
  detailsLocation: {
    fontSize: 16,
    color: colors.secondary,
    marginBottom: 8,
  },
  detailsTimer: {
    fontSize: 16,
    color: colors.primary,
    marginBottom: 8,
  },
  detailsTag: {
    fontSize: 14,
    color: colors.secondary,
    marginBottom: 12,
  },
  detailsDescription: {
    fontSize: 15,
    color: colors.secondary,
    lineHeight: 22,
  },
  noticeCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.cardBg,
  },
  noticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.secondary,
    marginBottom: 4,
  },
  noticeBody: {
    fontSize: 14,
    color: colors.secondary,
  },
  noticeSectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.placeholder,
    marginBottom: 8,
    marginTop: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  noticeSettingsCard: {
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 12,
    padding: 12,
    marginBottom: 18,
    backgroundColor: '#FFF5F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noticeToggleButton: {
    backgroundColor: colors.white,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 18,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  noticeToggleButtonActive: {
    backgroundColor: colors.primary,
  },
  noticeToggleButtonText: {
    color: colors.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  noticeToggleButtonTextActive: {
    color: colors.white,
  },
  noticeHistoryCard: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    backgroundColor: colors.cardBg,
    borderLeftWidth: 5,
    borderLeftColor: colors.warning,
  },
  noticeEmptyState: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: colors.border,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.white,
  },
});
