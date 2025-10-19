import React from 'react';
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
  FileText,
  Bell,
  TrendingUp,
  UserPlus,
  Search
} from 'lucide-react';
import {
  PieChart, Pie, Cell, PieLabelRenderProps,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import type { ViewType } from '../App';

// Datos de ejemplo
const statsData = [
  { title: 'Pacientes Activos', value: '248', icon: Users, iconColor: 'var(--chart-1)', bgColor: 'var(--accent)', trend: '+12 esta semana' },
  { title: 'Casos Críticos', value: '8', icon: AlertCircle, iconColor: 'var(--destructive)', bgColor: 'var(--accent)', trend: '2 requieren atención' },
  { title: 'Consultas de Hoy', value: '42', icon: Calendar, iconColor: 'var(--chart-2)', bgColor: 'var(--muted)', trend: '18 completadas' },
  { title: 'Médicos de Guardia', value: '16', icon: UserCheck, iconColor: 'var(--chart-2)', bgColor: 'var(--muted)', trend: 'Turno: Día' }
];

const patientStatusData = [
  { name: 'Estable', value: 182, color: 'var(--chart-2)' },
  { name: 'Urgente', value: 58, color: 'var(--chart-1)' },
  { name: 'Crítico', value: 8, color: 'var(--destructive)' }
];

const weeklyPatientsData = [
  { day: 'Lun', pacientes: 38 },
  { day: 'Mar', pacientes: 45 },
  { day: 'Mié', pacientes: 42 },
  { day: 'Jue', pacientes: 51 },
  { day: 'Vie', pacientes: 47 },
  { day: 'Sáb', pacientes: 28 },
  { day: 'Dom', pacientes: 22 }
];

const notifications = [
  { id: 1, type: 'critical', message: '2 pacientes críticos necesitan revisión inmediata', time: 'Hace 5 min' },
  { id: 2, type: 'warning', message: '5 pacientes con citas pendientes de confirmación', time: 'Hace 15 min' },
  { id: 3, type: 'info', message: 'Nuevo protocolo de tratamiento disponible', time: 'Hace 1 hora' },
  { id: 4, type: 'success', message: 'Inventario médico actualizado correctamente', time: 'Hace 2 horas' }
];

const quickActions: { id: number; title: string; description: string; icon: any; action: ViewType }[] = [
  { id: 1, title: 'Registrar Paciente', description: 'Añadir nuevo paciente al sistema', icon: UserPlus, action: 'registration' },
  { id: 2, title: 'Consultar Pacientes', description: 'Buscar y ver información de pacientes', icon: Search, action: 'consultation' },
  { id: 3, title: 'Historial Médico', description: 'Acceder a historiales completos', icon: FileText, action: 'history' }
];

interface MedicalDashboardProps {
  onNavigate?: (view: ViewType) => void;
  userName?: string;
}

export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ onNavigate, userName = 'Dr. Sakura Haruno' }) => {
  const handleQuickAction = (action: ViewType) => onNavigate?.(action);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'critical': return { bg: 'var(--destructive-foreground)', border: 'var(--destructive)', icon: 'var(--destructive)' };
      case 'warning': return { bg: 'var(--accent)', border: 'var(--secondary)', icon: 'var(--chart-1)' };
      case 'success': return { bg: 'var(--chart-2)', border: 'var(--chart-2)', icon: 'var(--chart-2)' };
      default: return { bg: 'var(--muted)', border: 'var(--border)', icon: 'var(--foreground)' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4" style={{ backgroundColor: 'var(--background)', color: 'var(--foreground)' }}>
      {/* Header */}
      <Card style={{ backgroundColor: 'var(--card)' }} className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'var(--font-weight-medium)' }}>Panel de Control Médico Ninja</h1>
            <p style={{ fontSize: '0.875rem', opacity: 0.6 }}>Bienvenido/a, {userName}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button style={{ borderColor: 'var(--secondary)', color: 'var(--foreground)' }} variant="outline">
              <Bell className="w-4 h-4 mr-2" /> Notificaciones
            </Button>
            <div style={{ backgroundColor: 'var(--accent)' }} className="w-10 h-10 flex justify-center items-center rounded-full">
              <span style={{ color: 'var(--destructive)' }}>SH</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, i) => (
          <Card key={i} style={{ backgroundColor: 'var(--card)' }} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div style={{ backgroundColor: stat.bgColor }} className="w-12 h-12 flex justify-center items-center rounded-lg">
                <stat.icon style={{ color: stat.iconColor }} className="w-6 h-6" />
              </div>
              <TrendingUp style={{ color: 'var(--chart-2)' }} className="w-4 h-4" />
            </div>
            <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{stat.title}</p>
            <p style={{ fontSize: '1rem' }}>{stat.value}</p>
            <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>{stat.trend}</p>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie */}
        <Card className="p-6" style={{ backgroundColor: 'var(--card)' }}>
          <h2 style={{ fontWeight: 'var(--font-weight-medium)' }}>Distribución de Pacientes</h2>
          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Por estado de salud</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: PieLabelRenderProps) => {
                    const { name, percent } = props;
                    const p = typeof percent === 'number' ? percent : 0;
                    return `${name}: ${(p * 100).toFixed(0)}%`;
                  }}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {patientStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Bar */}
        <Card className="p-6" style={{ backgroundColor: 'var(--card)' }}>
          <h2 style={{ fontWeight: 'var(--font-weight-medium)' }}>Pacientes Atendidos</h2>
          <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>Últimos 7 días</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyPatientsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="day" tick={{ fill: 'var(--foreground)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} />
                <YAxis tick={{ fill: 'var(--foreground)', fontSize: 12 }} axisLine={{ stroke: 'var(--border)' }} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: 8 }} />
                <Bar dataKey="pacientes" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Notificaciones + Accesos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2" style={{ backgroundColor: 'var(--card)' }}>
          <div className="flex justify-between items-center mb-4">
            <h2>Notificaciones Recientes</h2>
            <Badge style={{ backgroundColor: 'var(--destructive)', color: 'white' }}>{notifications.length}</Badge>
          </div>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {notifications.map(n => {
              const style = getNotificationStyle(n.type);
              return (
                <div key={n.id} className="p-4 rounded-lg border-l-4 hover:shadow-md" style={{ backgroundColor: style.bg, borderLeftColor: style.border }}>
                  <div className="flex gap-3 items-start">
                    <Bell style={{ color: style.icon }} className="w-4 h-4 mt-0.5" />
                    <div>
                      <p style={{ fontSize: '0.75rem' }}>{n.message}</p>
                      <p style={{ fontSize: '0.75rem', opacity: 0.5 }}>{n.time}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="p-6" style={{ backgroundColor: 'var(--card)' }}>
          <h2 style={{ fontWeight: 'var(--font-weight-medium)', marginBottom: '1rem' }}>Accesos Rápidos</h2>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleQuickAction(action.action)}
                className="w-full flex items-start gap-3 p-4 rounded-lg transition-all"
                style={{
                  borderColor: 'var(--secondary)',
                  color: 'var(--foreground)',
                  backgroundColor: 'var(--card)'
                }}
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg" style={{ backgroundColor: 'var(--accent)' }}>
                  <action.icon className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
                </div>
                <div className="text-left flex-1">
                  <p style={{ fontSize: '0.75rem', marginBottom: '0.25rem' }}>{action.title}</p>
                  <p style={{ fontSize: '0.75rem', opacity: 0.6 }}>{action.description}</p>
                </div>
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <Button
            variant="outline"
            className="w-full p-3 rounded-lg flex items-center justify-center gap-2"
            style={{
              borderColor: 'var(--secondary)',
              color: 'var(--destructive)',
              backgroundColor: 'var(--card)'
            }}
          >
            <Activity className="w-4 h-4" />
            Ver Más Opciones
          </Button>
        </Card>
      </div>
    </div>
  );
};
