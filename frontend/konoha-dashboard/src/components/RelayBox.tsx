import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Progress } from './ui/progress';
import {
  Heart,
  Thermometer,
  Zap,
  Activity,
  Radio,
  Users,
  Send,
  AlertCircle
} from 'lucide-react';
import { io } from "socket.io-client";

interface Vitals {
  pulso: number;
  presion: string;
  nivel_chakra: number;
  oxigenacion: number;
  temperatura: number;
  estado_general: 'Estable' | 'Fatigado' | 'Crítico';
}

interface Ubicacion {
  lat: number;
  lon: number;
}

interface Ninja {
  _id: string;
  nombre: string;
  apellido: string;
  aldea: string;
  rango: string;
  currentCondition: "critical" | "urgent" | "stable"; // Ajustado a los valores reales
}

interface TelemedicineRecord {
  _id: string;
  missionId: string;
  ninjaId: Ninja;
  vitals: Vitals;
  ubicacion: Ubicacion;
  currentCondition: "critical" | "urgent" | "stable"; // Agregado para unificar
  timestamp: string;
}



export const RelayBox: React.FC = () => {
  const [connectedNinjas, setConnectedNinjas] = useState<TelemedicineRecord[]>([]);

  const [selectedNinja, setSelectedNinja] = useState({
    name: '',
    rank: '',
    heartRate: 0,
    temperature: 0,
    chakraLevel: 0,
    pressure: '',
    status: 'stable',
    id: ''
  });

  const [isUpdating, setIsUpdating] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  // refs para controlar selección automática/manual
  const didAutoSelectRef = useRef(false);
  const manualSelectRef = useRef(false);
  useEffect(() => {
    const socket = io("http://localhost:3000");

    socket.on("connect", () => {
      console.log("RelayBox conectado a socket.io");
    });
    const fetchConnectedNinjas = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/telemedicina/M-TEST");
        console.log("Respuesta completa del backend:", res.data);

        const data = res.data.data || [];

        // Transformar los datos al tipo TelemedicineRecord
        const formatted: TelemedicineRecord[] = data.map((record: any) => ({
          _id: record._id,               // ID del registro de telemedicina
          missionId: record.missionId,   // missionId del backend
          currentCondition: record.ninjaId?.currentCondition || 'stable',
          ninjaId: record.ninjaId
            ? {
              _id: record.ninjaId._id || '',
              nombre: record.ninjaId.nombre || 'Desconocido',
              apellido: record.ninjaId.apellido || '',
              aldea: record.ninjaId.aldea || '',
              rango: record.ninjaId.rango || '',
              currentCondition: record.ninjaId.currentCondition || 'stable',
            }
            : {
              _id: '',
              nombre: 'Desconocido',
              apellido: '',
              aldea: '',
              rango: '',
              currentCondition: 'stable',
            },

          vitals: {
            pulso: record.vitals.pulso,
            presion: record.vitals.presion,
            nivel_chakra: record.vitals.nivel_chakra,
            oxigenacion: record.vitals.oxigenacion,
            temperatura: record.vitals.temperatura,
            estado_general: record.vitals.estado_general,
          },
          ubicacion: record.ubicacion,
          timestamp: record.timestamp,
        }));

        setConnectedNinjas(formatted);


        // actualizar selectedNinja de forma segura
        setSelectedNinja((prev) => {
          // 1) Si ya hay un ninja seleccionado, intenta actualizar sus datos con el nuevo fetch
          if (prev.id) {
            const actualizado = formatted.find((r) => r._id === prev.id);
            if (actualizado) {
              return {
                name: actualizado.ninjaId.nombre,
                rank: actualizado.ninjaId.rango,
                heartRate: actualizado.vitals.pulso,
                temperature: actualizado.vitals.temperatura,
                chakraLevel: actualizado.vitals.nivel_chakra,
                pressure: actualizado.vitals.presion,
                status: actualizado.currentCondition,
                id: actualizado._id,
              };
            }
            // si el ninja seleccionado ya no existe en la lista, mantenemos el prev (o podrías limpiarlo)
            return prev;
          }

          // 2) Si no hay seleccionado y NO hubo selección manual y tampoco auto-seleccion previa, auto-elige el primero
          if (!didAutoSelectRef.current && !manualSelectRef.current && formatted.length > 0) {
            didAutoSelectRef.current = true; // registramos que ya hicimos la auto-selección inicial
            const first = formatted[0];
            return {
              name: first.ninjaId.nombre,
              rank: first.ninjaId.rango,
              heartRate: first.vitals.pulso,
              temperature: first.vitals.temperatura,
              chakraLevel: first.vitals.nivel_chakra,
              pressure: first.vitals.presion,
              status: first.currentCondition,
              id: first._id,
            };
          }

          // 3) Si no aplican los casos anteriores, devolvemos prev sin tocarlo
          return prev;
        });


      } catch (error) {

        console.error("Error obteniendo ninjas conectados:", error);
      }
    };

    fetchConnectedNinjas(); // Llamada inicial
    const interval = setInterval(fetchConnectedNinjas, 3000); // Repetir cada 4s
    return () => clearInterval(interval); // Limpiar al desmontar
  }, []);// sin deps




  const getStatusColor = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'stable':
        return '#72be9a';
      case 'urgent':
        return '#f4c0c2';
      case 'critical':
        return '#882238';
      default:
        return '#3c5661';
    }
  };


  const getStatusBgColor = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'stable':
        return '#e8f5ef';
      case 'urgent':
        return '#fff9f5';
      case 'critical':
        return '#fff5f5';
      default:
        return '#f2ede9';
    }
  };

  const getStatusText = (status?: string) => {
    switch ((status || '').toLowerCase()) {
      case 'stable':
        return 'Estable';
      case 'urgent':
        return 'Urgente';
      case 'critical':
        return 'Crítico';
      default:
        return status || 'Desconocido';
    }
  };

  const getVitalStatus = (value: number, type: string) => {
    if (type === 'heartRate') {
      if (value < 60 || value > 100) return 'critical';
      if (value < 70 || value > 90) return 'warning';
      return 'normal';
    }
    if (type === 'temperature') {
      if (value < 36 || value > 38) return 'critical';
      if (value < 36.5 || value > 37.5) return 'warning';
      return 'normal';
    }
    if (type === 'chakra') {
      if (value < 30) return 'critical';
      if (value < 50) return 'warning';
      return 'normal';
    }
    return 'normal';
  };

  const handleSendAlert = async () => {
    try {
      const selectedRecord = connectedNinjas.find(
        (n) => n._id === selectedNinja.id
      );

      if (!selectedRecord) {
        console.error("❌ No se encontró el registro del ninja seleccionado.");
        return;
      }

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:2000";

      const body = {
        patientId: selectedRecord.ninjaId?._id, // <-- EL ID REAL DEL PACIENTE
        missionId: selectedRecord.missionId,
        tipoAlerta: "vitales",
        nivel: "crítico",
        descripcion: "El paciente requiere atención urgente"
      };

      const res = await axios.post(`${API_URL}/api/emergencia/alert`, body);

      console.log("Alerta enviada:", res.data);

      setAlertSent(true);
      setTimeout(() => setAlertSent(false), 3000);

    } catch (error) {
      console.error("❌ Error al enviar alerta:", error);
    }
  };


  // marca selección manual y actualiza el estado del ninja seleccionado
  const handleSelectNinja = (record: TelemedicineRecord) => {
    manualSelectRef.current = true; // indicamos que el usuario seleccionó manualmente
    setSelectedNinja({
      name: record.ninjaId.nombre || 'Desconocido',
      rank: record.ninjaId?.rango || 'N/A',
      heartRate: record.vitals?.pulso || 0,
      temperature: record.vitals?.temperatura || 0,
      chakraLevel: record.vitals?.nivel_chakra || 0,
      pressure: record.vitals?.presion || 'N/A',
      status: record.currentCondition || 'stable',
      id: record._id,
    });
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Encabezado */}
      <Card className="p-6 bg-white mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[#3c5661] mb-1">Relay Box – Monitoreo en tiempo real</h1>
            <p className="text-xs text-[#3c5661] opacity-60">
              Sistema de Telemedicina Ninja
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className={`flex items-center gap-2 px-3 py-2 rounded-lg bg-[#e8f5ef] transition-opacity ${isUpdating ? 'opacity-100' : 'opacity-60'
              }`}>
              <Radio className={`w-4 h-4 text-[#72be9a] ${isUpdating ? 'animate-pulse' : ''}`} />
              <span className="text-xs text-[#3c5661]">Actualizando datos...</span>
            </div>
            <Badge
              variant="outline"
              className="bg-[#72be9a] text-white border-[#72be9a] px-3 py-1"
            >
              {connectedNinjas.length} Conectados
            </Badge>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Panel izquierdo - Signos Vitales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tarjetas de Signos Vitales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frecuencia Cardíaca */}
            <Card className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.heartRate, 'heartRate')) }}
                  >
                    <Heart
                      className="w-6 h-6"
                      style={{ color: getStatusColor(getVitalStatus(selectedNinja.heartRate, 'heartRate')) }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#3c5661] opacity-60">Frecuencia Cardíaca</p>
                    <p className="text-[#3c5661]">{selectedNinja.heartRate} bpm</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.heartRate, 'heartRate')),
                    borderColor: getStatusColor(getVitalStatus(selectedNinja.heartRate, 'heartRate')),
                    color: getStatusColor(getVitalStatus(selectedNinja.heartRate, 'heartRate'))
                  }}
                  className="text-xs px-2 py-1"
                >
                  {getStatusText(getVitalStatus(selectedNinja.heartRate, 'heartRate'))}
                </Badge>
              </div>
              <Progress
                value={(selectedNinja.heartRate / 150) * 100}
                className="h-2"
                style={{
                  backgroundColor: '#f2ede9'
                }}
              />
            </Card>

            {/* Temperatura Corporal */}
            <Card className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.temperature, 'temperature')) }}
                  >
                    <Thermometer
                      className="w-6 h-6"
                      style={{ color: getStatusColor(getVitalStatus(selectedNinja.temperature, 'temperature')) }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#3c5661] opacity-60">Temperatura Corporal</p>
                    <p className="text-[#3c5661]">{selectedNinja.temperature}°C</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.temperature, 'temperature')),
                    borderColor: getStatusColor(getVitalStatus(selectedNinja.temperature, 'temperature')),
                    color: getStatusColor(getVitalStatus(selectedNinja.temperature, 'temperature'))
                  }}
                  className="text-xs px-2 py-1"
                >
                  {getStatusText(getVitalStatus(selectedNinja.temperature, 'temperature'))}
                </Badge>
              </div>
              <Progress
                value={(selectedNinja.temperature / 40) * 100}
                className="h-2"
                style={{
                  backgroundColor: '#f2ede9'
                }}
              />
            </Card>

            {/* Nivel de Chakra */}
            <Card className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.chakraLevel, 'chakra')) }}
                  >
                    <Zap
                      className="w-6 h-6"
                      style={{ color: getStatusColor(getVitalStatus(selectedNinja.chakraLevel, 'chakra')) }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#3c5661] opacity-60">Nivel de Chakra</p>
                    <p className="text-[#3c5661]">{selectedNinja.chakraLevel}%</p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getStatusBgColor(getVitalStatus(selectedNinja.chakraLevel, 'chakra')),
                    borderColor: getStatusColor(getVitalStatus(selectedNinja.chakraLevel, 'chakra')),
                    color: getStatusColor(getVitalStatus(selectedNinja.chakraLevel, 'chakra'))
                  }}
                  className="text-xs px-2 py-1"
                >
                  {getStatusText(getVitalStatus(selectedNinja.chakraLevel, 'chakra'))}
                </Badge>
              </div>
              <Progress
                value={selectedNinja.chakraLevel}
                className="h-2"
                style={{
                  backgroundColor: '#f2ede9'
                }}
              />
            </Card>

            {/* Presión / Estado General */}
            <Card className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: getStatusBgColor(selectedNinja.status) }}
                  >
                    <Activity
                      className="w-6 h-6"
                      style={{ color: getStatusColor(selectedNinja.status) }}
                    />
                  </div>
                  <div>
                    <p className="text-xs text-[#3c5661] opacity-60">Estado General</p>
                    <p className="text-[#3c5661]">
                      {selectedNinja.status === "critical"
                        ? "Crítico"
                        : selectedNinja.status === "urgent"
                          ? "Urgente"
                          : "Estable"}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getStatusBgColor(selectedNinja.status),
                    borderColor: getStatusColor(selectedNinja.status),
                    color: getStatusColor(selectedNinja.status)
                  }}
                  className="text-xs px-2 py-1"
                >
                  {selectedNinja.status === "critical"
                    ? "Crítico"
                    : selectedNinja.status === "urgent"
                      ? "Urgente"
                      : "Estable"}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full animate-pulse"
                  style={{ backgroundColor: getStatusColor(selectedNinja.status) }}
                ></div>
                <p className="text-xs text-[#3c5661] opacity-60">Monitoreando...</p>
              </div>
            </Card>
          </div>

          {/* Información del Paciente Seleccionado */}
          <Card className="p-6 bg-white">
            <h2 className="text-[#3c5661] mb-4">Información del Ninja</h2>
            <Separator className="mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-[#3c5661] opacity-60 mb-1">Nombre</p>
                <p className="text-xs text-[#3c5661]">{selectedNinja.name}</p>
              </div>
              <div>
                <p className="text-xs text-[#3c5661] opacity-60 mb-1">Rango</p>
                <Badge variant="outline" className="border-[#f4c0c2] text-[#882238] text-xs">
                  {selectedNinja.rank}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-[#3c5661] opacity-60 mb-1">Estado Actual</p>
                <Badge
                  variant="outline"
                  style={{
                    backgroundColor: getStatusBgColor(selectedNinja.status),
                    borderColor: getStatusColor(selectedNinja.status),
                    color: getStatusColor(selectedNinja.status)
                  }}
                  className="text-xs"
                >
                  {getStatusText(selectedNinja.status)}
                </Badge>
              </div>
              <div>
                <p className="text-xs text-[#3c5661] opacity-60 mb-1">ID Conexión</p>
                <p className="text-xs text-[#3c5661]">#{selectedNinja.id.toString().padStart(4, '0')}</p>
              </div>
            </div>
          </Card>

          {/* Botón de Alerta */}
          {alertSent && (
            <div className="mb-4 p-3 bg-[#e8f5ef] text-[#237a4c] border border-[#72be9a] rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>Alerta médica enviada con éxito.</span>
            </div>
          )}

          <Card className="p-6 bg-white">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[#3c5661] mb-1">Alerta Médica de Emergencia</h2>
                <p className="text-xs text-[#3c5661] opacity-60">
                  Invocar a Katsuyu para asistencia médica inmediata
                </p>
              </div>

              <Button
                onClick={handleSendAlert}
                className={`${alertSent
                  ? 'bg-[#72be9a] hover:bg-[#72be9a]'
                  : 'bg-[#882238] hover:bg-[#6d1a2c]'
                  } text-white rounded-lg px-6 py-3 flex items-center gap-2`}
                disabled={alertSent}
              >
                {alertSent ? (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    Alerta Enviada
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar alerta médica (Katsuyu)
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>

        {/* Panel derecho - Sello de Comunicación Médica */}
        <Card className="p-6 bg-white h-fit">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-[#882238]" />
            <h2 className="text-[#3c5661]">Sello de Comunicación Médica (SCM)</h2>
          </div>
          <Separator className="mb-4" />
          <p className="text-xs text-[#3c5661] opacity-60 mb-4">
            Ninjas conectados en tiempo real
          </p>
          <div className="space-y-2">
            {connectedNinjas.map((record) => (
              <button
                key={record._id} // ID del registro de telemedicina para el key
                onClick={() => handleSelectNinja(record)}
                className={`w-full p-3 rounded-lg border transition-all hover:shadow-md ${selectedNinja.id === record._id
                  ? 'border-[#882238] bg-[#fff9f5]'
                  : 'border-[#f4c0c2] bg-white hover:bg-[#f2ede9]'
                  }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full animate-pulse"
                      style={{ backgroundColor: getStatusColor(record.currentCondition) }}
                    ></div>
                    <p className="text-xs text-[#3c5661]">{record.ninjaId.nombre}</p>
                  </div>
                  <Badge
                    variant="outline"
                    style={{
                      backgroundColor: getStatusBgColor(record.currentCondition),
                      borderColor: getStatusColor(record.currentCondition),
                      color: getStatusColor(record.currentCondition)
                    }}
                    className="text-xs px-2 py-0.5"
                  >
                    {getStatusText(record.currentCondition)}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-xs text-[#3c5661] opacity-60">
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{record.vitals.pulso}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    <span>{record.vitals.temperatura}°</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3" />
                    <span>{record.vitals.nivel_chakra}%</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="p-3 rounded-lg bg-[#e8f5ef] border border-[#72be9a]">
            <p className="text-xs text-[#3c5661] mb-1">
              💡 Sistema Activo
            </p>
            <p className="text-xs text-[#3c5661] opacity-60">
              Todos los sellos de comunicación están operativos y transmitiendo datos en tiempo real.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};
