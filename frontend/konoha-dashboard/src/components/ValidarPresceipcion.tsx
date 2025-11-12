import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock, FileCheck, User, Pill, Calendar } from 'lucide-react';

// Mock data para demostración
const mockPrescripciones = [
  {
    id: 'RX-2025-001',
    patientName: 'Naruto Uzumaki',
    patientId: 'NJ-12345',
    diagnosis: 'Lesión menor en entrenamiento de taijutsu. Contusión muscular en brazo derecho.',
    medication: 'Pomada de Chakra Regenerativo, Píldoras de Soldado nivel 1',
    dosage: '2 aplicaciones diarias de pomada, 1 píldora cada 12 horas',
    duration: '5 días',
    instructions: 'Evitar entrenamientos intensos durante el periodo de tratamiento. Aplicar pomada después de las comidas.',
    doctorName: 'Sakura Haruno',
    doctorSignature: 'SH-MED-2025',
    medicalSeal: 'KONOHA-9847',
    date: '12 de Noviembre, 2025',
    status: 'valid'
  },
  {
    id: 'RX-2025-002',
    patientName: 'Sasuke Uchiha',
    patientId: 'NJ-12346',
    diagnosis: 'Agotamiento de chakra post-misión. Requiere reposo y recuperación energética.',
    medication: 'Suplemento de Chakra Concentrado, Té de Hierbas Medicinales',
    dosage: '1 suplemento cada 8 horas, té 3 veces al día',
    duration: '3 días',
    instructions: 'Reposo absoluto. Hidratación constante. No utilizar técnicas de Sharingan durante el tratamiento.',
    doctorName: 'Tsunade Senju',
    doctorSignature: 'TS-MED-2025',
    medicalSeal: 'KONOHA-0001',
    date: '11 de Noviembre, 2025',
    status: 'pending'
  },
  {
    id: 'RX-2025-003',
    patientName: 'Rock Lee',
    patientId: 'NJ-12347',
    diagnosis: 'Fractura menor en tobillo izquierdo durante entrenamiento.',
    medication: 'Píldoras de Recuperación Ósea, Vendaje Médico Ninja',
    dosage: '2 píldoras cada 6 horas',
    duration: '14 días',
    instructions: 'Inmovilización del tobillo. No realizar entrenamientos físicos hasta nueva orden médica.',
    doctorName: 'Shizune',
    doctorSignature: 'SZ-MED-2025',
    medicalSeal: 'KONOHA-5623',
    date: '10 de Noviembre, 2025',
    status: 'invalid'
  }
];

type StatusType = 'valid' | 'pending' | 'invalid';

