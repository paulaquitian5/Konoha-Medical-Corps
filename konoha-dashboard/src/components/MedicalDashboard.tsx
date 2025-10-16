import React, { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  Activity, 
  AlertCircle, 
  Users, 
  UserCheck, 
  Calendar,
  ClipboardList,
  FileText,
  Bell,
  TrendingUp,
  UserPlus,
  Search
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';

// Datos de ejemplo para las estadísticas
const statsData = [
  {
    title: 'Pacientes Activos',
    value: '248',
    icon: Users,
    iconColor: '#882238',
    bgColor: '#f4c0c2',
    trend: '+12 esta semana'
  },
  {
    title: 'Casos Críticos',
    value: '8',
    icon: AlertCircle,
    iconColor: '#882238',
    bgColor: '#f4c0c2',
    trend: '2 requieren atención'
  },
  {
    title: 'Consultas de Hoy',
    value: '42',
    icon: Calendar,
    iconColor: '#72be9a',
    bgColor: '#e8f5ef',
    trend: '18 completadas'
  },
  {
    title: 'Médicos de Guardia',
    value: '16',
    icon: UserCheck,
    iconColor: '#72be9a',
    bgColor: '#e8f5ef',
    trend: 'Turno: Día'
  }
];

// Datos para el gráfico circular - Distribución de pacientes por estado
const patientStatusData = [
  { name: 'Estable', value: 182, color: '#72be9a' },
  { name: 'Urgente', value: 58, color: '#f4c0c2' },
  { name: 'Crítico', value: 8, color: '#882238' }
];

// Datos para el gráfico de barras - Pacientes atendidos por semana
const weeklyPatientsData = [
  { day: 'Lun', pacientes: 38 },
  { day: 'Mar', pacientes: 45 },
  { day: 'Mié', pacientes: 42 },
  { day: 'Jue', pacientes: 51 },
  { day: 'Vie', pacientes: 47 },
  { day: 'Sáb', pacientes: 28 },
  { day: 'Dom', pacientes: 22 }
];

// Notificaciones de ejemplo
const notifications = [
  {
    id: 1,
    type: 'critical',
    message: '2 pacientes críticos necesitan revisión inmediata',
    time: 'Hace 5 min'
  },
  {
    id: 2,
    type: 'warning',
    message: '5 pacientes con citas pendientes de confirmación',
    time: 'Hace 15 min'
  },
  {
    id: 3,
    type: 'info',
    message: 'Nuevo protocolo de tratamiento disponible',
    time: 'Hace 1 hora'
  },
  {
    id: 4,
    type: 'success',
    message: 'Inventario médico actualizado correctamente',
    time: 'Hace 2 horas'
  }
];

// Accesos rápidos
const quickActions = [
  {
    id: 1,
    title: 'Registrar Paciente',
    description: 'Añadir nuevo paciente al sistema',
    icon: UserPlus,
    action: 'registration'
  },
  {
    id: 2,
    title: 'Consultar Pacientes',
    description: 'Buscar y ver información de pacientes',
    icon: Search,
    action: 'consultation'
  },
  {
    id: 3,
    title: 'Historial Médico',
    description: 'Acceder a historiales completos',
    icon: FileText,
    action: 'history'
  }
];

interface MedicalDashboardProps {
  onNavigate?: (view: string) => void;
  userName?: string;
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ 
  onNavigate,
  userName = 'Dr. Sakura Haruno' 
}) => {
    const [diagnosticos, setDiagnosticos] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
      useEffect(() => {
    const fetchDiagnosticos = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/diagnostico');
        if (!response.ok) throw new Error('Error al obtener los datos');
        const data = await response.json();
        setDiagnosticos(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDiagnosticos();
  }, []);


  const handleQuickAction = (action: string) => {
    if (onNavigate) {
      onNavigate(action);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Encabezado del Dashboard */}
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#3c5661] mb-1">Panel de Control Médico Ninja</h1>
            <p className="text-xs text-[#3c5661] opacity-60">
              Bienvenido/a, {userName}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Button 
              variant="outline"
              className="border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] rounded-lg px-4 py-2"
            >
              <Bell className="w-4 h-4 mr-2" />
              Notificaciones
            </Button>
            <div className="w-10 h-10 rounded-full bg-[#f4c0c2] flex items-center justify-center">
              <span className="text-[#882238]">SH</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tarjetas de Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, index) => (
          <Card key={index} className="p-6 bg-white hover:shadow-lg transition-shadow duration-200">
            <div className="flex items-start justify-between mb-4">
              <div 
                className="w-12 h-12 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: stat.bgColor }}
              >
                <stat.icon 
                  className="w-6 h-6" 
                  style={{ color: stat.iconColor }}
                />
              </div>
              <TrendingUp className="w-4 h-4 text-[#72be9a]" />
            </div>
            <div>
              <p className="text-xs text-[#3c5661] opacity-60 mb-1">{stat.title}</p>
              <p className="text-[#3c5661] mb-2">{stat.value}</p>
              <p className="text-xs text-[#3c5661] opacity-50">{stat.trend}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico Circular - Distribución de Pacientes */}
        <Card className="p-6 bg-white">
          <div className="mb-4">
            <h2 className="text-[#3c5661] mb-1">Distribución de Pacientes</h2>
            <p className="text-xs text-[#3c5661] opacity-60">Por estado de salud</p>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }:any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-4 mt-4">
            {patientStatusData.map((item, index) => (
              <div key={index} className="flex items-center gap-2">
                <div 
                  className="w-3 h-3 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="text-xs text-[#3c5661]">{item.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Gráfico de Barras - Pacientes Atendidos */}
        <Card className="p-6 bg-white">
          <div className="mb-4">
            <h2 className="text-[#3c5661] mb-1">Pacientes Atendidos</h2>
            <p className="text-xs text-[#3c5661] opacity-60">Últimos 7 días</p>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPatientsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f4c0c2" />
                <XAxis 
                  dataKey="day" 
                  tick={{ fill: '#3c5661', fontSize: 12 }}
                  axisLine={{ stroke: '#f4c0c2' }}
                />
                <YAxis 
                  tick={{ fill: '#3c5661', fontSize: 12 }}
                  axisLine={{ stroke: '#f4c0c2' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #f4c0c2',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="pacientes" fill="#882238" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Sección de Notificaciones y Accesos Rápidos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Notificaciones */}
        <Card className="p-6 bg-white lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[#3c5661]">Notificaciones Recientes</h2>
            <Badge 
              variant="outline" 
              className="bg-[#882238] text-white border-[#882238] px-2 py-1"
            >
              {notifications.length}
            </Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {notifications.map((notification) => {
              const getNotificationStyle = () => {
                switch (notification.type) {
                  case 'critical':
                    return { bg: '#fff5f5', border: '#882238', icon: '#882238' };
                  case 'warning':
                    return { bg: '#fff9f5', border: '#f4c0c2', icon: '#882238' };
                  case 'success':
                    return { bg: '#f0fdf4', border: '#72be9a', icon: '#72be9a' };
                  default:
                    return { bg: '#f8f9fa', border: '#f4c0c2', icon: '#3c5661' };
                }
              };

              const style = getNotificationStyle();

              return (
                <div
                  key={notification.id}
                  className="p-4 rounded-lg border-l-4 transition-all hover:shadow-md"
                  style={{ 
                    backgroundColor: style.bg, 
                    borderLeftColor: style.border 
                  }}
                >
                  <div className="flex items-start gap-3">
                    <Bell 
                      className="w-4 h-4 mt-0.5 flex-shrink-0" 
                      style={{ color: style.icon }}
                    />
                    <div className="flex-1">
                      <p className="text-xs text-[#3c5661] mb-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-[#3c5661] opacity-50">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {/* Accesos Rápidos */}
        <Card className="p-6 bg-white">
          <h2 className="text-[#3c5661] mb-4">Accesos Rápidos</h2>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {quickActions.map((action) => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleQuickAction(action.action)}
                className="w-full border-[#f4c0c2] text-[#3c5661] hover:bg-[#f4c0c2] hover:border-[#882238] rounded-lg p-4 h-auto flex items-start gap-3 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-[#f4c0c2] flex items-center justify-center flex-shrink-0">
                  <action.icon className="w-5 h-5 text-[#882238]" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs text-[#3c5661] mb-1">{action.title}</p>
                  <p className="text-xs text-[#3c5661] opacity-60">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <Button
            variant="outline"
            className="w-full border-[#f4c0c2] text-[#882238] hover:bg-[#882238] hover:text-white rounded-lg p-3"
          >
            <Activity className="w-4 h-4 mr-2" />
            Ver Más Opciones
          </Button>
        </Card>
      </div>
    </div>
  );
};
