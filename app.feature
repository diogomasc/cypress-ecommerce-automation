Feature: Gestão do Carrinho de Compras
  Como um usuário do e-commerce
  Quero gerenciar os itens no meu carrinho
  Para que eu possa revisar meus produtos antes de finalizar a compra.

  Scenario: Adicionar um produto ao carrinho com sucesso
    Given que estou na vitrine de produtos do site "Sauce Demo"
    When eu seleciono o produto "Grey jacket"
    And clico no botão "Add to cart"
    Then o contador do carrinho no cabeçalho deve exibir "(1)"
    And ao acessar o carrinho devo visualizar o item "Grey jacket" com o valor "£55.00"

  Scenario: Alterar a quantidade de um item no carrinho
    Given que possuo o item "Grey jacket" no meu carrinho
    When eu acesso a página do carrinho
    And altero o campo "Qty" para "2"
    And clico no botão "Update"
    Then o sistema deve atualizar o valor total do item para "£110.00"
    And o total geral do carrinho deve ser atualizado para "£110.00"

  Scenario: Erro ao inserir quantidade excessiva (Bug Detectado)
    Given que possuo o item "Grey jacket" no meu carrinho
    When eu informo a quantidade "1000001" no campo "Qty"
    And clico no botão "Update"
    Then o sistema deve redirecionar para uma página de erro
    And deve exibir a mensagem "Something went wrong."

  Scenario: Remover um produto do carrinho
    Given que o item "Grey jacket" está no carrinho
    When eu clico no botão "Remove" (x) associado ao produto na listagem
    Then o produto deve desaparecer da página do carrinho
    And a mensagem "It appears that your cart is currently empty!" deve ser exibida
    And o contador do carrinho no cabeçalho deve retornar para "(0)"

 Scenario: Retornar à vitrine através do botão "Continue Shopping"
    Given que estou na página do carrinho
    When eu clico no link "Continue Shopping"
    Then o sistema deve me redirecionar para a página de coleções "/collections/all"

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