import React, { useState, useMemo } from 'react';
import { Search, Users, Grid, List, Eye, Edit, User, Phone, Mail, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Badge } from './ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Separator } from './ui/separator';

// Datos mock de pacientes
const mockPatients = [
  {
    id: 'N001',
    name: 'Naruto Uzumaki',
    age: 25,
    chakraType: 'wind',
    phone: '+34 612 345 678',
    email: 'naruto@konoha.com',
    emergencyContactName: 'Iruka Sensei',
    emergencyContactPhone: '+34 612 345 679',
    medicalHistory: 'Historial de lesiones por entrenamiento intensivo. Regeneración acelerada debido a Kyuubi. Múltiples cirugías reconstructivas.',
    allergiesConditions: 'Sensibilidad a ciertos sellos de chakra. Reacciones adversas a medicamentos con base de hierbas de la Villa de la Arena.',
    currentCondition: 'stable',
    ninja: {
      rank: 'Hokage',
      village: 'Konoha'
    }
  },
  {
    id: 'N002',
    name: 'Sasuke Uchiha',
    age: 25,
    chakraType: 'lightning',
    phone: '+34 612 345 680',
    email: 'sasuke@uchiha.com',
    emergencyContactName: 'Sakura Haruno',
    emergencyContactPhone: '+34 612 345 681',
    medicalHistory: 'Pérdida de brazo izquierdo. Sharingan activo. Cirugías reconstructivas previas. Transplante de brazo protésico.',
    allergiesConditions: 'Intolerancia a ciertos medicamentos para el dolor. Reacciones adversas a tratamientos de regeneración celular estándar.',
    currentCondition: 'stable',
    ninja: {
      rank: 'Rogue Ninja',
      village: 'Ex-Konoha'
    }
  },
  {
    id: 'N003',
    name: 'Sakura Haruno',
    age: 24,
    chakraType: 'earth',
    phone: '+34 612 345 682',
    email: 'sakura@medical.konoha.com',
    emergencyContactName: 'Tsunade',
    emergencyContactPhone: '+34 612 345 683',
    medicalHistory: 'Especialista médica ninja. Excelente control de chakra. Sin lesiones significativas. Entrenamiento en Ninjutsu médico avanzado.',
    allergiesConditions: 'Ninguna alergia conocida. Alta resistencia a venenos y toxinas debido a entrenamiento médico.',
    currentCondition: 'stable',
    ninja: {
      rank: 'Jounin Médico',
      village: 'Konoha'
    }
  },
  {
    id: 'N004',
    name: 'Gaara del Desierto',
    age: 26,
    chakraType: 'earth',
    phone: '+34 612 345 684',
    email: 'gaara@suna.com',
    emergencyContactName: 'Temari',
    emergencyContactPhone: '+34 612 345 685',
    medicalHistory: 'Ex-Jinchuuriki de Shukaku. Cirugía de extracción de bijuu. Seguimiento psicológico continuo. Terapia de control emocional.',
    allergiesConditions: 'Sensibilidad residual a fluctuaciones de chakra externo. Requiere medicación especial para estabilidad emocional.',
    currentCondition: 'critical',
    ninja: {
      rank: 'Kazekage',
      village: 'Sunagakure'
    }
  },
  {
    id: 'N005',
    name: 'Rock Lee',
    age: 24,
    chakraType: 'fire',
    phone: '+34 612 345 686',
    email: 'lee@konoha.com',
    emergencyContactName: 'Might Guy',
    emergencyContactPhone: '+34 612 345 687',
    medicalHistory: 'Múltiples lesiones por sobreentrenamiento. Cirugía reconstructiva de pierna. Fisioterapia continua. Tratamiento de ocho puertas internas.',
    allergiesConditions: 'Alergia severa a relajantes musculares. Reacciones adversas a medicamentos que afecten el flujo de chakra.',
    currentCondition: 'urgent',
    ninja: {
      rank: 'Jounin',
      village: 'Konoha'
    }
  },
  {
    id: 'N006',
    name: 'Hinata Hyuga',
    age: 23,
    chakraType: 'water',
    phone: '+34 612 345 688',
    email: 'hinata@hyuga.konoha.com',
    emergencyContactName: 'Neji Hyuga',
    emergencyContactPhone: '+34 612 345 689',
    medicalHistory: 'Byakugan activo. Lesiones menores por combate. Control de chakra excepcional. Entrenamiento en Juken especializado.',
    allergiesConditions: 'Sensibilidad leve a cambios bruscos de temperatura. Requiere cuidado especial en procedimientos que afecten el sistema de chakra.',
    currentCondition: 'stable',
    ninja: {
      rank: 'Jounin',
      village: 'Konoha'
    }
  }
];

// Interfaz para el tipo de paciente
interface Patient {
  id: string;
  name: string;
  age: number;
  chakraType: string;
  phone: string;
  email: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  medicalHistory: string;
  allergiesConditions: string;
  currentCondition: string;
  ninja: {
    rank: string;
    village: string;
  };
}

// Componente para vista de detalle del paciente
interface PatientDetailProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: () => void;
  canEdit?: boolean;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, isOpen, onClose, onEdit, canEdit = true }) => {
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
            {canEdit && (
              <Button
                onClick={onEdit}
                className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-4 py-2 text-xs"
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
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
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.ninja.rank}</div>
              </div>
              <div>
                <label className="block font-medium text-xs text-[#3c5661] mb-2">Villa</label>
                <div className="p-3 bg-[#f2ede9] rounded-lg text-xs text-[#3c5661]">{patient.ninja.village}</div>
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
                <div className="p-3 bg-gray-50 rounded-lg text-xs whitespace-pre-wrap">{patient.medicalHistory}</div>
              </div>
            </div>
          </div>
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

  // Filtrado de pacientes
  const filteredPatients = useMemo(() => {
    return mockPatients.filter(patient => {
      const matchesSearch = 
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.ninja.rank.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesCondition = !conditionFilter || patient.currentCondition === conditionFilter;
      
      return matchesSearch && matchesCondition;
    });
  }, [searchTerm, conditionFilter]);

  const handlePatientSelect = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowDetail(true);
  };

  const handleEditPatient = () => {
    console.log('Editando paciente:', selectedPatient?.name);
    // Aquí se implementaría la navegación al formulario de edición
    setShowDetail(false);
  };

  const getChakraLevelText = (level: string) => {
    switch (level) {
      case 'low': return 'Bajo';
      case 'medium': return 'Medio';
      case 'high': return 'Alto';
      default: return level;
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

  return (
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
            
            <select
              value={conditionFilter}
              onChange={(e) => setConditionFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg text-xs hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2D5BFF] focus:ring-opacity-50"
            >
              <option value="">Todas las condiciones</option>
              <option value="stable">Estable</option>
              <option value="critical">Crítico</option>
              <option value="urgent">Urgente</option>
            </select>

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
                        <TableCell className="text-xs">{getChakraLevelText(patient.chakraType)}</TableCell>
                        <TableCell className="text-xs">{patient.ninja.rank}</TableCell>
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
                          <p className="text-xs text-gray-600">{patient.id} - {patient.ninja.rank}</p>
                        </div>
                        <Badge className={`${getConditionColor(patient.currentCondition)} text-xs px-2 py-1`}>
                          {getConditionText(patient.currentCondition)}
                        </Badge>
                      </div>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <User className="w-3 h-3" />
                          {patient.age} años - Chakra {getChakraLevelText(patient.chakraType)}
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
          canEdit={true}
        />
      )}
    </div>
  );
};