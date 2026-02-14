import { toast } from 'sonner';
import { Produto } from '@/../../shared/const';
import { BarChart3, TrendingDown, AlertTriangle, Package } from 'lucide-react';
import ExportarBotoes from '../ExportarBotoes';

interface RelatorioEstoqueProps {
  produtos: Produto[];
}

export default function RelatorioEstoque({ produtos }: RelatorioEstoqueProps) {
  const diasParaVencer = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    const hoje = new Date();
    return Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  };

  // Análises
  const produtosVencidos = produtos.filter(p => diasParaVencer(p.validade) <= 0);
  const produtosProximos = produtos.filter(p => {
    const d = diasParaVencer(p.validade);
    return d > 0 && d <= 30;
  });
  const produtosBaixoEstoque = produtos.filter(p => p.quantidade < 10);
  const produtosMaisCaro = [...produtos].sort((a, b) => b.preco - a.preco).slice(0, 3);
  const produtosMaisBarato = [...produtos].sort((a, b) => a.preco - b.preco).slice(0, 3);

  const valorTotalEstoque = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const quantidadeTotalItens = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  const copiarValorTotal = () => {
    const texto = `R$ ${valorTotalEstoque.toFixed(2).replace('.', ',')}`;
    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Valor total copiado!', { description: texto });
    }).catch(() => toast.error('Não foi possível copiar.'));
  };

  return (
    <div className="space-y-6">
      {/* Botões de exportação */}
      <ExportarBotoes produtos={produtos} />
      {/* Alertas críticos */}
      {(produtosVencidos.length > 0 || produtosBaixoEstoque.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {produtosVencidos.length > 0 && (
            <div className="bg-red-50 dark:bg-red-500/20 border border-red-300 dark:border-red-500/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-red-800 dark:text-red-200 font-bold mb-1">Produtos Vencidos</h3>
                  <p className="text-red-700 dark:text-red-300 text-sm">{produtosVencidos.length} produto(s) vencido(s) - Remova imediatamente!</p>
                </div>
              </div>
            </div>
          )}

          {produtosBaixoEstoque.length > 0 && (
            <div className="bg-amber-50 dark:bg-amber-500/20 border border-amber-300 dark:border-amber-500/50 rounded-xl p-5">
              <div className="flex items-start gap-4">
                <TrendingDown className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-amber-800 dark:text-amber-200 font-bold mb-1">Estoque Baixo</h3>
                  <p className="text-amber-700 dark:text-amber-300 text-sm">{produtosBaixoEstoque.length} produto(s) com quantidade menor que 10 unidades</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Estatísticas gerais */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-xl p-4 text-card-foreground border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">Total de Produtos</p>
              <p className="text-2xl font-bold text-card-foreground mt-2">{produtos.length}</p>
            </div>
            <Package className="w-8 h-8 text-primary/60" />
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={copiarValorTotal}
          onKeyDown={(e) => e.key === 'Enter' && copiarValorTotal()}
          className="bg-card border border-border rounded-xl p-4 cursor-pointer transition-all hover:scale-[1.02] hover:border-[var(--highlight)]/50 hover:shadow-lg text-card-foreground border-l-4 border-l-[var(--highlight)]"
          title="Clique para copiar"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">Valor Total <span className="text-[var(--highlight)]/90 text-[10px]">(clique para copiar)</span></p>
              <p className="text-2xl font-bold text-card-foreground mt-2">R$ {valorTotalEstoque.toFixed(2).replace('.', ',')}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-[var(--highlight)]/60" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 text-card-foreground border-l-4 border-l-emerald-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">Quantidade Total</p>
              <p className="text-2xl font-bold text-card-foreground mt-2">{quantidadeTotalItens}</p>
            </div>
            <Package className="w-8 h-8 text-emerald-500/60" />
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-4 text-card-foreground border-l-4 border-l-cyan-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-muted-foreground text-xs font-medium uppercase">Preço Médio</p>
              <p className="text-2xl font-bold text-card-foreground mt-2">R$ {(valorTotalEstoque / (produtos.length || 1)).toFixed(2).replace('.', ',')}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-cyan-500/60" />
          </div>
        </div>
      </div>

      {/* Produtos mais caros e mais baratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
          <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">💎</span> Produtos Mais Caros
          </h3>
          <div className="space-y-3">
            {produtosMaisCaro.map((p, i) => (
              <div key={p.id_produto} className="flex items-center justify-between p-3 bg-purple-50 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20">
                <div>
                  <p className="text-slate-800 dark:text-white font-medium">{i + 1}. {p.nome}</p>
                  <p className="text-purple-600 dark:text-purple-300 text-sm">Qtd: {p.quantidade}</p>
                </div>
                <p className="text-amber-700 dark:text-amber-300 font-bold">R$ {p.preco.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
          <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">💰</span> Produtos Mais Baratos
          </h3>
          <div className="space-y-3">
            {produtosMaisBarato.map((p, i) => (
              <div key={p.id_produto} className="flex items-center justify-between p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                <div>
                  <p className="text-slate-800 dark:text-white font-medium">{i + 1}. {p.nome}</p>
                  <p className="text-emerald-600 dark:text-emerald-300 text-sm">Qtd: {p.quantidade}</p>
                </div>
                <p className="text-emerald-700 dark:text-emerald-300 font-bold">R$ {p.preco.toFixed(2).replace('.', ',')}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Produtos próximos do vencimento */}
      {produtosProximos.length > 0 && (
        <div className="bg-card border border-border rounded-xl p-6 text-card-foreground">
          <h3 className="text-lg font-bold text-card-foreground mb-4 flex items-center gap-2">
            <span className="text-2xl">⏰</span> Próximos do Vencimento (30 dias)
          </h3>
          <div className="space-y-2">
            {produtosProximos.map(p => {
              const d = diasParaVencer(p.validade);
              return (
                <div key={p.id_produto} className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-500/10 rounded-lg border border-amber-200 dark:border-amber-500/20">
                  <div className="flex-1">
                    <p className="text-slate-800 dark:text-white font-medium">{p.nome}</p>
                    <p className="text-amber-700 dark:text-amber-300 text-sm">Validade: {p.validade}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${d <= 7 ? 'bg-red-100 text-red-700 dark:bg-red-500/40 dark:text-red-200' : 'bg-amber-100 text-amber-800 dark:bg-amber-500/40 dark:text-amber-200'}`}>
                    {d} dias
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
