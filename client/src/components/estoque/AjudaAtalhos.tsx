import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface AjudaAtalhosProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export default function AjudaAtalhos({ open: controlledOpen, onOpenChange }: AjudaAtalhosProps) {
  const isControlled = controlledOpen !== undefined && onOpenChange !== undefined;
  const [internalOpen, setInternalOpen] = useState(false);
  const aberto = isControlled ? controlledOpen : internalOpen;
  const setAberto = isControlled ? (onOpenChange!) : ((v: boolean) => setInternalOpen(v));

  const atalhos = [
    { combinacao: 'Alt + D', descricao: 'Ir para Início (Dashboard)' },
    { combinacao: 'Alt + L', descricao: 'Ir para Lista de Estoque' },
    { combinacao: 'Alt + A', descricao: 'Ir para Adicionar Produto' },
    { combinacao: 'Alt + V', descricao: 'Ir para Por Validade' },
    { combinacao: 'Alt + P', descricao: 'Ir para Próximos do Vencimento' },
    { combinacao: 'Alt + R', descricao: 'Ir para Relatório & Análise' },
    { combinacao: 'Alt + ?', descricao: 'Abrir esta ajuda' },
  ];

  return (
    <>
      <Button
        onClick={() => setAberto(true)}
        variant="outline"
        size="sm"
        className="border-purple-400 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20"
        title="Pressione Alt + ? para atalhos"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>

      <Dialog open={aberto} onOpenChange={setAberto}>
        <DialogContent className="bg-card border border-border text-card-foreground">
          <DialogHeader>
            <DialogTitle className="text-card-foreground">Atalhos de Teclado</DialogTitle>
          </DialogHeader>

          <div className="space-y-3 mt-4">
            {atalhos.map((atalho, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg border border-border">
                <p className="text-card-foreground">{atalho.descricao}</p>
                <kbd className="px-3 py-1 bg-muted text-foreground rounded text-sm font-mono border border-border">
                  {atalho.combinacao}
                </kbd>
              </div>
            ))}
          </div>

          <div className="bg-muted/50 border border-border rounded-lg p-4 mt-4">
            <p className="text-muted-foreground text-sm">
              💡 <span className="font-semibold">Dica:</span> Os atalhos funcionam em qualquer lugar do aplicativo, exceto quando você está digitando em um campo de entrada.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
