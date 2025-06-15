
import { Stethoscope } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex items-center">
        <Stethoscope className="text-blue-600 h-8 w-8 mr-3" />
        <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
          Emergency Medication Guide
        </h1>
      </div>
    </header>
  );
};

export default Header;
