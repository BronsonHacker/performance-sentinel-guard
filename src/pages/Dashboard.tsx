
import React from 'react';
import { Database, Circle, Circle as CircleIcon } from 'lucide-react';
import MetricCard from '@/components/dashboard/MetricCard';
import QueryTable from '@/components/dashboard/QueryTable';
import PerformanceChart from '@/components/dashboard/PerformanceChart';

const Dashboard = () => {
  // Mock data - Em produção, estes dados viriam da API
  const mockQueries = [
    {
      id: '1',
      text: 'SELECT * FROM Orders WHERE CustomerID = @CustomerID AND OrderDate >= @StartDate',
      cpuTime: 15420,
      duration: 8540,
      executions: 1250,
      logicalReads: 48000,
      severity: 'high' as const
    },
    {
      id: '2',
      text: 'UPDATE Products SET Stock = Stock - @Quantity WHERE ProductID = @ProductID',
      cpuTime: 8750,
      duration: 4320,
      executions: 890,
      logicalReads: 25600,
      severity: 'medium' as const
    },
    {
      id: '3',
      text: 'SELECT TOP 100 * FROM Customers ORDER BY LastOrderDate DESC',
      cpuTime: 6200,
      duration: 2100,
      executions: 450,
      logicalReads: 12800,
      severity: 'low' as const
    }
  ];

  const mockChartData = [
    { time: '00:00', cpu: 20, memory: 45, io: 12 },
    { time: '04:00', cpu: 15, memory: 42, io: 8 },
    { time: '08:00', cpu: 65, memory: 78, io: 25 },
    { time: '12:00', cpu: 80, memory: 85, io: 35 },
    { time: '16:00', cpu: 45, memory: 52, io: 18 },
    { time: '20:00', cpu: 30, memory: 48, io: 14 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Dashboard de Performance</h1>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <span className="text-sm text-gray-300">3 Instâncias Online</span>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="Instâncias Ativas"
          value="3"
          change="+1 desde ontem"
          changeType="positive"
          icon={Database}
        />
        <MetricCard
          title="Queries Críticas"
          value="12"
          change="-3 desde ontem"
          changeType="positive"
          icon={CircleIcon}
        />
        <MetricCard
          title="CPU Média"
          value="67%"
          change="+15% desde ontem"
          changeType="negative"
          icon={Circle}
        />
        <MetricCard
          title="Alertas Ativos"
          value="5"
          change="+2 desde ontem"
          changeType="negative"
          icon={Circle}
        />
      </div>

      {/* Gráfico de Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PerformanceChart
          data={mockChartData}
          title="Performance nas Últimas 24h"
        />
        <div className="space-y-4">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Status das Instâncias</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">SQL-PROD-01</span>
                </div>
                <span className="text-gray-300">CPU: 45%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <span className="text-white">SQL-PROD-02</span>
                </div>
                <span className="text-gray-300">CPU: 78%</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-white">SQL-DEV-01</span>
                </div>
                <span className="text-gray-300">CPU: 23%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Queries Problemáticas */}
      <QueryTable
        queries={mockQueries}
        title="Top 10 Queries com Maior Consumo de CPU"
      />
    </div>
  );
};

export default Dashboard;
