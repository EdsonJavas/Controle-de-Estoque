import { Produto } from '@/../../shared/const';
import { Calendar } from 'lucide-react';

interface PorValidadeProps {
  produtos: Produto[];
  carregando: boolean;
}

export default function PorValidade({ produtos, carregando }: PorValidadeProps) {
  const produtosOrdenados = [...produtos].sort((a, b) => {
    const [da, ma, ya] = a.validade.split('/').map(Number);
    const [db, mb, yb] = b.validade.split('/').map(Number);
    const dataA = new Date(ya, ma - 1, da);
    const dataB = new Date(yb, mb - 1, db);
    return dataA.getTime() - dataB.getTime();
  });

  const isVencido = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    return data < new Date();
  };

  const diasParaVencer = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    const hoje = new Date();
    return Math.ceil((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  };

  return (
    <div className="space-y-6">
      <div className="bg-card border border-border rounded-xl overflow-hidden text-card-foreground">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-purple-300 dark:border-purple-500/30 border-t-purple-500 dark:border-t-purple-400 rounded-full" />
            </div>
            <p className="text-muted-foreground mt-4">Carregando produtos...</p>
          </div>
        ) : produtosOrdenados.length === 0 ? (
          <div className="p-12 text-center">
            <Calendar className="w-12 h-12 text-purple-500 dark:text-purple-400/50 mx-auto mb-4" />
            <p className="text-card-foreground text-lg">Nenhum produto no estoque</p>
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
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {produtosOrdenados.map((produto) => {
                  const vencido = isVencido(produto.validade);
                  const dias = diasParaVencer(produto.validade);
                  const proximoVencimento = dias <= 30 && dias > 0;

                  return (
                    <tr key={produto.id_produto} className="hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors">
                      <td className="px-6 py-4 text-sm text-slate-600 dark:text-purple-300">{produto.id_produto}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{produto.nome}</td>
                      <td className="px-6 py-4 text-sm text-slate-700 dark:text-purple-200">{produto.quantidade}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-700 dark:text-amber-300">R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-slate-800 dark:text-white">{produto.validade}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium inline-block ${
                          vencido ? 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200 border border-red-300 dark:border-red-500/50' :
                          proximoVencimento ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/30 dark:text-amber-200 border border-amber-300 dark:border-amber-500/50' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/50'
                        }`}>
                          {vencido ? '❌ Vencido' : proximoVencimento ? `⚠️ ${dias} dias` : '✓ OK'}
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
