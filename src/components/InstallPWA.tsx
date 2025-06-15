
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { toast } from 'sonner';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) {
      return;
    }
    await installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    if (outcome === 'accepted') {
      toast.success('App installed successfully!');
    } else {
      toast.info('Installation cancelled.');
    }
    setInstallPrompt(null);
  };

  if (!installPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Button onClick={handleInstallClick} size="lg" className="shadow-lg">
        <Download className="mr-2 h-5 w-5" />
        Install App
      </Button>
    </div>
  );
};

export default InstallPWA;
