"""
Lógica de negócio do controle de estoque (reutilizada pelo CLI e pela versão web).
"""
import json
from datetime import datetime
from pathlib import Path


class Produto:
    def __init__(self, id_produto: int, nome: str, quantidade: int, preco: float, validade: datetime):
        self.id_produto = id_produto
        self.nome = nome
        self.quantidade = quantidade
        self.preco = preco
        self.validade = validade

    def atualizar_quantidade(self, nova_quantidade: int):
        if nova_quantidade is not None:
            self.quantidade = nova_quantidade

    def atualizar_preco(self, novo_preco: float):
        if novo_preco is not None:
            self.preco = novo_preco

    def to_dict(self):
        return {
            'id_produto': self.id_produto,
            'nome': self.nome,
            'quantidade': self.quantidade,
            'preco': self.preco,
            'validade': self.validade.strftime("%d/%m/%Y")
        }

    @classmethod
    def from_dict(cls, dados):
        validade_str = dados.get('validade')
        validade = datetime.strptime(validade_str, "%d/%m/%Y") if validade_str else datetime.now()
        return cls(
            dados['id_produto'],
            dados['nome'],
            dados['quantidade'],
            dados['preco'],
            validade
        )


class SistemaEstoque:
    def __init__(self, arquivo_json=None):
        if arquivo_json is None:
            arquivo_json = Path(__file__).resolve().parent / 'estoque.json'
        self.arquivo_json = Path(arquivo_json).resolve()
        self.estoque = {}
        self.carregar_estoque()

    def produto_existe(self, id_produto):
        return id_produto in self.estoque

    def proximo_id_disponivel(self):
        if not self.estoque:
            return 1
        return max(self.estoque.keys()) + 1

    def adicionar_produto(self, produto: Produto):
        if self.produto_existe(produto.id_produto):
            return False, f"Produto com ID {produto.id_produto} já existe."
        self.estoque[produto.id_produto] = produto
        self.salvar_estoque()
        return True, None

    def atualizar_produto(self, id_produto: int, quantidade: int = None, preco: float = None):
        produto = self.estoque.get(id_produto)
        if not produto:
            return False, "Produto não encontrado."
        if quantidade is None and preco is None:
            return False, "Nenhuma alteração informada."
        if quantidade is not None and quantidade < 0:
            return False, "Quantidade não pode ser negativa."
        if preco is not None and preco < 0:
            return False, "Preço não pode ser negativo."
        produto.atualizar_quantidade(quantidade)
        produto.atualizar_preco(preco)
        self.salvar_estoque()
        return True, None

    def remover_produto(self, id_produto: int):
        if not self.produto_existe(id_produto):
            return False, "Produto não encontrado."
        removido = self.estoque.pop(id_produto)
        self.salvar_estoque()
        return True, removido.nome

    def salvar_estoque(self):
        with open(self.arquivo_json, 'w', encoding='utf-8') as f:
            json.dump(
                {k: p.to_dict() for k, p in self.estoque.items()},
                f, ensure_ascii=False, indent=2
            )

    def carregar_estoque(self):
        try:
            with open(self.arquivo_json, 'r', encoding='utf-8') as f:
                dados = json.load(f)
            self.estoque = {
                int(k): Produto.from_dict(v)
                for k, v in dados.items()
            }
        except FileNotFoundError:
            self.estoque = {}
        except Exception as e:
            self.estoque = {}
            raise RuntimeError(f"Erro ao carregar {self.arquivo_json}: {e}") from e

    def listar_todos(self):
        return [p.to_dict() for p in self.estoque.values()]

    def listar_por_validade(self):
        ordenados = sorted(self.estoque.values(), key=lambda p: p.validade)
        return [p.to_dict() for p in ordenados]

    def produtos_proximos_vencimento(self, dias=30):
        hoje = datetime.now()
        proximos = [
            p for p in self.estoque.values()
            if 0 <= (p.validade - hoje).days <= dias
        ]
        return [p.to_dict() for p in proximos]

    def buscar_com_filtros(self, nome=None, id_produto=None, quantidade_min=None, preco_max=None, validade_min=None):
        resultados = []
        for produto in self.estoque.values():
            if nome and nome.lower() not in produto.nome.lower():
                continue
            if id_produto is not None and produto.id_produto != id_produto:
                continue
            if quantidade_min is not None and produto.quantidade < quantidade_min:
                continue
            if preco_max is not None and produto.preco > preco_max:
                continue
            if validade_min and produto.validade < validade_min:
                continue
            resultados.append(produto.to_dict())
        return resultados

    def obter_produto(self, id_produto: int):
        p = self.estoque.get(id_produto)
        return p.to_dict() if p else None
