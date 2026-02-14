import { Produto } from '@/../../shared/const';

export function exportarCSV(produtos: Produto[], nomeArquivo = 'estoque.csv') {
  const headers = ['ID', 'Produto', 'Quantidade', 'Preço', 'Validade'];
  const rows = produtos.map(p => [
    p.id_produto,
    p.nome,
    p.quantidade,
    p.preco.toFixed(2),
    p.validade
  ]);

  const csv = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportarJSON(produtos: Produto[], nomeArquivo = 'estoque.json') {
  const json = JSON.stringify(produtos, null, 2);
  const blob = new Blob([json], { type: 'application/json;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function gerarRelatorioHTML(produtos: Produto[]): string {
  const valorTotal = produtos.reduce((acc, p) => acc + (p.preco * p.quantidade), 0);
  const quantidadeTotal = produtos.reduce((acc, p) => acc + p.quantidade, 0);

  const linhasTabela = produtos
    .map(p => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.id_produto}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.nome}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.quantidade}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">R$ ${p.preco.toFixed(2)}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${p.validade}</td>
      </tr>
    `)
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Relatório de Estoque</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        h1 { color: #333; }
        .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin: 20px 0; }
        .stat-box { background: #f0f0f0; padding: 15px; border-radius: 8px; }
        .stat-box h3 { margin: 0 0 10px 0; color: #666; }
        .stat-box .value { font-size: 24px; font-weight: bold; color: #333; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th { background: #333; color: white; padding: 12px; text-align: left; }
        .footer { margin-top: 30px; color: #666; font-size: 12px; }
      </style>
    </head>
    <body>
      <h1>Relatório de Estoque</h1>
      <p>Gerado em: ${new Date().toLocaleString('pt-BR')}</p>

      <div class="stats">
        <div class="stat-box">
          <h3>Total de Produtos</h3>
          <div class="value">${produtos.length}</div>
        </div>
        <div class="stat-box">
          <h3>Quantidade Total</h3>
          <div class="value">${quantidadeTotal}</div>
        </div>
        <div class="stat-box">
          <h3>Valor Total</h3>
          <div class="value">R$ ${valorTotal.toFixed(2)}</div>
        </div>
      </div>

      <h2>Detalhes do Estoque</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Preço</th>
            <th>Validade</th>
          </tr>
        </thead>
        <tbody>
          ${linhasTabela}
        </tbody>
      </table>

      <div class="footer">
        <p>Relatório gerado automaticamente pelo Controle de Estoque Pro</p>
      </div>
    </body>
    </html>
  `;
}

export function exportarHTML(produtos: Produto[], nomeArquivo = 'relatorio-estoque.html') {
  const html = gerarRelatorioHTML(produtos);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', nomeArquivo);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
