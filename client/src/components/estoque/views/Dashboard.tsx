import { Produto } from '@/../../shared/const';
import { Package, TrendingUp, AlertCircle, Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TelaAtiva } from '../EstoqueSidebar';

interface DashboardProps {
  produtos: Produto[];
  onIrPara: (tela: TelaAtiva) => void;
}

export default function Dashboard({ produtos, onIrPara }: DashboardProps) {
  const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const qtdTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);
  const diasParaVencer = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    return Math.ceil((data.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };
  const proximosVencimento = produtos.filter(p => {
    const d = diasParaVencer(p.validade);
    return d > 0 && d <= 30;
  }).length;
  const estoqueBaixo = produtos.filter(p => p.quantidade < 10).length;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-5 text-card-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Total de Produtos</p>
              <p className="text-2xl font-bold mt-1">{produtos.length}</p>
            </div>
            <Package className="w-10 h-10 text-primary/60" />
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-primary p-0 h-auto" onClick={() => onIrPara('lista')}>
            Ver lista <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 text-card-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Valor em Estoque</p>
              <p className="text-2xl font-bold mt-1">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-primary/60" />
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-primary p-0 h-auto" onClick={() => onIrPara('relatorio')}>
            Ver relatório <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 text-card-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Próximos do Vencimento</p>
              <p className="text-2xl font-bold mt-1">{proximosVencimento}</p>
            </div>
            <Calendar className="w-10 h-10 text-amber-500/80" />
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-primary p-0 h-auto" onClick={() => onIrPara('proximos')}>
            Ver lista <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>

        <div className="bg-card border border-border rounded-xl p-5 text-card-foreground">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-sm font-medium">Estoque Baixo (&lt;10)</p>
              <p className="text-2xl font-bold mt-1">{estoqueBaixo}</p>
            </div>
            <AlertCircle className="w-10 h-10 text-destructive/80" />
          </div>
          <Button variant="ghost" size="sm" className="mt-3 text-primary p-0 h-auto" onClick={() => onIrPara('lista')}>
            Ver lista <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 text-center text-card-foreground">
        <p className="text-muted-foreground text-sm">Quantidade total de itens no estoque</p>
        <p className="text-4xl font-bold mt-2">{qtdTotal}</p>
        <p className="text-sm text-muted-foreground mt-1">unidades</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button className="h-auto py-6 flex flex-col items-center gap-2" onClick={() => onIrPara('adicionar')}>
          <Package className="w-8 h-8" />
          <span>Adicionar novo produto</span>
        </Button>
        <Button variant="outline" className="h-auto py-6 flex flex-col items-center gap-2" onClick={() => onIrPara('relatorio')}>
          <TrendingUp className="w-8 h-8" />
          <span>Relatório completo</span>
        </Button>
      </div>
    </div>
  );
}
