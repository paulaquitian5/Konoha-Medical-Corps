import React, { useState } from 'react';
import axios from 'axios';
import { useForm } from "react-hook-form";
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Separator } from './ui/separator';

// Opciones para los select
const aldeaOptions = [
  { value: '', label: 'Seleccione Aldea' },
  { value: 'Konoha', label: 'Konoha' },
  { value: 'Suna', label: 'Suna' },
  { value: 'Kiri', label: 'Kiri' },
  { value: 'Iwa', label: 'Iwa' },
  { value: 'Kumo', label: 'Kumo' },
];

const clanOptions = [
  { value: '', label: 'Seleccione Clan' },
  { value: 'Uchiha', label: 'Uchiha' },
  { value: 'Hyuga', label: 'Hyuga' },
  { value: 'Senju', label: 'Senju' },
  { value: 'Nara', label: 'Nara' },
];

const rangoOptions = [
  { value: '', label: 'Seleccione Rango' },
  { value: 'Genin', label: 'Genin' },
  { value: 'Chunin', label: 'Chunin' },
  { value: 'Jounin', label: 'Jounin' },
  { value: 'Kage', label: 'Kage' },
];

const grupoSanguineoOptions = [
  { value: '', label: 'Seleccione Grupo Sanguíneo' },
  { value: 'A+', label: 'A+' },
  { value: 'A-', label: 'A-' },
  { value: 'B+', label: 'B+' },
  { value: 'B-', label: 'B-' },
  { value: 'AB+', label: 'AB+' },
  { value: 'AB-', label: 'AB-' },
  { value: 'O+', label: 'O+' },
  { value: 'O-', label: 'O-' },
];


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

interface FormData {
  patientName: string;
  apellido?: string;
  aldea?: string;
  clan?: string;
  rango?: string;
  fechaNacimiento?: string;
  sexo?: string;
  estado?: string;
  grupoSanguineo?: string;
  phone: string;
  email: string;
  name?: string;
  chakraType: string;
  chakraCapacidad?: string;
  chakraFluctuacion?: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory?: string;
  allergiesConditions?: string;
  currentCondition: string;
}

