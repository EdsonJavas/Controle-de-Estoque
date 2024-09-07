import json
from colorama import Fore, Back, Style, init
from datetime import datetime

init(autoreset=True)

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
    while True:
        try:
            valor = input(mensagem)
            if valor == '':
                return None
            return int(valor)
        except ValueError:
            print(f"{Fore.RED}Valor inválido. Digite um número inteiro.{Style.RESET_ALL}")

def entrada_float(mensagem):
    while True:
        try:
            valor = input(mensagem).replace(',', '.')
            if valor == '':
                return None
            return float(valor)
        except ValueError:
            print(f"{Fore.RED}Valor inválido. Digite um número real (float).{Style.RESET_ALL}")

def entrada_data(mensagem):
    while True:
        data_str = input(mensagem)
        if data_str == '':
            return None
        try:
            data = datetime.strptime(data_str, "%d/%m/%Y")
            if data < datetime.now():
                print(f"{Fore.RED}Data de validade já passou!{Style.RESET_ALL}")
            else:
                return data
        except ValueError:
            print(f"{Fore.RED}Formato de data inválido. Use dd/mm/yyyy.{Style.RESET_ALL}")

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
        return cls(dados['id_produto'], dados['nome'], dados['quantidade'], dados['preco'], validade)

    def __str__(self):
        return (f"{Fore.CYAN}ID: {self.id_produto}{Style.RESET_ALL}, "
                f"{Fore.YELLOW}Nome: {self.nome}{Style.RESET_ALL}, "
                f"{Fore.GREEN}Quantidade: {self.quantidade}{Style.RESET_ALL}, "
                f"{Fore.MAGENTA}Preço: R${self.preco:.2f}{Style.RESET_ALL}, "
                f"{Fore.LIGHTWHITE_EX}Validade: {self.validade.strftime('%d/%m/%Y')}{Style.RESET_ALL}")

class SistemaEstoque:
    def __init__(self, arquivo_json='estoque.json'):
        self.estoque = {}
        self.arquivo_json = arquivo_json
        self.carregar_estoque()

    def produto_existe(self, id_produto):
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
            produto.atualizar_quantidade(quantidade)
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
        self.perguntar_proximo_passo()

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

    def produtos_proximos_vencimento(self, dias=30):
        hoje = datetime.now()
        proximos = [
            produto for produto in self.estoque.values()
            if 0 <= (produto.validade - hoje).days <= dias
        ]
        if proximos:
            print(f"{Fore.LIGHTRED_EX}Produtos próximos do vencimento (em até {dias} dias):{Style.RESET_ALL}")
            for produto in proximos:
                print(produto)
        else:
            print(f"{Fore.GREEN}Nenhum produto próximo do vencimento.{Style.RESET_ALL}")
        self.perguntar_proximo_passo()

    def listar_por_validade(self):
        produtos_ordenados = sorted(self.estoque.values(), key=lambda p: p.validade)
        if produtos_ordenados:
            print(f"{Fore.LIGHTBLUE_EX}Produtos listados por data de validade:{Style.RESET_ALL}")
            for produto in produtos_ordenados:
                print(produto)
        else:
            print(f"{Fore.YELLOW}Nenhum produto encontrado.{Style.RESET_ALL}")
        self.perguntar_proximo_passo()

    def perguntar_proximo_passo(self):
        opcao = input(f"{PALETA_MENU}Deseja voltar ao menu? (s/n): {Style.RESET_ALL}")
        if opcao.lower() != 's':
            print(f"{Fore.LIGHTMAGENTA_EX}Encerrando o sistema...{Style.RESET_ALL}")
            exit()

    def buscar_com_filtros_interativo(self):
        print(f"\n{PALETA_EXIBIR['titulo']}--- Buscar Produtos com Filtros ---{Style.RESET_ALL}\n")
        filtros_disponiveis = {
            '1': 'Nome do Produto',
            '2': 'ID do Produto',
            '3': 'Quantidade',
            '4': 'Preço',
            '5': 'Validade (dd/mm/yyyy)'
        }

        print("Selecione apenas um filtro que deseja aplicar:")
        for chave, valor in filtros_disponiveis.items():
            print(f"{chave}. {valor}")
        print("6. Iniciar busca")

        escolha = input(f"{PALETA_EXIBIR['input']}Escolha uma opção (1-6): {Style.RESET_ALL}")

        if escolha not in filtros_disponiveis:
            print(f"{Fore.RED}Opção inválida, tente novamente.{Style.RESET_ALL}")
            return

        nome = id_produto = quantidade_min = preco_max = validade_min = None

        if escolha == '1':
            nome = input(f"{PALETA_EXIBIR['input']}Nome do Produto: {Style.RESET_ALL}")
        elif escolha == '2':
            id_produto = entrada_inteira(f"{PALETA_EXIBIR['input']}ID do Produto: {Style.RESET_ALL}")
        elif escolha == '3':
            quantidade_min = entrada_inteira(f"{PALETA_EXIBIR['input']}Quantidade Mínima: {Style.RESET_ALL}")
        elif escolha == '4':
            preco_max = entrada_float(f"{PALETA_EXIBIR['input']}Preço Máximo: R$ {Style.RESET_ALL}")
        elif escolha == '5':
            validade_min = entrada_data(f"{PALETA_EXIBIR['input']}Validade Mínima (dd/mm/yyyy): {Style.RESET_ALL}")

        self.buscar_com_filtros(nome, id_produto, quantidade_min, preco_max, validade_min)

    def buscar_com_filtros(self, nome=None, id_produto=None, quantidade_min=None, preco_max=None, validade_min=None):
        resultados = []
        for produto in self.estoque.values():
            if nome and nome.lower() not in produto.nome.lower():
                continue
            if id_produto and produto.id_produto != id_produto:
                continue
            if quantidade_min is not None and produto.quantidade < quantidade_min:
                continue
            if preco_max is not None and produto.preco > preco_max:
                continue
            if validade_min and produto.validade < validade_min:
                continue
            resultados.append(produto)

        if resultados:
            for resultado in resultados:
                print(resultado)
        else:
            print(f"{Fore.RED}Nenhum produto encontrado com os critérios fornecidos.{Style.RESET_ALL}")
        self.perguntar_proximo_passo()

