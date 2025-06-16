
import React from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Zap, AlertTriangle, ShieldAlert, Clock, Phone } from 'lucide-react';

interface EmergencyToolbarProps {
  onScenarioSelect: (scenario: string) => void;
  className?: string;
}

const EmergencyToolbar: React.FC<EmergencyToolbarProps> = ({ onScenarioSelect, className = '' }) => {
  const emergencyScenarios = [
    {
      name: "Cardiac Emergency",
      icon: Heart,
      color: "bg-red-500 hover:bg-red-600 text-white",
      searchTerm: "epinephrine"
    },
    {
      name: "Anaphylaxis",
      icon: AlertTriangle,
      color: "bg-orange-500 hover:bg-orange-600 text-white",
      searchTerm: "epinephrine"
    },
    {
      name: "Seizures",
      icon: Zap,
      color: "bg-purple-500 hover:bg-purple-600 text-white",
      searchTerm: "lorazepam"
    },
    {
      name: "Pain Management",
      icon: ShieldAlert,
      color: "bg-blue-600 hover:bg-blue-700 text-white",
      searchTerm: "morphine"
    }
  ];

  return (
    <div className={`bg-red-50 border-l-4 border-red-500 p-4 rounded-lg ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center">
          <ShieldAlert className="h-5 w-5 mr-2 text-red-600" />
          <h3 className="font-bold text-red-800">Emergency Drug Access</h3>
        </div>
        <Badge variant="destructive" className="text-xs">
          <Clock className="h-3 w-3 mr-1" />
          URGENT
        </Badge>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {emergencyScenarios.map((scenario) => {
          const IconComponent = scenario.icon;
          return (
            <Button
              key={scenario.name}
              variant="outline"
              size="sm"
              className={`${scenario.color} border-0 h-16 flex flex-col items-center justify-center p-2 transition-all duration-200 hover:scale-105 shadow-md font-semibold`}
              onClick={() => onScenarioSelect(scenario.searchTerm)}
            >
              <IconComponent className="h-5 w-5 mb-1" />
              <span className="text-xs leading-tight text-center">{scenario.name}</span>
            </Button>
          );
        })}
      </div>
      
      <div className="mt-3 text-xs text-red-600 flex items-center">
        <Phone className="h-3 w-3 mr-1" />
        <span>For life-threatening emergencies, call 911 immediately</span>
      </div>
    </div>
  );
};

export default EmergencyToolbar;
