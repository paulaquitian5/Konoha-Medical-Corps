import { useState, useEffect, useMemo } from "react";
import { Search, Users, Grid, List, Eye, Edit, User, Phone, Mail, AlertCircle } from 'lucide-react';
import axios from 'axios';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';
import { ViewType } from '../types/view';

// Componente de notificación
const Notification: React.FC<{ message: string; type: 'success' | 'error'; onClose: () => void }> = ({ message, type, onClose }) => {
  return (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-100 text-green-800 border border-green-300' : 'bg-red-100 text-red-800 border border-red-300'}`}>
      <div className="flex items-center justify-between">
        <span>{message}</span>
        <button onClick={onClose} className="ml-4 text-lg font-bold">&times;</button>
      </div>
    </div>
  );
};

// Interfaz para el tipo de paciente
interface Patient {
  id: string;
  name: string;
  age: number;
  chakraType: string;
  estado: string;
  currentCondition: string;
  rango?: string;
  aldea?: string;
  grupoSanguineo?: string;
  phone?: string;
  email?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  medicalHistory?: string;
}
interface PatientDetailProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (updatedPatient: Patient) => void;
  onDelete?: (id: string) => void;
  showNotification?: (msg: string, type: 'success' | 'error') => void;
  canEdit?: boolean;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, isOpen, onClose, onEdit, onDelete, canEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [editedMedicalHistory, setEditedMedicalHistory] = useState(patient.medicalHistory);

  const showLocalNotification = (message: string, type: 'success' | 'error') => {
    console.log("NOTIFICACIÓN DISPARADA:", notification);
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };


  useEffect(() => {
    setEditedMedicalHistory(patient.medicalHistory);
    setIsEditing(false);
  }, [patient]);

  const [editedData, setEditedData] = useState({
    name: patient.name,
    age: patient.age,
    chakraType: patient.chakraType,
    rango: patient.rango || '',
    aldea: patient.aldea || '',
    phone: patient.phone || '',
    email: patient.email || '',
    emergencyContactName: patient.emergencyContactName || '',
    emergencyContactPhone: patient.emergencyContactPhone || '',
    medicalHistory: patient.medicalHistory || '',
    currentCondition: patient.currentCondition || 'stable'
  });

  // Actualizar cuando cambie el paciente
  useEffect(() => {
    setEditedData({
      name: patient.name,
      age: patient.age,
      chakraType: patient.chakraType,
      rango: patient.rango || '',
      aldea: patient.aldea || '',
      phone: patient.phone || '',
      email: patient.email || '',
      emergencyContactName: patient.emergencyContactName || '',
      emergencyContactPhone: patient.emergencyContactPhone || '',
      medicalHistory: patient.medicalHistory || '',
      currentCondition: patient.currentCondition || 'stable'
    });
    setIsEditing(false);
    setNotification(null);
  }, [patient]);

  // Manejar cambios en los inputs mientras editas
  const handleChange = (field: string, value: string | number) => {
    setEditedData(prev => ({ ...prev, [field]: value }));
  };


  // Guardar cambios - envía PUT al backend
  const handleSave = async () => {
    try {
      setIsSaving(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

      const response = await axios.put(`${API_URL}/api/pacientes/${patient.id}`, editedData);

      onEdit?.({
        ...patient,
        ...editedData
      });
      // Notificación local del modal
      showLocalNotification("Paciente actualizado exitosamente", "success");

      setIsEditing(false);
    } catch (error: any) {
      console.error("Error al actualizar paciente:", error);

      showLocalNotification(
        `Error al actualizar: ${error.response?.data?.message || error.message}`,
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Cancelar edición - restaura valores originales
  const handleCancel = () => {
    setEditedData({
      name: patient.name,
      age: patient.age,
      chakraType: patient.chakraType,
      rango: patient.rango || '',
      aldea: patient.aldea || '',
      phone: patient.phone || '',
      email: patient.email || '',
      emergencyContactName: patient.emergencyContactName || '',
      emergencyContactPhone: patient.emergencyContactPhone || '',
      medicalHistory: patient.medicalHistory || '',
      currentCondition: patient.currentCondition || 'stable'
    });
    setIsEditing(false);
  };

  const getChakraTypeText = (type: string) => {
    switch (type) {
      case 'fire': return 'Fuego (Katon)';
      case 'water': return 'Agua (Suiton)';
      case 'lightning': return 'Rayo (Raiton)';
      case 'wind': return 'Viento (Futon)';
      case 'earth': return 'Tierra (Doton)';
      default: return type;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'stable': return 'Estable';
      case 'critical': return 'Crítico';
      case 'urgent': return 'Urgente';
      default: return condition;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'stable': return 'bg-[#72be9a] text-white';
      case 'critical': return 'bg-[#882238] text-white';
      case 'urgent': return 'bg-[#f4c0c2] text-[#882238]';
      default: return 'bg-[#3c5661] text-white';
    }
  };

  return (
    <>
      {/* Notificación flotante - aparece arriba a la derecha */}
      {notification && (
        <div className="noti">
          {notification.message}
        </div>
      )}


      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span className="font-bold text-[#3c5661]">Detalle del Paciente</span>
              {canEdit && !isEditing && (
                <div className="flex gap-2">
                  <Button
                    onClick={() => setIsEditing(true)}
                    className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-4 py-2 text-xs"
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    onClick={() => onDelete && onDelete(patient.id)}
                    className="bg-red-600 hover:bg-red-700 text-white rounded-lg px-4 py-2 text-xs"
                  >
                    Eliminar
                  </Button>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Información Básica */}
            <div>
              <h3 className="font-bold mb-4 text-[#3c5661]">Información Básica</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Nombre del Paciente</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.name}
                      onChange={(e) => handleChange('name', e.target.value)}
                      className="w-full p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661] border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.name}</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">ID Ninja</label>
                  <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.id}</div>
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Edad</label>
                  {isEditing ? (
                    <input
                      type="number"
                      value={editedData.age}
                      onChange={(e) => handleChange('age', parseInt(e.target.value))}
                      className="w-full p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661] border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.age} años</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Tipo de Chakra</label>
                  {isEditing ? (
                    <select
                      value={editedData.chakraType}
                      onChange={(e) => handleChange('chakraType', e.target.value)}
                      className="w-full p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661] border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    >
                      <option value="fire">Fuego (Katon)</option>
                      <option value="water">Agua (Suiton)</option>
                      <option value="lightning">Rayo (Raiton)</option>
                      <option value="wind">Viento (Futon)</option>
                      <option value="earth">Tierra (Doton)</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{getChakraTypeText(patient.chakraType)}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Información Ninja - AHORA EDITABLE */}
            <div>
              <h3 className="font-bold mb-4 text-[#3c5661]">Información Ninja</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Rango</label>
                  {isEditing ? (
                    <select
                      value={editedData.rango}
                      onChange={(e) => handleChange('rango', e.target.value)}
                      className="w-full p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661] border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    >
                      <option value="">Seleccionar rango</option>
                      <option value="Genin">Genin</option>
                      <option value="Chunin">Chunin</option>
                      <option value="Jounin">Jounin</option>
                      <option value="Kage">Kage</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.rango}</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Villa</label>
                  {isEditing ? (
                    <select
                      value={editedData.aldea}
                      onChange={(e) => handleChange('aldea', e.target.value)}
                      className="w-full p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661] border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    >
                      <option value="">Seleccionar aldea</option>
                      <option value="Konoha">Konoha</option>
                      <option value="Suna">Suna</option>
                      <option value="Kiri">Kiri</option>
                      <option value="Iwa">Iwa</option>
                      <option value="Kumo">Kumo</option>
                    </select>
                  ) : (
                    <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.aldea}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Información de Contacto - AHORA EDITABLE */}
            <div>
              <h3 className="font-bold mb-4 text-[#3c5661]">Información de Contacto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.phone}
                      onChange={(e) => handleChange('phone', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.phone}</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editedData.email}
                      onChange={(e) => handleChange('email', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.email}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Contacto de Emergencia - AHORA EDITABLE */}
            <div>
              <h3 className="font-bold mb-4 text-[#3c5661]">Contacto de Emergencia</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Nombre</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editedData.emergencyContactName}
                      onChange={(e) => handleChange('emergencyContactName', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.emergencyContactName}</div>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Teléfono</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editedData.emergencyContactPhone}
                      onChange={(e) => handleChange('emergencyContactPhone', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.emergencyContactPhone}</div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Información Médica - AHORA EDITABLE */}
            <div>
              <h3 className="font-bold mb-4 text-[#3c5661]">Información Médica</h3>
              <div className="space-y-4">
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Condición Actual</label>
                  {isEditing ? (
                    <select
                      value={editedData.currentCondition}
                      onChange={(e) => handleChange('currentCondition', e.target.value)}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    >
                      <option value="stable">Estable</option>
                      <option value="critical">Crítico</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  ) : (
                    <Badge className={`${getConditionColor(patient.currentCondition)} text-xs px-3 py-1`}>
                      {getConditionText(patient.currentCondition)}
                    </Badge>
                  )}
                </div>
                <div>
                  <label className="block font-medium text-xs text-[#3c5661] mb-2">Historial Médico</label>
                  {isEditing ? (
                    <textarea
                      value={editedData.medicalHistory}
                      onChange={(e) => handleChange('medicalHistory', e.target.value)}
                      rows={4}
                      className="w-full p-3 bg-gray-50 rounded-lg text-xs border border-[#882238] focus:outline-none focus:ring-2 focus:ring-[#882238]"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg text-xs whitespace-pre-wrap">{patient.medicalHistory}</div>
                  )}
                </div>
              </div>
            </div>

            {/* Botones de acción - Aparecen solo cuando estás editando */}
            {isEditing && (
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-800 text-xs px-4 py-3 rounded-lg disabled:opacity-50"
                >
                  Cancelar
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// Componente principal de consulta
export const PatientConsultationForm: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [conditionFilter, setConditionFilter] = useState('');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        // Log para verificar la URL
        const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
        console.log(' Intentando conectar a:', `${apiUrl}/api/pacientes`);

        const res = await axios.get(`${apiUrl}/api/pacientes`);

        console.log(' Respuesta completa:', res);
        console.log(' Datos recibidos:', res.data);
        console.log(' Tipo de res.data:', typeof res.data);
        console.log(' Es array res.data?:', Array.isArray(res.data));

        // Manejo más robusto de la respuesta
        let pacientesRaw = [];

        if (res.data && Array.isArray(res.data.pacientes)) {
          console.log(' Formato: { pacientes: [...] }');
          pacientesRaw = res.data.pacientes;
        } else if (Array.isArray(res.data)) {
          console.log(' Formato: [...]');
          pacientesRaw = res.data;
        } else {
          console.error(' Formato inesperado:', res.data);
          setNotification({
            message: 'Formato de respuesta inesperado del servidor',
            type: 'error'
          });
          setPatients([]);
          setLoading(false);
          return;
        }

        console.log(' Total de pacientes crudos:', pacientesRaw.length);
        console.log(' Primer paciente crudo:', pacientesRaw[0]);

        if (pacientesRaw.length === 0) {
          console.warn(' No hay pacientes en la base de datos');
          setNotification({
            message: 'No hay pacientes registrados en la base de datos',
            type: 'error'
          });
        }

        const pacientesAdaptados = pacientesRaw.map((p: any) => {
          const paciente = {
            id: p.id || p._id || "Sin ID",
            name: p.name || `${p.nombre ?? ''} ${p.apellido ?? ''}`.trim() || "Sin nombre",
            age: p.age ?? p.edad ?? 0,
            rango: p.rango || "No asignado",
            aldea: p.aldea || "No registrada",
            estado: p.estado || "Desconocido",
            chakraType: p.chakraType || p.chakra?.tipo || "No registrado",
            grupoSanguineo: p.grupoSanguineo || "No registrado",
            currentCondition: p.currentCondition || p.condicion || "stable",
            phone: p.phone || p.telefono || p.contact?.phone || "No registrado",
            email: p.email || p.contact?.email || "No registrado",
            emergencyContactName: p.emergencyContactName || p.contactoEmergencia?.nombre || "No registrado",
            emergencyContactPhone: p.emergencyContactPhone || p.contactoEmergencia?.telefono || "No registrado",
            medicalHistory: p.medicalHistory || p.historialMedico || "Sin historial disponible",
          };

          console.log(' Paciente adaptado:', paciente);
          return paciente;
        });

        setPatients(pacientesAdaptados);
        console.log(' Total pacientes adaptados:', pacientesAdaptados.length);

        if (pacientesAdaptados.length > 0) {
          setNotification({
            message: `${pacientesAdaptados.length} pacientes cargados correctamente`,
            type: 'success'
          });
        }

      } catch (err: any) {
        console.error(' Error completo:', err);
        console.error(' Mensaje de error:', err.message);
        console.error(' Respuesta del servidor:', err.response?.data);
        console.error(' Status:', err.response?.status);

        let errorMsg = 'Error al cargar pacientes';

        if (err.code === 'ERR_NETWORK') {
          errorMsg = 'No se pudo conectar al servidor. Verifica que el backend esté corriendo.';
        } else if (err.response?.status === 404) {
          errorMsg = 'Ruta no encontrada en el servidor. Verifica la URL de la API.';
        } else if (err.response?.status === 500) {
          errorMsg = 'Error del servidor. Revisa los logs del backend.';
        }

        setNotification({ message: errorMsg, type: 'error' });
        setPatients([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();
  }, []);

  // Filtrado de pacientes
  const filteredPatients = useMemo(() => {
    return patients.filter((patient) => {
      const matchesSearch =
        patient.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.rango?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.currentCondition?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCondition =
        !conditionFilter ||
        conditionFilter === 'all' ||
        patient.currentCondition?.toLowerCase() === conditionFilter.toLowerCase();

      return matchesSearch && matchesCondition;
    });
  }, [patients, searchTerm, conditionFilter]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
  };

  const handleEditPatient = (updatedPatient: Patient) => {
    setPatients(prev =>
      prev.map(p => (p.id === updatedPatient.id ? updatedPatient : p))
    );
    setSelectedPatient(updatedPatient);
    setShowDetail(false);
  };

  const handleDeletePatient = async (id: string) => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/pacientes/${id}`);
      setPatients(prev => prev.filter(p => p.id !== id));
      setNotification({ message: `Paciente con ID ${id} eliminado correctamente.`, type: 'success' });
      setShowDetail(false);
    } catch (err) {
      console.error("Error eliminando paciente:", err);
      setNotification({ message: 'Error al eliminar el paciente.', type: 'error' });
    }
  };

  const getChakraTypeText = (type: string) => {
    switch (type) {
      case 'fire': return 'Fuego (Katon)';
      case 'water': return 'Agua (Suiton)';
      case 'lightning': return 'Rayo (Raiton)';
      case 'wind': return 'Viento (Futon)';
      case 'earth': return 'Tierra (Doton)';
      default: return type;
    }
  };

  const getConditionText = (condition: string) => {
    switch (condition) {
      case 'stable': return 'Estable';
      case 'critical': return 'Crítico';
      case 'urgent': return 'Urgente';
      default: return condition;
    }
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'stable': return 'bg-[#00B894] text-white';
      case 'critical': return 'bg-[#D63031] text-white';
      case 'urgent': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <p className="text-gray-500">Cargando datos de pacientes...</p>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}


      <div className="max-w-6xl mx-auto">
        <Card className="p-8 bg-white">
          <CardHeader className="px-0 pt-0">
            <CardTitle className="font-bold text-gray-800 flex items-center gap-2">
              <Users className="w-5 h-5" />
              Consulta de Pacientes
            </CardTitle>
          </CardHeader>

          <CardContent className="px-0 space-y-6">
            {/* Controles de búsqueda y filtros */}
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por nombre, ID ninja o rango..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 text-xs"
                />
              </div>

              <Select value={conditionFilter} onValueChange={setConditionFilter}>
                <SelectTrigger className="text-xs w-full lg:w-[180px]">
                  <SelectValue placeholder="Todas las condiciones" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-200 shadow-lg rounded-lg z-50">
                  <SelectItem value="all">Todas las condiciones</SelectItem>
                  <SelectItem value="stable">Estable</SelectItem>
                  <SelectItem value="critical">Crítico</SelectItem>
                  <SelectItem value="urgent">Urgente</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'outline'}
                  onClick={() => setViewMode('table')}
                  className={`px-4 py-2 rounded-lg text-xs ${viewMode === 'table'
                    ? 'bg-[#3c5661] hover:opacity-90 text-white'
                    : 'border-[#3c5661] text-[#3c5661] hover:bg-[#3c5661] hover:text-white'
                    }`}
                >
                  <List className="w-4 h-4 mr-2" />
                  Lista
                </Button>
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'outline'}
                  onClick={() => setViewMode('cards')}
                  className={`px-4 py-2 rounded-lg text-xs ${viewMode === 'cards'
                    ? 'bg-[#3c5661] hover:opacity-90 text-white'
                    : 'border-[#3c5661] text-[#3c5661] hover:bg-[#3c5661] hover:text-white'
                    }`}
                >
                  <Grid className="w-4 h-4 mr-2" />
                  Tarjetas
                </Button>
              </div>
            </div>

            {/* Resultados */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <p className="text-xs text-gray-600">
                  {filteredPatients.length} paciente{filteredPatients.length !== 1 ? 's' : ''} encontrado{filteredPatients.length !== 1 ? 's' : ''}
                </p>
              </div>

              {viewMode === 'table' ? (
                // Vista de tabla
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-medium text-xs text-gray-700">Nombre</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">ID</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">Edad</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">Chakra</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">Rango</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">Condición</TableHead>
                        <TableHead className="font-medium text-xs text-gray-700">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredPatients.map((patient) => (
                        <TableRow key={patient.id} className="hover:bg-gray-50">
                          <TableCell className="text-xs font-medium">{patient.name}</TableCell>
                          <TableCell className="text-xs">{patient.id}</TableCell>
                          <TableCell className="text-xs">{patient.age}</TableCell>
                          <TableCell className="text-xs">{getChakraTypeText(patient.chakraType)}</TableCell>
                          <TableCell className="text-xs">{patient.rango}</TableCell>
                          <TableCell>
                            <Badge className={`${getConditionColor(patient.currentCondition)} text-xs px-2 py-1`}>
                              {getConditionText(patient.currentCondition)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <Button
                              onClick={() => handlePatientSelect(patient)}
                              className="bg-[#3c5661] hover:bg-[#1E40CC] text-white rounded-lg px-3 py-1 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Ver
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                // Vista de tarjetas
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredPatients.map((patient) => (
                    <Card key={patient.id} className="hover:shadow-lg transition-shadow duration-200">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="font-bold text-sm text-gray-800">{patient.name}</h3>
                            <p className="text-xs text-gray-600">{patient.id} - {patient.rango}</p>
                          </div>
                          <Badge className={`${getConditionColor(patient.currentCondition)} text-xs px-2 py-1`}>
                            {getConditionText(patient.currentCondition)}
                          </Badge>
                        </div>

                        <div className="space-y-2 mb-4">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <User className="w-3 h-3" />
                            {patient.age} años - Chakra {getChakraTypeText(patient.chakraType)}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Mail className="w-3 h-3" />
                            {patient.email}
                          </div>
                        </div>

                        <Button
                          onClick={() => handlePatientSelect(patient)}
                          className="w-full bg-[#3c5661] hover:bg-[#3c5661] text-white rounded-lg px-4 py-2 text-xs"
                        >
                          <Eye className="w-3 h-3 mr-2" />
                          Ver Detalle
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {filteredPatients.length === 0 && (
                <div className="text-center py-8">
                  <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 text-sm">No se encontraron pacientes que coincidan con los criterios de búsqueda</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Modal de detalle del paciente */}
        {selectedPatient && (
          <PatientDetail
            patient={selectedPatient}
            isOpen={showDetail}
            onClose={() => setShowDetail(false)}
            onEdit={handleEditPatient}
            onDelete={handleDeletePatient}
            showNotification={showNotification}
            canEdit={true}
          />
        )}
      </div>
    </>
  );
};

export default PatientConsultationForm;