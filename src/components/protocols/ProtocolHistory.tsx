
import React from 'react';
import { ProtocolHistoryItem } from '@/hooks/useProtocol';
import { ProtocolNodeData } from '@/types/protocol';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { format } from 'date-fns';
import { History } from 'lucide-react';

interface ProtocolHistoryProps {
  history: ProtocolHistoryItem[];
  algorithm: ProtocolNodeData[];
}

const ProtocolHistory: React.FC<ProtocolHistoryProps> = ({ history, algorithm }) => {
  const getNodeTitle = (nodeId: string) => {
    return algorithm.find(node => node.id === nodeId)?.title || 'Unknown Step';
  };

  return (
    <Card className="mt-8 w-full max-w-lg mx-auto animate-in fade-in duration-500">
      <CardHeader>
        <CardTitle className="flex items-center">
          <History className="mr-2 h-5 w-5" />
          Session History
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-48">
          <ul className="space-y-2 pr-4">
            {history.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-sm">
                <span className="truncate pr-2">{getNodeTitle(item.nodeId)}</span>
                <span className="text-muted-foreground font-mono text-xs flex-shrink-0">
                  {format(new Date(item.timestamp), 'HH:mm:ss')}
                </span>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

export default ProtocolHistory;
