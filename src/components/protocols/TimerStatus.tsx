
import React from 'react';
import { TimerState } from '@/hooks/useProtocol';
import { ProtocolNodeData } from '@/types/protocol';
import { Card, CardContent } from '@/components/ui/card';
import { Timer, Clock } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface TimerStatusProps {
  activeTimers: TimerState[];
  algorithm: ProtocolNodeData[];
  onTimerClick?: (nodeId: string) => void;
}

const TimerStatus: React.FC<TimerStatusProps> = ({ activeTimers, algorithm, onTimerClick }) => {
  if (activeTimers.length === 0) return null;

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getNodeTitle = (nodeId: string) => {
    return algorithm.find(node => node.id === nodeId)?.title || 'Unknown Timer';
  };

  return (
    <Card className="mb-4 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center mb-3">
          <Clock className="h-4 w-4 text-blue-600 mr-2" />
          <span className="text-sm font-medium text-blue-800">
            Active Timers ({activeTimers.length})
          </span>
        </div>
        <div className="space-y-3">
          {activeTimers.map((timer) => {
            const progress = ((timer.duration - timer.timeLeft) / timer.duration) * 100;
            const isUrgent = timer.timeLeft <= 30 && timer.timeLeft > 0;
            const isExpired = timer.timeLeft === 0;
            
            return (
              <div
                key={timer.nodeId}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  isExpired 
                    ? 'bg-red-100 border-red-300 hover:bg-red-150' 
                    : isUrgent 
                    ? 'bg-yellow-100 border-yellow-300 hover:bg-yellow-150'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => onTimerClick?.(timer.nodeId)}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium truncate pr-2">
                    {getNodeTitle(timer.nodeId)}
                  </span>
                  <div className="flex items-center">
                    <Timer className={`h-3 w-3 mr-1 ${
                      isExpired ? 'text-red-600' : isUrgent ? 'text-yellow-600' : 'text-blue-600'
                    }`} />
                    <span className={`text-sm font-mono ${
                      isExpired ? 'text-red-700 font-bold' : isUrgent ? 'text-yellow-700' : 'text-gray-700'
                    }`}>
                      {formatTime(timer.timeLeft)}
                    </span>
                  </div>
                </div>
                <Progress 
                  value={progress} 
                  className={`h-2 ${
                    isExpired ? '[&>div]:bg-red-500' : isUrgent ? '[&>div]:bg-yellow-500' : '[&>div]:bg-blue-500'
                  }`}
                />
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default TimerStatus;
