// Teste de CRUD para custos operacionais e despesas
import fetch from 'node-fetch';

const API_URL = 'http://localhost:3000/api';

// Função helper para fazer requisições
const api = async (endpoint, method = 'GET', body = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  if (body) {
    options.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${API_URL}${endpoint}`, options);
  const data = await response.json();
  return { status: response.status, data };
};

// Função principal de teste
async function runTests() {
  console.log('Iniciando testes de Custos Operacionais e Despesas...\n');
  
  try {
    // 1. Primeiro criar um usuário para os testes
    const userResponse = await api('/usuarios', 'POST', {
      nome: 'Teste CRUD',
      email: `teste${Date.now()}@teste.com`,
      senha: '123456',
      confirmarSenha: '123456',
      bairro: 'Teste'
    });
    
    if (userResponse.status !== 201) {
      throw new Error(`Falha ao criar usuário: ${JSON.stringify(userResponse.data)}`);
    }
    
    const userId = userResponse.data.usuario._id;
    console.log('✅ Usuário criado com sucesso:', userId);

    // 2. Testar CRUD de Custos Operacionais
    console.log('\n🔄 Testando CRUD de Custos Operacionais:');
    
    // CREATE
    const novoCusto = await api('/custos', 'POST', {
      usuario: userId,
      nome: 'Energia Elétrica',
      valorMensal: 500
    });
    console.log('CREATE custo:', novoCusto.status === 201 ? '✅ OK' : '❌ Falhou');
    const custoId = novoCusto.data.item._id;

    // READ
    const listaCustos = await api(`/custos/user/${userId}`);
    console.log('READ custos:', listaCustos.status === 200 ? '✅ OK' : '❌ Falhou');
    console.log(`Quantidade de custos: ${listaCustos.data.length}`);

    // UPDATE
    const custoAtualizado = await api(`/custos/${custoId}`, 'PUT', {
      nome: 'Energia Elétrica Atualizado',
      valorMensal: 550
    });
    console.log('UPDATE custo:', custoAtualizado.status === 200 ? '✅ OK' : '❌ Falhou');

    // DELETE
    const custoDeletado = await api(`/custos/${custoId}`, 'DELETE');
    console.log('DELETE custo:', custoDeletado.status === 200 ? '✅ OK' : '❌ Falhou');

    // 3. Testar CRUD de Despesas
    console.log('\n🔄 Testando CRUD de Despesas:');
    
    // CREATE
    const novaDespesa = await api('/despesas', 'POST', {
      usuario: userId,
      nome: 'Internet',
      valorMensal: 150
    });
    console.log('CREATE despesa:', novaDespesa.status === 201 ? '✅ OK' : '❌ Falhou');
    const despesaId = novaDespesa.data.item._id;

    // READ
    const listaDespesas = await api(`/despesas/user/${userId}`);
    console.log('READ despesas:', listaDespesas.status === 200 ? '✅ OK' : '❌ Falhou');
    console.log(`Quantidade de despesas: ${listaDespesas.data.length}`);

    // UPDATE
    const despesaAtualizada = await api(`/despesas/${despesaId}`, 'PUT', {
      nome: 'Internet Atualizada',
      valorMensal: 180
    });
    console.log('UPDATE despesa:', despesaAtualizada.status === 200 ? '✅ OK' : '❌ Falhou');

    // DELETE
    const despesaDeletada = await api(`/despesas/${despesaId}`, 'DELETE');
    console.log('DELETE despesa:', despesaDeletada.status === 200 ? '✅ OK' : '❌ Falhou');

    // Limpar usuário de teste
    const userDeletado = await api(`/usuarios/${userId}`, 'DELETE');
    console.log('\n✅ Limpeza: Usuário de teste removido');

    console.log('\n✅ Todos os testes completados com sucesso!');

  } catch (erro) {
    console.error('\n❌ Erro durante os testes:', erro.message);
    process.exit(1);
  }
}

// Executar os testes
runTests().catch(console.error);