def desenhar_menu():
    largura = 40
    print("\n" + "+" + "-" * largura + "+")
    print(f"| Sistema de Controle de Estoque           |")
    print("+" + "-" * largura + "+")
    print(f"| 1. Adicionar Produto                     |")
    print(f"| 2. Atualizar Produto                     |")
    print(f"| 3. Remover Produto                       |")
    print(f"| 4. Exibir Estoque                        |")
    print(f"| 5. Buscar Produtos com Filtros           |")
    print(f"| 6. Listar por Validade                   |")
    print(f"| 7. Produtos Próximos ao Vencimento       |")
    print(f"| 8. Sair                                  |")
    print("+" + "-" * largura + "+")

def main():
    sistema_estoque = SistemaEstoque()

    while True:
        desenhar_menu()
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
            validade = entrada_data(f"{PALETA_ADICIONAR['input']}Data de Validade (dd/mm/yyyy): {Style.RESET_ALL}")
            produto = Produto(id_produto, nome, quantidade, preco, validade)
            sistema_estoque.adicionar_produto(produto)

        elif opcao == '2':
            print(f"\n{PALETA_ATUALIZAR['titulo']}--- Atualizar Produto ---{Style.RESET_ALL}\n")
            id_produto = entrada_inteira(f"{PALETA_ATUALIZAR['input']}ID do Produto a atualizar: {Style.RESET_ALL}")
            if not sistema_estoque.produto_existe(id_produto):
                print(f"{Fore.RED}Produto com ID {id_produto} não encontrado.{Style.RESET_ALL}")
                continue

            quantidade = entrada_inteira(f"{PALETA_ATUALIZAR['input']}Nova Quantidade (ou deixe em branco para manter): {Style.RESET_ALL}")
            preco = entrada_float(f"{PALETA_ATUALIZAR['input']}Novo Preço (ou deixe em branco para manter): R$ {Style.RESET_ALL}")
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
            sistema_estoque.buscar_com_filtros_interativo()

        elif opcao == '6':
            print(f"\n{PALETA_EXIBIR['titulo']}--- Listar Produtos por Validade ---{Style.RESET_ALL}\n")
            sistema_estoque.listar_por_validade()

        elif opcao == '7':
            dias = entrada_inteira(f"{PALETA_EXIBIR['input']}Digite o número de dias para verificar produtos próximos do vencimento: {Style.RESET_ALL}")
            sistema_estoque.produtos_proximos_vencimento(dias)

        elif opcao == '8':
            print(f"\n{Fore.LIGHTMAGENTA_EX}Encerrando o sistema...{Style.RESET_ALL}")
            break

        else:
            print(f"{Fore.RED}Opção inválida, tente novamente.{Style.RESET_ALL}")

if __name__ == "__main__":
    main()