const StatusBadge: React.FC<{ status: StatusType }> = ({ status }) => {
  const statusConfig = {
    valid: {
      label: 'Válida',
      icon: CheckCircle,
      className: 'bg-[#72be9a] bg-opacity-10 text-[#72be9a] border-[#72be9a]'
    },
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'bg-[#f4c0c2] bg-opacity-20 text-[#882238] border-[#f4c0c2]'
    },
    invalid: {
      label: 'Inválida',
      icon: XCircle,
      className: 'bg-[#882238] bg-opacity-10 text-[#882238] border-[#882238]'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} px-3 py-1 flex items-center gap-2 w-fit`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

interface DetailRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}

const DetailRow: React.FC<DetailRowProps> = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#f4c0c2] bg-opacity-20 flex items-center justify-center">
      <Icon className="w-4 h-4 text-[#882238]" />
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">{label}</p>
      <p className="text-xs text-[#3c5661]">{value}</p>
    </div>
  </div>
);

export const ValidarPrescripcion: React.FC = () => {
  const [selectedPrescripcion, setSelectedPrescripcion] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');
  const [showObservaciones, setShowObservaciones] = useState(false);

  const currentPrescripcion = mockPrescripciones[selectedPrescripcion];

  const handleSaveObservaciones = () => {
    console.log('Observaciones guardadas:', observaciones);
    setShowObservaciones(false);
    setObservaciones('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Selector de Prescripciones */}
      <Card className="p-6 bg-white">
        <h2 className="font-bold mb-4 text-[#3c5661]">Seleccionar Prescripción</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {mockPrescripciones.map((prescripcion, index) => (
            <button
              key={prescripcion.id}
              onClick={() => setSelectedPrescripcion(index)}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${
                selectedPrescripcion === index
                  ? 'border-[#882238] bg-[#882238] bg-opacity-5'
                  : 'border-[#f4c0c2] hover:border-[#882238]'
              }`}
            >
              <p className="font-medium text-xs text-[#3c5661] mb-1">{prescripcion.id}</p>
              <p className="text-xs text-[#3c5661] opacity-60">{prescripcion.patientName}</p>
              <div className="mt-2">
                <StatusBadge status={prescripcion.status as StatusType} />
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Detalle de la Prescripción */}
      <Card className="p-8 bg-white">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10">
              <FileCheck className="w-5 h-5 text-[#882238]" />
            </div>
            <div>
              <h1 className="font-bold text-[#3c5661]">Prescripción Médica</h1>
              <p className="text-xs text-[#3c5661] opacity-60">{currentPrescripcion.id}</p>
            </div>
          </div>
          <StatusBadge status={currentPrescripcion.status as StatusType} />
        </div>

        <Separator className="my-6" />

        {/* Información del Paciente */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Información del Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              icon={User}
              label="Nombre del Paciente"
              value={currentPrescripcion.patientName}
            />
            <DetailRow
              icon={FileCheck}
              label="ID del Paciente"
              value={currentPrescripcion.patientId}
            />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Diagnóstico */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Diagnóstico Médico</h2>
          <div className="bg-[#f2ede9] rounded-lg p-4">
            <p className="text-xs text-[#3c5661]">{currentPrescripcion.diagnosis}</p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Tratamiento Prescrito */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Tratamiento Prescrito</h2>
          <div className="space-y-4">
            <DetailRow
              icon={Pill}
              label="Medicamentos"
              value={currentPrescripcion.medication}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Dosis</p>
                <p className="text-xs text-[#3c5661]">{currentPrescripcion.dosage}</p>
              </div>
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Duración</p>
                <p className="text-xs text-[#3c5661]">{currentPrescripcion.duration}</p>
              </div>
            </div>
            {currentPrescripcion.instructions && (
              <div className="bg-[#f4c0c2] bg-opacity-20 border border-[#f4c0c2] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] mb-2">Instrucciones Adicionales</p>
                <p className="text-xs text-[#3c5661]">{currentPrescripcion.instructions}</p>
              </div>
            )}
          </div>
        </div>

        <Separator className="my-6" />

        {/* Validación Médica */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Validación Médica</h2>
          <div className="space-y-4">
            <DetailRow
              icon={User}
              label="Médico Tratante"
              value={currentPrescripcion.doctorName}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Firma Digital</p>
                <p className="text-xs text-[#3c5661] font-mono">{currentPrescripcion.doctorSignature}</p>
              </div>
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Sello Médico</p>
                <p className="text-xs text-[#3c5661] font-mono">{currentPrescripcion.medicalSeal}</p>
              </div>
              <DetailRow
                icon={Calendar}
                label="Fecha de Emisión"
                value={currentPrescripcion.date}
              />
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Observaciones del Farmacéutico */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-[#3c5661]">Observaciones del Farmacéutico</h2>
            <Button
              onClick={() => setShowObservaciones(!showObservaciones)}
              variant="outline"
              className="border-[#f4c0c2] text-[#882238] hover:bg-[#f4c0c2] hover:text-[#882238] rounded-lg px-4 py-2 text-xs"
            >
              {showObservaciones ? 'Ocultar' : 'Agregar Observación'}
            </Button>
          </div>

          {showObservaciones && (
            <div className="space-y-4">
              <textarea
                value={observaciones}
                onChange={(e) => setObservaciones(e.target.value)}
                placeholder="Ingrese observaciones sobre la prescripción, interacciones medicamentosas, sustituciones, etc..."
                className="w-full px-4 py-4 text-xs border border-[#f4c0c2] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 resize-vertical min-h-[100px] text-[#3c5661] hover:border-[#882238]"
              />
              <div className="flex gap-3">
                <Button
                  onClick={handleSaveObservaciones}
                  className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-2"
                >
                  Guardar Observación
                </Button>
                <Button
                  onClick={() => {
                    setShowObservaciones(false);
                    setObservaciones('');
                  }}
                  variant="outline"
                  className="border-[#f4c0c2] text-[#882238] hover:bg-[#f4c0c2] hover:text-[#882238] rounded-lg px-6 py-2"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}

          {!showObservaciones && (
            <div className="bg-[#f2ede9] rounded-lg p-4 text-center">
              <p className="text-xs text-[#3c5661] opacity-60">
                No hay observaciones registradas para esta prescripción.
              </p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};