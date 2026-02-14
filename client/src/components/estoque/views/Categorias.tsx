import { FolderOpen, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Categorias() {
  return (
    <div className="max-w-2xl space-y-6">
      <div className="bg-card border border-border rounded-xl p-8 text-card-foreground">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
            <FolderOpen className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-card-foreground">Categorias de Produtos</h2>
            <p className="text-sm text-muted-foreground">Organize seus produtos por categoria (em breve)</p>
          </div>
        </div>
        <p className="text-muted-foreground text-sm">
          Aqui você poderá criar categorias como: Bebidas, Laticínios, Higiene, etc. e associar cada produto a uma categoria para filtros e relatórios mais organizados.
        </p>
        <Button disabled className="mt-6" variant="outline">
          <Plus className="w-4 h-4 mr-2" />
          Nova categoria (em breve)
        </Button>
      </div>
    </div>
  );
}
