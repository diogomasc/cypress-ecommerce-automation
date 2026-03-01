Linguagem de Especificação de Comportamento (Gherkin) para testes de funcionalidades do e-commerce "Sauce Demo".:

  Feature: Recurso
  Scenario: Cenário
  Given: Dado que
  When: Quando
  And: E
  Then: Então

---

Feature: Gestão do Carrinho de Compras
  Como um usuário do e-commerce
  Quero gerenciar os itens no meu carrinho
  Para que eu possa revisar meus produtos antes de finalizar a compra.

  Scenario: Adicionar um produto ao carrinho com sucesso
    Given que estou na vitrine de produtos do site "Sauce Demo"
    When eu seleciono o produto "Grey jacket"
    And clico no botão "Add to cart"
    And clico no ícone do carrinho no canto superior direito
    Then o sistema deve exibir o produto "Grey jacket" no carrinho
    And o valor exibido deve ser de "£55.00"

  Scenario: Alterar a quantidade de um item no carrinho
    Given que possuo o item "Grey jacket" no meu carrinho
    When eu acesso a página do carrinho
    And altero o campo "Qty" para um novo valor numérico
    And clico em "Update" ou pressiono Enter
    Then o sistema deve atualizar o valor total com base na nova quantidade

  Scenario: Erro ao inserir quantidade excessiva (Bug Detectado)
    Given que possuo itens no carrinho
    When eu informo uma quantidade igual ou maior que "1000001" no campo "Qty"
    Then o sistema deve exibir a mensagem de erro "Something went wrong"
    And a transação não deve ser processada

  Scenario: Remover um produto do carrinho
    Given que o item "Grey jacket" está no carrinho
    When eu clico no botão "Remove" associado ao produto
    Then o produto deve ser removido da listagem
    And o contador (badge) do carrinho deve ser atualizado para zero ou desaparecer

  Scenario: Retornar à vitrine através do botão "Continue Shopping"
    Given que estou na página do carrinho
    When eu clico no botão "Continue Shopping" abaixo da lista de produtos
    Then o sistema deve me redirecionar de volta para a vitrine de produtos

Feature: Fluxo de Checkout
  Como um cliente (convidado ou logado)
  Quero preencher meus dados e informações de pagamento
  Para finalizar minha compra com segurança.

  Scenario: Finalizar compra como convidado (Sucesso)
    Given que adicionei o item "Grey jacket" ao carrinho
    When eu clico em "Check Out" e preencho os campos de e-mail e endereço de entrega
    And informo o dígito "1" no campo "Card number" (Bogus Gateway)
    And preencho uma data de validade futura e o código "111"
    And clico no botão "Pay now"
    Then o sistema deve redirecionar para a página de sucesso
    And exibir a mensagem de confirmação do pedido e o número da ordem

  Scenario: Finalizar compra com usuário logado (Auto-preenchimento)
    Given que estou logado em uma conta com endereço pré-cadastrado
    And possuo itens no carrinho
    When eu acesso a página de checkout
    Then o campo "Email" e a seção "Delivery" devem aparecer preenchidos automaticamente
    When eu insiro os dados de pagamento (cartão "1") e clico em "Pay now"
    Then o sistema deve processar a compra utilizando os dados carregados do perfil

  Scenario: Tentar finalizar compra com campo obrigatório vazio
    Given que estou na página de checkout como convidado
    When eu preencho todos os campos, mas mantenho o campo "Last name" vazio
    And clico no botão "Pay now"
    Then o sistema não deve processar a compra
    And deve realizar uma rolagem automática até o campo vazio
    And exibir a mensagem de erro "Enter a last name"

  Scenario: Pagamento recusado pelo Gateway
    Given que preenchi todos os dados de envio corretamente
    When eu informo o dígito "2" no campo "Card number" (Simulação de recusa)
    And clico no botão "Pay now"
    Then o sistema deve exibir a mensagem: "There was an issue processing your payment. Try again or use a different payment method"
    And o usuário deve permanecer na tela de checkout para correção