import { useState } from 'react';
import { toast } from 'sonner';
import { Produto } from '@/../../shared/const';
import { Input } from '@/components/ui/input';
import { AlertCircle } from 'lucide-react';

interface ProximosVencimentoProps {
  produtos: Produto[];
  carregando: boolean;
}

export default function ProximosVencimento({ produtos, carregando }: ProximosVencimentoProps) {
  const [dias, setDias] = useState('30');

  const handleDiasBlur = () => {
    const n = parseInt(dias, 10);
    if (!Number.isNaN(n) && n > 0) {
      toast.success('Período atualizado', { description: `Exibindo produtos que vencem em até ${n} dias.` });
    }
  };

  const diasParaVencer = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    const hoje = new Date();
    return Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  };

  const produtosProximos = produtos.filter(p => {
    const d = diasParaVencer(p.validade);
    return d <= parseInt(dias) && d > 0;
  }).sort((a, b) => diasParaVencer(a.validade) - diasParaVencer(b.validade));

  const produtosVencidos = produtos.filter(p => diasParaVencer(p.validade) <= 0);

  return (
    <div className="space-y-6">
      {/* Configuração de dias */}
      <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
        <div className="flex items-center gap-4">
          <div>
            <label className="text-slate-700 dark:text-purple-300 font-medium">Mostrar produtos que vencem em até</label>
            <div className="flex items-center gap-3 mt-3">
              <Input
                type="number"
                value={dias}
                onChange={(e) => setDias(e.target.value)}
                onBlur={handleDiasBlur}
                className="w-24 bg-background border-border text-foreground"
              />
              <span className="text-slate-600 dark:text-purple-300">dias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas */}
      {produtosVencidos.length > 0 && (
        <div className="bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-red-800 dark:text-red-200 font-semibold mb-2">Produtos Vencidos</h3>
              <p className="text-red-700 dark:text-red-300 text-sm">Você tem {produtosVencidos.length} produto(s) vencido(s). Remova-os do estoque!</p>
            </div>
          </div>
        </div>
      )}

      {/* Tabela de próximos vencimentos */}
      <div className="bg-card border border-border rounded-xl overflow-hidden text-card-foreground">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-purple-300 dark:border-purple-500/30 border-t-purple-500 dark:border-t-purple-400 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-4">Carregando produtos...</p>
          </div>
        ) : produtosProximos.length === 0 ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-emerald-500 dark:text-emerald-400/50 mx-auto mb-4" />
            <p className="text-card-foreground text-lg">Nenhum produto próximo do vencimento</p>
            <p className="text-muted-foreground text-sm mt-2">Tudo está em ordem! ✓</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/80 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preço</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Validade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Dias</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {produtosProximos.map((produto) => {
                  const d = diasParaVencer(produto.validade);
                  const urgente = d <= 7;

                  return (
                    <tr key={produto.id_produto} className={`hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors ${urgente ? 'bg-red-50/80 dark:bg-red-500/5' : ''}`}>
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-purple-300">{produto.id_produto}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{produto.nome}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">{produto.quantidade}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-700 dark:text-amber-300">R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{produto.validade}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold inline-block ${
                          urgente ? 'bg-red-100 text-red-700 dark:bg-red-500/40 dark:text-red-200 border border-red-300 dark:border-red-500/60' :
                          'bg-amber-100 text-amber-800 dark:bg-amber-500/40 dark:text-amber-200 border border-amber-300 dark:border-amber-500/60'
                        }`}>
                          {urgente ? '🔴' : '🟡'} {d} dias
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
