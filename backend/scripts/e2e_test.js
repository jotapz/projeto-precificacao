// TESTE, IGNORAR ESSE FILE
(async () => {
  try {
    const base = 'http://localhost:3000/api';
    const unique = Date.now();
    const email = `teste_e2e_${unique}@example.com`;

    console.log('=== Iniciando E2E test ===');

    // 1) Criar usuário
    console.log('\n1) Criando usuário...');
    let res = await fetch(`${base}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome: 'E2E Test User', email, senha: 'senha123', confirmarSenha: 'senha123', bairro: 'Centro' })
    });
    const userBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(userBody, null, 2));

    if (!res.ok) throw new Error('Falha ao criar usuário');
    const userId = userBody.usuario && (userBody.usuario._id || userBody.usuario.id);
    if (!userId) throw new Error('Não foi possível obter userId da resposta');

    // 2) Criar matéria-prima
    console.log('\n2) Criando matéria-prima...');
    res = await fetch(`${base}/materiasprimas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: userId, nome: 'Farinha', quantidade: 100, valorUnitario: 2.5, unidade: 'kg' })
    });
    const mpBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(mpBody, null, 2));
    if (!res.ok) throw new Error('Falha ao criar matéria-prima');
    const mpId = mpBody.item && (mpBody.item._id || mpBody.item.id);

    // 3) Criar despesa mensal
    console.log('\n3) Criando despesa mensal...');
    res = await fetch(`${base}/despesas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: userId, nome: 'Aluguel', valorMensal: 1000 })
    });
    const despBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(despBody, null, 2));

    // 4) Criar custo operacional
    console.log('\n4) Criando custo operacional...');
    res = await fetch(`${base}/custos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: userId, nome: 'Energia', valorMensal: 300 })
    });
    const custoBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(custoBody, null, 2));

    // 5) Criar produto usando a matéria-prima acima
    console.log('\n5) Criando produto...');
    const ingredientes = [ { materiaPrima: mpId, quantidade: 2 } ];
    res = await fetch(`${base}/produtos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usuario: userId, nome: 'Pão Teste', unidade: 'kg', ingredientes, tempoProducaoHoras: 0.5, margemLucroPercentual: 20 })
    });
    const prodBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(prodBody, null, 2));
    if (!res.ok) throw new Error('Falha ao criar produto');
    const prodId = prodBody.item && (prodBody.item._id || prodBody.item.id);

    // 6) Calcular preço final
    console.log('\n6) Solicitando cálculo do preço final...');
    res = await fetch(`${base}/produtos/${prodId}/preco-final`);
    const priceBody = await res.json();
    console.log('-> status:', res.status);
    console.log('-> body:', JSON.stringify(priceBody, null, 2));

    console.log('\n=== E2E test finalizado ===');
  } catch (err) {
    console.error('Erro durante E2E test:', err);
    process.exit(1);
  }
})();
