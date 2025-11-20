import React, { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { FileText, Check } from 'lucide-react';
import axios from "axios";

// Form Field Components
interface FormFieldProps {
  label: string;
  children: React.ReactNode;
  error?: string;
  required?: boolean;
}

const FormField: React.FC<FormFieldProps> = ({ label, children, error, required }) => (
  <div className="space-y-2">
    <label className="block font-medium text-xs text-[#3c5661]">
      {label}
      {required && <span className="text-[#882238] ml-1">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-xs text-[#882238] mt-1">{error}</p>
    )}
  </div>
);

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  success?: boolean;
}

const Input: React.FC<InputProps> = ({ error, success, className = '', ...props }) => {
  const baseClasses = "w-full px-4 py-4 text-xs border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]";

  let borderClasses = "border-[#f4c0c2] hover:border-[#882238]";

  if (error) {
    borderClasses = "border-[#882238] focus:border-[#882238]";
  } else if (success) {
    borderClasses = "border-[#72be9a] focus:border-[#72be9a]";
  }

  return (
    <input
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    />
  );
};

const doctors = [
  { id: 1, nombre: "Tsunade", firmaDigital: "tsunade-001", sello: "TS" },
  { id: 2, nombre: "Sakura Haruno", firmaDigital: "sakura-002", sello: "SH" },
  { id: 3, nombre: "Ino Yamanaka", firmaDigital: "ino-003", sello: "IY" },
  { id: 4, nombre: "Shizune", firmaDigital: "shizune-004", sello: "SZ" },
  { id: 5, nombre: "Rin Nohara", firmaDigital: "rin-005", sello: "RN" },
  { id: 6, nombre: "Yugao Uzuki", firmaDigital: "yugao-006", sello: "YU" }
];

// Interfaz de Datos del Formulario
interface PrescripcionFormData {
  patientName: string;
  patientId: string;
  diagnosis: string;
  medication: string;
  dosage: string;
  duration: string;
  instructions: string;
  doctorName: string;
  doctorSignature: string;
  medicalSeal: string;
}

interface Patient {
  id: string;
  name: string;
  currentCondition?: 'stable' | 'critical' | 'urgent';
}


