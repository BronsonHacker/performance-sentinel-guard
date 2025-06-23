
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface ChartData {
  time: string;
  cpu: number;
  memory: number;
  io: number;
}

interface PerformanceChartProps {
  data: ChartData[];
  title: string;
}

const PerformanceChart = ({ data, title }: PerformanceChartProps) => {
  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="time" 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <YAxis 
                stroke="#9CA3AF"
                tick={{ fill: '#9CA3AF' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  color: '#F3F4F6'
                }}
              />
              <Line 
                type="monotone" 
                dataKey="cpu" 
                stroke="#3B82F6" 
                strokeWidth={2}
                name="CPU (%)"
              />
              <Line 
                type="monotone" 
                dataKey="memory" 
                stroke="#10B981" 
                strokeWidth={2}
                name="Memória (%)"
              />
              <Line 
                type="monotone" 
                dataKey="io" 
                stroke="#F59E0B" 
                strokeWidth={2}
                name="I/O (MB/s)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
