import { defineConfig } from "cypress";

export default defineConfig({
  chromeWebSecurity: false,
  allowCypressEnv: false,

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    // Define a URL base para os testes, para que possamos usar caminhos relativos nos testes
    baseUrl: "https://sauce-demo.myshopify.com",
    // Não vai limpar o estado entre os testes por padrão, ou seja, o usuário vai permanecer logado entre os testes
    testIsolation: false,
    // Bloqueia as requisições para os domínios de analytics e monitoramento, para evitar que eles causem falhas nos testes
    blockHosts: ["*google-analytics.com", "*://shopify.com"],
    // Configura o Cypress para tentar novamente os testes que falharem, para aumentar a estabilidade dos testes em casos de falhas intermitentes
    retries: {
      runMode: 2, // Número de tentativas de retry quando os testes falharem durante a execução normal (cypress run)
      openMode: 1, // Número de tentativas de retry quando os testes falharem durante a execução interativa (cypress open)
    },
  },
});
