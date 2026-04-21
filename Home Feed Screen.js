import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
} from 'react-native';
import { colors } from './theme';

const FILTERS = ['All', 'Vegetarian', 'DUC', 'Gander Hall'];
const FOOD_PHOTOS = {
  pizza:
    'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=1200&q=80',
  pastry:
    'https://images.unsplash.com/photo-1483695028939-5bb13f8648b0?auto=format&fit=crop&w=1200&q=80',
  snack:
    'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
  vegetarian:
    'https://images.unsplash.com/photo-1543353071-087092ec393a?auto=format&fit=crop&w=1200&q=80',
  generic:
    'https://images.unsplash.com/photo-1498837167922-ddd27525d352?auto=format&fit=crop&w=1200&q=80',
};

function getPhotoForPost(item) {
  if (item.imageUri) return item.imageUri;
  const text = `${item.title ?? ''} ${item.description ?? ''} ${item.tag ?? ''}`.toLowerCase();
  if (text.includes('pizza')) return FOOD_PHOTOS.pizza;
  if (text.includes('pastr') || text.includes('bagel') || text.includes('cookie')) {
    return FOOD_PHOTOS.pastry;
  }
  if (text.includes('vegetarian') || text.includes('salad')) return FOOD_PHOTOS.vegetarian;
  if (text.includes('snack') || text.includes('chips') || text.includes('cracker')) {
    return FOOD_PHOTOS.snack;
  }
  return FOOD_PHOTOS.generic;
}

function FoodCard({ item, onPress }) {
  const timerColor =
    item.timerMins <= 10 ? colors.warning : colors.success;
  const stockPhoto = getPhotoForPost(item);
  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.9} onPress={onPress}>
      <View style={styles.cardImage}>
        <Image source={{ uri: stockPhoto }} style={styles.cardPhoto} />
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
    </TouchableOpacity>
  );
}

export default function HomeFeedScreen({
  navigation,
  posts = [],
  onSelectPost,
  onOpenNotifications,
}) {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredPosts =
    activeFilter === 'All'
      ? posts
      : posts.filter(
          (p) =>
            p.tag === activeFilter ||
            p.building?.toLowerCase().includes(activeFilter.toLowerCase())
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
        <TouchableOpacity style={styles.bellBtn} onPress={() => onOpenNotifications?.()}>
          <Text style={styles.bellIcon}>🔔</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.filtersRow}>
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
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <FoodCard item={item} onPress={() => onSelectPost?.(item)} />
        )}
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
  filtersRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  filterPill: {
    paddingHorizontal: 12,
    minHeight: 36,
    justifyContent: 'center',
    borderRadius: 20,
    backgroundColor: colors.tagBg,
    marginRight: 6,
  },
  filterPillActive: { backgroundColor: colors.primary },
  filterText: { fontSize: 14, lineHeight: 18, color: colors.secondary, fontWeight: '600' },
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
  cardPhoto: {
    width: '100%',
    height: '100%',
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
