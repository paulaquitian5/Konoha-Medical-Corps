import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { 
  Package, 
  Search, 
  RefreshCw, 
  CheckCircle, 
  Clock, 
  XCircle,
  AlertCircle,
  Filter
} from 'lucide-react';

// Mock data para órdenes
const mockOrdenes = [
  {
    id: 'ORD-2025-1001',
    patientName: 'Naruto Uzumaki',
    medication: 'Pomada de Chakra Regenerativo',
    quantity: '2 unidades',
    status: 'completed',
    date: '12 Nov 2025, 10:30',
    priority: 'normal'
  },
  {
    id: 'ORD-2025-1002',
    patientName: 'Sasuke Uchiha',
    medication: 'Suplemento de Chakra Concentrado',
    quantity: '3 cajas',
    status: 'processing',
    date: '12 Nov 2025, 09:15',
    priority: 'high'
  },
  {
    id: 'ORD-2025-1003',
    patientName: 'Sakura Haruno',
    medication: 'Píldoras de Soldado nivel 2',
    quantity: '1 frasco',
    status: 'pending',
    date: '12 Nov 2025, 08:45',
    priority: 'normal'
  },
  {
    id: 'ORD-2025-1004',
    patientName: 'Rock Lee',
    medication: 'Píldoras de Recuperación Ósea',
    quantity: '4 frascos',
    status: 'processing',
    date: '11 Nov 2025, 16:20',
    priority: 'urgent'
  },
  {
    id: 'ORD-2025-1005',
    patientName: 'Hinata Hyuga',
    medication: 'Té de Hierbas Medicinales',
    quantity: '1 caja',
    status: 'completed',
    date: '11 Nov 2025, 14:50',
    priority: 'normal'
  },
  {
    id: 'ORD-2025-1006',
    patientName: 'Neji Hyuga',
    medication: 'Vendaje Médico Ninja',
    quantity: '5 rollos',
    status: 'cancelled',
    date: '11 Nov 2025, 12:30',
    priority: 'low'
  },
  {
    id: 'ORD-2025-1007',
    patientName: 'Gaara',
    medication: 'Antídoto Universal nivel 3',
    quantity: '2 dosis',
    status: 'processing',
    date: '10 Nov 2025, 18:00',
    priority: 'urgent'
  },
  {
    id: 'ORD-2025-1008',
    patientName: 'Kakashi Hatake',
    medication: 'Suero de Recuperación Rápida',
    quantity: '3 unidades',
    status: 'pending',
    date: '10 Nov 2025, 15:30',
    priority: 'high'
  }
];

type OrderStatus = 'pending' | 'processing' | 'completed' | 'cancelled';
type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusConfig = {
    pending: {
      label: 'Pendiente',
      icon: Clock,
      className: 'bg-[#f4c0c2] bg-opacity-20 text-[#882238] border-[#f4c0c2]'
    },
    processing: {
      label: 'En Proceso',
      icon: RefreshCw,
      className: 'bg-[#882238] bg-opacity-10 text-[#882238] border-[#882238]'
    },
    completed: {
      label: 'Completada',
      icon: CheckCircle,
      className: 'bg-[#72be9a] bg-opacity-10 text-[#72be9a] border-[#72be9a]'
    },
    cancelled: {
      label: 'Cancelada',
      icon: XCircle,
      className: 'bg-[#3c5661] bg-opacity-10 text-[#3c5661] border-[#3c5661]'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge 
      variant="outline" 
      className={`${config.className} px-2 py-1 flex items-center gap-1 w-fit text-xs`}
    >
      <Icon className="w-3 h-3" />
      {config.label}
    </Badge>
  );
};

const PriorityIndicator: React.FC<{ priority: OrderPriority }> = ({ priority }) => {
  const priorityConfig = {
    low: { color: '#3c5661', label: 'Baja' },
    normal: { color: '#72be9a', label: 'Normal' },
    high: { color: '#882238', label: 'Alta' },
    urgent: { color: '#d4183d', label: 'Urgente' }
  };

  const config = priorityConfig[priority];

  return (
    <div className="flex items-center gap-2">
      <div 
        className="w-2 h-2 rounded-full" 
        style={{ backgroundColor: config.color }}
      />
      <span className="text-xs text-[#3c5661] opacity-60">{config.label}</span>
    </div>
  );
};

