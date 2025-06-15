
import { useProtocol } from '@/hooks/useProtocol';
import { ProtocolNodeData } from '@/types/protocol';
import ProtocolNode from './ProtocolNode';
import { Button } from '@/components/ui/button';
import ProtocolHistory from './ProtocolHistory';

interface InteractiveProtocolProps {
  algorithm: ProtocolNodeData[];
}

const InteractiveProtocol: React.FC<InteractiveProtocolProps> = ({ algorithm }) => {
  const { currentNode, advance, reset, history } = useProtocol(algorithm);

  if (!currentNode) {
    return <div>Error: Protocol node not found.</div>;
  }

  return (
    <div>
      <ProtocolNode node={currentNode} onAdvance={advance} />
      
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
