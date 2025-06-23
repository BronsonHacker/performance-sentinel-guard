
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Circle, Settings } from 'lucide-react';

const Alerts = () => {
  const alerts = [
    {
      id: '1',
      title: 'Alto consumo de CPU',
      description: 'SQL-PROD-02 apresentando CPU acima de 75% por mais de 10 minutos',
      severity: 'high',
      timestamp: '2024-01-15 14:23:00',
      instance: 'SQL-PROD-02',
      status: 'active'
    },
    {
      id: '2',
      title: 'Query com longa duração detectada',
      description: 'Query executando por mais de 30 segundos na instância SQL-PROD-01',
      severity: 'medium',
      timestamp: '2024-01-15 13:45:00',
      instance: 'SQL-PROD-01',
      status: 'acknowledged'
    },
    {
      id: '3',
      title: 'Espaço em disco baixo',
      description: 'Arquivo de log com menos de 10% de espaço livre',
      severity: 'high',
      timestamp: '2024-01-15 12:30:00',
      instance: 'SQL-PROD-01',
      status: 'resolved'
    }
  ];

  const alertRules = [
    {
      id: '1',
      name: 'CPU Alto',
      condition: 'CPU > 75% por 10 minutos',
      enabled: true
    },
    {
      id: '2',
      name: 'Query Lenta',
      condition: 'Duração > 30 segundos',
      enabled: true
    },
    {
      id: '3',
      name: 'Espaço em Disco',
      condition: 'Espaço livre < 10%',
      enabled: false
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'bg-red-600';
      case 'medium':
        return 'bg-yellow-600';
      default:
        return 'bg-green-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-red-600';
      case 'acknowledged':
        return 'bg-yellow-600';
      case 'resolved':
        return 'bg-green-600';
      default:
        return 'bg-gray-600';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Sistema de Alertas</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Bell className="h-4 w-4 mr-2" />
          Configurar Alerta
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <div className="w-3 h-3 bg-red-400 rounded-full mr-2"></div>
              Alertas Ativos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">2</div>
            <p className="text-sm text-gray-400">Requerem atenção</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
              Reconhecidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">1</div>
            <p className="text-sm text-gray-400">Em investigação</p>
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
              Resolvidos Hoje
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">5</div>
            <p className="text-sm text-gray-400">Últimas 24h</p>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Alertas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Alertas Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="border border-gray-700 rounded-lg p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={`${getSeverityColor(alert.severity)} text-white`}>
                        {alert.severity.toUpperCase()}
                      </Badge>
                      <Badge className={`${getStatusColor(alert.status)} text-white`}>
                        {alert.status.toUpperCase()}
                      </Badge>
                      <span className="text-sm text-gray-400">{alert.instance}</span>
                    </div>
                    <h3 className="text-white font-medium mb-1">{alert.title}</h3>
                    <p className="text-sm text-gray-400 mb-2">{alert.description}</p>
                    <p className="text-xs text-gray-500">{alert.timestamp}</p>
                  </div>
                  <div className="flex space-x-2">
                    {alert.status === 'active' && (
                      <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                        Reconhecer
                      </Button>
                    )}
                    <Button size="sm" variant="outline" className="border-gray-600 text-gray-300">
                      Detalhes
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regras de Alerta */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Regras de Alerta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {alertRules.map((rule) => (
              <div key={rule.id} className="flex items-center justify-between py-3 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${rule.enabled ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                  <div>
                    <h4 className="text-white font-medium">{rule.name}</h4>
                    <p className="text-sm text-gray-400">{rule.condition}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge className={rule.enabled ? 'bg-green-600' : 'bg-gray-600'}>
                    {rule.enabled ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alerts;