// Formulario Principal
export const PatientRegistrationForm: React.FC = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
    watch,
    reset
  } = useForm<FormData>({
    mode: 'onChange',
  });

  const watchedFields = watch();

  const onReset = () => {
    reset();
    setIsSubmitted(false);
  };

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

  const onSubmit = async (data: FormData) => {

    try {
      // Payload plano compatible con backend
      const pacientePayload = {
        nombre: data.patientName,
        apellido: data.apellido || '',
        aldea: data.aldea || 'Konoha',
        clan: data.clan || '',
        rango: data.rango || 'Genin',
        fechaNacimiento: data.fechaNacimiento || '2000-01-01',
        sexo: data.sexo || 'No especificado',
        estado: data.estado || 'Activo',
        grupoSanguineo: data.grupoSanguineo || 'O+',
        chakra: {
          tipo: data.chakraType,
          capacidad: data.chakraCapacidad || 'Normal',
          fluctuacion: data.chakraFluctuacion || 'Estable'
        },
        phone: data.phone,
        email: data.email,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        medicalHistory: data.medicalHistory || '',
        allergiesConditions: data.allergiesConditions || '',
        currentCondition: data.currentCondition
      };

      console.log("Datos que se van a enviar:", data);
      console.log("Payload a enviar:", pacientePayload);
      alert(JSON.stringify(pacientePayload, null, 2));

      const response = await axios.post('https://konoha-medical-corps-backend.onrender.com/api/pacientes', pacientePayload);
      console.log('Paciente guardado:', response.data);

      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 3000);
      reset();
    } catch (error: any) {
      console.error('Error al guardar el paciente:', error.response?.data || error.message);
      alert('Ocurrió un error al guardar el paciente. Revisa la consola para más detalles.');
    }
  };

  if (isSubmitted) {
    return (
      <div className="max-w-2xl mx-auto">
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


      <Card className="p-8 bg-white">
        <h1 className="font-bold mb-6 text-[#3c5661]">Formulario de Registro y Consulta Médica</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Sección de Información del Paciente */}
          <h2 className="font-bold mb-4 text-[#3c5661]">Información del Paciente</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField label="Nombre del Paciente" required error={errors.patientName?.message}>
              <Input
                {...register('patientName', {
                  required: 'El nombre del paciente es obligatorio',
                  minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' }
                })}
                placeholder="Ingrese el nombre completo del paciente"
              />
            </FormField>

            <FormField label="Apellido" required error={errors.apellido?.message}>
              <Input
                {...register('apellido', {
                  required: 'El apellido es obligatorio',
                  minLength: { value: 2, message: 'El apellido debe tener al menos 2 caracteres' }
                })}
                placeholder="Ingrese el apellido"
              />
            </FormField>

            <FormField label="Aldea" required error={errors.aldea?.message}>
              <Select
                {...register('aldea', { required: 'Seleccione la aldea' })}
                options={aldeaOptions}
              />
            </FormField>

            <FormField label="Clan" required error={errors.clan?.message}>
              <Select
                {...register('clan', { required: 'Seleccione el clan' })}
                options={clanOptions}
              />
            </FormField>

            <FormField label="Rango" required error={errors.rango?.message}>
              <Select
                {...register('rango', { required: 'Seleccione el rango' })}
                options={rangoOptions}
              />
            </FormField>

            <FormField label="Grupo Sanguíneo" required error={errors.grupoSanguineo?.message}>
              <Select
                {...register('grupoSanguineo', { required: 'Seleccione el grupo sanguíneo' })}
                options={grupoSanguineoOptions}
              />
            </FormField>

            <FormField label="Fecha de Nacimiento" error={errors.fechaNacimiento?.message}>
              <Input
                type="date"
                {...register('fechaNacimiento')}
              />
            </FormField>

            <FormField label="Sexo" error={errors.sexo?.message}>
              <Select
                {...register('sexo')}
                options={[
                  { value: '', label: 'Seleccionar sexo' },
                  { value: 'Masculino', label: 'Masculino' },
                  { value: 'Femenino', label: 'Femenino' },
                  { value: 'No especificado', label: 'No especificado' },
                ]}
              />
            </FormField>

            <FormField label="Estado" error={errors.estado?.message}>
              <Select
                {...register('estado')}
                options={[
                  { value: '', label: 'Seleccionar estado' },
                  { value: 'Activo', label: 'Activo' },
                  { value: 'Inactivo', label: 'Inactivo' },
                ]}
              />
            </FormField>

            <FormField label="Tipo de Chakra Principal" required error={errors.chakraType?.message}>
              <Select
                {...register('chakraType', { required: 'Por favor seleccione el tipo de chakra principal' })}
                options={chakraOptions}
              />
            </FormField>

            <FormField label="Capacidad de Chakra" error={errors.chakraCapacidad?.message}>
              <Select
                {...register('chakraCapacidad')}
                options={[
                  { value: '', label: 'Seleccionar capacidad' },
                  { value: 'Baja', label: 'Baja' },
                  { value: 'Normal', label: 'Normal' },
                  { value: 'Alta', label: 'Alta' },
                ]}
              />
            </FormField>

            <FormField label="Fluctuación de Chakra" error={errors.chakraFluctuacion?.message}>
              <Select
                {...register('chakraFluctuacion')}
                options={[
                  { value: '', label: 'Seleccionar fluctuación' },
                  { value: 'Inestable', label: 'Inestable' },
                  { value: 'Estable', label: 'Estable' },
                ]}
              />
            </FormField>
          </div>


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
                />
              </FormField>

              <FormField label="Alergias y Condiciones Adversas" error={errors.allergiesConditions?.message}>
                <Textarea
                  {...register('allergiesConditions')}
                  placeholder="Describa alergias conocidas, reacciones adversas a medicamentos, condiciones especiales..."
                />
              </FormField>

              <FormField label="Condición Actual" required error={errors.currentCondition?.message}>
                <Select
                  {...register('currentCondition', { required: 'Por favor seleccione la condición actual' })}
                  options={conditionOptions}
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
