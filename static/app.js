const API = '/api';

function get(url) {
  return fetch(API + url).then(r => {
    if (!r.ok) throw new Error(r.statusText);
    return r.json();
  });
}

function post(url, body) {
  return fetch(API + url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => {
    const data = r.json().catch(() => ({}));
    if (!r.ok) return data.then(d => { throw new Error(d.erro || r.statusText); });
    return data;
  });
}

function put(url, body) {
  return fetch(API + url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  }).then(r => {
    const data = r.json().catch(() => ({}));
    if (!r.ok) return data.then(d => { throw new Error(d.erro || r.statusText); });
    return data;
  });
}

function del(url) {
  return fetch(API + url, { method: 'DELETE' }).then(r => {
    if (!r.ok) return r.json().then(d => { throw new Error(d.erro || r.statusText); });
    return r.json();
  });
}

function formatPreco(n) {
  return Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parsePrecoInput(s) {
  return String(s).replace(/\./g, '').replace(',', '.') || '0';
}

/* ========== MÁSCARAS (data, monetário, inteiro) ========== */
function mascaraData(v) {
  const d = v.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return d.slice(0, 2) + '/' + d.slice(2);
  return d.slice(0, 2) + '/' + d.slice(2, 4) + '/' + d.slice(4, 8);
}

function mascaraMonetario(v) {
  const d = v.replace(/\D/g, '');
  if (d.length === 0) return '';
  const n = parseInt(d, 10);
  const centavos = n % 100;
  const inteiros = Math.floor(n / 100);
  const partes = inteiros.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return (partes || '0') + ',' + (centavos < 10 ? '0' : '') + centavos;
}

function mascaraInteiro(v) {
  return v.replace(/\D/g, '');
}

function aplicarMascaraInput(el) {
  const mask = el.getAttribute('data-mask');
  if (!mask) return;
  function atualizar() {
    let novo = el.value;
    if (mask === 'date') novo = mascaraData(el.value);
    else if (mask === 'currency') novo = mascaraMonetario(el.value);
    else if (mask === 'integer') {
      novo = mascaraInteiro(el.value);
      if (el.maxLength) novo = novo.slice(0, parseInt(el.maxLength, 10));
    }
    el.value = novo;
  }
  el.addEventListener('input', atualizar);
  el.addEventListener('paste', (e) => {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text').replace(/\D/g, mask === 'date' ? '' : (mask === 'currency' ? '' : ''));
    if (mask === 'date') {
      const soNumeros = text.replace(/\D/g, '').slice(0, 8);
      el.value = mascaraData(soNumeros);
    } else if (mask === 'currency') {
      el.value = mascaraMonetario(text);
    } else {
      el.value = text.slice(0, el.maxLength || 999);
    }
  });
}

function initMascaras() {
  document.querySelectorAll('[data-mask]').forEach(aplicarMascaraInput);
}

function valorInteiro(el) {
  const v = (el.value || '').replace(/\D/g, '');
  return v === '' ? null : parseInt(v, 10);
}

function linhaValidade(validadeStr) {
  const [d, m, y] = validadeStr.split('/').map(Number);
  const data = new Date(y, m - 1, d);
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  data.setHours(0, 0, 0, 0);
  const dias = Math.ceil((data - hoje) / (1000 * 60 * 60 * 24));
  const span = document.createElement('span');
  span.textContent = validadeStr;
  span.className = dias < 0 ? 'validade-vencida' : (dias <= 30 ? 'validade-perto' : '');
  return span;
}

function renderLinhaLista(p, comAcoes = true) {
  const tr = document.createElement('tr');
  const acoes = comAcoes ? `
    <td class="acoes">
      <button type="button" class="btn btn-sec btn-sm btn-editar" data-id="${p.id_produto}">Editar</button>
      <button type="button" class="btn btn-danger btn-sm btn-excluir" data-id="${p.id_produto}" data-nome="${p.nome.replace(/"/g, '&quot;')}">Remover</button>
    </td>
  ` : '';
  tr.innerHTML = `
    <td>${p.id_produto}</td>
    <td class="td-nome">${p.nome}</td>
    <td class="td-qtd">${p.quantidade}</td>
    <td class="preco">R$ ${formatPreco(p.preco)}</td>
    <td></td>
    ${acoes}
  `;
  tr.querySelector('td:nth-child(5)').appendChild(linhaValidade(p.validade));
  return tr;
}

function renderLinhaSimples(p) {
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${p.id_produto}</td>
    <td class="td-nome">${p.nome}</td>
    <td class="td-qtd">${p.quantidade}</td>
    <td class="preco">R$ ${formatPreco(p.preco)}</td>
    <td></td>
  `;
  tr.querySelector('td:last-child').appendChild(linhaValidade(p.validade));
  return tr;
}

let idExcluir = null;

function atualizarLista(params = {}) {
  const qs = new URLSearchParams();
  if (params.nome) qs.set('nome', params.nome);
  if (params.quantidade_min !== undefined && params.quantidade_min !== '') qs.set('quantidade_min', params.quantidade_min);
  if (params.preco_max !== undefined && params.preco_max !== '') qs.set('preco_max', params.preco_max);
  const url = qs.toString() ? '/produtos?' + qs.toString() : '/produtos';
  const errCarregar = document.getElementById('erro-carregar-lista');
  if (errCarregar) errCarregar.style.display = 'none';
  get(url).then(lista => {
    const tbody = document.getElementById('corpo-tabela');
    const msg = document.getElementById('msg-vazio-lista');
    tbody.innerHTML = '';
    if (errCarregar) errCarregar.style.display = 'none';
    if (lista.length === 0) {
      msg.classList.add('visivel');
      document.getElementById('stat-total-itens').textContent = '0';
      document.getElementById('stat-valor-total').textContent = 'R$ 0,00';
      document.getElementById('badge-count').textContent = '0 itens';
      document.querySelector('.total-itens').textContent = '0';
      return;
    }
    msg.classList.remove('visivel');
    let valorTotal = 0;
    lista.forEach((p, i) => {
      valorTotal += Number(p.preco) * Number(p.quantidade);
      const tr = renderLinhaLista(p);
      tr.style.animationDelay = (i * 0.02) + 's';
      tbody.appendChild(tr);
    });
    document.getElementById('stat-total-itens').textContent = lista.length;
    document.getElementById('stat-valor-total').textContent = 'R$ ' + formatPreco(valorTotal);
    document.getElementById('badge-count').textContent = lista.length + ' itens';
    document.querySelector('.total-itens').textContent = lista.length;
    bindEditarExcluir();
  }).catch((err) => {
    document.getElementById('msg-vazio-lista').classList.remove('visivel');
    document.getElementById('corpo-tabela').innerHTML = '';
    const st = document.getElementById('stat-total-itens');
    const sv = document.getElementById('stat-valor-total');
    const bc = document.getElementById('badge-count');
    if (st) st.textContent = '0';
    if (sv) sv.textContent = 'R$ 0,00';
    if (bc) bc.textContent = '0 itens';
    const ti = document.querySelector('.total-itens');
    if (ti) ti.textContent = '0';
    const errEl = document.getElementById('erro-carregar-lista');
    if (errEl) {
      errEl.textContent = 'Não foi possível carregar o estoque. Abra a página pelo servidor: http://127.0.0.1:5000 (rode python app_web.py antes).';
      errEl.style.display = 'block';
    }
    console.error('Erro ao carregar produtos:', err);
  });
}

function bindEditarExcluir() {
  document.querySelectorAll('.btn-editar').forEach(btn => {
    btn.onclick = () => abrirEditar(Number(btn.dataset.id));
  });
  document.querySelectorAll('.btn-excluir').forEach(btn => {
    btn.onclick = () => abrirExcluir(Number(btn.dataset.id), btn.dataset.nome);
  });
}

function abrirEditar(id) {
  get('/produtos/' + id).then(p => {
    document.getElementById('edit-id').value = p.id_produto;
    document.getElementById('edit-nome-display').textContent = p.nome;
    document.getElementById('edit-quantidade').value = String(p.quantidade);
    document.getElementById('edit-preco').value = formatPreco(p.preco);
    document.getElementById('erro-editar').classList.remove('visivel');
    document.getElementById('modal-editar').classList.add('ativo');
  });
}

function abrirExcluir(id, nome) {
  idExcluir = id;
  document.getElementById('nome-produto-excluir').textContent = nome;
  document.getElementById('modal-excluir').classList.add('ativo');
}

document.getElementById('btn-fechar-editar').onclick = () => {
  document.getElementById('modal-editar').classList.remove('ativo');
};

document.getElementById('form-editar').onsubmit = (e) => {
  e.preventDefault();
  const id = Number(document.getElementById('edit-id').value);
  const qRaw = valorInteiro(document.getElementById('edit-quantidade'));
  const quantidade = qRaw !== null ? qRaw : undefined;
  const preco = document.getElementById('edit-preco').value.trim() !== ''
    ? parseFloat(parsePrecoInput(document.getElementById('edit-preco').value)) : undefined;
  const errEl = document.getElementById('erro-editar');
  put('/produtos/' + id, { quantidade, preco })
    .then(() => {
      document.getElementById('modal-editar').classList.remove('ativo');
      atualizarLista();
      atualizarTotal();
    })
    .catch(err => {
      errEl.textContent = err.message;
      errEl.classList.add('visivel');
    });
};

document.getElementById('btn-confirmar-excluir').onclick = () => {
  if (idExcluir == null) return;
  del('/produtos/' + idExcluir).then(() => {
    document.getElementById('modal-excluir').classList.remove('ativo');
    idExcluir = null;
    atualizarLista();
    atualizarTotal();
  }).catch(alert);
};

document.getElementById('btn-cancelar-excluir').onclick = () => {
  document.getElementById('modal-excluir').classList.remove('ativo');
  idExcluir = null;
};

function atualizarTotal() {
  get('/produtos').then(lista => {
    document.querySelector('.total-itens').textContent = lista.length;
    let valorTotal = 0;
    lista.forEach(p => { valorTotal += Number(p.preco) * Number(p.quantidade); });
    document.getElementById('stat-total-itens').textContent = lista.length;
    document.getElementById('stat-valor-total').textContent = 'R$ ' + formatPreco(valorTotal);
    document.getElementById('badge-count').textContent = lista.length + ' itens';
  });
}

function atualizarPorValidade() {
  get('/produtos/por-validade').then(lista => {
    const tbody = document.getElementById('corpo-por-validade');
    const msg = document.getElementById('msg-vazio-validade');
    tbody.innerHTML = '';
    if (lista.length === 0) {
      msg.classList.add('visivel');
      return;
    }
    msg.classList.remove('visivel');
    lista.forEach(p => tbody.appendChild(renderLinhaSimples(p)));
  });
}

function atualizarProximos() {
  const dias = valorInteiro(document.getElementById('dias-vencimento')) ?? 30;
  get('/produtos/proximos-vencimento?dias=' + dias).then(lista => {
    const tbody = document.getElementById('corpo-proximos');
    const msg = document.getElementById('msg-vazio-proximos');
    tbody.innerHTML = '';
    if (lista.length === 0) {
      msg.classList.add('visivel');
      return;
    }
    msg.classList.remove('visivel');
    lista.forEach(p => tbody.appendChild(renderLinhaSimples(p)));
  });
}

document.getElementById('btn-atualizar-proximos').onclick = atualizarProximos;

document.getElementById('form-adicionar').onsubmit = (e) => {
  e.preventDefault();
  const errEl = document.getElementById('erro-adicionar');
  const idRaw = valorInteiro(document.getElementById('add-id'));
  const qtdRaw = valorInteiro(document.getElementById('add-quantidade'));
  const payload = {
    id_produto: idRaw !== null ? idRaw : 0,
    nome: document.getElementById('add-nome').value.trim(),
    quantidade: qtdRaw !== null ? qtdRaw : 0,
    preco: parseFloat(parsePrecoInput(document.getElementById('add-preco').value)),
    validade: document.getElementById('add-validade').value.trim()
  };
  post('/produtos', payload)
    .then(() => {
      errEl.classList.remove('visivel');
      document.getElementById('form-adicionar').reset();
      get('/proximo-id').then(d => {
        document.getElementById('add-id').value = d.proximo_id;
        document.getElementById('sugestao-id').textContent = 'Sugestão: ' + d.proximo_id;
      });
      atualizarLista();
      atualizarTotal();
    })
    .catch(err => {
      errEl.textContent = err.message;
      errEl.classList.add('visivel');
    });
};

document.getElementById('btn-buscar').onclick = () => {
  const qMin = valorInteiro(document.getElementById('filtro-qtd-min'));
  atualizarLista({
    nome: document.getElementById('filtro-nome').value.trim() || undefined,
    quantidade_min: qMin !== null ? qMin : undefined,
    preco_max: document.getElementById('filtro-preco-max').value.trim() ? parsePrecoInput(document.getElementById('filtro-preco-max').value) : undefined
  });
};

const titulos = {
  'lista': 'Tudo disponível no estoque',
  'adicionar': 'Adicionar produto',
  'por-validade': 'Por validade',
  'proximos': 'Próximos do vencimento'
};

const subtitulos = {
  'lista': 'Veja todos os produtos, preços e quantidades.',
  'adicionar': 'Cadastre um novo item no estoque.',
  'por-validade': 'Ordenado pela data de validade.',
  'proximos': 'Itens que vencem em breve.'
};

document.querySelectorAll('.nav-btn').forEach(btn => {
  btn.onclick = () => {
    const tela = btn.dataset.tela;
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.tela').forEach(t => t.classList.remove('active'));
    document.getElementById('tela-' + tela).classList.add('active');
    document.getElementById('titulo-tela').textContent = titulos[tela];
    const subEl = document.getElementById('topo-sub');
    if (subEl) subEl.textContent = subtitulos[tela] || '';
    const filtros = document.getElementById('filtros-lista');
    filtros.style.display = tela === 'lista' ? 'flex' : 'none';
    if (tela === 'lista') atualizarLista();
    if (tela === 'por-validade') atualizarPorValidade();
    if (tela === 'proximos') atualizarProximos();
    if (tela === 'adicionar') {
      get('/proximo-id').then(d => {
        document.getElementById('add-id').value = String(d.proximo_id);
        document.getElementById('sugestao-id').textContent = 'Sugestão: ' + d.proximo_id;
      });
    }
  };
});

initMascaras();

get('/proximo-id').then(d => {
  document.getElementById('add-id').value = String(d.proximo_id);
  document.getElementById('sugestao-id').textContent = 'Sugestão: ' + d.proximo_id;
});
atualizarLista();
