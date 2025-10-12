import React, { useState } from 'react';
import { useForm } from 'react-hook-form@7.55.0';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

// Componente de Guía de Estilo
const StyleGuide = () => (
  <Card className="mb-8 p-6 bg-white">
    <h2 className="text-lg font-bold text-[#3c5661] mb-4">Guía de Estilo - Sakura Haruno Medical System</h2>
    
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Colores */}
      <div>
        <h3 className="font-semibold text-sm text-[#3c5661] mb-3">Colores</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#882238]"></div>
            <span className="text-xs text-[#3c5661]">Primario: #882238</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f4c0c2]"></div>
            <span className="text-xs text-[#3c5661]">Acento: #f4c0c2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#72be9a]"></div>
            <span className="text-xs text-[#3c5661]">Éxito: #72be9a</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#f2ede9] border border-[#f4c0c2]"></div>
            <span className="text-xs text-[#3c5661]">Fondo: #f2ede9</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#3c5661]"></div>
            <span className="text-xs text-[#3c5661]">Texto: #3c5661</span>
          </div>
        </div>
      </div>

      {/* Tipografía */}
      <div>
        <h3 className="font-semibold text-sm text-[#3c5661] mb-3">Tipografía</h3>
        <div className="space-y-2">
          <div className="font-bold text-base text-[#3c5661]">Títulos: Inter Bold 16pt</div>
          <div className="font-medium text-xs text-[#3c5661]">Etiquetas: Inter Medium 12pt</div>
          <div className="font-normal text-xs text-[#3c5661]">Texto: Inter Regular 12pt</div>
        </div>
      </div>

      {/* Espaciado */}
      <div>
        <h3 className="font-semibold text-sm text-[#3c5661] mb-3">Espaciado</h3>
        <div className="space-y-2 text-xs text-[#3c5661]">
          <div>Grilla: sistema 8px</div>
          <div>Padding input: 16px</div>
          <div>Margen sección: 24px</div>
        </div>
      </div>

      {/* Botones */}
      <div>
        <h3 className="font-semibold text-sm text-[#3c5661] mb-3">Botones</h3>
        <div className="space-y-2">
          <Button 
            size="sm" 
            className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-4 py-2 text-xs"
          >
            Primario
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            className="border-[#f4c0c2] text-[#882238] hover:bg-[#f4c0c2] hover:text-[#882238] rounded-lg px-4 py-2 text-xs"
          >
            Secundario
          </Button>
        </div>
      </div>
    </div>
  </Card>
);

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

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
  success?: boolean;
  options: { value: string; label: string }[];
}

