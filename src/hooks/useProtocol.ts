
import { useState, useMemo, useEffect } from 'react';
import { ProtocolNodeData } from '@/types/protocol';

export interface ProtocolHistoryItem {
  nodeId: string;
  timestamp: number;
}

export const useProtocol = (algorithm: ProtocolNodeData[], initialNodeId = 'start') => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);
  const [history, setHistory] = useState<ProtocolHistoryItem[]>([]);

  useEffect(() => {
    setCurrentNodeId(initialNodeId);
    setHistory([{ nodeId: initialNodeId, timestamp: Date.now() }]);
  }, [algorithm, initialNodeId]);


  const currentNode = useMemo(() => {
    return algorithm.find(node => node.id === currentNodeId);
  }, [currentNodeId, algorithm]);

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
  }

  return { currentNode, advance, reset, history };
};
