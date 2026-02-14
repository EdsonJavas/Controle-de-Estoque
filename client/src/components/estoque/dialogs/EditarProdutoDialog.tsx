import { useState } from 'react';
import { toast } from 'sonner';
import { Produto } from '@/../../shared/const';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface EditarProdutoDialogProps {
  produto: Produto;
  onSalvar: (dados: Partial<Produto>) => Promise<void>;
  onFechar: () => void;
}

export default function EditarProdutoDialog({ produto, onSalvar, onFechar }: EditarProdutoDialogProps) {
  const [quantidade, setQuantidade] = useState(produto.quantidade.toString());
  const [preco, setPreco] = useState(produto.preco.toFixed(2).replace('.', ','));
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      await onSalvar({
        quantidade: parseInt(quantidade),
        preco: parseFloat(preco.replace(',', '.'))
      });
    } finally {
      setSalvando(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      toast.info('Edição cancelada', { description: 'Nenhuma alteração foi salva.' });
    }
    onFechar();
  };

  return (
    <Dialog open onOpenChange={handleOpenChange}>
      <DialogContent className="bg-card border border-border text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-card-foreground">Editar Produto</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <Label className="text-card-foreground">Nome do Produto</Label>
            <Input
              value={produto.nome}
              disabled
              className="bg-muted border-border text-muted-foreground mt-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-card-foreground">Quantidade</Label>
              <Input
                type="number"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                className="bg-background border-border text-foreground mt-2"
              />
            </div>

            <div>
              <Label className="text-card-foreground">Preço (R$)</Label>
              <Input
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                className="bg-background border-border text-foreground mt-2"
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onFechar}
            className="border-purple-400 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSalvar}
            disabled={salvando}
            className="bg-gradient-to-r from-purple-600 to-amber-600 hover:from-purple-500 hover:to-amber-500 text-white"
          >
            {salvando ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
