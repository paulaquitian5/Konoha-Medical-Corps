import React, { useState } from 'react';
import { useEffect } from 'react';
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


type OrderStatus = 'pending' | 'valid' | 'invalid';
type OrderPriority = 'low' | 'normal' | 'high' | 'urgent';

interface Medicamento {
  nombre: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
}

interface Orden {
  _id: string;
  patientId: string;           // ID del paciente
  pacienteNombre?: string;
  doctorId: string;            // ID del doctor
  medicamentos: Medicamento[];
  observaciones: string;
  firmaDigital: string;
  fechaCreacion: string;       // se puede convertir a string legible
  pedidoAutomatico: boolean;
  status: 'pending' | 'valid' | 'invalid';
  observacionesFarmaceutico?: string | null;
}


const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const statusConfig = {
    pending: { label: 'Pendiente', className: 'bg-[#f4c0c2] ...', icon: Clock },
    valid: { label: 'Validada', className: 'bg-[#72be9a] ...', icon: CheckCircle },
    invalid: { label: 'Inválida', className: 'bg-[#882238] ...', icon: XCircle },
  };
  const config = statusConfig[status];
  const Icon = config.icon;
  return <Badge className={config.className}><Icon />{config.label}</Badge>;
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
  const [ordenes, setOrdenes] = useState<Orden[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [ordenSeleccionada, setOrdenSeleccionada] = useState<Orden | null>(null);


  const handleAbrirModal = (orden: Orden) => {
    setOrdenSeleccionada(orden);
    setModalOpen(true);
  };

  const handlePedidoAutomatico = async () => {
    if (!ordenSeleccionada) return;

    try {
      const res = await fetch("http://localhost:3000/api/medicamentos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recetaId: ordenSeleccionada._id })
      });
      const data = await res.json();

      if (data.exito) {
        // Actualizamos el flag localmente para reflejarlo en la UI
        setOrdenes(prev => prev.map(o =>
          o._id === ordenSeleccionada._id ? { ...o, pedidoAutomatico: true } : o
        ));
        alert("Pedido automático enviado correctamente");
      } else {
        alert("Error: " + data.mensaje);
      }
    } catch (error) {
      console.error("Error al enviar pedido:", error);
      alert("Error al enviar pedido, revisa la consola");
    } finally {
      setModalOpen(false);
      setOrdenSeleccionada(null);
    }
  };
  // 🔥 Traer órdenes del backend
  useEffect(() => {
    const fetchOrdenes = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/medicamentos');
        const data = await res.json();
        if (data.exito && Array.isArray(data.data)) {
          setOrdenes(data.data);
        } else {
          console.error('Error al cargar órdenes:', data.mensaje);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrdenes();
  }, []);

  // Filtrar órdenes
  const filteredOrdenes = ordenes.filter(o => {
    const matchesSearch =
      o._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.medicamentos.some(med =>
        med.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );
    const matchesFilter = filterStatus === 'all' || o.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (isLoading) return <p className="text-center text-[#3c5661] py-6">Cargando órdenes...</p>;

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch('http://localhost:3000/api/medicamentos');
      const data = await res.json();
      if (data.exito && Array.isArray(data.data)) {
        setOrdenes(data.data);
      } else {
        console.error('Error al cargar órdenes:', data.mensaje);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsRefreshing(false);
    }
  };


  // Estadísticas con datos reales
  const stats = {
    total: ordenes.length,
    pending: ordenes.filter(o => o.status === 'pending').length,
    valid: ordenes.filter(o => o.status === 'valid').length,
    invalid: ordenes.filter(o => o.status === 'invalid').length
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
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">Invalidas</p>
              <p className="font-bold text-[#882238]">{stats.invalid}</p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#882238] bg-opacity-10 flex items-center justify-center">
              <RefreshCw className="w-5 h-5 text-[#882238]" />
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">Validada</p>
              <p className="font-bold text-[#72be9a]">{stats.valid}</p>
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
              <option value="valid">Validada</option>
              <option value="invalid">Inválida</option>

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
      {modalOpen && ordenSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h2 className="font-bold text-[#882238] mb-4">Confirmar Pedido Automático</h2>
            <p className="text-sm text-[#3c5661] mb-4">
              ¿Deseas enviar el pedido automático para la receta del paciente <strong>{ordenSeleccionada.pacienteNombre}</strong>?
            </p>
            <div className="flex justify-end gap-3">
              <Button onClick={() => setModalOpen(false)} variant="outline">Cancelar</Button>
              <Button onClick={handlePedidoAutomatico}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}


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
                      key={orden._id}
                      className={`border-b border-[#f4c0c2] hover:bg-[#f2ede9] transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-[#f2ede9] bg-opacity-30'
                        }`}
                    >
                      <td className="py-4 px-4">
                        <p className="text-xs font-medium text-[#882238]">{orden._id}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661]">{orden.pacienteNombre}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661]">{orden.medicamentos.map(med => med.nombre).join(', ')}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661] opacity-75">{orden.medicamentos[0]?.dosis || '-'}</p>
                      </td>
                      <td className="py-4 px-4">
                        <PriorityIndicator priority={orden.pedidoAutomatico ? 'urgent' : 'normal'} />
                      </td>
                      <td className="py-4 px-4">
                        <StatusBadge status={orden.status as OrderStatus} />
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-xs text-[#3c5661] opacity-60">{new Date(orden.fechaCreacion).toLocaleString()}</p>
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          className="bg-[#882238] hover:bg-[#6d1a2c] text-white text-xs px-3 py-1 rounded"
                          onClick={() => handleAbrirModal(orden)}
                          disabled={orden.pedidoAutomatico} // si ya se hizo pedido
                        >
                          {orden.pedidoAutomatico ? "Pedido enviado" : "Generar Pedido"}
                        </Button>
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