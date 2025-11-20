import React from 'react';
import { Card } from './ui/card';
import { FileText, FileCheck, Package } from 'lucide-react';

import { ViewType } from '../types/view.ts'; 

interface FarmaciaMenuProps {
  onNavigate: (view: ViewType) => void;
}

export const FarmaciaMenu: React.FC<FarmaciaMenuProps> = ({ onNavigate }) => {
  const menuOptions = [
    {
      id: 'emitir-prescripcion' as ViewType,
      title: 'Emitir Prescripción',
      description: 'Crear y emitir nuevas prescripciones médicas para pacientes',
      icon: FileText,
      color: '#882238',
      bgColor: 'bg-[#882238]'
    },
    {
      id: 'validar-prescripcion' as ViewType,
      title: 'Validar Prescripción',
      description: 'Revisar y validar prescripciones existentes del sistema',
      icon: FileCheck,
      color: '#72be9a',
      bgColor: 'bg-[#72be9a]'
    },
    {
      id: 'ordenes-automaticas' as ViewType,
      title: 'Órdenes Automáticas',
      description: 'Gestionar órdenes enviadas a la Farmacia de Tsunade',
      icon: Package,
      color: '#f4c0c2',
      bgColor: 'bg-[#f4c0c2]'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="font-bold mb-3 text-[#3c5661]">Gestión de Prescripciones</h1>
        <p className="text-xs text-[#3c5661] opacity-75">
          Sistema integral de gestión farmacéutica y prescripciones médicas
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {menuOptions.map((option) => {
          const Icon = option.icon;
          return (
            <Card
              key={option.id}
              onClick={() => onNavigate(option.id)}
              className="p-6 bg-white cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 hover:border-[#882238] border-2 border-transparent"
            >
              <div className="flex flex-col items-center text-center space-y-4">
                <div 
                  className={`w-16 h-16 rounded-xl ${option.bgColor} bg-opacity-10 flex items-center justify-center`}
                >
                  <Icon className="w-8 h-8" style={{ color: option.color }} />
                </div>
                
                <div>
                  <h2 className="font-bold mb-2 text-[#3c5661]">{option.title}</h2>
                  <p className="text-xs text-[#3c5661] opacity-75 leading-relaxed">
                    {option.description}
                  </p>
                </div>

                <div className="pt-2">
                  <div className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-[#882238] bg-opacity-5 text-xs text-[#882238] font-medium hover:bg-opacity-10 transition-all">
                    Acceder →
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 p-6 bg-[#f4c0c2] bg-opacity-20 border border-[#f4c0c2]">
        <div className="flex gap-3">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#882238] bg-opacity-10 flex items-center justify-center">
            <Package className="w-4 h-4 text-[#882238]" />
          </div>
          <div>
            <p className="font-medium text-xs text-[#3c5661] mb-2">
              Sistema Integrado de Farmacia
            </p>
            <p className="text-xs text-[#3c5661] opacity-75">
              Este módulo permite la gestión completa del ciclo de prescripciones médicas, 
              desde su emisión hasta la entrega automática de órdenes a la Farmacia de Tsunade. 
              Todas las acciones quedan registradas para auditoría y trazabilidad.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};