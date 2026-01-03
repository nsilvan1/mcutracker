'use client';

import { useEffect, useState } from 'react';
import OfflineIndicator, { UpdateAvailableToast } from './OfflineIndicator';
import { useServiceWorker } from '@/hooks/useServiceWorker';

export default function ClientProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  const { updateAvailable, update } = useServiceWorker();
  const [showUpdateToast, setShowUpdateToast] = useState(false);

  useEffect(() => {
    if (updateAvailable) {
      setShowUpdateToast(true);
    }
  }, [updateAvailable]);

  return (
    <>
      <OfflineIndicator />
      {showUpdateToast && (
        <UpdateAvailableToast
          onUpdate={() => {
            update();
            setShowUpdateToast(false);
          }}
          onDismiss={() => setShowUpdateToast(false)}
        />
      )}
      {children}
    </>
  );
}
