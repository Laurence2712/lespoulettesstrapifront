import { router } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { ExperienceForm } from '@/components/experience/ExperienceForm';
import { Screen, ScreenHeader, Text, toast } from '@/components/ui';
import { useMapFocus } from '@/features/experiences/mapFocus';
import { useData } from '@/features/experiences/store';
import { haptic } from '@/lib/haptics';

export default function AddScreen() {
  const addExperience = useData((s) => s.addExperience);
  const focusOnMap = useMapFocus((s) => s.focus);

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen withTabBar>
        <ScreenHeader overline="Nouvelle expérience" title="Qu’as-tu vécu ?" />
        <Text tone="muted">Quelques secondes suffisent. Tout est privé par défaut.</Text>
        <ExperienceForm
          submitLabel="Ajouter à ma carte"
          onSubmit={(values) => {
            const created = addExperience(values);
            haptic.success();
            toast('Ajouté à ta carte ✦', 'success');
            if (created.coordinates) {
              focusOnMap(created.id);
              router.navigate('/(tabs)');
            } else {
              router.push(`/experience/${created.id}`);
            }
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
