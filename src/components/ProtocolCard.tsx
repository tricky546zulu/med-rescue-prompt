
import React from 'react';
import { Link } from 'react-router-dom';
import { Protocol } from '@/data/protocols';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface ProtocolCardProps {
  protocol: Protocol;
}

const ProtocolCard: React.FC<ProtocolCardProps> = ({ protocol }) => {
  const { id, title, category, description, icon: Icon } = protocol;

  return (
    <Link to={`/protocols/${id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-lg">
      <Card className="h-full flex flex-col">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl">{title}</CardTitle>
            {Icon && <Icon className="h-6 w-6 text-muted-foreground" />}
          </div>
          <CardDescription>
            <Badge variant={category === 'ACLS' ? 'destructive' : category === 'PALS' ? 'default' : 'secondary'}>
              {category}
            </Badge>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-muted-foreground">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProtocolCard;
