import { useEffect, useState } from 'react';

import { useData } from '@/features/experiences/store';
import { useSettings } from '@/features/settings/store';

/** True once persisted stores (settings + local data) have been read from device storage. */
export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(
    () => useSettings.persist.hasHydrated() && useData.persist.hasHydrated(),
  );
  useEffect(() => {
    const check = () => setHydrated(useSettings.persist.hasHydrated() && useData.persist.hasHydrated());
    const unsubs = [useSettings.persist.onFinishHydration(check), useData.persist.onFinishHydration(check)];
    check();
    return () => unsubs.forEach((u) => u());
  }, []);
  return hydrated;
}
