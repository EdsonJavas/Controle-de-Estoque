"""
Servidor web local do Controle de Estoque.
Usa o mesmo estoque.json do sistema. Rode: python app_web.py
Acesse: http://127.0.0.1:5000
"""
from datetime import datetime
from pathlib import Path

from flask import Flask, request, jsonify, send_from_directory

# Caminho do projeto (onde está estoque.json) — absoluto para funcionar de qualquer pasta
PASTA_PROJETO = Path(__file__).resolve().parent
ARQUIVO_ESTOQUE = PASTA_PROJETO / 'estoque.json'
if not ARQUIVO_ESTOQUE.exists():
    ARQUIVO_ESTOQUE = Path.cwd() / 'estoque.json'
app = Flask(__name__, static_folder=PASTA_PROJETO / 'static')

from estoque_core import SistemaEstoque, Produto

estoque = SistemaEstoque(ARQUIVO_ESTOQUE)
print('[Estoque] Carregando de:', ARQUIVO_ESTOQUE, '—', len(estoque.estoque), 'produtos')


def parse_validade(s):
    if not s:
        return None
    try:
        return datetime.strptime(s.strip(), "%d/%m/%Y")
    except ValueError:
        return None


@app.route('/')
def index():
    return send_from_directory(PASTA_PROJETO, 'index.html')


@app.route('/api/proximo-id')
def api_proximo_id():
    return jsonify({'proximo_id': estoque.proximo_id_disponivel()})


@app.route('/api/produtos', methods=['GET'])
def api_listar():
    nome = request.args.get('nome', '').strip() or None
    id_produto = request.args.get('id')
    id_produto = int(id_produto) if id_produto else None
    quantidade_min = request.args.get('quantidade_min')
    quantidade_min = int(quantidade_min) if quantidade_min not in (None, '') else None
    preco_max = request.args.get('preco_max')
    preco_max = float(preco_max.replace(',', '.')) if preco_max not in (None, '') else None
    validade_min = parse_validade(request.args.get('validade_min'))

    if any(x is not None for x in (nome, id_produto, quantidade_min, preco_max, validade_min)):
        lista = estoque.buscar_com_filtros(nome, id_produto, quantidade_min, preco_max, validade_min)
    else:
        lista = estoque.listar_todos()
    return jsonify(lista)


@app.route('/api/produtos/por-validade')
def api_por_validade():
    return jsonify(estoque.listar_por_validade())


@app.route('/api/produtos/proximos-vencimento')
def api_proximos_vencimento():
    dias = request.args.get('dias', 30, type=int)
    return jsonify(estoque.produtos_proximos_vencimento(dias=dias))


@app.route('/api/produtos/<int:id_produto>')
def api_obter(id_produto):
    p = estoque.obter_produto(id_produto)
    if p is None:
        return jsonify({'erro': 'Produto não encontrado'}), 404
    return jsonify(p)


@app.route('/api/produtos', methods=['POST'])
def api_adicionar():
    data = request.get_json() or {}
    try:
        id_produto = int(data.get('id_produto'))
        nome = (data.get('nome') or '').strip()
        quantidade = int(data.get('quantidade', 0))
        preco = float(str(data.get('preco', 0)).replace(',', '.'))
        validade = parse_validade(data.get('validade'))
    except (TypeError, ValueError):
        return jsonify({'erro': 'Dados inválidos'}), 400

    if not nome:
        return jsonify({'erro': 'Nome é obrigatório'}), 400
    if quantidade < 0:
        return jsonify({'erro': 'Quantidade não pode ser negativa'}), 400
    if preco < 0:
        return jsonify({'erro': 'Preço não pode ser negativo'}), 400
    if not validade:
        return jsonify({'erro': 'Data de validade é obrigatória (dd/mm/aaaa)'}), 400

    produto = Produto(id_produto, nome, quantidade, preco, validade)
    ok, msg = estoque.adicionar_produto(produto)
    if not ok:
        return jsonify({'erro': msg}), 400
    return jsonify(produto.to_dict()), 201


@app.route('/api/produtos/<int:id_produto>', methods=['PUT'])
def api_atualizar(id_produto):
    data = request.get_json() or {}
    quantidade = data.get('quantidade')
    preco = data.get('preco')
    if quantidade is not None:
        try:
            quantidade = int(quantidade)
        except (TypeError, ValueError):
            return jsonify({'erro': 'Quantidade inválida'}), 400
    if preco is not None:
        try:
            preco = float(str(preco).replace(',', '.'))
        except (TypeError, ValueError):
            return jsonify({'erro': 'Preço inválido'}), 400

    ok, msg = estoque.atualizar_produto(id_produto, quantidade=quantidade, preco=preco)
    if not ok:
        return jsonify({'erro': msg}), 400
    return jsonify(estoque.obter_produto(id_produto))


@app.route('/api/produtos/<int:id_produto>', methods=['DELETE'])
def api_remover(id_produto):
    ok, msg = estoque.remover_produto(id_produto)
    if not ok:
        return jsonify({'erro': msg}), 404
    return jsonify({'sucesso': True, 'nome': msg})


if __name__ == '__main__':
    print('Acesse no navegador: http://127.0.0.1:5000')
    app.run(host='127.0.0.1', port=5000, debug=True)
