# Sistema de Precificação - Backend

## Configuração

1. Instale as dependências:
```bash
npm install
```

2. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Preencha as variáveis com seus valores

3. Inicie o servidor:
```bash
npm run dev
```

## Rotas da API

### Autenticação
- `POST /login` - Login do usuário
  ```json
  {
    "email": "seu@email.com",
    "senha": "sua-senha"
  }
  ```

- `POST /refresh-token` - Renovar token de acesso
  ```json
  {
    "refreshToken": "seu-refresh-token"
  }
  ```

### Usuários
- `POST /usuarios` - Criar novo usuário
  ```json
  {
    "nome": "Nome Completo",
    "email": "seu@email.com",
    "senha": "sua-senha",
    "confirmarSenha": "sua-senha",
    "bairro": "Seu Bairro",
    "cpf": "123.456.789-00" // opcional
  }
  ```

- `GET /usuarios` - Listar usuários (requer autenticação)
- `GET /usuarios/:id` - Buscar usuário por ID (requer autenticação)
- `PUT /usuarios/:id` - Atualizar usuário (requer autenticação)
- `DELETE /usuarios/:id` - Deletar usuário (requer autenticação)

### Recuperação de Senha
- `POST /solicitar-reset-senha` - Solicitar reset de senha
  ```json
  {
    "email": "seu@email.com"
  }
  ```

- `POST /reset-senha` - Resetar senha com token
  ```json
  {
    "token": "token-recebido-por-email",
    "novaSenha": "nova-senha"
  }
  ```

## Autenticação

Para rotas protegidas, inclua o token JWT no header:
```
Authorization: Bearer seu-token-aqui
```

## Desenvolvimento

Para contribuir:
1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Crie um pull request