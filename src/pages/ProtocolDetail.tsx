
import { useParams, Link } from 'react-router-dom';
import { protocols } from '@/data/protocols';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Construction } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import InteractiveProtocol from '@/components/protocols/InteractiveProtocol';
import { aclsCardiacArrestAlgorithm } from '@/data/protocols/acls-cardiac-arrest';

const ProtocolDetail = () => {
  const { id } = useParams<{ id: string }>();
  const protocol = protocols.find((p) => p.id === id);

  if (!protocol) {
    return (
      <div className="container mx-auto p-4 text-center">
        <h1 className="text-2xl font-bold">Protocol not found</h1>
        <Button asChild variant="link" className="mt-4">
          <Link to="/protocols">Back to Protocols</Link>
        </Button>
      </div>
    );
  }

  const renderProtocolContent = () => {
    if (protocol.id === 'acls-cardiac-arrest') {
      return <InteractiveProtocol algorithm={aclsCardiacArrestAlgorithm} />;
    }
    
    return (
      <Card>
        <CardHeader>
          <CardTitle>Interactive Protocol</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center text-center p-12">
          <Construction className="h-16 w-16 text-yellow-500 mb-4" />
          <h2 className="text-xl font-semibold">Under Construction</h2>
          <p className="text-muted-foreground mt-2">
            This interactive protocol is coming soon.
          </p>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex items-center mb-6">
        <Button asChild variant="outline" size="icon" className="mr-4">
          <Link to="/protocols">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to protocols</span>
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{protocol.title}</h1>
      </div>
      
      {renderProtocolContent()}
    </div>
  );
};

export default ProtocolDetail;
