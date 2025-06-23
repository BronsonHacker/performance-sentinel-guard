
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Settings as SettingsIcon, User, Bell, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Configurações</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configurações de Conta */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <User className="h-5 w-5 mr-2" />
              Conta
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300">Nome</Label>
              <Input 
                id="name" 
                defaultValue="João Silva" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300">Email</Label>
              <Input 
                id="email" 
                type="email" 
                defaultValue="joao@empresa.com" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-300">Empresa</Label>
              <Input 
                id="company" 
                defaultValue="Minha Empresa LTDA" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Salvar Alterações
            </Button>
          </CardContent>
        </Card>

        {/* Configurações de Notificação */}
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white flex items-center">
              <Bell className="h-5 w-5 mr-2" />
              Notificações
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email-alerts" className="text-gray-300">Email para Alertas</Label>
              <Input 
                id="email-alerts" 
                type="email" 
                defaultValue="alertas@empresa.com" 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-url" className="text-gray-300">Webhook URL (Slack/Teams)</Label>
              <Input 
                id="webhook-url" 
                placeholder="https://hooks.slack.com/..." 
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="email-notifications" 
                className="rounded border-gray-600 bg-gray-700"
                defaultChecked
              />
              <Label htmlFor="email-notifications" className="text-gray-300">
                Receber notificações por email
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input 
                type="checkbox" 
                id="daily-reports" 
                className="rounded border-gray-600 bg-gray-700"
              />
              <Label htmlFor="daily-reports" className="text-gray-300">
                Relatório diário de performance
              </Label>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Salvar Configurações
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Configurações Avançadas */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            Configurações de Monitoramento
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="collection-interval" className="text-gray-300">
                  Intervalo de Coleta (minutos)
                </Label>
                <Input 
                  id="collection-interval" 
                  type="number" 
                  defaultValue="15" 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="retention-days" className="text-gray-300">
                  Retenção de Dados (dias)
                </Label>
                <Input 
                  id="retention-days" 
                  type="number" 
                  defaultValue="30" 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cpu-threshold" className="text-gray-300">
                  Limite de CPU para Alerta (%)
                </Label>
                <Input 
                  id="cpu-threshold" 
                  type="number" 
                  defaultValue="75" 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration-threshold" className="text-gray-300">
                  Limite de Duração de Query (segundos)
                </Label>
                <Input 
                  id="duration-threshold" 
                  type="number" 
                  defaultValue="30" 
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
          </div>
          <div className="mt-6">
            <Button className="bg-blue-600 hover:bg-blue-700">
              Salvar Configurações de Monitoramento
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plano e Faturamento */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-white">Plano Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-white font-medium">Plano Pro</h3>
              <p className="text-gray-400">Até 10 instâncias, retenção de 30 dias</p>
              <p className="text-sm text-gray-500">Próxima cobrança: 15 de Fevereiro, 2024</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">R$ 99</div>
              <div className="text-sm text-gray-400">/mês</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Button variant="outline" className="border-gray-600 text-gray-300 mr-2">
              Alterar Plano
            </Button>
            <Button variant="outline" className="border-gray-600 text-gray-300">
              Histórico de Cobrança
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;
