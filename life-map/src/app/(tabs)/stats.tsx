import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';

import { Card, EmptyState, Screen, ScreenHeader, SectionTitle, Text } from '@/components/ui';
import { CATEGORIES } from '@/features/experiences/categories';
import { computeStats } from '@/features/experiences/stats';
import { useMyExperiences } from '@/features/experiences/store';
import { formatMonthYear, plural } from '@/lib/format';
import { useTheme } from '@/theme/ThemeProvider';

function StatTile({ label, value, icon }: { label: string; value: number; icon: React.ComponentProps<typeof Ionicons>['name'] }) {
  const { colors, spacing } = useTheme();
  return (
    <Card style={{ flex: 1, gap: spacing.xs }}>
      <Ionicons name={icon} size={18} color={colors.accent} />
      <Text variant="display" style={{ fontSize: 30, lineHeight: 36 }} accessibilityLabel={`${value} ${label}`}>
        {value}
      </Text>
      <Text variant="caption" tone="muted">
        {label}
      </Text>
    </Card>
  );
}

export default function StatsScreen() {
  const { colors, spacing, radius } = useTheme();
  const mine = useMyExperiences();
  const stats = useMemo(() => computeStats(mine), [mine]);
  const maxMonth = Math.max(1, ...stats.byMonth.map((m) => m.count));
  const maxCat = Math.max(1, ...stats.byCategory.map((c) => c.count));
  const current = stats.byMonth[stats.byMonth.length - 1]!;

  if (stats.total === 0) {
    return (
      <Screen withTabBar>
        <ScreenHeader overline="Ta vie en chiffres" title="Stats" />
        <EmptyState
          icon="stats-chart-outline"
          title="Pas encore de chiffres"
          message="Tes statistiques se construisent à partir de tes vraies expériences. Ajoute la première !"
          actionLabel="Ajouter une expérience"
          onAction={() => router.navigate('/add')}
        />
      </Screen>
    );
  }

  return (
    <Screen withTabBar>
      <ScreenHeader overline="Ta vie en chiffres" title="Stats" />

      {/* Monthly recap */}
      <Card style={{ backgroundColor: colors.accentSoft, borderColor: 'transparent', gap: spacing.xs }}>
        <Text variant="overline" tone="accent">
          Récap · {formatMonthYear(current.key)}
        </Text>
        <Text variant="title">
          {stats.currentMonth.count === 0
            ? 'Ce mois-ci est encore une page blanche.'
            : `${plural(stats.currentMonth.count, 'expérience', 'expériences')} dans ${plural(stats.currentMonth.places, 'lieu', 'lieux')}.`}
        </Text>
        {stats.currentMonth.topCategory ? (
          <Text tone="muted">
            Ton fil rouge du mois : {CATEGORIES[stats.currentMonth.topCategory].label.toLowerCase()}.
          </Text>
        ) : null}
      </Card>

      <View style={styles.row}>
        <StatTile label="expériences" value={stats.total} icon="sparkles-outline" />
        <StatTile label="lieux distincts" value={stats.distinctPlaces} icon="location-outline" />
      </View>
      <View style={styles.row}>
        <StatTile label="privées" value={stats.privateCount} icon="lock-closed-outline" />
        <StatTile label="partagées" value={stats.sharedCount} icon="people-outline" />
      </View>

      <SectionTitle>Évolution sur 6 mois</SectionTitle>
      <Card>
        <View style={styles.chart} accessibilityLabel={stats.byMonth.map((m) => `${m.label} : ${m.count}`).join(', ')}>
          {stats.byMonth.map((m) => (
            <View key={m.key} style={styles.barCol}>
              <Text variant="caption" tone={m.count ? 'default' : 'subtle'} style={{ fontWeight: '600' }}>
                {m.count}
              </Text>
              <View style={[styles.barTrack, { backgroundColor: colors.surfaceRaised, borderRadius: radius.sm }]}>
                <View
                  style={{
                    height: `${(m.count / maxMonth) * 100}%`,
                    backgroundColor: m.key === current.key ? colors.accent : `${colors.accent}88`,
                    borderRadius: radius.sm,
                  }}
                />
              </View>
              <Text variant="caption" tone="muted" style={{ fontSize: 11 }}>
                {m.label}
              </Text>
            </View>
          ))}
        </View>
      </Card>

      <SectionTitle>Par catégorie</SectionTitle>
      <Card style={{ gap: spacing.md }}>
        {stats.byCategory.map(({ category, count }) => {
          const meta = CATEGORIES[category];
          return (
            <View key={category} style={{ gap: 6 }}>
              <View style={styles.catRow}>
                <Ionicons name={meta.icon} size={15} color={meta.color} />
                <Text style={{ flex: 1 }}>{meta.label}</Text>
                <Text variant="bodyStrong">{count}</Text>
              </View>
              <View style={[styles.hTrack, { backgroundColor: colors.surfaceRaised, borderRadius: radius.pill }]}>
                <View style={{ width: `${(count / maxCat) * 100}%`, height: '100%', backgroundColor: meta.color, borderRadius: radius.pill }} />
              </View>
            </View>
          );
        })}
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 12 },
  chart: { flexDirection: 'row', alignItems: 'flex-end', gap: 10, height: 170 },
  barCol: { flex: 1, alignItems: 'center', gap: 6, height: '100%' },
  barTrack: { flex: 1, width: '100%', justifyContent: 'flex-end', overflow: 'hidden' },
  catRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  hTrack: { height: 8, overflow: 'hidden' },
});
