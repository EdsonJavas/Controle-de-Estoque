import { LayoutDashboard, Package, Plus, Calendar, AlertCircle, BarChart3, Bell, FolderOpen, Settings } from 'lucide-react';

export type TelaAtiva = 'dashboard' | 'lista' | 'adicionar' | 'validade' | 'proximos' | 'relatorio' | 'alertas' | 'categorias' | 'configuracoes';

interface EstoqueSidebarProps {
  telaAtiva: TelaAtiva;
  onTelaChange: (tela: TelaAtiva) => void;
  totalProdutos: number;
}

export default function EstoqueSidebar({ telaAtiva, onTelaChange, totalProdutos }: EstoqueSidebarProps) {
  const navItems: { id: TelaAtiva; label: string; icon: typeof LayoutDashboard }[] = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'lista', label: 'Tudo no estoque', icon: Package },
    { id: 'adicionar', label: 'Adicionar produto', icon: Plus },
    { id: 'validade', label: 'Por validade', icon: Calendar },
    { id: 'proximos', label: 'Próximos do vencimento', icon: AlertCircle },
    { id: 'relatorio', label: 'Relatório & Análise', icon: BarChart3 },
    { id: 'alertas', label: 'Alertas', icon: Bell },
    { id: 'categorias', label: 'Categorias', icon: FolderOpen },
    { id: 'configuracoes', label: 'Configurações', icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-violet-100/95 via-purple-50/90 to-amber-50/95 dark:from-purple-900/40 dark:via-purple-950/50 dark:to-slate-950/60 backdrop-blur-xl border-r border-purple-200 dark:border-purple-500/20 flex flex-col shadow-sm dark:shadow-none">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-purple-200 dark:border-purple-500/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 via-amber-500 to-purple-600 dark:from-purple-400 dark:via-amber-400 dark:to-purple-500 rounded-lg flex items-center justify-center shadow-lg shadow-purple-300/50 dark:shadow-purple-500/50">
            <Package className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-800 dark:text-white">Estoque Pro</h1>
            <p className="text-xs text-purple-600 dark:text-purple-300">Controle inteligente</p>
          </div>
        </div>
      </div>

      {/* Navegação */}
      <nav className="flex-1 px-3 py-6 space-y-2">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => onTelaChange(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-left border ${
              telaAtiva === id
                ? 'bg-gradient-to-r from-purple-500/90 to-amber-500/80 dark:from-purple-600/60 dark:to-amber-500/40 text-white shadow-lg shadow-purple-400/40 dark:shadow-purple-500/30 border-purple-400/50 dark:border-[var(--highlight)]/40 ring-1 ring-[var(--highlight)]/20'
                : 'text-slate-700 dark:text-purple-200 hover:bg-purple-100/80 dark:hover:bg-purple-500/20 hover:text-purple-800 dark:hover:text-purple-100 border-transparent hover:border-purple-300/50 dark:hover:border-purple-500/20'
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{label}</span>
          </button>
        ))}
      </nav>

      {/* Rodapé com estatísticas */}
      <div className="px-6 py-4 border-t border-purple-200 dark:border-purple-500/20 bg-purple-100/80 dark:bg-purple-900/20 rounded-t-xl border-x border-purple-200/50 dark:border-[var(--highlight)]/10">
        <div className="text-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-purple-600 via-amber-600 to-purple-600 dark:from-purple-400 dark:via-[var(--highlight)] dark:to-amber-400 bg-clip-text text-transparent">
            {totalProdutos}
          </div>
          <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">produtos no estoque</p>
        </div>
      </div>
    </aside>
  );
}
