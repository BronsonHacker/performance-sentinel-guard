
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Copy, Database, Key, Server } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AddInstanceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddInstanceModal = ({ open, onOpenChange }: AddInstanceModalProps) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    server: '',
    port: '1433',
    description: ''
  });
  const { toast } = useToast();

  const generateApiKey = () => {
    return 'SK-' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  };

  const generateScript = () => {
    const apiKey = generateApiKey();
    return `# Script Coletor SQL Server Performance
# Instância: ${formData.name}
# Servidor: ${formData.server}:${formData.port}

# Configuração
$ApiKey = "${apiKey}"
$ServerName = "${formData.server}"
$Port = ${formData.port}
$InstanceName = "${formData.name}"

# Script de coleta (executar a cada 5 minutos via Task Scheduler)
Write-Host "Coletando métricas de performance para $InstanceName..."
# Implementar coleta real de métricas aqui`;
  };

  const handleCopyScript = () => {
    navigator.clipboard.writeText(generateScript());
    toast({
      title: "Script copiado!",
      description: "O script foi copiado para a área de transferência.",
    });
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText(generateApiKey());
    toast({
      title: "Chave API copiada!",
      description: "A chave foi copiada para a área de transferência.",
    });
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.name || !formData.server) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha o nome e servidor da instância.",
          variant: "destructive",
        });
        return;
      }
      setStep(2);
    }
  };

  const handleFinish = () => {
    toast({
      title: "Instância configurada!",
      description: `${formData.name} foi adicionada com sucesso.`,
    });
    onOpenChange(false);
    setStep(1);
    setFormData({ name: '', server: '', port: '1433', description: '' });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center">
            <Database className="h-5 w-5 mr-2" />
            {step === 1 ? 'Configurar Nova Instância' : 'Chave API e Script Coletor'}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {step === 1 
              ? 'Preencha as informações da instância SQL Server'
              : 'Copie a chave API e o script coletor para configurar o monitoramento'
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-white">Nome da Instância *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ex: SQL-PROD-01"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="server" className="text-white">Servidor *</Label>
                <Input
                  id="server"
                  value={formData.server}
                  onChange={(e) => setFormData(prev => ({ ...prev, server: e.target.value }))}
                  placeholder="Ex: srv-db-prod-01.empresa.com"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="port" className="text-white">Porta</Label>
              <Input
                id="port"
                value={formData.port}
                onChange={(e) => setFormData(prev => ({ ...prev, port: e.target.value }))}
                placeholder="1433"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description" className="text-white">Descrição (opcional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Descrição da instância..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button onClick={handleNext} className="bg-blue-600 hover:bg-blue-700">
                Próximo
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Key className="h-4 w-4 mr-2" />
                  Chave API
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-2">
                  <Input
                    value={generateApiKey()}
                    readOnly
                    className="bg-gray-800 border-gray-600 text-white font-mono text-sm"
                  />
                  <Button size="sm" onClick={handleCopyApiKey}>
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gray-700 border-gray-600">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Server className="h-4 w-4 mr-2" />
                  Script Coletor PowerShell
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={generateScript()}
                  readOnly
                  className="bg-gray-800 border-gray-600 text-white font-mono text-xs"
                  rows={8}
                />
                <Button onClick={handleCopyScript} className="mt-2" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Script
                </Button>
              </CardContent>
            </Card>

            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h4 className="text-blue-400 font-semibold mb-2">Próximos Passos:</h4>
              <ol className="text-sm text-gray-300 space-y-1">
                <li>1. Execute o script PowerShell no servidor SQL Server</li>
                <li>2. Configure uma tarefa agendada para executar a cada 5 minutos</li>
                <li>3. Os dados começarão a aparecer no dashboard em alguns minutos</li>
              </ol>
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="outline" onClick={() => setStep(1)}>
                Voltar
              </Button>
              <div className="space-x-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleFinish} className="bg-green-600 hover:bg-green-700">
                  Finalizar Configuração
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddInstanceModal;