// --- Mini Modal Paciente (Lista) ---
interface PatientMiniListProps {
  patients: Patient[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (patient: Patient) => void;
}
const PatientMiniList: React.FC<PatientMiniListProps> = ({ patients, isOpen, onClose, onSelect }) => {
  if (!isOpen) return null;

  const getConditionColor = (condition?: string) => {

    if (!condition) return 'bg-gray-500 text-white';

    const normalized = condition
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    switch (normalized) {
      case 'estable': return 'bg-[#72be9a] text-white';
      case 'critico': return 'bg-[#D63031] text-white';
      case 'urgente': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatCondition = (condition?: string) => {
    if (!condition) return 'Desconocido';

    const normalized = condition
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

    switch (normalized) {
      case 'estable': return 'Estable';
      case 'critico': return 'Crítico';
      case 'urgente': return 'Urgente';
      default: return condition;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-20 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-4 shadow-lg">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-bold text-[#3c5661]">Seleccionar Paciente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">&times;</button>
        </div>

        <div className="space-y-2 text-sm text-[#3c5661] max-h-80 overflow-y-auto">
          {patients.map((patient) => (
            <div key={patient.id} className="flex justify-between items-center p-2 border-b border-gray-200 rounded hover:bg-gray-50">
              <div>
                <p><strong>{patient.name}</strong></p>
                <p className="text-xs text-gray-500">ID: {patient.id}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-1 rounded text-xs ${getConditionColor(patient.currentCondition)}`}>
                  {formatCondition(patient.currentCondition)}
                </span>
                <Button
                  onClick={() => { onSelect(patient); onClose(); }}
                  className="bg-[#882238] hover:bg-[#6d1a2c] text-white text-xs px-3 py-1 rounded-lg"
                >
                  Seleccionar
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 flex justify-end">
          <Button onClick={onClose} className="border border-[#f4c0c2] text-[#882238] text-xs px-4 py-2 rounded-lg">
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

// Main Component
export const EmitirPrescripcion: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPatientModal, setShowPatientModal] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pacientes`);
        const pacientesTraducidos = res.data.pacientes.map((p: any) => ({
          ...p,
          currentCondition:
            p.currentCondition === 'stable' ? 'Estable' :
              p.currentCondition === 'critical' ? 'Crítico' :
                p.currentCondition === 'urgent' ? 'Urgente' :
                  undefined
        }));

        setPatients(pacientesTraducidos);
      } catch (error) {
        console.error("Error al cargar los pacientes:", error);
        alert("No se pudieron cargar los pacientes");
      }
    };

    fetchPatients();
  }, []);
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset,
    setValue,
  } = useForm<PrescripcionFormData>({
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = async (data: PrescripcionFormData) => {
    try {
      const payload = {
        patientId: data.patientId,
        medicamentos: [
          {
            nombre: data.medication,
            dosis: data.dosage,
            frecuencia: data.dosage || "Según indicación",  
            duracion: "Indefinido"
          }
        ],
        observaciones: data.diagnosis,
      };
      
      console.log("Payload a enviar:", payload);
      //const res = await axios.post("/api/medicamentos", payload);
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/medicamentos`, payload);
      console.log("Respuesta del servidor:", res.data);

      setIsSubmitted(true);
      

    } catch (error) {
      console.error("Error al enviar la prescripción:", error);
      
    }
  };


  const onReset = () => {
    reset();
    setIsSubmitted(false);
  };

  // Helper function to determine field state
  const getFieldState = (fieldName: keyof PrescripcionFormData) => {
    const hasError = !!errors[fieldName];
    const isTouched = !!touchedFields[fieldName];
    const hasValue = !!watchedFields[fieldName];
    const isSuccess = isTouched && !hasError && hasValue;

    return { error: hasError, success: isSuccess };
  };

  if (isSubmitted) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card className="p-8 text-center bg-white">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#72be9a] bg-opacity-10 mb-4">
            <Check className="w-8 h-8 text-[#72be9a]" />
          </div>
          <h2 className="font-bold mb-4 text-[#3c5661]">¡Prescripción Emitida Exitosamente!</h2>
          <p className="text-[#3c5661] opacity-75 mb-6">La prescripción médica ha sido generada y registrada en el sistema.</p>
          <Button
            onClick={onReset}
            className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-3"
          >
            Emitir Nueva Prescripción
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-8 bg-white">
        <div className="flex items-center gap-3 mb-6">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10">
            <FileText className="w-5 h-5 text-[#882238]" />
          </div>
          <h1 className="font-bold text-[#3c5661]">Emitir Prescripción Médica</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección de Información del Paciente */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Información del Paciente</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del Paciente" required error={errors.patientName?.message}>
                <div className="flex gap-2">
                  <Input
                    value={selectedPatient?.name || ''}
                    placeholder="Seleccione un paciente"
                    readOnly
                    {...getFieldState('patientName')}
                  />
                  <Button
                    type="button"
                    onClick={() => setShowPatientModal(true)}
                    className="bg-[#3c5661] hover:bg-[#1E40CC] text-white text-xs px-4 py-2 rounded-lg"
                  >
                    Ver / Seleccionar
                  </Button>
                </div>
              </FormField>
              <FormField label="ID del Paciente" required error={errors.patientId?.message}>
                <Input
                  value={selectedPatient?.id || ''}
                  placeholder="ID o número de historial clínico"
                  readOnly
                  {...getFieldState('patientId')}
                />
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Diagnóstico y Prescripción */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Diagnóstico y Tratamiento</h2>
            <div className="space-y-4">
              {/* Diagnóstico */}
              <FormField label="Diagnóstico" required error={errors.diagnosis?.message}>
                <select
                  {...register('diagnosis', {
                    required: 'El diagnóstico es obligatorio',
                  })}
                  className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                >
                  <option value="">Seleccione un diagnóstico</option>
                  <option value="Herida de shuriken">Herida de shuriken</option>
                  <option value="Fatiga por entrenamiento de chakra">Fatiga por entrenamiento de chakra</option>
                  <option value="Quemadura por Jutsu de fuego">Quemadura por Jutsu de fuego</option>
                  <option value="Contusión por taijutsu">Contusión por taijutsu</option>
                </select>
              </FormField>

              {/* Medicamentos Prescritos */}
              <FormField label="Medicamentos Prescritos" required error={errors.medication?.message}>
                <select
                  {...register('medication', {
                    required: 'Los medicamentos son obligatorios',
                  })}
                  className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                >
                  <option value="">Seleccione un medicamento</option>
                  <option value="Ungüento de curación de Tsunade">Ungüento de curación de Tsunade</option>
                  <option value="Píldora anti-fatiga de Konoha">Píldora anti-fatiga de Konoha</option>
                  <option value="Cataplasma de hierbas de la Aldea de la Hoja">Cataplasma de hierbas de la Aldea de la Hoja</option>
                </select>
              </FormField>

              {/* Dosis y Duración */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Dosis" required error={errors.dosage?.message}>
                  <select
                    {...register('dosage', { required: 'La dosis es obligatoria' })}
                    className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                  >
                    <option value="">Seleccione una dosis</option>
                    <option value="1 aplicación cada 8 horas">1 aplicación cada 8 horas</option>
                    <option value="2 cápsulas antes del entrenamiento">2 cápsulas antes del entrenamiento</option>
                    <option value="Ungüento aplicado en la herida 3 veces al día">Ungüento aplicado en la herida 3 veces al día</option>
                  </select>
                </FormField>

                <FormField label="Duración del Tratamiento" required error={errors.duration?.message}>
                  <select
                    {...register('duration', { required: 'La duración del tratamiento es obligatoria' })}
                    className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                  >
                    <option value="">Seleccione duración</option>
                    <option value="3 días">3 días</option>
                    <option value="7 días">7 días</option>
                    <option value="1 semana de reposo">1 semana de reposo</option>
                  </select>
                </FormField>
              </div>

              {/* Instrucciones Adicionales */}
              <FormField label="Instrucciones Adicionales" error={errors.instructions?.message}>
                <select
                  {...register('instructions')}
                  className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                >
                  <option value="">Seleccione instrucciones</option>
                  <option value="Tomar antes del entrenamiento">Tomar antes del entrenamiento</option>
                  <option value="Aplicar después del combate">Aplicar después del combate</option>
                  <option value="Evitar beber agua fría">Evitar beber agua fría</option>
                </select>
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Firma Digital y Sello Médico */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Validación Médica</h2>
            <div className="space-y-4">
              {/* Nombre del Médico */}
              <FormField label="Nombre del Médico" required error={errors.doctorName?.message}>
                <select
                  {...register('doctorName', { required: 'El nombre del médico es obligatorio' })}
                  className="w-full px-4 py-4 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 text-[#3c5661]"
                  onChange={(e) => {
                    const selectedDoc = doctors.find(doc => doc.nombre === e.target.value);
                    if (selectedDoc) {
                      setValue('doctorSignature', selectedDoc.firmaDigital);
                      setValue('medicalSeal', selectedDoc.sello);
                    } else {
                      setValue('doctorSignature', '');
                      setValue('medicalSeal', '');
                    }
                  }}
                >
                  <option value="">Seleccione un médico</option>
                  {doctors.map(doc => (
                    <option key={doc.id} value={doc.nombre}>
                      {doc.nombre}
                    </option>
                  ))}
                </select>
              </FormField>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Firma Digital */}
                <FormField label="Firma Digital" required error={errors.doctorSignature?.message}>
                  <Input
                    {...register('doctorSignature', { required: 'La firma digital es obligatoria' })}
                    placeholder="Código de firma digital"
                    {...getFieldState('doctorSignature')}
                    readOnly
                  />
                </FormField>

                {/* Sello Médico */}
                <FormField label="Sello Médico" required error={errors.medicalSeal?.message}>
                  <Input
                    {...register('medicalSeal', { required: 'El sello médico es obligatorio' })}
                    placeholder="Número de sello profesional"
                    {...getFieldState('medicalSeal')}
                    readOnly
                  />
                </FormField>
              </div>

              <div className="bg-[#f4c0c2] bg-opacity-20 border border-[#f4c0c2] rounded-lg p-4">
                <p className="text-xs text-[#3c5661]">
                  <strong>Nota:</strong> Al emitir esta prescripción, usted certifica que ha examinado al paciente
                  y que los medicamentos prescritos son apropiados para su condición. Esta prescripción será enviada
                  automáticamente a la Farmacia de Tsunade.
                </p>
              </div>
            </div>
          </div>

          {/* Acciones del Formulario */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-3"
            >
              Emitir Prescripción
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="border-[#f4c0c2] text-[#882238] hover:bg-[#f4c0c2] hover:text-[#882238] rounded-lg px-6 py-3"
            >
              Limpiar Formulario
            </Button>
          </div>
        </form>
        {/* Mini Modal */}
        {showPatientModal && (
          <PatientMiniList
            patients={patients}
            isOpen={showPatientModal}
            onClose={() => setShowPatientModal(false)}
            onSelect={(p) => {
              setSelectedPatient(p);
              setValue('patientName', p.name);
              setValue('patientId', p.id);
            }}
          />
        )}
      </Card>
    </div>
  );
};
