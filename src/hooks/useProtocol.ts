
import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { ProtocolNodeData } from '@/types/protocol';

export interface ProtocolHistoryItem {
  nodeId: string;
  timestamp: number;
}

export interface TimerState {
  nodeId: string;
  duration: number;
  timeLeft: number;
  isRunning: boolean;
  startTime: number;
}

export const useProtocol = (algorithm: ProtocolNodeData[], initialNodeId = 'start') => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [history, setHistory] = useState<ProtocolHistoryItem[]>([]);
  const [activeTimers, setActiveTimers] = useState<Map<string, TimerState>>(new Map());
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setCurrentNodeId(initialNodeId);
    setHistory([{ nodeId: initialNodeId, timestamp: Date.now() }]);
    setActiveTimers(new Map());
  }, [algorithm, initialNodeId]);

  // Background timer management
  useEffect(() => {
    if (activeTimers.size > 0) {
      intervalRef.current = setInterval(() => {
        setActiveTimers(prevTimers => {
          const newTimers = new Map(prevTimers);
          let hasChanges = false;

          newTimers.forEach((timer, nodeId) => {
            if (timer.isRunning) {
              const elapsed = Math.floor((Date.now() - timer.startTime) / 1000);
              const newTimeLeft = Math.max(0, timer.duration - elapsed);
              
              if (newTimeLeft !== timer.timeLeft) {
                newTimers.set(nodeId, { ...timer, timeLeft: newTimeLeft });
                hasChanges = true;

                // Auto-advance if timer reaches zero and we're on this node
                if (newTimeLeft === 0 && nodeId === currentNodeId) {
                  const node = algorithm.find(n => n.id === nodeId);
                  if (node?.next) {
                    setTimeout(() => advance(node.next), 100);
                  }
                }
              }
            }
          });

          return hasChanges ? newTimers : prevTimers;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [activeTimers.size, currentNodeId, algorithm]);

  const currentNode = useMemo(() => {
    return algorithm.find(node => node.id === currentNodeId);
  }, [currentNodeId, algorithm]);

  const startTimer = useCallback((nodeId: string, duration: number) => {
    setActiveTimers(prev => {
      const newTimers = new Map(prev);
      newTimers.set(nodeId, {
        nodeId,
        duration,
        timeLeft: duration,
        isRunning: true,
        startTime: Date.now()
      });
      return newTimers;
    });
  }, []);

  const pauseTimer = useCallback((nodeId: string) => {
    setActiveTimers(prev => {
      const newTimers = new Map(prev);
      const timer = newTimers.get(nodeId);
      if (timer) {
        newTimers.set(nodeId, { ...timer, isRunning: false });
      }
      return newTimers;
    });
  }, []);

  const getTimerState = useCallback((nodeId: string): TimerState | undefined => {
    return activeTimers.get(nodeId);
  }, [activeTimers]);

  const advance = (nextNodeId?: string) => {
    if (!nextNodeId) return;
    const nextNode = algorithm.find(node => node.id === nextNodeId);
    if (nextNode) {
      setCurrentNodeId(nextNodeId);
      setHistory(prev => [...prev, { nodeId: nextNodeId, timestamp: Date.now() }]);
    } else {
      console.error(`Protocol node with id "${nextNodeId}" not found.`);
    }
  };
  
  const reset = () => {
    setCurrentNodeId(initialNodeId);
    setHistory([{ nodeId: initialNodeId, timestamp: Date.now() }]);
    setActiveTimers(new Map());
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const activeTimersList = Array.from(activeTimers.values()).filter(timer => timer.isRunning);

  return { 
    currentNode, 
    advance, 
    reset, 
    history, 
    startTimer, 
    pauseTimer, 
    getTimerState,
    activeTimers: activeTimersList
  };
};
