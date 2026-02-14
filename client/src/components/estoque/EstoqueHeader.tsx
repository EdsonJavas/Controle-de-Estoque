import { Moon, Sun } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Button } from '@/components/ui/button';
import AjudaAtalhos from './AjudaAtalhos';
import type { TelaAtiva } from './EstoqueSidebar';

interface EstoqueHeaderProps {
  telaAtiva: TelaAtiva;
  usandoMock?: boolean;
  ajudaAberta?: boolean;
  onAjudaOpenChange?: (open: boolean) => void;
}

const titulos: Record<TelaAtiva, { titulo: string; descricao: string }> = {
  dashboard: { titulo: 'Início', descricao: 'Visão geral do seu estoque e atalhos rápidos' },
  lista: { titulo: 'Tudo disponível no estoque', descricao: 'Veja todos os produtos, preços e quantidades em tempo real' },
  adicionar: { titulo: 'Novo produto', descricao: 'Adicione um novo item ao seu controle de estoque' },
  validade: { titulo: 'Ordenado por validade', descricao: 'Produtos organizados pela data de vencimento' },
  proximos: { titulo: 'Próximos do vencimento', descricao: 'Produtos que vencem em breve - atenção necessária' },
  relatorio: { titulo: 'Relatório & Análise', descricao: 'Análise completa do seu estoque com insights valiosos' },
  alertas: { titulo: 'Alertas', descricao: 'Vencidos, estoque baixo e próximos do vencimento' },
  categorias: { titulo: 'Categorias', descricao: 'Organize produtos por categoria' },
  configuracoes: { titulo: 'Configurações', descricao: 'Preferências do estabelecimento' },
};

export default function EstoqueHeader({ telaAtiva, usandoMock, ajudaAberta, onAjudaOpenChange }: EstoqueHeaderProps) {
  const { titulo, descricao } = titulos[telaAtiva] ?? titulos.dashboard;
  const { theme, toggleTheme, switchable } = useTheme();

  return (
    <header className="bg-gradient-to-r from-violet-100/90 via-purple-50/80 to-amber-100/90 dark:from-purple-900/30 dark:via-purple-800/20 dark:to-amber-900/20 backdrop-blur-md border-b border-purple-200 dark:border-purple-500/20 px-8 py-6 shadow-lg shadow-purple-200/30 dark:shadow-purple-950/30">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-700 via-violet-600 to-amber-700 dark:from-purple-300 dark:via-purple-200 dark:to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            {titulo}
          </h1>
          <p className="text-slate-600 dark:text-purple-300/80 text-sm mt-1">{descricao}</p>
        </div>
        <div className="flex items-center gap-3">
          {switchable && toggleTheme && (
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="rounded-full border-purple-300 dark:border-purple-500/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20"
              title={theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          )}
          <AjudaAtalhos open={ajudaAberta} onOpenChange={onAjudaOpenChange} />
          {usandoMock && (
            <div className="bg-amber-100 dark:bg-amber-500/20 border border-amber-400/60 dark:border-amber-500/50 rounded-lg px-4 py-2 ring-1 ring-[var(--highlight)]/30">
              <p className="text-amber-800 dark:text-amber-300 text-xs font-semibold">📊 Modo Demonstração</p>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
