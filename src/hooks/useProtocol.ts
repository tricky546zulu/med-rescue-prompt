
import { useState, useMemo } from 'react';
import { ProtocolNodeData } from '@/types/protocol';

export const useProtocol = (algorithm: ProtocolNodeData[], initialNodeId = 'start') => {
  const [currentNodeId, setCurrentNodeId] = useState<string>(initialNodeId);

  const currentNode = useMemo(() => {
    return algorithm.find(node => node.id === currentNodeId);
  }, [currentNodeId, algorithm]);

  const advance = (nextNodeId?: string) => {
    if (!nextNodeId) return;
    const nextNode = algorithm.find(node => node.id === nextNodeId);
    if (nextNode) {
      setCurrentNodeId(nextNodeId);
    } else {
      console.error(`Protocol node with id "${nextNodeId}" not found.`);
    }
  };
  
  const reset = () => {
      setCurrentNodeId(initialNodeId);
  }

  return { currentNode, advance, reset };
};
