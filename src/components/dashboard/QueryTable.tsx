
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Query {
  id: string;
  text: string;
  cpuTime: number;
  duration: number;
  executions: number;
  logicalReads: number;
  severity: 'high' | 'medium' | 'low';
}

interface QueryTableProps {
  queries: Query[];
  title: string;
}

const QueryTable = ({ queries, title }: QueryTableProps) => {
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

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Query</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">CPU (ms)</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Duração (ms)</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Execuções</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Leituras</th>
                <th className="text-left py-3 px-2 text-gray-300 font-medium">Prioridade</th>
              </tr>
            </thead>
            <tbody>
              {queries.map((query) => (
                <tr key={query.id} className="border-b border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="py-3 px-2">
                    <div className="text-white font-mono text-xs max-w-xs truncate">
                      {query.text}
                    </div>
                  </td>
                  <td className="py-3 px-2 text-gray-300">{query.cpuTime.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-300">{query.duration.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-300">{query.executions.toLocaleString()}</td>
                  <td className="py-3 px-2 text-gray-300">{query.logicalReads.toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <Badge className={`${getSeverityColor(query.severity)} text-white`}>
                      {query.severity.toUpperCase()}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default QueryTable;
