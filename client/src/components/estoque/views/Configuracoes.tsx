import { Settings, Bell, Database, Palette } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export default function Configuracoes() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-xl p-8 text-card-foreground">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <Settings className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Configurações</h2>
            <p className="text-sm text-muted-foreground">Preferências do estabelecimento</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-muted-foreground" />
              <Label htmlFor="alertas" className="text-card-foreground font-medium">Alertas de estoque baixo</Label>
            </div>
            <Switch id="alertas" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div className="flex items-center gap-3">
              <Database className="w-5 h-5 text-muted-foreground" />
              <Label htmlFor="backup" className="text-card-foreground font-medium">Lembrete de backup</Label>
            </div>
            <Switch id="backup" defaultChecked />
          </div>
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Palette className="w-5 h-5 text-muted-foreground" />
              <span className="text-card-foreground font-medium">Tema claro/escuro</span>
            </div>
            <p className="text-xs text-muted-foreground">Altere pelo ícone no topo da página</p>
          </div>
        </div>
      </div>
    </div>
  );
}
