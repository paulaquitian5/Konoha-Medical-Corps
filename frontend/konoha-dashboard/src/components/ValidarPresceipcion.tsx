import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { Badge } from './ui/badge';
import { CheckCircle, XCircle, Clock, FileCheck, User, Pill, Calendar } from 'lucide-react';


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

  const config = statusConfig[status] || statusConfig.pending;
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
const doctors = [
  { id: 1, nombre: "Tsunade", firmaDigital: "tsunade-001", sello: "TS" },
  { id: 2, nombre: "Sakura Haruno", firmaDigital: "sakura-002", sello: "SH" },
  { id: 3, nombre: "Ino Yamanaka", firmaDigital: "ino-003", sello: "IY" },
  { id: 4, nombre: "Shizune", firmaDigital: "shizune-004", sello: "SZ" },
  { id: 5, nombre: "Rin Nohara", firmaDigital: "rin-005", sello: "RN" },
  { id: 6, nombre: "Yugao Uzuki", firmaDigital: "yugao-006", sello: "YU" }
];

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
  const [prescripciones, setPrescripciones] = useState<any[]>([]);
  const [selectedPrescripcion, setSelectedPrescripcion] = useState(0);

  const [observaciones, setObservaciones] = useState('');
  const [showObservaciones, setShowObservaciones] = useState(false);

  // 🔥 FETCH REAL AL BACKEND
  useEffect(() => {
    const fetchPrescripciones = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/medicamentos");
        const data = await res.json();
        setPrescripciones(data.data);
      } catch (error) {
        console.error("Error fetching medicamentos:", error);
      }
    };

    fetchPrescripciones();
  }, []);

  if (prescripciones.length === 0) {
    return (
      <div className="max-w-5xl mx-auto p-6 text-center text-[#3c5661]">
        Cargando prescripciones…
      </div>
    );
  }

  const currentPrescripcion = prescripciones[selectedPrescripcion];

  const doctorInfo = doctors.find(
    d => d.id === Number(currentPrescripcion.doctorId)
  );

  // Adaptar medicamentos
  const medicamentosTexto = currentPrescripcion.medicamentos
    .map((m: any) => m.nombre)
    .join(', ');

  const dosis = currentPrescripcion.medicamentos[0]?.dosis || "—";
  const duracion = currentPrescripcion.medicamentos[0]?.duracion || "—";

  const fecha = new Date(currentPrescripcion.fechaCreacion)
    .toLocaleDateString("es-CO", { year: "numeric", month: "long", day: "numeric" });

  const handleSaveObservaciones = () => {
    console.log("Observaciones guardadas:", observaciones);
    setShowObservaciones(false);
    setObservaciones('');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Selector de Prescripciones */}
      <Card className="p-6 bg-white">
        <h2 className="font-bold mb-4 text-[#3c5661]">Seleccionar Prescripción</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {prescripciones.map((prescripcion, index) => (
            <button
              key={prescripcion.id}
              onClick={() => setSelectedPrescripcion(index)}
              className={`p-4 border rounded-lg text-left transition-all duration-200 ${selectedPrescripcion === index
                ? 'border-[#882238] bg-[#882238] bg-opacity-5'
                : 'border-[#f4c0c2] hover:border-[#882238]'
                }`}
            >
              <p className="font-medium text-xs text-[#3c5661] mb-1">{prescripcion._id}</p>
              <p className="text-xs text-[#3c5661] opacity-60">{prescripcion.pacienteNombre}</p>
              <div className="mt-2">
                <StatusBadge status={prescripcion.status} />
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
              <p className="text-xs text-[#3c5661] opacity-60">{currentPrescripcion._id}</p>
            </div>
          </div>
          <StatusBadge status={currentPrescripcion.status} />
        </div>

        <Separator className="my-6" />

        {/* Información del Paciente */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Información del Paciente</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DetailRow
              icon={User}
              label="Nombre del Paciente"
              value={currentPrescripcion.pacienteNombre}
            />
            <DetailRow
              icon={FileCheck}
              label="ID del Paciente"
              value={currentPrescripcion.patientId}
            />
            <DetailRow icon={Calendar} label="Fecha de emisión" value={new Date(currentPrescripcion.fechaCreacion).toLocaleString("es-CO", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit"
            })} />
          </div>
        </div>

        <Separator className="my-6" />

        {/* Diagnóstico */}
        <div className="mb-6">
          <h2 className="font-bold mb-4 text-[#3c5661]">Diagnóstico Médico</h2>
          <div className="bg-[#f2ede9] rounded-lg p-4">
            <p className="text-xs text-[#3c5661]">{currentPrescripcion.observaciones}</p>
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
              value={medicamentosTexto}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Dosis</p>
                <p className="text-xs text-[#3c5661]">{dosis}</p>
              </div>
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Duración</p>
                <p className="text-xs text-[#3c5661]">{duracion}</p>
              </div>
            </div>
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
              value={doctorInfo?.nombre || "No disponible"}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Firma Digital</p>
                <p className="text-xs text-[#3c5661] font-mono">{doctorInfo?.firmaDigital || "No disponible"}</p>
              </div>
              <div className="bg-[#f2ede9] rounded-lg p-4">
                <p className="text-xs font-medium text-[#3c5661] opacity-60 mb-1">Sello Médico</p>
                <p className="text-xs text-[#3c5661] font-mono">{doctorInfo?.sello || "No disponible"}</p>
              </div>
              <DetailRow
                icon={Calendar}
                label="Fecha de Emisión"
                value={new Date(currentPrescripcion.fechaCreacion).toLocaleString("es-CO", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit"
                })}
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
