import { router, useLocalSearchParams } from 'expo-router';
import { KeyboardAvoidingView, Platform } from 'react-native';

import { ExperienceForm } from '@/components/experience/ExperienceForm';
import { EmptyState, Screen, toast } from '@/components/ui';
import { useData, useExperience } from '@/features/experiences/store';
import { haptic } from '@/lib/haptics';

export default function EditExperienceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const experience = useExperience(id);
  const meId = useData((s) => s.meId);
  const update = useData((s) => s.updateExperience);

  if (!experience || experience.ownerId !== meId) {
    return (
      <Screen edges="none">
        <EmptyState icon="lock-closed-outline" title="Modification impossible" message="Seul l’auteur d’une expérience peut la modifier." />
      </Screen>
    );
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <Screen edges="none">
        <ExperienceForm
          initial={experience}
          submitLabel="Enregistrer"
          onSubmit={(values) => {
            update(experience.id, values);
            haptic.success();
            toast('Modifications enregistrées.', 'success');
            router.back();
          }}
        />
      </Screen>
    </KeyboardAvoidingView>
  );
}
