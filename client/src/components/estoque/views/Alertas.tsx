import { Produto } from '@/../../shared/const';
import { AlertTriangle, TrendingDown, Calendar, CheckCircle2, ShieldAlert, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { TelaAtiva } from '../EstoqueSidebar';

interface AlertasProps {
  produtos: Produto[];
  onIrPara: (tela: TelaAtiva) => void;
}

export default function Alertas({ produtos, onIrPara }: AlertasProps) {
  const diasParaVencer = (validade: string) => {
    const [d, m, y] = validade.split('/').map(Number);
    const data = new Date(y, m - 1, d);
    return Math.ceil((data.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  };
  const vencidos = produtos.filter(p => diasParaVencer(p.validade) <= 0);
  const proximos = produtos.filter(p => {
    const d = diasParaVencer(p.validade);
    return d > 0 && d <= 30;
  }).sort((a, b) => diasParaVencer(a.validade) - diasParaVencer(b.validade));
  const estoqueBaixo = produtos.filter(p => p.quantidade < 10);

  const temAlgumAlerta = vencidos.length > 0 || estoqueBaixo.length > 0 || proximos.length > 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Cabeçalho da tela */}
      <div className="bg-card border border-border rounded-2xl p-6 text-card-foreground">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/20 flex items-center justify-center shrink-0">
            <ShieldAlert className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-card-foreground">Central de alertas</h2>
            <p className="text-muted-foreground text-sm mt-1">
              Vencidos, estoque baixo e produtos próximos do vencimento. Resolva aqui para manter o estoque em dia.
            </p>
          </div>
          {temAlgumAlerta && (
            <div className="flex flex-wrap gap-2">
              {vencidos.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-destructive/15 text-destructive text-sm font-medium">
                  <AlertTriangle className="w-4 h-4" />
                  {vencidos.length} vencido{vencidos.length !== 1 ? 's' : ''}
                </span>
              )}
              {estoqueBaixo.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/15 text-amber-700 dark:text-amber-400 text-sm font-medium">
                  <TrendingDown className="w-4 h-4" />
                  {estoqueBaixo.length} estoque baixo
                </span>
              )}
              {proximos.length > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/15 text-primary text-sm font-medium">
                  <Calendar className="w-4 h-4" />
                  {proximos.length} próximo{proximos.length !== 1 ? 's' : ''} do vencimento
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card: Vencidos */}
      {vencidos.length > 0 && (
        <div className="bg-card border-2 border-destructive/50 rounded-2xl overflow-hidden">
          <div className="bg-destructive/10 px-6 py-3 border-b border-destructive/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-6 h-6 text-destructive" />
              <h3 className="font-bold text-destructive">Produtos vencidos</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-destructive/20 text-destructive text-sm font-semibold">
                {vencidos.length}
              </span>
            </div>
            <Button size="sm" variant="destructive" onClick={() => onIrPara('lista')}>
              Ver na lista
            </Button>
          </div>
          <div className="p-6 text-card-foreground">
            <p className="text-muted-foreground text-sm mb-4">
              Estes itens já passaram da data de validade. Remova do estoque ou descarte para evitar uso indevido.
            </p>
            <ul className="space-y-2">
              {vencidos.map(p => (
                <li
                  key={p.id_produto}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-card-foreground">{p.nome}</span>
                    <span className="text-xs text-muted-foreground">ID {p.id_produto}</span>
                  </div>
                  <span className="text-sm font-semibold text-destructive">Venceu em {p.validade}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Card: Estoque baixo */}
      {estoqueBaixo.length > 0 && (
        <div className="bg-card border-2 border-amber-500/50 rounded-2xl overflow-hidden">
          <div className="bg-amber-500/10 px-6 py-3 border-b border-amber-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <TrendingDown className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              <h3 className="font-bold text-amber-700 dark:text-amber-400">Estoque baixo</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-400 text-sm font-semibold">
                &lt; 10 unidades
              </span>
            </div>
            <Button size="sm" variant="outline" className="border-amber-500/50 text-amber-700 dark:text-amber-400" onClick={() => onIrPara('lista')}>
              Ver na lista
            </Button>
          </div>
          <div className="p-6 text-card-foreground">
            <p className="text-muted-foreground text-sm mb-4">
              Produtos com menos de 10 unidades. Considere repor para não faltar.
            </p>
            <ul className="space-y-2">
              {estoqueBaixo.map(p => (
                <li
                  key={p.id_produto}
                  className="flex items-center justify-between py-3 px-4 rounded-xl bg-muted/50 border border-border"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-card-foreground">{p.nome}</span>
                    <span className="text-xs text-muted-foreground">ID {p.id_produto}</span>
                  </div>
                  <span className="text-sm font-semibold text-amber-600 dark:text-amber-400">{p.quantidade} un.</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Card: Próximos do vencimento */}
      {proximos.length > 0 && (
        <div className="bg-card border-2 border-primary/40 rounded-2xl overflow-hidden">
          <div className="bg-primary/10 px-6 py-3 border-b border-primary/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-6 h-6 text-primary" />
              <h3 className="font-bold text-primary">Próximos do vencimento (30 dias)</h3>
              <span className="px-2.5 py-0.5 rounded-full bg-primary/20 text-primary text-sm font-semibold">
                {proximos.length} produto{proximos.length !== 1 ? 's' : ''}
              </span>
            </div>
            <Button size="sm" variant="default" onClick={() => onIrPara('proximos')}>
              Ver todos
            </Button>
          </div>
          <div className="p-6 text-card-foreground">
            <p className="text-muted-foreground text-sm mb-4">
              Itens que vencem nos próximos 30 dias. Priorize venda ou uso.
            </p>
            <ul className="space-y-2">
              {proximos.slice(0, 10).map(p => {
                const dias = diasParaVencer(p.validade);
                const urgente = dias <= 7;
                return (
                  <li
                    key={p.id_produto}
                    className={`flex items-center justify-between py-3 px-4 rounded-xl border ${
                      urgente ? 'bg-destructive/5 border-destructive/30' : 'bg-muted/50 border-border'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-card-foreground">{p.nome}</span>
                      <span className="text-xs text-muted-foreground">ID {p.id_produto}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-semibold ${urgente ? 'text-destructive' : 'text-primary'}`}>
                        {dias} dia{dias !== 1 ? 's' : ''}
                      </span>
                      <span className="text-xs text-muted-foreground">({p.validade})</span>
                    </div>
                  </li>
                );
              })}
              {proximos.length > 10 && (
                <li className="py-2 text-center">
                  <Button variant="ghost" size="sm" onClick={() => onIrPara('proximos')}>
                    + {proximos.length - 10} mais na tela Próximos do vencimento
                  </Button>
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Estado vazio: tudo em dia */}
      {!temAlgumAlerta && (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-10 md:p-14 text-center">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-card-foreground">Nenhum alerta no momento</h3>
            <p className="text-muted-foreground mt-2 max-w-sm mx-auto">
              Seu estoque está em dia: sem itens vencidos, sem estoque crítico e sem vencimentos próximos.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Button onClick={() => onIrPara('adicionar')}>
                Adicionar produto
              </Button>
              <Button variant="outline" onClick={() => onIrPara('relatorio')}>
                Ver relatório
              </Button>
              <Button variant="outline" onClick={() => onIrPara('lista')}>
                Ver lista completa
              </Button>
            </div>
          </div>

          <div className="border-t border-border bg-muted/30 px-6 py-4">
            <div className="flex items-start gap-3 text-sm text-muted-foreground">
              <Info className="w-5 h-5 shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-card-foreground">Dicas para manter o controle</p>
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  <li>Cadastre a validade de todos os produtos para receber avisos aqui.</li>
                  <li>Produtos com menos de 10 unidades aparecem em &quot;Estoque baixo&quot;.</li>
                  <li>Use a tela &quot;Próximos do vencimento&quot; para planejar promoções.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
