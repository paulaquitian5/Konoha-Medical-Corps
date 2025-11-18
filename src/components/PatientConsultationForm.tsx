import React, { useEffect, useState, useMemo } from 'react';
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

// Componente de notificación (agregado para mostrar mensajes de éxito/error)
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
  canEdit?: boolean;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, isOpen, onClose, onEdit, onDelete, canEdit = true }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedMedicalHistory, setEditedMedicalHistory] = useState(patient.medicalHistory);

  useEffect(() => {
    setEditedMedicalHistory(patient.medicalHistory);
    setIsEditing(false);
  }, [patient]);

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
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
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.name}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">ID Ninja</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.id}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">Edad</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.age} años</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">Tipo de Chakra</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{getChakraTypeText(patient.chakraType)}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Ninja */}
          <div>
            <h3 className="font-bold mb-4 text-[#3c5661]">Información Ninja</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">Rango</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.rango}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">Villa</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.aldea}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información de Contacto */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Información de Contacto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Teléfono</label>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.phone}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Email</label>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.email}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Contacto de Emergencia */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Contacto de Emergencia</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Nombre</label>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.emergencyContactName}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Teléfono</label>
                <div className="p-3 bg-gray-50 rounded-lg text-xs">{patient.emergencyContactPhone}</div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Información Médica */}
          <div>
            <h3 className="font-bold mb-4 text-gray-800">Información Médica</h3>
            <div className="space-y-4">
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Condición Actual</label>
                <Badge className={`${getConditionColor(patient.currentCondition)} text-xs px-3 py-1`}>
                  {getConditionText(patient.currentCondition)}
                </Badge>
              </div>
              <div>
                <label className="block font-medium text-xs text-gray-700 mb-2">Historial Médico</label>
                {isEditing ? (
                  <textarea
                    value={editedMedicalHistory}
                    onChange={(e) => setEditedMedicalHistory(e.target.value)}
                    className="p-3 bg-gray-50 rounded-lg text-xs w-full"
                  />
                ) : (
                  <div className="p-3 bg-gray-50 rounded-lg text-xs whitespace-pre-wrap">{patient.medicalHistory}</div>
                )}
              </div>
            </div>
          </div>

          {/* Botones Guardar / Cancelar */}
          {isEditing && (
            <div className="flex gap-2 mt-4">
              <Button
                onClick={() => {
                  onEdit && onEdit({ ...patient, medicalHistory: editedMedicalHistory });
                  setIsEditing(false);
                }}
                className="bg-green-600 text-white text-xs px-4 py-2 rounded-lg"
              >
                Guardar
              </Button>
              <Button
                onClick={() => {
                  setEditedMedicalHistory(patient.medicalHistory);
                  setIsEditing(false);
                }}
                className="bg-gray-300 text-gray-800 text-xs px-4 py-2 rounded-lg"
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
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


  useEffect(() => {
    const fetchPacientes = async () => {
      try {
        console.log(' Backend URL:', import.meta.env.VITE_API_URL);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pacientes`);
        console.log('Datos recibidos:', res.data);
        console.log('Primer paciente crudo:', res.data.pacientes[1]);


        if (res.data && Array.isArray(res.data.pacientes)) {
          if (res.data && Array.isArray(res.data.pacientes)) {
            const pacientesAdaptados = res.data.pacientes.map((p: any) => ({
              id: p.id || p._id || "Sin ID",
              name: p.name || `${p.nombre ?? ''} ${p.apellido ?? ''}`.trim() || "Sin nombre",
              age: p.age ?? 0,
              rango: p.rango || "No asignado",
              aldea: p.aldea || "No registrada",
              estado: p.estado || "Desconocido",
              chakraType: p.chakraType || p.chakra?.tipo || "No registrado",
              grupoSanguineo: p.grupoSanguineo || "No registrado",
              currentCondition: p.currentCondition || "stable",
              phone: p.phone ?? p.contact?.phone ?? "No registrado",
              email: p.email ?? p.contact?.email ?? "No registrado",
              emergencyContactName: p.emergencyContactName ?? "No registrado",
              emergencyContactPhone: p.emergencyContactPhone ?? "No registrado",

              medicalHistory: p.medicalHistory || "Sin historial disponible",
            }));

            setPatients(pacientesAdaptados);
            console.log("Pacientes adaptados:", pacientesAdaptados);
          }

        } else if (Array.isArray(res.data)) {
          setPatients(res.data);
        } else {
          console.warn('Formato inesperado de respuesta:', res.data);
          setPatients([]);
        }
      } catch (err) {
        console.error('Error al obtener pacientes:', err);
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
    setSelectedPatient(updatedPatient); // opcional, para que el modal refleje los cambios si sigue abierto
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
    <div className="max-w-6xl mx-auto">
      {/* Notificación */}
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
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
              <SelectContent>
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
          canEdit={true}
        />
      )}
    </div>
  );
};
export default PatientConsultationForm;