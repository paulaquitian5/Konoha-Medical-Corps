import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';
import { FileText, Check } from 'lucide-react';

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

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  success?: boolean;
}

const Textarea: React.FC<TextareaProps> = ({ error, success, className = '', ...props }) => {
  const baseClasses = "w-full px-4 py-4 text-xs border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 resize-vertical min-h-[100px] text-[#3c5661]";
  
  let borderClasses = "border-[#f4c0c2] hover:border-[#882238]";
  
  if (error) {
    borderClasses = "border-[#882238] focus:border-[#882238]";
  } else if (success) {
    borderClasses = "border-[#72be9a] focus:border-[#72be9a]";
  }
  
  return (
    <textarea 
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    />
  );
};

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

// Main Component
export const EmitirPrescripcion: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset
  } = useForm<PrescripcionFormData>({
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = (data: PrescripcionFormData) => {
    console.log('Prescripción emitida:', data);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
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
                <Input
                  {...register('patientName', { 
                    required: 'El nombre del paciente es obligatorio',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                  placeholder="Nombre completo del paciente"
                  {...getFieldState('patientName')}
                />
              </FormField>
              
              <FormField label="ID del Paciente" required error={errors.patientId?.message}>
                <Input
                  {...register('patientId', { 
                    required: 'El ID del paciente es obligatorio'
                  })}
                  placeholder="ID o número de historial clínico"
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
              <FormField label="Diagnóstico" required error={errors.diagnosis?.message}>
                <Textarea
                  {...register('diagnosis', { 
                    required: 'El diagnóstico es obligatorio',
                    minLength: { value: 10, message: 'Por favor proporcione un diagnóstico detallado' }
                  })}
                  placeholder="Describa el diagnóstico médico del paciente..."
                  {...getFieldState('diagnosis')}
                />
              </FormField>
              
              <FormField label="Medicamentos Prescritos" required error={errors.medication?.message}>
                <Textarea
                  {...register('medication', { 
                    required: 'Los medicamentos son obligatorios',
                    minLength: { value: 5, message: 'Por favor especifique los medicamentos' }
                  })}
                  placeholder="Liste los medicamentos prescritos (nombre, presentación)..."
                  {...getFieldState('medication')}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Dosis" required error={errors.dosage?.message}>
                  <Input
                    {...register('dosage', { 
                      required: 'La dosis es obligatoria'
                    })}
                    placeholder="Ej: 500mg cada 8 horas"
                    {...getFieldState('dosage')}
                  />
                </FormField>
                
                <FormField label="Duración del Tratamiento" required error={errors.duration?.message}>
                  <Input
                    {...register('duration', { 
                      required: 'La duración del tratamiento es obligatoria'
                    })}
                    placeholder="Ej: 7 días"
                    {...getFieldState('duration')}
                  />
                </FormField>
              </div>

              <FormField label="Instrucciones Adicionales" error={errors.instructions?.message}>
                <Textarea
                  {...register('instructions')}
                  placeholder="Instrucciones especiales para el paciente (tomar con alimentos, evitar alcohol, etc.)..."
                  {...getFieldState('instructions')}
                />
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Firma Digital y Sello Médico */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Validación Médica</h2>
            <div className="space-y-4">
              <FormField label="Nombre del Médico" required error={errors.doctorName?.message}>
                <Input
                  {...register('doctorName', { 
                    required: 'El nombre del médico es obligatorio'
                  })}
                  placeholder="Nombre completo del médico tratante"
                  {...getFieldState('doctorName')}
                />
              </FormField>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField label="Firma Digital" required error={errors.doctorSignature?.message}>
                  <Input
                    {...register('doctorSignature', { 
                      required: 'La firma digital es obligatoria'
                    })}
                    placeholder="Código de firma digital"
                    {...getFieldState('doctorSignature')}
                  />
                </FormField>
                
                <FormField label="Sello Médico" required error={errors.medicalSeal?.message}>
                  <Input
                    {...register('medicalSeal', { 
                      required: 'El sello médico es obligatorio'
                    })}
                    placeholder="Número de sello profesional"
                    {...getFieldState('medicalSeal')}
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
      </Card>
    </div>
  );
};
