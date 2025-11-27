# 💰 Sistema de Precificação - NAF (Núcleo de Apoio Contábil e Fiscal)

> Uma solução completa para auxiliar microempreendedores na gestão de custos e precificação de produtos.

![Badge em Desenvolvimento](http://img.shields.io/static/v1?label=STATUS&message=EM%20DESENVOLVIMENTO&color=GREEN&style=for-the-badge)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![NodeJS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-563D7C?style=for-the-badge&logo=bootstrap&logoColor=white)

## 💻 Sobre o Projeto

Este projeto foi desenvolvido no âmbito universitário para o **NAF (Núcleo de Apoio Contábil e Fiscal)**. O objetivo é fornecer uma ferramenta intuitiva onde empreendedores possam cadastrar suas matérias-primas, custos operacionais e receitas, recebendo automaticamente uma sugestão de preço de venda baseada na margem de lucro desejada.

O sistema conta também com um **Painel Administrativo** para gestão de usuários e monitoramento da plataforma.

---

## ✨ Funcionalidades Principais

### 👤 Para o Empreendedor (Usuário)
- **Cadastro e Login:** Acesso seguro com email e senha.
- **Gestão de Matéria-Prima:** Cadastro de ingredientes com conversão de unidades (kg, g, L, ml, un).
- **Custos Operacionais:** Registro de despesas fixas e variáveis.
- **Criação de Produtos (Receitas):** Montagem de produtos selecionando ingredientes do estoque.
- **Calculadora de Preços:** Simulação automática do preço final baseada nos custos + lucro desejado.
- **Exportação de Relatórios:** Geração de PDF detalhado da precificação com um clique.
- **Perfil:** Gestão de dados pessoais e visualização de iniciais no avatar.

### 🛡️ Para o Administrador (NAF)
- **Login Exclusivo:** Acesso via matrícula e senha.
- **Dashboard Gerencial:** Visão geral do número de usuários e métricas do sistema.
- **Gestão de Usuários:** Listagem de empreendedores cadastrados com opção de exclusão.
- **Visualização de Dados:** O admin pode ver os produtos e receitas cadastradas pelos usuários (modo leitura).
- **Gestão de Admins:** Cadastro de novos colaboradores administrativos.

---

## 🛠️ Tecnologias Utilizadas

### Frontend (Cliente)
- **React.js (Vite):** Biblioteca principal para construção da interface.
- **React Router Dom:** Para navegação entre páginas.
- **Bootstrap 5:** Para estilização responsiva e componentes (Modais, Tabelas, Cards).
- **React Icons:** Ícones modernos.
- **jsPDF & autoTable:** Para geração e exportação de relatórios em PDF.

### Backend (Servidor)
- **Node.js & Express:** Servidor e API RESTful.
- **MongoDB & Mongoose:** Banco de dados NoSQL e modelagem de dados.
- **Nodemon:** Para reinicialização automática durante o desenvolvimento.
- **Cors:** Para permitir comunicação entre Frontend e Backend.