const Select: React.FC<SelectProps> = ({ error, success, options, className = '', ...props }) => {
  const baseClasses = "w-full px-4 py-4 text-xs border rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 bg-white text-[#3c5661]";
  
  let borderClasses = "border-[#f4c0c2] hover:border-[#882238]";
  
  if (error) {
    borderClasses = "border-[#882238] focus:border-[#882238]";
  } else if (success) {
    borderClasses = "border-[#72be9a] focus:border-[#72be9a]";
  }
  
  return (
    <select 
      className={`${baseClasses} ${borderClasses} ${className}`}
      {...props}
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
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
interface FormData {
  patientName: string;
  age: number;
  chakraType: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  allergiesConditions: string;
  currentCondition: string;
}

// Main Form Component
export const PatientRegistrationForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, touchedFields },
    watch,
    reset
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onSubmit = (data: FormData) => {
    console.log('Formulario enviado:', data);
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  const onReset = () => {
    reset();
    setIsSubmitted(false);
  };

  // Helper function to determine field state
  const getFieldState = (fieldName: keyof FormData) => {
    const hasError = !!errors[fieldName];
    const isTouched = !!touchedFields[fieldName];
    const hasValue = watchedFields[fieldName];
    const isSuccess = isTouched && !hasError && hasValue;
    
    return { error: hasError, success: isSuccess };
  };

  const chakraOptions = [
    { value: '', label: 'Seleccionar tipo de chakra' },
    { value: 'fire', label: 'Fuego (Katon)' },
    { value: 'water', label: 'Agua (Suiton)' },
    { value: 'lightning', label: 'Rayo (Raiton)' },
    { value: 'wind', label: 'Viento (Futon)' },
    { value: 'earth', label: 'Tierra (Doton)' }
  ];

  const conditionOptions = [
    { value: '', label: 'Seleccionar condición actual' },
    { value: 'stable', label: 'Estable' },
    { value: 'critical', label: 'Crítico' },
    { value: 'urgent', label: 'Urgente' }
  ];

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
        <StyleGuide />
        <Card className="p-8 text-center bg-white">
          <div className="text-[#72be9a] text-4xl mb-4">✓</div>
          <h2 className="font-bold mb-4 text-[#3c5661]">¡Registro Exitoso!</h2>
          <p className="text-[#3c5661] opacity-75 mb-6">La información del paciente ha sido guardada exitosamente.</p>
          <Button 
            onClick={onReset}
            className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-3"
          >
            Registrar Otro Paciente
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <StyleGuide />
      
      <Card className="p-8 bg-white">
        <h1 className="font-bold mb-6 text-[#3c5661]">Formulario de Registro y Consulta Médica</h1>
        
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
                  placeholder="Ingrese el nombre completo del paciente"
                  {...getFieldState('patientName')}
                />
              </FormField>
              
              <FormField label="Edad" required error={errors.age?.message}>
                <Input
                  type="number"
                  {...register('age', { 
                    required: 'La edad es obligatoria',
                    min: { value: 0, message: 'La edad debe ser un número positivo' },
                    max: { value: 150, message: 'La edad debe ser realista' }
                  })}
                  placeholder="Ingrese la edad"
                  {...getFieldState('age')}
                />
              </FormField>
            </div>
            
            <div className="mt-4">
              <FormField label="Tipo de Chakra Principal" required error={errors.chakraType?.message}>
                <Select
                  {...register('chakraType', { required: 'Por favor seleccione el tipo de chakra principal' })}
                  options={chakraOptions}
                  {...getFieldState('chakraType')}
                />
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Información de Contacto */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Información de Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Número de Teléfono" required error={errors.phone?.message}>
                <Input
                  type="tel"
                  {...register('phone', { 
                    required: 'El número de teléfono es obligatorio',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Formato de número de teléfono inválido'
                    }
                  })}
                  placeholder="+34 (555) 123-4567"
                  {...getFieldState('phone')}
                />
              </FormField>
              
              <FormField label="Dirección de Email" required error={errors.email?.message}>
                <Input
                  type="email"
                  {...register('email', { 
                    required: 'El email es obligatorio',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Formato de email inválido'
                    }
                  })}
                  placeholder="paciente@ejemplo.com"
                  {...getFieldState('email')}
                />
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Contacto de Emergencia */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Contacto de Emergencia</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField label="Nombre del Contacto de Emergencia" required error={errors.emergencyContactName?.message}>
                <Input
                  {...register('emergencyContactName', { 
                    required: 'El nombre del contacto de emergencia es obligatorio',
                    minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                  })}
                  placeholder="Ingrese el nombre del contacto de emergencia"
                  {...getFieldState('emergencyContactName')}
                />
              </FormField>
              
              <FormField label="Teléfono del Contacto de Emergencia" required error={errors.emergencyContactPhone?.message}>
                <Input
                  type="tel"
                  {...register('emergencyContactPhone', { 
                    required: 'El teléfono del contacto de emergencia es obligatorio',
                    pattern: {
                      value: /^[\+]?[1-9][\d]{0,15}$/,
                      message: 'Formato de número de teléfono inválido'
                    }
                  })}
                  placeholder="+34 (555) 123-4567"
                  {...getFieldState('emergencyContactPhone')}
                />
              </FormField>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Sección de Información Médica */}
          <div>
            <h2 className="font-bold mb-4 text-[#3c5661]">Información Médica</h2>
            <div className="space-y-4">
              <FormField label="Historial Médico" error={errors.medicalHistory?.message}>
                <Textarea
                  {...register('medicalHistory')}
                  placeholder="Por favor describa el historial médico relevante, tratamientos previos, cirugías..."
                  {...getFieldState('medicalHistory')}
                />
              </FormField>
              
              <FormField label="Alergias y Condiciones Adversas" error={errors.allergiesConditions?.message}>
                <Textarea
                  {...register('allergiesConditions')}
                  placeholder="Describa alergias conocidas, reacciones adversas a medicamentos, condiciones especiales..."
                  {...getFieldState('allergiesConditions')}
                />
              </FormField>
              
              <FormField label="Condición Actual" required error={errors.currentCondition?.message}>
                <Select
                  {...register('currentCondition', { required: 'Por favor seleccione la condición actual' })}
                  options={conditionOptions}
                  {...getFieldState('currentCondition')}
                />
              </FormField>
            </div>
          </div>

          {/* Acciones del Formulario */}
          <div className="flex gap-4 pt-6">
            <Button
              type="submit"
              className="flex-1 bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-6 py-3"
            >
              Enviar Registro
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onReset}
              className="border-[#f4c0c2] text-[#882238] hover:bg-[#f4c0c2] hover:text-[#882238] rounded-lg px-6 py-3"
            >
              Reiniciar Formulario
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};