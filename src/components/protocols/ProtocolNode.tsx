
import React, { useEffect } from 'react';
import { ProtocolNodeData } from '@/types/protocol';
import { TimerState } from '@/hooks/useProtocol';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProtocolNodeProps {
  node: ProtocolNodeData;
  onAdvance: (nextNodeId?: string) => void;
  onStartTimer?: (nodeId: string, duration: number) => void;
  timerState?: TimerState;
}

const ProtocolNode: React.FC<ProtocolNodeProps> = ({ 
  node, 
  onAdvance, 
  onStartTimer,
  timerState 
}) => {
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderNodeContent = () => {
    switch (node.type) {
      case 'start':
      case 'action':
      case 'medication':
        return (
          node.next && (
            <CardFooter>
              <Button onClick={() => onAdvance(node.next)}>Continue</Button>
            </CardFooter>
          )
        );
      case 'decision':
        return (
          <CardFooter className="flex-col items-start gap-2">
            {node.options?.map(option => (
              <Button key={option.next} onClick={() => onAdvance(option.next)}>
                {option.text}
              </Button>
            ))}
          </CardFooter>
        );
      case 'timer':
        const timeLeft = timerState?.timeLeft ?? node.duration ?? 0;
        const isRunning = timerState?.isRunning ?? false;
        const duration = node.duration ?? 0;
        
        return (
          <CardFooter className="flex-col items-stretch gap-4">
             <div className="text-center">
                <p className={`text-5xl font-bold font-mono tabular-nums ${
                  timeLeft <= 30 && timeLeft > 0 ? 'text-yellow-600' : 
                  timeLeft === 0 ? 'text-red-600' : 'text-foreground'
                }`}>
                  {formatTime(timeLeft)}
                </p>
             </div>
             {duration > 0 && (
               <Progress 
                 value={((duration - timeLeft) / duration) * 100} 
                 className={`w-full ${
                   timeLeft <= 30 && timeLeft > 0 ? '[&>div]:bg-yellow-500' :
                   timeLeft === 0 ? '[&>div]:bg-red-500' : ''
                 }`}
               />
             )}
            {!isRunning ? (
                <Button 
                  onClick={() => onStartTimer?.(node.id, duration)}
                  disabled={!onStartTimer || duration === 0}
                >
                  <Timer className="mr-2 h-4 w-4" /> Start Timer
                </Button>
            ) : (
                <Button 
                  onClick={() => onAdvance(node.next)} 
                  variant={timeLeft === 0 ? "default" : "secondary"}
                  disabled={timeLeft > 0}
                >
                    {timeLeft > 0 ? 'Cycle in Progress...' : 'Continue'}
                </Button>
            )}
          </CardFooter>
        );
      case 'end':
        return <CardContent><p className="text-muted-foreground">{node.content}</p></CardContent>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {node.title}
          {timerState?.isRunning && node.type !== 'timer' && (
            <div className="flex items-center text-sm text-blue-600">
              <Timer className="h-4 w-4 mr-1" />
              {formatTime(timerState.timeLeft)}
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg">{node.content}</p>
        {node.clinicalNotes && node.clinicalNotes.length > 0 && (
          <Accordion type="single" collapsible className="w-full mt-4">
            <AccordionItem value="item-1">
              <AccordionTrigger>Clinical Considerations</AccordionTrigger>
              <AccordionContent>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  {node.clinicalNotes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </CardContent>
      {renderNodeContent()}
    </Card>
  );
};

export default ProtocolNode;