export const OrdenesAutomaticas: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    // Simular actualización
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  // Filtrar órdenes
  const filteredOrdenes = mockOrdenes.filter(orden => {
    const matchesSearch = 
      orden.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.medication.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || orden.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: mockOrdenes.length,
    pending: mockOrdenes.filter(o => o.status === 'pending').length,
    processing: mockOrdenes.filter(o => o.status === 'processing').length,
    completed: mockOrdenes.filter(o => o.status === 'completed').length
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header con estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">Total Órdenes</p>
              <p className="font-bold text-[#3c5661]">{stats.total}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10 flex items-center justify-center">
              <Package className="w-5 h-5 text-[#882238]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">Pendientes</p>
              <p className="font-bold text-[#882238]">{stats.pending}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#f4c0c2] bg-opacity-20 flex items-center justify-center">
              <Clock className="w-5 h-5 text-[#882238]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">En Proceso</p>
              <p className="font-bold text-[#882238]">{stats.processing}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#882238]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">Completadas</p>
              <p className="font-bold text-[#72be9a]">{stats.completed}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#72be9a] bg-opacity-10 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-[#72be9a]" />
            </div>
          </div>
        </Card>
      </div>

      {/* Controles de búsqueda y filtros */}
      <Card className="p-6 bg-white">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#3c5661] opacity-40" />
            <Input
              type="text"
              placeholder="Buscar por ID de orden, paciente o medicamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-[#f4c0c2] hover:border-[#882238] focus:ring-[#882238] text-xs"
            />
          </div>
          
          <div className="flex gap-2">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as OrderStatus | 'all')}
              className="px-4 py-2 text-xs border border-[#f4c0c2] rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882238] focus:ring-opacity-30 bg-white text-[#3c5661] hover:border-[#882238]"
            >
              <option value="all">Todos los estados</option>
              <option value="pending">Pendiente</option>
              <option value="processing">En Proceso</option>
              <option value="completed">Completada</option>
              <option value="cancelled">Cancelada</option>
            </select>

            <Button
              onClick={handleRefresh}
              className="bg-[#882238] hover:bg-[#6d1a2c] text-white rounded-lg px-4 py-2"
              disabled={isRefreshing}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>
      </Card>

      {/* Tabla de órdenes */}
      <Card className="bg-white overflow-hidden">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10">
              <Package className="w-5 h-5 text-[#882238]" />
            </div>
            <h1 className="font-bold text-[#3c5661]">Órdenes Automáticas - Farmacia de Tsunade</h1>
          </div>

          {filteredOrdenes.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="w-12 h-12 text-[#3c5661] opacity-20 mx-auto mb-4" />
              <p className="text-xs text-[#3c5661] opacity-60">
                No se encontraron órdenes que coincidan con los criterios de búsqueda.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[#f4c0c2]">
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">ID Orden</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Paciente</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Medicamento</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Cantidad</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Prioridad</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Estado</th>
                    <th className="text-left py-3 px-4 text-xs font-medium text-[#3c5661] opacity-60">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrdenes.map((orden, index) => (
                    <tr 
                      key={orden.id}
                      className={`border-b border-[#f4c0c2] hover:bg-[#f2ede9] transition-colors ${
                        index % 2 === 0 ? 'bg-white' : 'bg-[#f2ede9] bg-opacity-30'
                      }`}
                    >
                      <td className="py-4 px-4">
                        <p className="text-xs font-medium text-[#882238]">{orden.id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661]">{orden.patientName}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661]">{orden.medication}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661] opacity-75">{orden.quantity}</p>
                      </td>
                      <td className="py-4 px-4">
                        <PriorityIndicator priority={orden.priority as OrderPriority} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={orden.status as OrderStatus} />
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661] opacity-60">{orden.date}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </Card>

      {/* Nota informativa */}
      <Card className="p-6 bg-[#f4c0c2] bg-opacity-20 border border-[#f4c0c2]">
        <div className="flex gap-3">
          <AlertCircle className="w-5 h-5 text-[#882238] flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-medium text-xs text-[#3c5661] mb-2">
              Sistema de Órdenes Automáticas
            </p>
            <p className="text-xs text-[#3c5661] opacity-75">
              Las órdenes se envían automáticamente a la Farmacia de Tsunade cuando se emite una prescripción médica. 
              El sistema actualiza el estado en tiempo real según el progreso de preparación y entrega. 
              Las órdenes urgentes tienen prioridad en el procesamiento.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};
