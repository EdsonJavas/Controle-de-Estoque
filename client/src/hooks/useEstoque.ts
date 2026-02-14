import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Produto, FiltrosListagem } from '@/../../shared/const';

// Mock de dados para demonstração
const MOCK_PRODUTOS: Produto[] = [
  { id_produto: 1, nome: 'Tomate', quantidade: 45, preco: 3.50, validade: '28/02/2026' },
  { id_produto: 2, nome: 'Alface', quantidade: 30, preco: 2.80, validade: '25/02/2026' },
  { id_produto: 3, nome: 'Cenoura', quantidade: 60, preco: 1.90, validade: '15/03/2026' },
  { id_produto: 4, nome: 'Batata', quantidade: 100, preco: 2.50, validade: '20/04/2026' },
  { id_produto: 5, nome: 'Cebola', quantidade: 50, preco: 2.20, validade: '10/03/2026' },
  { id_produto: 6, nome: 'Maçã', quantidade: 35, preco: 4.50, validade: '05/03/2026' },
  { id_produto: 7, nome: 'Banana', quantidade: 80, preco: 2.00, validade: '18/02/2026' },
  { id_produto: 8, nome: 'Laranja', quantidade: 55, preco: 3.20, validade: '12/03/2026' },
];

export function useEstoque() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [usandoMock, setUsandoMock] = useState(false);

  // Tentar carregar da API, se falhar usar mock
  useEffect(() => {
    const carregarProdutos = async () => {
      try {
        const res = await fetch('/api/produtos');
        if (!res.ok) throw new Error('Erro na API');
        const data = await res.json();
        setProdutos(data);
        setUsandoMock(false);
        toast.success('Estoque carregado com sucesso!', { description: `${data.length} produto(s) disponível(is).` });
      } catch (err) {
        console.log('API indisponível, usando dados de demonstração');
        setProdutos(MOCK_PRODUTOS);
        setUsandoMock(true);
        toast.info('Modo demonstração ativado', { description: 'Usando dados de exemplo. Conecte o servidor para seus dados reais.' });
      } finally {
        setCarregando(false);
      }
    };

    carregarProdutos();
  }, []);

  const filtrarProdutos = (filtros: FiltrosListagem): Produto[] => {
    return produtos.filter(p => {
      if (filtros.nome && !p.nome.toLowerCase().includes(filtros.nome.toLowerCase())) return false;
      if (filtros.quantidade_min !== undefined && p.quantidade < filtros.quantidade_min) return false;
      if (filtros.preco_max !== undefined && p.preco > filtros.preco_max) return false;
      return true;
    });
  };

  return {
    produtos,
    setProdutos,
    carregando,
    usandoMock,
    filtrarProdutos
  };
}
