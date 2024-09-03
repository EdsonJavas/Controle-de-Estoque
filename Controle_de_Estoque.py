import json
from colorama import Fore, Back, Style, init

# Inicializa o colorama para suportar as cores no Windows
init(autoreset=True)

# Paletas de cores para diferentes opções
PALETA_ADICIONAR = {
    'titulo': Fore.LIGHTGREEN_EX + Back.BLACK,
    'texto': Fore.GREEN + Back.BLACK,
    'input': Fore.LIGHTGREEN_EX + Back.BLACK
}

PALETA_ATUALIZAR = {
    'titulo': Fore.LIGHTCYAN_EX + Back.BLACK,
    'texto': Fore.CYAN + Back.BLACK,
    'input': Fore.LIGHTCYAN_EX + Back.BLACK
}

PALETA_REMOVER = {
    'titulo': Fore.LIGHTRED_EX + Back.BLACK,
    'texto': Fore.RED + Back.BLACK,
    'input': Fore.LIGHTRED_EX + Back.BLACK
}

PALETA_EXIBIR = {
    'titulo': Fore.LIGHTBLUE_EX + Back.BLACK,
    'texto': Fore.BLUE + Back.BLACK,
    'input': Fore.LIGHTBLUE_EX + Back.BLACK
}

PALETA_MENU = Fore.LIGHTYELLOW_EX + Back.BLACK

def entrada_inteira(mensagem):
    """Função para garantir que o usuário insira um valor inteiro válido."""
    while True:
        try:
            return int(input(mensagem))
        except ValueError:
            print(f"{Fore.RED}Valor inválido. Digite um número inteiro.{Style.RESET_ALL}")

def entrada_float(mensagem):
    """Função para garantir que o usuário insira um valor float válido."""
    while True:
        try:
            return float(input(mensagem).replace(',', '.'))
        except ValueError:
            print(f"{Fore.RED}Valor inválido. Digite um número real (float).{Style.RESET_ALL}")

class Produto:
    def __init__(self, id_produto: int, nome: str, quantidade: int, preco: float):
        self.id_produto = id_produto
        self.nome = nome
        self.quantidade = quantidade
        self.preco = preco

    def atualizar_quantidade(self, nova_quantidade: int):
        self.quantidade = nova_quantidade

    def atualizar_preco(self, novo_preco: float):
        self.preco = novo_preco

    def to_dict(self):
        return {
            'id_produto': self.id_produto,
            'nome': self.nome,
            'quantidade': self.quantidade,
            'preco': self.preco
        }

    @classmethod
    def from_dict(cls, dados):
        return cls(dados['id_produto'], dados['nome'], dados['quantidade'], dados['preco'])

    def __str__(self):
        return (f"{Fore.CYAN}ID: {self.id_produto}{Style.RESET_ALL}, "
                f"{Fore.YELLOW}Nome: {self.nome}{Style.RESET_ALL}, "
                f"{Fore.GREEN}Quantidade: {self.quantidade}{Style.RESET_ALL}, "
                f"{Fore.MAGENTA}Preço: R${self.preco:.2f}{Style.RESET_ALL}")

class SistemaEstoque:
    def __init__(self, arquivo_json='estoque.json'):
        self.estoque = {}
        self.arquivo_json = arquivo_json
        self.carregar_estoque()

    def produto_existe(self, id_produto):
        """Verifica se um produto com o ID especificado já existe."""
        return id_produto in self.estoque

    def adicionar_produto(self, produto: Produto):
        if self.produto_existe(produto.id_produto):
            print(f"{Fore.RED}Produto com ID {produto.id_produto} já existe.{Style.RESET_ALL}")
        else:
            self.estoque[produto.id_produto] = produto
            self.salvar_estoque()
            print(f"{Fore.GREEN}Produto {produto.nome} adicionado com sucesso!{Style.RESET_ALL}")

    def atualizar_produto(self, id_produto: int, quantidade: int = None, preco: float = None):
        produto = self.estoque.get(id_produto)
        if produto:
            if quantidade is not None:
                produto.atualizar_quantidade(quantidade)
            if preco is not None:
                produto.atualizar_preco(preco)
            self.salvar_estoque()
            print(f"{Fore.GREEN}Produto {produto.nome} atualizado com sucesso!{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}Produto com ID {id_produto} não encontrado.{Style.RESET_ALL}")

    def remover_produto(self, id_produto: int):
        if self.produto_existe(id_produto):
            removido = self.estoque.pop(id_produto)
            self.salvar_estoque()
            print(f"{Fore.GREEN}Produto {removido.nome} removido com sucesso!{Style.RESET_ALL}")
        else:
            print(f"{Fore.RED}Produto com ID {id_produto} não encontrado.{Style.RESET_ALL}")

    def exibir_estoque(self):
        if not self.estoque:
            print(f"{Fore.YELLOW}Estoque vazio.{Style.RESET_ALL}")
        else:
            print(f"{Back.BLUE}{Fore.WHITE}Estoque atual:{Style.RESET_ALL}\n")
            for produto in self.estoque.values():
                print(produto)
                print(f"{Fore.CYAN}{'-'*40}{Style.RESET_ALL}")

    def salvar_estoque(self):
        with open(self.arquivo_json, 'w') as arquivo:
            json.dump({id_produto: produto.to_dict() for id_produto, produto in self.estoque.items()}, arquivo)
        print(f"{Fore.GREEN}Estoque salvo em {self.arquivo_json}.{Style.RESET_ALL}")

    def carregar_estoque(self):
        try:
            with open(self.arquivo_json, 'r') as arquivo:
                dados_estoque = json.load(arquivo)
                self.estoque = {int(id_produto): Produto.from_dict(dados) for id_produto, dados in dados_estoque.items()}
            print(f"{Fore.GREEN}Estoque carregado de {self.arquivo_json}.{Style.RESET_ALL}")
        except FileNotFoundError:
            print(f"{Fore.YELLOW}Arquivo {self.arquivo_json} não encontrado, iniciando com estoque vazio.{Style.RESET_ALL}")

