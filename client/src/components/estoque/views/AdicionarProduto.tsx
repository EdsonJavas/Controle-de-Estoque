import { useState } from 'react';
import { toast } from 'sonner';
import { Produto } from '@/../../shared/const';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Package, DollarSign, CalendarDays, Hash, Tag, Box, AlertTriangle } from 'lucide-react';

interface AdicionarProdutoProps {
  onAdicionarProduto: (produto: Produto) => Promise<void>;
  produtos: Produto[];
}

export default function AdicionarProduto({ onAdicionarProduto, produtos }: AdicionarProdutoProps) {
  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [quantidade, setQuantidade] = useState('0');
  const [preco, setPreco] = useState('');
  const [validade, setValidade] = useState('');
  const [adicionando, setAdicionando] = useState(false);
  const [erro, setErro] = useState('');

  const proximoId = Math.max(...produtos.map(p => p.id_produto), 0) + 1;

  const preencherProximoId = () => {
    setId(proximoId.toString());
    toast.success('ID sugerido preenchido', { description: `ID ${proximoId} disponível.` });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErro('');

    if (!id || !nome || !preco || !validade) {
      const msg = 'Preencha todos os campos obrigatórios';
      setErro(msg);
      toast.error('Campos obrigatórios', { description: msg });
      return;
    }

    setAdicionando(true);
    try {
      await onAdicionarProduto({
        id_produto: parseInt(id),
        nome,
        quantidade: parseInt(quantidade),
        preco: parseFloat(preco.replace(',', '.')),
        validade
      });

      setId('');
      setNome('');
      setQuantidade('0');
      setPreco('');
      setValidade('');
    } catch (err) {
      setErro(err instanceof Error ? err.message : 'Erro ao adicionar produto');
    } finally {
      setAdicionando(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero / foco */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6 text-card-foreground overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-amber-500 flex items-center justify-center shadow-lg shrink-0">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <div className="flex-1">
            <h2 className="text-2xl md:text-3xl font-bold text-card-foreground tracking-tight">
              Adicionar novo produto
            </h2>
            <p className="text-muted-foreground mt-1 max-w-xl">
              Preencha os dados abaixo para registrar um novo item no estoque. Todos os campos são obrigatórios.
            </p>
            <div className="flex flex-wrap gap-3 mt-4">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted text-muted-foreground text-sm">
                <Hash className="w-4 h-4" />
                {produtos.length} produtos no estoque
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-sm font-medium">
                Próximo ID: {proximoId}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário em card destacado */}
      <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit} className="p-6 md:p-8">
          {/* Seção: Identificação */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                <Tag className="w-4 h-4 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Identificação</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-card-foreground font-medium flex items-center gap-2">
                  <Hash className="w-4 h-4 text-muted-foreground" />
                  ID do produto
                </Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                    placeholder={`Ex: ${proximoId}`}
                    className="bg-background border-border text-foreground placeholder:text-muted-foreground flex-1"
                  />
                  <Button type="button" variant="outline" size="sm" onClick={preencherProximoId} className="shrink-0">
                    Usar {proximoId}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">Identificador único do item no sistema.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground font-medium flex items-center gap-2">
                  <Package className="w-4 h-4 text-muted-foreground" />
                  Nome do produto
                </Label>
                <Input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  placeholder="Ex: Arroz integral 5kg"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Nome completo ou descrição do produto.</p>
              </div>
            </div>
          </div>

          {/* Seção: Quantidade e preço */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                <Box className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Quantidade e preço</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-card-foreground font-medium">Quantidade em estoque</Label>
                <Input
                  type="number"
                  min={0}
                  value={quantidade}
                  onChange={(e) => setQuantidade(e.target.value)}
                  placeholder="0"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Número de unidades disponíveis.</p>
              </div>

              <div className="space-y-2">
                <Label className="text-card-foreground font-medium flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-muted-foreground" />
                  Preço unitário (R$)
                </Label>
                <Input
                  type="text"
                  value={preco}
                  onChange={(e) => setPreco(e.target.value)}
                  placeholder="0,00"
                  className="bg-background border-border text-foreground placeholder:text-muted-foreground"
                />
                <p className="text-xs text-muted-foreground">Use vírgula ou ponto como decimal.</p>
              </div>
            </div>
          </div>

          {/* Seção: Validade */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <CalendarDays className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-lg font-semibold text-card-foreground">Validade</h3>
            </div>
            <div className="max-w-xs space-y-2">
              <Label className="text-card-foreground font-medium">Data de validade</Label>
              <Input
                type="text"
                value={validade}
                onChange={(e) => {
                  let v = e.target.value.replace(/\D/g, '');
                  if (v.length >= 2) v = v.slice(0, 2) + '/' + v.slice(2);
                  if (v.length >= 5) v = v.slice(0, 5) + '/' + v.slice(5, 9);
                  setValidade(v);
                }}
                placeholder="dd/mm/aaaa"
                maxLength={10}
                className="bg-background border-border text-foreground placeholder:text-muted-foreground text-lg"
              />
              <p className="text-xs text-muted-foreground">Formato: dia/mês/ano (ex: 31/12/2026).</p>
            </div>
          </div>

          {erro && (
            <div className="mb-6 bg-destructive/10 border border-destructive/50 rounded-xl p-4 flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
              <p className="text-destructive text-sm">{erro}</p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-border">
            <Button
              type="submit"
              disabled={adicionando}
              className="flex-1 h-12 text-base bg-gradient-to-r from-primary to-amber-600 hover:opacity-90 text-white font-semibold rounded-xl transition-all shadow-lg shadow-primary/20"
            >
              {adicionando ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Cadastrando...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Plus className="w-5 h-5" />
                  Cadastrar produto
                </span>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="sm:w-auto h-12 rounded-xl border-border text-muted-foreground hover:text-card-foreground"
              onClick={() => {
                setErro('');
                setId(proximoId.toString());
                setNome('');
                setQuantidade('0');
                setPreco('');
                setValidade('');
                toast.info('Formulário limpo', { description: 'Pronto para novo cadastro.' });
              }}
            >
              Limpar campos
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
