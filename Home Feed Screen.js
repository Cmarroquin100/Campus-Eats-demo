import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  FlatList,
} from 'react-native';
import { colors } from '../theme';
import { MOCK_FOOD_POSTS } from '../data/mockData';

const FILTERS = ['All', 'Vegetarian', 'DUC', 'Gander Hall'];

function FoodCard({ item }) {
  const timerColor =
    item.timerMins <= 10 ? colors.warning : colors.success;
  return (
    <View style={styles.card}>
      <View style={styles.cardImage}>
        <Text style={styles.cardImagePlaceholder}>🍕</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{item.title}</Text>
        <View style={styles.locationRow}>
          <Text style={styles.pin}>📍</Text>
          <Text style={styles.location}>{item.location}</Text>
        </View>
        <View style={styles.row}>
          <Text style={[styles.timer, { color: timerColor }]}>
            Ends in {item.timerMins} mins
          </Text>
          {item.lowQuantity && (
            <Text style={styles.lowQty}>Low Quantity</Text>
          )}
        </View>
        {item.tag && (
          <View style={styles.tag}>
            <Text style={styles.tagText}>{item.tag}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

export default function HomeFeedScreen({ navigation }) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPosts =
    activeFilter === 'All'
      ? MOCK_FOOD_POSTS
      : MOCK_FOOD_POSTS.filter(
          (p) =>
            p.tag === activeFilter ||
            p.building.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.menuBtn}
          onPress={() => navigation.openDrawer?.()}
        >
          <Text style={styles.menuIcon}>☰</Text>
        </TouchableOpacity>
        <Text style={styles.logo}>Campus Eats</Text>
        <TouchableOpacity style={styles.bellBtn}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filtersScroll}
        contentContainerStyle={styles.filtersContent}
      >
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[
              styles.filterPill,
              activeFilter === f && styles.filterPillActive,
            ]}
            onPress={() => setActiveFilter(f)}
          >
            <Text
              style={[
                styles.filterText,
                activeFilter === f && styles.filterTextActive,
              ]}
            >
              {f}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <FoodCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 48,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuBtn: { padding: 8 },
  menuIcon: { fontSize: 24 },
  logo: { fontSize: 18, fontWeight: '700', color: colors.primary },
  bellBtn: { padding: 8 },
  bellIcon: { fontSize: 22 },
  filtersScroll: { maxHeight: 44 },
  filtersContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 8,
    flexDirection: 'row',
  },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: colors.tagBg,
    marginRight: 8,
  },
  filterPillActive: { backgroundColor: colors.primary },
  filterText: { fontSize: 14, color: colors.secondary },
  filterTextActive: { color: colors.white, fontWeight: '600' },
  listContent: { padding: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.cardBg,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  cardImage: {
    height: 160,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardImagePlaceholder: { fontSize: 48 },
  cardBody: { padding: 16 },
  cardTitle: { fontSize: 18, fontWeight: '700', color: colors.secondary, marginBottom: 8 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  pin: { fontSize: 14, marginRight: 6 },
  location: { fontSize: 14, color: colors.secondary },
  row: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  timer: { fontSize: 14, fontWeight: '600', marginRight: 12 },
  lowQty: { fontSize: 12, color: colors.danger },
  tag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tagBg,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: { fontSize: 12, color: colors.secondary },
});
