import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { ViewType } from '../types/view';
import { format, subDays, isSameDay } from "date-fns";
import { es } from "date-fns/locale";
import {
  Activity,
  AlertCircle,
  Users,
  UserCheck,
  Calendar,
  FileText,
  Bell,
  TrendingUp,
  Search
} from 'lucide-react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { io } from "socket.io-client";
export const socket = io(import.meta.env.VITE_API_URL, { transports: ["websocket"] });


interface Chakra {
  tipo: string;
  capacidad: "Baja" | "Normal" | "Alta";
  estabilidad: number;
}

interface Paciente {
  _id: string;
  nombre: string;
  apellido: string;
  estado: "Activo" | "Inactivo" | "Fallecido";
  aldea: string;
  rango: string;
  grupoSanguineo?: string;
  chakra?: Chakra;
  currentCondition: "critical" | "urgent" | "stable";
  createdAt?: string;
}


interface Notification {
  id: string;
  message: string;
  time: string;
  type: string;
}

interface MedicalDashboardProps {
  onNavigate: React.Dispatch<React.SetStateAction<ViewType>>;
  username?: string;  // Prop opcional para nombre de usuario
}



export const MedicalDashboard: React.FC<MedicalDashboardProps> = ({ onNavigate, username }: MedicalDashboardProps) => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [quickActions, setQuickActions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [consultasHoy, setConsultasHoy] = useState(0);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case 'crítico':
        return { bg: '#ffe6e6', border: '#ff4d4f', icon: '#ff0000' };
      case 'alto':
        return { bg: '#fff2cc', border: '#ffc107', icon: '#ff9800' };
      case 'moderado':
        return { bg: '#e6f7ff', border: '#17a2b8', icon: '#007bff' };
      default:
        return { bg: '#f0f0f0', border: '#ccc', icon: '#6c757d' };
    }
  };

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'registrar':
        onNavigate('registration');
        break;
      case 'consultar':
        onNavigate('consultation');
        break;
      case 'historial':
        onNavigate('dashboard');
        break;
      default:
        console.log('⚙️ Acción no definida');
    }
  };

  useEffect(() => {

    const acciones = [
      {
        id: 1,
        title: 'Registrador de pacientes',
        description: 'Añadir nuevo paciente al sistema',
        icon: Users,
        action: 'registrar'
      },
      {
        id: 2,
        title: 'Consultar Pacientes',
        description: 'Buscar y ver información de pacientes',
        icon: Search,
        action: 'consultar'
      },
      {
        id: 3,
        title: 'Historial Médico',
        description: 'Acceder a historiales completos',
        icon: FileText,
        action: 'historial'
      },
    ];
    setQuickActions(acciones);

    // =======================
    //   Cargar notificaciones
    // =======================
    console.log("Conectando al socket...");
    socket.on("connect", () => {
      console.log("⚡ Dashboard conectado al socket:", socket.id);
    });

    socket.on("alerta_medica", (nueva) => {
      console.log("🚨 ALERTA RECIBIDA:", nueva);
      setNotifications((prev) => [
        {
          id: nueva.alertaId,
          message: nueva.descripcion,
          time: new Date(nueva.creadoEn).toLocaleTimeString("es-ES", {
            hour: "2-digit",
            minute: "2-digit",
          }),
          type: nueva.nivel,
        },
        ...prev,
      ]);
    });

    // =======================
    //   Cargar pacientes
    // =======================

    const fetchPacientes = async () => {

      try {
        console.log(' Backend URL:', import.meta.env.VITE_API_URL);
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/pacientes`);
        console.log('Datos recibidos:', res.data);
        let listaPacientes: Paciente[] = [];


        if (res.data && Array.isArray(res.data.pacientes)) {
          listaPacientes = res.data.pacientes;
          setPacientes(res.data.pacientes);
        } else if (Array.isArray(res.data)) {
          listaPacientes = res.data;
          setPacientes(res.data);
        } else {
          console.warn('Formato inesperado de respuesta:', res.data);
          setPacientes([]);
        }

        const consultas = listaPacientes.filter((p: Paciente) => {

          if (!p.createdAt) return false;
          const fechaCreacion = new Date(p.createdAt);
          const hoy = new Date();
          return fechaCreacion.getFullYear() === hoy.getFullYear() &&
            fechaCreacion.getMonth() === hoy.getMonth() &&
            fechaCreacion.getDate() === hoy.getDate();
        }).length;

        setConsultasHoy(consultas);
        console.log("Consultas de hoy:", consultas);

      } catch (err) {
        console.error('Error al obtener pacientes:', err);
        setPacientes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPacientes();


    return () => {
      socket.off("alerta_medica");
    };

  }, []);

  if (loading) return <p>Cargando pacientes...</p>;

  // 🔹 Calcular estadísticas según el nivel de chakra
  const casosCriticos = pacientes.filter(p => p.currentCondition === "critical").length;
  const casosEstables = pacientes.filter(p => p.currentCondition === "stable").length;
  const casosModerados = pacientes.filter(p => p.currentCondition === "urgent").length;


  const pacientesActivos = pacientes.length;
  const medicosGuardia = 12;

  const statsData = [
    { title: 'Pacientes Totales', value: pacientesActivos, icon: Users, iconColor: 'var(--chart-1)', bgColor: 'var(--accent)', trend: 'Total registrados' },
    { title: 'Casos Críticos', value: casosCriticos, icon: AlertCircle, iconColor: 'var(--destructive)', bgColor: 'var(--accent)', trend: `${casosCriticos} requieren atención` },
    { title: 'Consultas de Hoy', value: consultasHoy, icon: Calendar, iconColor: 'var(--chart-2)', bgColor: 'var(--muted)', trend: '18 completadas' },
    { title: 'Médicos de Guardia', value: medicosGuardia, icon: UserCheck, iconColor: 'var(--chart-2)', bgColor: 'var(--muted)', trend: 'Turno: Día' }
  ];

  const patientStatusData = [
    { name: 'Crítico', value: casosCriticos, color: 'var(--destructive)' },
    { name: 'Urgente', value: casosModerados, color: 'var(--chart-2)' },
    { name: 'Estable', value: casosEstables, color: 'var(--chart-1)' }
  ];


  // 🔹 Obtener los últimos 7 días
  const hoy = new Date();
  const diasSemana = Array.from({ length: 7 }).map((_, i) =>
    subDays(hoy, 6 - i)
  );

  // 🔹 Contar pacientes por día
  const weeklyPatientsData = diasSemana.map((dia) => {
    const count = pacientes.filter((p) =>
      p.createdAt ? isSameDay(new Date(p.createdAt), dia) : false
    ).length;

    // Ej: "Lun", "Mar", etc.
    const dayName = format(dia, "EEE", { locale: es }).replace(".", "");
    return { day: dayName.charAt(0).toUpperCase() + dayName.slice(1), pacientes: count };
  });


  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Header */}
      <Card className="p-6 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-medium">Panel de Control Médico Ninja</h1>
            <p className="text-sm text-muted-foreground">Bienvenido/a, {username ?? 'usuario/a'}</p>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="outline">
              <Bell className="w-4 h-4 mr-2" /> Notificaciones
            </Button>
            <div className="w-10 h-10 flex justify-center items-center rounded-full bg-accent">
              <span className="text-destructive">SH</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, i) => (
          <Card key={i} className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <div style={{ backgroundColor: stat.bgColor }} className="w-12 h-12 flex justify-center items-center rounded-lg">
                <stat.icon style={{ color: stat.iconColor }} className="w-6 h-6" />
              </div>
              <TrendingUp className="w-4 h-4 text-[var(--chart-2)]" />
            </div>
            <p className="text-xs text-muted-foreground">{stat.title}</p>
            <p className="text-base">{stat.value}</p>
            <p className="text-xs text-muted-foreground/80">{stat.trend}</p>
          </Card>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie */}
        <Card className="p-6">
          <h2 className="font-medium">Distribución de Pacientes</h2>
          <p className="text-xs text-muted-foreground">Por estado de salud</p>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={patientStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(props: any) => {
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
        <Card className="p-6">
          <h2 className="font-medium">Pacientes Atendidos</h2>
          <p className="text-xs text-muted-foreground">Últimos 7 días</p>
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
        <Card className="p-6 lg:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2>Notificaciones Recientes</h2>
            <Badge variant="destructive">{notifications.length}</Badge>
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
                      <p className="text-xs">{n.message}</p>
                      <p className="text-xs text-muted-foreground/80">{n.time}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="font-medium mb-4">Accesos Rápidos</h2>
          <Separator className="mb-4" />
          <div className="space-y-3">
            {quickActions.map(action => (
              <Button
                key={action.id}
                variant="outline"
                onClick={() => handleQuickAction(action.action)}
                className="w-full h-auto flex items-start gap-3 p-4 rounded-lg transition-all justify-start"
              >
                <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent">
                  <action.icon className="w-5 h-5 text-destructive" />
                </div>
                <div className="text-left flex-1">
                  <p className="text-xs mb-1">{action.title}</p>
                  <p className="text-xs text-muted-foreground">{action.description}</p>
                </div>
              </Button>
            ))}
          </div>

          <Separator className="my-4" />

          <Button variant="outline" className="w-full p-3 rounded-lg text-destructive">
            <Activity className="w-4 h-4" />
            Ver Más Opciones
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default MedicalDashboard;