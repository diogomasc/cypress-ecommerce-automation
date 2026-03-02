# Cypress E-commerce Automation

Este repositório contém uma aplicação de testes automatizados utilizando o Cypress. Este projeto foi desenvolvido como parte da Atividade Prática 2 do curso/Bootcamp de Quality Assurance da Avanti.

## Descrição

A aplicação implementa cenários de testes utilizando o padrão Gherkin, cobrindo os seguintes fluxos principais:

- Gestão do carrinho de compras
- Fluxo de checkout

Os testes foram projetados para garantir a qualidade e a confiabilidade das funcionalidades principais de um e-commerce projeto como ambiente de testes, o https://sauce-demo.myshopify.com/.

![alt text](image.png)

## Pré-requisitos

- **[Node.js](https://nodejs.org/pt-br/download)**: Recomendado a versão `v22.22.0` ou superior.
- **NPM** (gerenciador de pacotes do Node.js)

## Instalação

1. Clone este repositório:

   ```bash
   git clone https://github.com/diogomasc/cypress-ecommerce-automation.git
   ```

2. Navegue até o diretório do projeto:

   ```bash
   cd cypress-ecommerce-automation
   ```

3. Instale as dependências do projeto:
   ```bash
   npm install
   ```

## Como executar os testes

### Executar os testes no modo interativo:

1. Abra o Cypress no modo interativo:

   ```bash
   npx cypress open
   ```

2. No painel do Cypress, selecione o arquivo de teste desejado para executar.

### Executar os testes no modo headless:

1. Execute o seguinte comando para rodar os testes no modo headless:
   ```bash
   npx cypress run
   ```

## Estrutura do Projeto

- **cypress/e2e/**: Contém os arquivos de teste.
- **cypress/fixtures/**: Contém dados estáticos usados nos testes.
- **cypress/support/**: Contém comandos customizados e configurações globais.
