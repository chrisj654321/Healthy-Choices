import React, { useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../constants/colors';
import { Font } from '../constants/typography';
import { PRODUCT_DB } from '../data/products';
import { productsForCategory } from '../data/healthyCategories';
import { scoreProduct, scoreToColor } from '../utils/scorer';

export default function HealthyCategoryScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { category } = route?.params ?? {};

  const items = useMemo(
    () => (category ? productsForCategory(category, PRODUCT_DB, scoreProduct) : []),
    [category]
  );

  if (!category) return null;

  return (
    <View style={s.container}>
      <View style={[s.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={Colors.primary} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>{category.label}</Text>
        <View style={s.back} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <Text style={s.intro}>Ranked by our health score — cleanest options first.</Text>
        {items.map(({ product, result }, i) => {
          const color = result.insufficientData ? '#9BB5AE' : scoreToColor(result.score);
          return (
            <TouchableOpacity
              key={product.barcode ?? i}
              style={s.row}
              activeOpacity={0.8}
              onPress={() => navigation.navigate('ProductScore', { product })}
            >
              {product.image ? (
                <Image source={{ uri: product.image }} style={s.thumb} />
              ) : (
                <View style={s.thumbPlaceholder}>
                  <Image source={require('../../assets/icon.png')} style={s.thumbLogo} resizeMode="contain" />
                </View>
              )}
              <View style={s.info}>
                <Text style={s.name} numberOfLines={2}>{product.name}</Text>
                <Text style={s.brand}>{product.brand}</Text>
              </View>
              <View style={[s.score, { borderColor: color }]}>
                <Text style={[s.scoreNum, { color }]}>
                  {result.insufficientData ? '?' : result.score}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
        {items.length === 0 && (
          <Text style={s.empty}>No products in this category yet.</Text>
        )}
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingBottom: 10,
  },
  back: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: Font.sizes.lg, fontWeight: Font.weights.heavy, color: Colors.textPrimary },
  intro: { fontSize: Font.sizes.sm, color: Colors.textSecondary, marginBottom: 12 },

  row: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: 12, padding: 12, marginBottom: 10,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1,
  },
  thumb: { width: 52, height: 52, borderRadius: 8, marginRight: 12, resizeMode: 'contain' },
  thumbPlaceholder: {
    width: 52, height: 52, borderRadius: 8, marginRight: 12, backgroundColor: '#D5EAE3',
    alignItems: 'center', justifyContent: 'center',
  },
  thumbLogo: { width: 34, height: 34, opacity: 0.85 },
  info: { flex: 1 },
  name: { fontSize: Font.sizes.sm, fontWeight: Font.weights.semibold, color: Colors.textPrimary },
  brand: { fontSize: Font.sizes.xs, color: Colors.textMuted, marginTop: 2 },
  score: {
    minWidth: 44, height: 44, borderRadius: 22, borderWidth: 2,
    alignItems: 'center', justifyContent: 'center', marginLeft: 8, paddingHorizontal: 6,
  },
  scoreNum: { fontSize: Font.sizes.md, fontWeight: Font.weights.bold },
  empty: { fontSize: Font.sizes.sm, color: Colors.textMuted, textAlign: 'center', marginTop: 40 },
});
