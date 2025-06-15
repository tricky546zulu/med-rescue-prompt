
import React, { useState, useEffect } from 'react';
import { ProtocolNodeData } from '@/types/protocol';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

interface ProtocolNodeProps {
  node: ProtocolNodeData;
  onAdvance: (nextNodeId?: string) => void;
}

const ProtocolNode: React.FC<ProtocolNodeProps> = ({ node, onAdvance }) => {
  const [timeLeft, setTimeLeft] = useState(node.duration || 0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setTimeLeft(node.duration || 0);
    setIsRunning(false);
  }, [node]);

  useEffect(() => {
    if (!isRunning || node.type !== 'timer' || !node.duration) return;

    if (timeLeft <= 0) {
      onAdvance(node.next);
      return;
    }

    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [isRunning, timeLeft, node, onAdvance]);

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
        return (
          <CardFooter className="flex-col items-stretch gap-4">
             <div className="text-center">
                <p className="text-5xl font-bold font-mono tabular-nums">{formatTime(timeLeft)}</p>
             </div>
             {node.duration && timeLeft > 0 && <Progress value={((node.duration - timeLeft) / node.duration) * 100} className="w-full" />}
            {!isRunning ? (
                <Button onClick={() => setIsRunning(true)}><Timer className="mr-2 h-4 w-4" /> Start Timer</Button>
            ) : (
                <Button onClick={() => onAdvance(node.next)} variant="secondary" disabled={timeLeft > 0}>
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
        <CardTitle>{node.title}</CardTitle>
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
