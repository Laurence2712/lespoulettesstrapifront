import { Ionicons } from '@expo/vector-icons';
import type { ComponentProps } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from 'expo-router/js-tabs';

import { Text } from '@/components/ui';
import { haptic } from '@/lib/haptics';
import { useTheme } from '@/theme/ThemeProvider';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: Record<string, { label: string; icon: IconName; iconActive: IconName }> = {
  index: { label: 'Explore', icon: 'map-outline', iconActive: 'map' },
  feed: { label: 'Feed', icon: 'albums-outline', iconActive: 'albums' },
  add: { label: 'Ajouter', icon: 'add', iconActive: 'add' },
  stats: { label: 'Stats', icon: 'stats-chart-outline', iconActive: 'stats-chart' },
  profile: { label: 'Profil', icon: 'person-circle-outline', iconActive: 'person-circle' },
};

export function TabBar({ state, navigation }: BottomTabBarProps) {
  const { colors, radius } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[styles.wrap, { paddingBottom: Math.max(insets.bottom, 12) }]}>
      <View
        accessibilityRole="tablist"
        style={[
          styles.bar,
          { backgroundColor: colors.tabBar, borderColor: colors.border, borderRadius: radius.xl },
        ]}
      >
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          if (!meta) return null;
          const focused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!focused && !event.defaultPrevented) {
              if (route.name === 'add') haptic.impact();
              else haptic.tap();
              navigation.navigate(route.name);
            }
          };

          if (route.name === 'add') {
            return (
              <Pressable
                key={route.key}
                accessibilityRole="tab"
                accessibilityLabel="Ajouter une expérience"
                accessibilityState={{ selected: focused }}
                onPress={onPress}
                style={({ pressed }) => [styles.addSlot, { transform: [{ scale: pressed ? 0.94 : 1 }] }]}
              >
                <View style={[styles.addButton, { backgroundColor: colors.accent, shadowColor: colors.accent }]}>
                  <Ionicons name="add" size={30} color={colors.accentText} />
                </View>
              </Pressable>
            );
          }

          const tint = focused ? colors.accent : colors.textSubtle;
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={meta.label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              style={styles.item}
            >
              <Ionicons name={focused ? meta.iconActive : meta.icon} size={23} color={tint} />
              <Text variant="caption" style={{ color: tint, fontSize: 11, fontWeight: focused ? '700' : '500' }}>
                {meta.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { position: 'absolute', left: 0, right: 0, bottom: 0, paddingHorizontal: 14 },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 68,
    borderWidth: StyleSheet.hairlineWidth,
    paddingHorizontal: 6,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 12,
  },
  item: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3, height: '100%' },
  addSlot: { flex: 1, alignItems: 'center', justifyContent: 'center', height: '100%' },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -26,
    shadowOpacity: 0.45,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 10,
  },
});