def exibir_menu():
    """Função para exibir o menu principal."""
    print(f"\n{PALETA_MENU}--- Sistema de Controle de Estoque ---{Style.RESET_ALL}\n")
    print(f"{Fore.GREEN}1. Adicionar Produto")
    print(f"{Fore.CYAN}2. Atualizar Produto")
    print(f"{Fore.RED}3. Remover Produto")
    print(f"{Fore.BLUE}4. Exibir Estoque")
    print(f"{Fore.MAGENTA}5. Sair{Style.RESET_ALL}")

def main():
    sistema_estoque = SistemaEstoque()

    while True:
        exibir_menu()
        opcao = input(f"\n{PALETA_MENU}Escolha uma opção: {Style.RESET_ALL}")

        if opcao == '1':
            print(f"\n{PALETA_ADICIONAR['titulo']}--- Adicionar Produto ---{Style.RESET_ALL}\n")
            id_produto = entrada_inteira(f"{PALETA_ADICIONAR['input']}ID do Produto: {Style.RESET_ALL}")
            if sistema_estoque.produto_existe(id_produto):
                print(f"{Fore.RED}Produto com ID {id_produto} já existe.{Style.RESET_ALL}")
                continue

            nome = input(f"{PALETA_ADICIONAR['input']}Nome do Produto: {Style.RESET_ALL}")
            quantidade = entrada_inteira(f"{PALETA_ADICIONAR['input']}Quantidade: {Style.RESET_ALL}")
            preco = entrada_float(f"{PALETA_ADICIONAR['input']}Preço: R$ {Style.RESET_ALL}")
            produto = Produto(id_produto, nome, quantidade, preco)
            sistema_estoque.adicionar_produto(produto)

        elif opcao == '2':
            print(f"\n{PALETA_ATUALIZAR['titulo']}--- Atualizar Produto ---{Style.RESET_ALL}\n")
            id_produto = entrada_inteira(f"{PALETA_ATUALIZAR['input']}ID do Produto a atualizar: {Style.RESET_ALL}")
            if not sistema_estoque.produto_existe(id_produto):
                print(f"{Fore.RED}Produto com ID {id_produto} não encontrado.{Style.RESET_ALL}")
                continue

            quantidade = entrada_inteira(f"{PALETA_ATUALIZAR['input']}Nova Quantidade (ou deixe em branco para manter): {Style.RESET_ALL}") or None
            preco = entrada_float(f"{PALETA_ATUALIZAR['input']}Novo Preço (ou deixe em branco para manter): R$ {Style.RESET_ALL}") or None
            sistema_estoque.atualizar_produto(id_produto, quantidade, preco)

        elif opcao == '3':
            print(f"\n{PALETA_REMOVER['titulo']}--- Remover Produto ---{Style.RESET_ALL}\n")
            id_produto = entrada_inteira(f"{PALETA_REMOVER['input']}ID do Produto a remover: {Style.RESET_ALL}")
            if not sistema_estoque.produto_existe(id_produto):
                print(f"{Fore.RED}Produto com ID {id_produto} não encontrado.{Style.RESET_ALL}")
                continue

            sistema_estoque.remover_produto(id_produto)

        elif opcao == '4':
            print(f"\n{PALETA_EXIBIR['titulo']}--- Exibir Estoque ---{Style.RESET_ALL}\n")
            sistema_estoque.exibir_estoque()

        elif opcao == '5':
            print(f"\n{Fore.LIGHTMAGENTA_EX}Encerrando o sistema...{Style.RESET_ALL}")
            break

        else:
            print(f"{Fore.RED}Opção inválida, tente novamente.{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
