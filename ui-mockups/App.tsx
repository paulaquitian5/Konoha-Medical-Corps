import React, { useState } from 'react';
import { PatientRegistrationForm } from './components/PatientRegistrationForm';
import { PatientConsultationForm } from './components/PatientConsultationForm';
import { MedicalDashboard } from './components/MedicalDashboard';
import { Button } from './components/ui/button';
import { Card } from './components/ui/card';
import { UserPlus, Search, LayoutDashboard } from 'lucide-react';

type ViewType = 'menu' | 'dashboard' | 'registration' | 'consultation';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('menu');

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <MedicalDashboard onNavigate={setCurrentView} />;
      case 'registration':
        return <PatientRegistrationForm />;
      case 'consultation':
        return <PatientConsultationForm />;
      default:
        return (
          <Card className="p-8 bg-white text-center max-w-md mx-auto">
            <h1 className="font-bold mb-6 text-[#3c5661]">Sistema Médico Ninja</h1>
            <p className="text-[#3c5661] mb-8 text-sm opacity-75">
              Seleccione una opción para continuar
            </p>
            <div className="space-y-4">
              <Button
                onClick={() => setCurrentView('dashboard')}
                className="w-full bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2"
              >
                <LayoutDashboard className="w-4 h-4" />
                Panel de Control
              </Button>
              <Button
                onClick={() => setCurrentView('registration')}
                className="w-full border-[#882238] text-[#882238] hover:bg-[#882238] hover:text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2"
                variant="outline"
              >
                <UserPlus className="w-4 h-4" />
                Registro de Pacientes
              </Button>
              <Button
                onClick={() => setCurrentView('consultation')}
                className="w-full border-[#882238] text-[#882238] hover:bg-[#882238] hover:text-white rounded-lg px-6 py-3 flex items-center justify-center gap-2"
                variant="outline"
              >
                <Search className="w-4 h-4" />
                Consulta de Pacientes
              </Button>
            </div>
          </Card>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f2ede9]">
      {/* Barra de navegación */}
      {currentView !== 'menu' && (
        <div className="bg-white border-b border-[#f4c0c2] px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <h1 className="font-bold text-[#3c5661]">Sistema Médico Ninja</h1>
            <div className="flex gap-2">
              <Button
                onClick={() => setCurrentView('menu')}
                variant="outline"
                className="text-xs px-3 py-2 rounded-lg border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] hover:text-[#3c5661]"
              >
                Menú Principal
              </Button>
              <Button
                onClick={() => setCurrentView('dashboard')}
                variant={currentView === 'dashboard' ? 'default' : 'outline'}
                className={`text-xs px-3 py-2 rounded-lg ${
                  currentView === 'dashboard'
                    ? 'bg-[#882238] hover:bg-[#6d1a2c] text-white'
                    : 'border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] hover:text-[#3c5661]'
                }`}
              >
                Dashboard
              </Button>
              <Button
                onClick={() => setCurrentView('registration')}
                variant={currentView === 'registration' ? 'default' : 'outline'}
                className={`text-xs px-3 py-2 rounded-lg ${
                  currentView === 'registration'
                    ? 'bg-[#882238] hover:bg-[#6d1a2c] text-white'
                    : 'border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] hover:text-[#3c5661]'
                }`}
              >
                Registro
              </Button>
              <Button
                onClick={() => setCurrentView('consultation')}
                variant={currentView === 'consultation' ? 'default' : 'outline'}
                className={`text-xs px-3 py-2 rounded-lg ${
                  currentView === 'consultation'
                    ? 'bg-[#882238] hover:bg-[#6d1a2c] text-white'
                    : 'border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] hover:text-[#3c5661]'
                }`}
              >
                Consulta
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto py-8 px-4">
        {renderView()}
      </div>
    </div>
  );
}