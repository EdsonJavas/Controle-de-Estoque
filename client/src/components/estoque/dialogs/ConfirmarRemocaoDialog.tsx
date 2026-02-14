import { useState } from 'react';
import { toast } from 'sonner';
import { Produto } from '@/../../shared/const';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface ConfirmarRemocaoDialogProps {
  produto: Produto;
  onConfirmar: () => Promise<void>;
  onCancelar: () => void;
}

export default function ConfirmarRemocaoDialog({ produto, onConfirmar, onCancelar }: ConfirmarRemocaoDialogProps) {
  const [removendo, setRemovendo] = useState(false);

  const handleConfirmar = async () => {
    setRemovendo(true);
    try {
      await onConfirmar();
    } finally {
      setRemovendo(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      toast.info('Remoção cancelada', { description: 'O produto permanece no estoque.' });
    }
    onCancelar();
  };

  return (
    <AlertDialog open onOpenChange={handleOpenChange}>
      <AlertDialogContent className="bg-card border border-border text-card-foreground">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-card-foreground">Remover Produto</AlertDialogTitle>
          <AlertDialogDescription className="text-muted-foreground">
            Tem certeza que deseja remover <span className="font-semibold text-amber-700 dark:text-amber-300">{produto.nome}</span>? Esta ação não pode ser desfeita.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="bg-red-50 dark:bg-red-500/10 border border-red-300 dark:border-red-500/30 rounded-lg p-4 mt-4">
          <p className="text-sm text-red-700 dark:text-red-300">
            <span className="font-semibold">Aviso:</span> Você está removendo este produto do estoque permanentemente.
          </p>
        </div>

        <div className="flex gap-3 justify-end mt-6">
          <AlertDialogCancel className="border-purple-400 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20">
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirmar}
            disabled={removendo}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            {removendo ? 'Removendo...' : 'Remover'}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
