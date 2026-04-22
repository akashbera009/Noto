import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { Colors } from '../../utils/colors';
import { FontFamily, FontSize, FontWeight } from '../../utils/fonts';
import { Dimensions_ } from '../../utils/dimensions';

export interface FilterOption<T extends string = string> {
  label: string;
  value: T;
  count?: number;
}

interface Props<T extends string> {
  options: FilterOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
}

function CustomFilterList<T extends string>({
  options,
  selected,
  onSelect,
}: Props<T>) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {options.map(opt => {
        const isActive = opt.value === selected;
        return (
          <TouchableOpacity
            key={opt.value}
            style={[styles.chip, isActive && styles.chipActive]}
            onPress={() => onSelect(opt.value)}
            activeOpacity={0.75}
          >
            <Text style={[styles.chipLabel, isActive && styles.chipLabelActive]}>
              {opt.label}
            </Text>
            {opt.count !== undefined && (
              <View style={[styles.badge, isActive && styles.badgeActive]}>
                <Text style={[styles.badgeText, isActive && styles.badgeTextActive]}>
                  {opt.count}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Dimensions_.spacing.base,
    paddingVertical: Dimensions_.spacing.sm,
    gap: Dimensions_.spacing.sm,
    flexDirection: 'row',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Dimensions_.spacing.xs,
    paddingHorizontal: Dimensions_.spacing.md,
    paddingVertical: Dimensions_.spacing.sm,
    borderRadius: Dimensions_.radius.full,
    backgroundColor: Colors.bg.elevated,
    borderWidth: 1,
    borderColor: Colors.border.default,
  },
  chipActive: {
    backgroundColor: Colors.accent.muted,
    borderColor: Colors.border.accent,
  },
  chipLabel: {
    fontSize: FontSize.sm,
    fontFamily: FontFamily.medium,
    color: Colors.text.secondary,
  },
  chipLabelActive: {
    color: Colors.accent.primary,
    fontFamily: FontFamily.semiBold,
    fontWeight: FontWeight.semiBold,
  },
  badge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.bg.card,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeActive: {
    backgroundColor: Colors.accent.primary,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: FontFamily.medium,
    color: Colors.text.muted,
  },
  badgeTextActive: {
    color: Colors.text.inverse,
  },
});

export default CustomFilterList;
