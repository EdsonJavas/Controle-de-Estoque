import { useState } from 'react';
import { Produto, FiltrosListagem } from '@/../../shared/const';
import { Search, Edit2, Trash2, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import EditarProdutoDialog from '../dialogs/EditarProdutoDialog';
import ConfirmarRemocaoDialog from '../dialogs/ConfirmarRemocaoDialog';

interface ListaEstoqueProps {
  produtos: Produto[];
  carregando: boolean;
  filtros: FiltrosListagem;
  onFiltrosChange: (filtros: FiltrosListagem) => void;
  onEditarProduto: (id: number, dados: Partial<Produto>) => Promise<void>;
  onRemoverProduto: (id: number, nome: string) => Promise<void>;
}

export default function ListaEstoque({
  produtos,
  carregando,
  filtros,
  onFiltrosChange,
  onEditarProduto,
  onRemoverProduto
}: ListaEstoqueProps) {
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [removendoId, setRemovendoId] = useState<number | null>(null);
  const [filtroNome, setFiltroNome] = useState(filtros.nome || '');
  const [filtroQtdMin, setFiltroQtdMin] = useState(filtros.quantidade_min?.toString() || '');
  const [filtroPrecoMax, setFiltroPrecoMax] = useState(filtros.preco_max?.toString() || '');

  const aplicarFiltros = () => {
    const novosFiltros = {
      nome: filtroNome || undefined,
      quantidade_min: filtroQtdMin ? parseInt(filtroQtdMin) : undefined,
      preco_max: filtroPrecoMax ? parseFloat(filtroPrecoMax) : undefined
    };
    onFiltrosChange(novosFiltros);
    const temFiltro = !!(novosFiltros.nome || novosFiltros.quantidade_min !== undefined || novosFiltros.preco_max !== undefined);
    toast.success('Filtros aplicados', { description: temFiltro ? 'Lista atualizada com os critérios selecionados.' : 'Exibindo todos os produtos.' });
  };

  const limparFiltros = () => {
    setFiltroNome('');
    setFiltroQtdMin('');
    setFiltroPrecoMax('');
    onFiltrosChange({});
    toast.success('Filtros limpos', { description: 'Exibindo todos os produtos.' });
  };

  const copiarValorTotal = () => {
    const total = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
    const texto = `R$ ${total.toFixed(2).replace('.', ',')}`;
    navigator.clipboard.writeText(texto).then(() => {
      toast.success('Valor copiado!', { description: texto });
    }).catch(() => {
      toast.error('Não foi possível copiar.');
    });
  };

  const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);

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
      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-purple-100 to-purple-200/80 dark:from-purple-600/40 dark:to-purple-700/20 backdrop-blur border border-purple-300/60 dark:border-purple-500/30 rounded-xl p-5 transition-all hover:shadow-lg hover:border-[var(--highlight)]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-700 dark:text-purple-300 text-sm font-medium">Total de Produtos</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{produtos.length}</p>
            </div>
            <div className="w-12 h-12 bg-purple-400/40 dark:bg-purple-500/30 rounded-lg flex items-center justify-center ring-1 ring-[var(--highlight)]/20">
              <TrendingUp className="w-6 h-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
        </div>

        <div
          role="button"
          tabIndex={0}
          onClick={copiarValorTotal}
          onKeyDown={(e) => e.key === 'Enter' && copiarValorTotal()}
          className="bg-gradient-to-br from-amber-100 to-amber-200/80 dark:from-amber-600/40 dark:to-amber-700/20 backdrop-blur border border-amber-300/60 dark:border-amber-500/30 rounded-xl p-5 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-glow hover:border-[var(--highlight)]/50"
          title="Clique para copiar o valor total"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-800 dark:text-amber-300 text-sm font-medium">Valor Total <span className="text-[var(--highlight)] text-xs">(clique para copiar)</span></p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">R$ {valorTotal.toFixed(2).replace('.', ',')}</p>
            </div>
            <div className="w-12 h-12 bg-amber-400/40 dark:bg-amber-500/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-amber-700 dark:text-amber-300" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-100 to-emerald-200/80 dark:from-emerald-600/40 dark:to-emerald-700/20 backdrop-blur border border-emerald-300/60 dark:border-emerald-500/30 rounded-xl p-5 transition-all hover:shadow-lg hover:border-[var(--highlight)]/30">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-700 dark:text-emerald-300 text-sm font-medium">Quantidade Total</p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{produtos.reduce((a, p) => a + p.quantidade, 0)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-400/40 dark:bg-emerald-500/30 rounded-lg flex items-center justify-center ring-1 ring-[var(--highlight)]/20">
              <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-300" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-card backdrop-blur border border-border rounded-xl p-6 shadow-lg text-card-foreground">
        <div className="flex items-center gap-2 mb-4">
          <Search className="w-5 h-5 text-[var(--highlight)]" />
          <h3 className="text-lg font-semibold text-card-foreground">Filtros</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Input
            placeholder="Nome do produto"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          <Input
            placeholder="Qtd mínima"
            type="number"
            value={filtroQtdMin}
            onChange={(e) => setFiltroQtdMin(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          <Input
            placeholder="Preço máximo"
            type="number"
            step="0.01"
            value={filtroPrecoMax}
            onChange={(e) => setFiltroPrecoMax(e.target.value)}
            className="bg-background border-border text-foreground placeholder:text-muted-foreground"
          />
          <div className="flex gap-2">
            <Button
              onClick={aplicarFiltros}
              className="flex-1 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white"
            >
              Filtrar
            </Button>
            <Button
              onClick={limparFiltros}
              variant="outline"
              className="flex-1 border-purple-400 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20"
            >
              Limpar
            </Button>
          </div>
        </div>
      </div>

      {/* Tabela */}
      <div className="bg-card border border-border rounded-xl overflow-hidden text-card-foreground">
        {carregando ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin">
              <div className="w-8 h-8 border-4 border-border border-t-primary rounded-full" />
            </div>
            <p className="text-muted-foreground mt-4">Carregando produtos...</p>
          </div>
        ) : produtos.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted flex items-center justify-center ring-2 ring-[var(--highlight)]/30">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-card-foreground text-lg font-medium">Nenhum produto encontrado</p>
            <p className="text-muted-foreground text-sm mt-2">Ajuste os filtros ou adicione o primeiro produto para começar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/80 border-b border-border">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Produto</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quantidade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Preço Unit.</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Validade</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {produtos.map((produto) => {
                  const vencido = isVencido(produto.validade);
                  const dias = diasParaVencer(produto.validade);
                  const proximoVencimento = dias <= 30 && dias > 0;

                  return (
                    <tr
                      key={produto.id_produto}
                      className="hover:bg-purple-50 dark:hover:bg-purple-500/10 transition-colors"
                      onDoubleClick={() => setEditandoId(produto.id_produto)}
                      title="Duplo clique para editar"
                    >
                      <td className="px-6 py-4 text-sm text-muted-foreground">{produto.id_produto}</td>
                      <td className="px-6 py-4 text-sm font-medium text-card-foreground">{produto.nome}</td>
                      <td className="px-6 py-4 text-sm text-card-foreground">{produto.quantidade}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-amber-600 dark:text-amber-400">R$ {produto.preco.toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          vencido ? 'bg-red-100 text-red-700 dark:bg-red-500/30 dark:text-red-200 border border-red-300 dark:border-red-500/50' :
                          proximoVencimento ? 'bg-amber-100 text-amber-800 dark:bg-amber-500/30 dark:text-amber-200 border border-amber-300 dark:border-amber-500/50' :
                          'bg-emerald-100 text-emerald-800 dark:bg-emerald-500/30 dark:text-emerald-200 border border-emerald-300 dark:border-emerald-500/50'
                        }`}>
                          {produto.validade}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setEditandoId(produto.id_produto)}
            className="border-purple-400 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-500/20"
          >
            <Edit2 className="w-4 h-4" />
          </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setRemovendoId(produto.id_produto)}
                          className="border-red-400 dark:border-red-500/30 text-red-600 dark:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Diálogos */}
      {editandoId !== null && (
        <EditarProdutoDialog
          produto={produtos.find(p => p.id_produto === editandoId)!}
          onSalvar={async (dados: Partial<Produto>) => {
            await onEditarProduto(editandoId, dados);
            setEditandoId(null);
          }}
          onFechar={() => setEditandoId(null)}
        />
      )}

      {removendoId !== null && (
        <ConfirmarRemocaoDialog
          produto={produtos.find(p => p.id_produto === removendoId)!}
          onConfirmar={async () => {
            await onRemoverProduto(removendoId, produtos.find(p => p.id_produto === removendoId)!.nome);
            setRemovendoId(null);
          }}
          onCancelar={() => setRemovendoId(null)}
        />
      )}
    </div>
  );
}
