import { describe, expect, it, jest } from '@jest/globals';
import { fireEvent, render, screen, waitFor } from '@testing-library/react-native';

import { ExperienceForm } from '@/components/experience/ExperienceForm';
import type { ExperienceFormValues } from '@/features/experiences/schema';
import { ThemeProvider } from '@/theme/ThemeProvider';

async function setup() {
  const onSubmit = jest.fn<(values: ExperienceFormValues) => void>();
  await render(
    <ThemeProvider>
      <ExperienceForm submitLabel="Ajouter à ma carte" onSubmit={onSubmit} />
    </ThemeProvider>,
  );
  return { onSubmit };
}

describe('ExperienceForm', () => {
  it('shows validation errors and does not submit an empty form', async () => {
    const { onSubmit } = await setup();
    await fireEvent.press(screen.getByTestId('submit-experience'));
    expect(await screen.findByText('Donne un titre d’au moins 2 caractères.')).toBeTruthy();
    expect(screen.getByText('Indique un lieu.')).toBeTruthy();
    expect(screen.getByText('Choisis une catégorie.')).toBeTruthy();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a quick experience, private by default, dated today', async () => {
    const { onSubmit } = await setup();
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Café au soleil');
    await fireEvent.changeText(screen.getByTestId('place-input'), 'Place Flagey');
    await fireEvent.press(screen.getByTestId('category-discovery'));
    await fireEvent.press(screen.getByTestId('submit-experience'));

    await waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
    const values = onSubmit.mock.calls[0]![0];
    expect(values).toMatchObject({ title: 'Café au soleil', placeName: 'Place Flagey', category: 'discovery', visibility: 'private', media: [] });
    expect(values.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    // The form clears itself, ready for the next memory.
    await waitFor(() => expect(screen.getByTestId('title-input').props.value).toBe(''));
  });

  it('lets the user change visibility', async () => {
    const { onSubmit } = await setup();
    await fireEvent.changeText(screen.getByTestId('title-input'), 'Concert');
    await fireEvent.changeText(screen.getByTestId('place-input'), 'Ancienne Belgique');
    await fireEvent.press(screen.getByTestId('category-culture'));
    await fireEvent.press(screen.getByTestId('visibility-friends'));
    await fireEvent.press(screen.getByTestId('submit-experience'));
    await waitFor(() => expect(onSubmit).toHaveBeenCalled());
    expect(onSubmit.mock.calls[0]![0].visibility).toBe('friends');
    await waitFor(() => expect(screen.getByTestId('title-input').props.value).toBe(''));
  });
});
