
import { useEffect, useRef } from 'react';
import { useProtocol } from '@/hooks/useProtocol';
import { ProtocolNodeData } from '@/types/protocol';
import ProtocolNode from './ProtocolNode';
import { Button } from '@/components/ui/button';
import ProtocolHistory from './ProtocolHistory';
import TimerStatus from './TimerStatus';
import { useWakeLock } from '@/hooks/useWakeLock';
import { useToast } from '@/hooks/use-toast';
import { Smartphone } from 'lucide-react';

interface InteractiveProtocolProps {
  algorithm: ProtocolNodeData[];
}

const InteractiveProtocol: React.FC<InteractiveProtocolProps> = ({ algorithm }) => {
  const { isLocked } = useWakeLock();
  const { toast } = useToast();
  const toastShownRef = useRef(false);

  useEffect(() => {
    if (isLocked && !toastShownRef.current) {
      toast({
        title: (
          <div className="flex items-center">
            <Smartphone className="h-5 w-5 mr-2 text-blue-500" />
            <span className="font-semibold">Screen Kept Awake</span>
          </div>
        ),
        description: "Your screen will not sleep during this protocol.",
      });
      toastShownRef.current = true;
    }
  }, [isLocked, toast]);

  const { 
    currentNode, 
    advance, 
    reset, 
    history, 
    startTimer, 
    getTimerState,
    activeTimers
  } = useProtocol(algorithm);

  if (!currentNode) {
    return <div>Error: Protocol node not found.</div>;
  }

  const handleTimerClick = (nodeId: string) => {
    // Navigate to the timer node when clicked
    const timerNode = algorithm.find(node => node.id === nodeId);
    if (timerNode) {
      advance(nodeId);
    }
  };

  const currentTimerState = getTimerState(currentNode.id);

  return (
    <div>
      <TimerStatus 
        activeTimers={activeTimers}
        algorithm={algorithm}
        onTimerClick={handleTimerClick}
      />
      
      <ProtocolNode 
        node={currentNode} 
        onAdvance={advance}
        onStartTimer={startTimer}
        timerState={currentTimerState}
      />
      
      {history && history.length > 1 && (
        <ProtocolHistory history={history} algorithm={algorithm} />
      )}

      {currentNode.type !== 'start' && (
         <div className="text-center mt-8">
            <Button variant="outline" size="sm" onClick={reset}>
                Restart Protocol
            </Button>
         </div>
      )}
    </div>
  );
};

export default InteractiveProtocol;
