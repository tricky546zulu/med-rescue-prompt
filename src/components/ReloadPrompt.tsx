
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useRegisterSW } from 'virtual:pwa-register/react';
import { toast } from 'sonner';
import { Rocket } from 'lucide-react';

function ReloadPrompt() {
  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      console.log(`Service Worker at: ${swUrl}`);
    },
    onRegisterError(error) {
      console.log('SW registration error:', error);
    },
  });

  useEffect(() => {
    if (offlineReady) {
      toast.success('App is ready to work offline!');
      setOfflineReady(false);
    }
  }, [offlineReady, setOfflineReady]);

  useEffect(() => {
    if (needRefresh) {
      const toastId = toast.info('New version available!', {
        action: (
          <Button
            onClick={() => {
              updateServiceWorker(true);
              toast.dismiss(toastId);
            }}
          >
            <Rocket className="mr-2 h-4 w-4" /> Reload
          </Button>
        ),
        duration: Infinity,
        dismissible: false,
      });

      return () => {
        toast.dismiss(toastId);
      };
    }
  }, [needRefresh, setNeedRefresh, updateServiceWorker]);

  return null;
}

export default ReloadPrompt;
