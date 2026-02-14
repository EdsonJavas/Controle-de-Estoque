import { useState, useCallback } from 'react';
import { Produto, FiltrosListagem } from '@/../../shared/const';
import EstoqueHeader from '@/components/estoque/EstoqueHeader';
import EstoqueSidebar, { type TelaAtiva } from '@/components/estoque/EstoqueSidebar';
import EstoqueContent from '@/components/estoque/EstoqueContent';
import { useEstoque } from '@/hooks/useEstoque';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from 'sonner';

const nomesTela: Record<TelaAtiva, string> = {
  dashboard: 'Início',
  lista: 'Tudo no estoque',
  adicionar: 'Adicionar produto',
  validade: 'Por validade',
  proximos: 'Próximos do vencimento',
  relatorio: 'Relatório & Análise',
  alertas: 'Alertas',
  categorias: 'Categorias',
  configuracoes: 'Configurações',
};

export default function EstoqueManager() {
  const { produtos, setProdutos, carregando: carregandoInicial, usandoMock, filtrarProdutos } = useEstoque();
  const [telaAtiva, setTelaAtiva] = useState<TelaAtiva>('dashboard');
  const [filtros, setFiltros] = useState<FiltrosListagem>({});
  const [ajudaAberta, setAjudaAberta] = useState(false);

  const handleTelaChange = useCallback((tela: TelaAtiva) => {
    setTelaAtiva(tela);
    toast.success(`Abrindo: ${nomesTela[tela]}`, { description: 'Navegação atualizada.' });
  }, []);

  const carregarProdutos = async (novosFiltros?: FiltrosListagem) => {
    const filtrosAplicar = novosFiltros || filtros;
    setFiltros(filtrosAplicar);
  };

  const handleAdicionarProduto = async (produto: Produto): Promise<void> => {
    try {
      if (usandoMock) {
        const novoId = Math.max(...produtos.map(p => p.id_produto), 0) + 1;
        setProdutos([...produtos, { ...produto, id_produto: novoId }]);
      } else {
        const res = await fetch('/api/produtos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(produto)
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.erro || 'Erro ao adicionar');
        }

        const data = await res.json();
        setProdutos([...produtos, data]);
      }

      toast.success(`✓ Produto "${produto.nome}" adicionado com sucesso!`);
      setTelaAtiva('lista');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    }
  };

  const handleEditarProduto = async (id: number, dados: Partial<Produto>): Promise<void> => {
    try {
      if (usandoMock) {
        setProdutos(produtos.map(p => p.id_produto === id ? { ...p, ...dados } : p));
      } else {
        const res = await fetch(`/api/produtos/${id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(dados)
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.erro || 'Erro ao editar');
        }

        const data = await res.json();
        setProdutos(produtos.map(p => p.id_produto === id ? data : p));
      }

      toast.success('✓ Produto atualizado com sucesso!');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao editar produto');
    }
  };

  const handleRemoverProduto = async (id: number, nome: string): Promise<void> => {
    try {
      if (usandoMock) {
        setProdutos(produtos.filter(p => p.id_produto !== id));
      } else {
        const res = await fetch(`/api/produtos/${id}`, {
          method: 'DELETE'
        });

        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.erro || 'Erro ao remover');
        }

        setProdutos(produtos.filter(p => p.id_produto !== id));
      }

      toast.success(`✓ Produto "${nome}" removido com sucesso!`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover produto');
    }
  };

  const produtosExibidos = filtros.nome || filtros.quantidade_min || filtros.preco_max 
    ? filtrarProdutos(filtros) 
    : produtos;

  useKeyboardShortcuts({
    'alt+d': () => handleTelaChange('dashboard'),
    'alt+l': () => handleTelaChange('lista'),
    'alt+a': () => handleTelaChange('adicionar'),
    'alt+v': () => handleTelaChange('validade'),
    'alt+p': () => handleTelaChange('proximos'),
    'alt+r': () => handleTelaChange('relatorio'),
    'alt+?': () => { setAjudaAberta(true); toast.info('Ajuda aberta', { description: 'Atalho: Alt+?' }); },
  });

  return (
    <div className="flex h-screen bg-background">
      <EstoqueSidebar 
        telaAtiva={telaAtiva} 
        onTelaChange={handleTelaChange}
        totalProdutos={produtos.length}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <EstoqueHeader telaAtiva={telaAtiva} usandoMock={usandoMock} ajudaAberta={ajudaAberta} onAjudaOpenChange={setAjudaAberta} />
        
        <EstoqueContent
          telaAtiva={telaAtiva}
          produtos={produtosExibidos}
          carregando={carregandoInicial}
          filtros={filtros}
          onFiltrosChange={(novosFiltros: FiltrosListagem) => carregarProdutos(novosFiltros)}
          onAdicionarProduto={handleAdicionarProduto}
          onEditarProduto={handleEditarProduto}
          onRemoverProduto={handleRemoverProduto}
          onTelaChange={handleTelaChange}
        />
      </div>
    </div>
  );
}
