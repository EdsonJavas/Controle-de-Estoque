import { Produto, FiltrosListagem } from '@/../../shared/const';
import type { TelaAtiva } from './EstoqueSidebar';
import ListaEstoque from './views/ListaEstoque';
import AdicionarProduto from './views/AdicionarProduto';
import PorValidade from './views/PorValidade';
import ProximosVencimento from './views/ProximosVencimento';
import RelatorioEstoque from './views/RelatorioEstoque';
import Dashboard from './views/Dashboard';
import Categorias from './views/Categorias';
import Configuracoes from './views/Configuracoes';
import Alertas from './views/Alertas';

interface EstoqueContentProps {
  telaAtiva: TelaAtiva;
  produtos: Produto[];
  carregando: boolean;
  filtros: FiltrosListagem;
  onFiltrosChange: (filtros: FiltrosListagem) => void;
  onAdicionarProduto: (produto: Produto) => Promise<void>;
  onEditarProduto: (id: number, dados: Partial<Produto>) => Promise<void>;
  onRemoverProduto: (id: number, nome: string) => Promise<void>;
  onTelaChange: (tela: TelaAtiva) => void;
}

export default function EstoqueContent({
  telaAtiva,
  produtos,
  carregando,
  filtros,
  onFiltrosChange,
  onAdicionarProduto,
  onEditarProduto,
  onRemoverProduto,
  onTelaChange
}: EstoqueContentProps) {
  return (
    <main className="flex-1 overflow-auto bg-background">
      <div className="p-8">
        {telaAtiva === 'dashboard' && (
          <Dashboard produtos={produtos} onIrPara={onTelaChange} />
        )}

        {telaAtiva === 'lista' && (
          <ListaEstoque
            produtos={produtos}
            carregando={carregando}
            filtros={filtros}
            onFiltrosChange={onFiltrosChange}
            onEditarProduto={onEditarProduto}
            onRemoverProduto={onRemoverProduto}
          />
        )}

        {telaAtiva === 'adicionar' && (
          <AdicionarProduto
            onAdicionarProduto={onAdicionarProduto}
            produtos={produtos}
          />
        )}

        {telaAtiva === 'validade' && (
          <PorValidade produtos={produtos} carregando={carregando} />
        )}

        {telaAtiva === 'proximos' && (
          <ProximosVencimento produtos={produtos} carregando={carregando} />
        )}

        {telaAtiva === 'relatorio' && (
          <RelatorioEstoque produtos={produtos} />
        )}

        {telaAtiva === 'alertas' && (
          <Alertas produtos={produtos} onIrPara={onTelaChange} />
        )}

        {telaAtiva === 'categorias' && <Categorias />}
        {telaAtiva === 'configuracoes' && <Configuracoes />}
      </div>
    </main>
  );
}
