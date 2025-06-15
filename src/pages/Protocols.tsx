
import { Link } from 'react-router-dom';
import { protocols } from '@/data/protocols';
import ProtocolCard from '@/components/ProtocolCard';
import { ArrowLeft } from 'lucide-react';

const Protocols = () => {
  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Emergency Protocols</h1>
      </div>
      <p className="text-muted-foreground mb-6">Select a protocol to view the interactive algorithm.</p>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {protocols.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </div>
    </div>
  );
};

export default Protocols;
