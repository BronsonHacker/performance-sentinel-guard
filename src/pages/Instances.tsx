import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, Circle, Settings } from 'lucide-react';
import AddInstanceModal from '@/components/instances/AddInstanceModal';

const Instances = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const instances = [
    {
      id: '1',
      name: 'SQL-PROD-01',
      server: 'srv-db-prod-01.empresa.com',
      status: 'online',
      cpu: 45,
      memory: 67,
      lastUpdate: '2 min atrás',
      version: 'SQL Server 2019'
    },
    {
      id: '2',
      name: 'SQL-PROD-02',
      server: 'srv-db-prod-02.empresa.com',
      status: 'warning',
      cpu: 78,
      memory: 85,
      lastUpdate: '1 min atrás',
      version: 'SQL Server 2022'
    },
    {
      id: '3',
      name: 'SQL-DEV-01',
      server: 'srv-db-dev-01.empresa.com',
      status: 'online',
      cpu: 23,
      memory: 34,
      lastUpdate: '3 min atrás',
      version: 'SQL Server 2019'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-600';
      case 'warning':
        return 'bg-yellow-600';
      case 'offline':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <div className="w-3 h-3 bg-green-400 rounded-full"></div>;
      case 'warning':
        return <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>;
      case 'offline':
        return <div className="w-3 h-3 bg-red-400 rounded-full"></div>;
      default:
        return <div className="w-3 h-3 bg-gray-400 rounded-full"></div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Instâncias SQL Server</h1>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => setShowAddModal(true)}
        >
          <Database className="h-4 w-4 mr-2" />
          Adicionar Instância
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {instances.map((instance) => (
          <Card key={instance.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-white flex items-center">
                  {getStatusIcon(instance.status)}
                  <span className="ml-2">{instance.name}</span>
                </CardTitle>
                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-sm text-gray-400">{instance.server}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-300">Status</span>
                <Badge className={`${getStatusColor(instance.status)} text-white`}>
                  {instance.status.toUpperCase()}
                </Badge>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">CPU</span>
                  <span className="text-sm text-white">{instance.cpu}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${instance.cpu > 70 ? 'bg-red-500' : instance.cpu > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${instance.cpu}%` }}
                  ></div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Memória</span>
                  <span className="text-sm text-white">{instance.memory}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${instance.memory > 70 ? 'bg-red-500' : instance.memory > 50 ? 'bg-yellow-500' : 'bg-green-500'}`}
                    style={{ width: `${instance.memory}%` }}
                  ></div>
                </div>
              </div>

              <div className="pt-2 border-t border-gray-700">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Versão</span>
                  <span className="text-gray-300">{instance.version}</span>
                </div>
                <div className="flex items-center justify-between text-sm mt-1">
                  <span className="text-gray-400">Última atualização</span>
                  <span className="text-gray-300">{instance.lastUpdate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Card de Instruções para Adicionar Nova Instância */}
      <Card className="bg-gray-800 border-gray-700 border-dashed">
        <CardContent className="py-8">
          <div className="text-center">
            <Database className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Adicionar Nova Instância</h3>
            <p className="text-gray-400 mb-4 max-w-md mx-auto">
              Configure uma nova instância SQL Server para monitoramento. 
              Você receberá um script coletor personalizado e uma chave de API única.
            </p>
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => setShowAddModal(true)}
            >
              Começar Configuração
            </Button>
          </div>
        </CardContent>
      </Card>

      <AddInstanceModal 
        open={showAddModal} 
        onOpenChange={setShowAddModal} 
      />
    </div>
  );
};

export default Instances;
