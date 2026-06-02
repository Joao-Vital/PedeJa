# Plano de testes de software

<span style="color:red">Pré-requisitos: <a href="02-Especificacao.md"> Especificação do projeto</a></span>, <a href="05-Projeto-interface.md"> Projeto de interface</a>

O plano de testes de software é gerado a partir da especificação do sistema e consiste em casos de teste que deverão ser executados quando a implementação estiver parcial ou totalmente pronta. Seguem abaixo os planos de testes.

| **Caso de teste**  | **CT-001 – Cadastrar perfil**  |
|:---: |:---: |
| Requisito associado | RF-00X - A aplicação deve apresentar, na página principal, a funcionalidade de cadastro de usuários para que estes consigam criar e gerenciar seu perfil. |
| Objetivo do teste | Verificar se o usuário consegue se cadastrar na aplicação. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar em "Criar conta" <br> - Preencher os campos obrigatórios (e-mail, nome, sobrenome, celular, CPF, senha, confirmação de senha) <br> - Aceitar os termos de uso <br> - Clicar em "Registrar" |
| Critério de êxito | - O cadastro foi realizado com sucesso. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-002 – Efetuar login**  |
|:---: |:---: |
| Requisito associado | RF-00Y - A aplicação deve possuir opção de fazer login, sendo o login o endereço de e-mail. |
| Objetivo do teste | Verificar se o usuário consegue realizar login. |
| Passos | - Acessar o navegador <br> - Informar o endereço do site https://adota-pet.herokuapp.com/src/index.html <br> - Clicar no botão "Entrar" <br> - Preencher o campo de e-mail <br> - Preencher o campo de senha <br> - Clicar em "Login" |
| Critério de êxito | - O login foi realizado com sucesso. |
| Responsável pela elaboração do caso de teste | Nome do integrante da equipe. |

<br>

| **Caso de teste**  | **CT-001 – Visualizar oficinas com filtro**  |
|:---: |:---: |
| Requisito associado | RF-015 – A aplicação deve permitir filtrar oficinas por categorias (Disponíveis, Concluídas e Favoritas). |
| Objetivo do teste | Verificar se os botões de filtro exibem corretamente as oficinas correspondentes. |
| Passos | - Acessar o navegador <br> - Abrir a página de oficinas <br> - Clicar em um dos botões de filtro (Concluídas, Favoritas ou Oficinas/Disponíveis)  |
| Critério de êxito | - A página deve exibir somente as oficinas correspondentes ao filtro selecionado. |
| Responsável pela elaboração do caso de teste | João Pedro Vital. |

<br>

| **Caso de teste**  | **CT-002 – Operações CRUD da oficina**  |
|:---: |:---: |
| Requisito associado | RF-014 e RF-016 – O sistema deve permitir criar, visualizar, editar e excluir oficinas. |
| Objetivo do teste | Testar o fluxo completo do CRUD da oficina.|
| Passos | - Acessar o navegador <br> - Clicar no botão Cadastrar <br> - Preencher os campos da nova oficina <br> - Clicar em Salvar <br> - Clicar no card criado para visualizar os detalhes <br> - Clicar em Voltar <br> - Clicar no botão de 3 pontos (menu) <br> - Selecionar Editar <br> - Alterar os campos necessários <br> - Clicar em Salvar <br> - Clicar novamente no menu de 3 pontos <br> - Selecionar Excluir |
| Critério de êxito | - O usuário deve conseguir criar, visualizar, editar e excluir uma oficina com sucesso.|
| Responsável pela elaboração do caso de teste | João Pedro Vital. |

<br>

| **Caso de teste**  | **CT-003 – Operações CRUD dos produtos**  |
|:---: |:---: |
| Requisito associado | RF-003 – CRUD Produtos |
| Objetivo do teste | Testar o fluxo completo do CRUD do produto.|
| Passos | - Acessar a página gerenciamentoProdutos <br> - Clicar no botão Cadastrar novo produto <br> - Preencher todos os campos obrigatórios com dados válidos. <br> - Clicar em Salvar <br> - Resultado esperado: Exibir mensagem "Produto salvo com sucesso". O novo produto deve aparecer na lista. <br> - Na lista de produtos, clicar em Editar na coluna Ações do produto cadastrado. <br> - Alterar qualquer informação válida. <br> - Clique em salvar <br> - Resultado esperado: Exibir mensagem "Produto salvo com sucesso". O produto deve aparecer na lista com as informações atualizadas. <br> - Na coluna Ações, clicar em Excluir para o produto alterado. <br> - Confirmar a exclusão. <br> - Resultado esperado: Exibir mensagem "Produto excluído com sucesso". O produto não deve mais aparecer na lista. |
| Critério de êxito | - O usuário deve conseguir criar, visualizar, editar e excluir um produto com sucesso.|
| Responsável pela elaboração do caso de teste | Samara Lana da Rocha. |

<br>

| **Caso de teste**  | **CT-006 – Ordenar produtos cadastrados**  |
|:---: |:---: |
| Requisito associado | RF-012 – Ordenar produtos cadastrados |
| Objetivo do teste | Testar o fluxo de ordenação da página de gerenciamento de produtos |
| Passos | - Acessar a página gerenciamentoProdutos <br> - Selecionar a opção de Ordenar de A-Z <br> - A lista de produtos deve aparecer com o nome do produto em ordem alfabética <br> - Selecionar a opção preço descrescente <br> -  A lista de produtos deve aparecer na ordem do pedido mais caro ao mais barato |
| Critério de êxito | - O usuário deve conseguir ordenar a lista de produtos com sucesso.|
| Responsável pela elaboração do caso de teste | Samara Lana da Rocha. |

<br>

| **Caso de teste**  | **CT-007 – Buscar produtos cadastrados**  |
|:---: |:---: |
| Requisito associado | RF-013 – Buscar produtos cadastrados |
| Objetivo do teste | Testar o fluxo de busca da página de gerenciamento de produtos |
| Passos | - Acessar a página gerenciamentoProdutos <br> - No campo de busca escrever o nome completo de um produto <br> - A lista de produtos deve retornar somente protos com esse nome <br> - No campo de busca escrever somente Hamburguer ou alguma outra palavra que faça parte do nome de alguns produtos, mas não o nome todo. Testar várias opções <br> -  A lista de produtos deve retornar somente produtos que tem o nome todo ou parte do nome igual ao que foi buscado |
| Critério de êxito | - O usuário deve conseguir buscar produtos na lista de produtos cadastrados.|
| Responsável pela elaboração do caso de teste | Samara Lana da Rocha. |

<br>

| **Caso de teste**  | **CT-008 – Visualizar cardápio**  |
|:---: |:---: |
| Requisito associado |RF-004 – Visualizar cardápio |
| Objetivo do teste | Validar se o usuário consegue visualizar corretamente todos os itens do cardápio, incluindo suas informações principais (nome, descrição, preço, categoria e imagem). |
| Passos | - Acessar a página /cardapio. <br> -Verificar se a página carrega todos os produtos cadastrados que devem aparecer no cardápio.Confirmar se cada item exibe corretamente: <br> - Nome do produto <br> - Descrição<br> - Preço<br> - Categoria <br> - Imagem (quando cadastrada) <br> - Verificar se a página organiza os produtos por categoria (caso o sistema possua essa lógica). <br> - Rolar a página e validar se não há falhas de carregamento ou produtos duplicados.<br> - Atualizar a página (F5) para verificar se o conteúdo é recarregado corretamente.<br> - Caso exista paginação, verificar se ao navegar entre páginas todos os itens continuam sendo exibidos adequadamente.|
| Critério de êxito |O cardápio deve exibir corretamente todos os produtos, com todas as informações obrigatórias, sem itens faltando, duplicados ou com erros de carregamento, e a página deve abrir sem travamentos ou mensagens de erro.|
| Responsável pela elaboração do caso de teste | Raissa Aparecida de Souza Rocha |

<br>



| **Caso de teste**  | **CT-009 – Operações CRUD do carrinho de compras**  |
|:---: |:---: |
| Requisito associado | RF-008 – Carrinho de Compras |
| Objetivo do teste | Testar o fluxo completo do carrinho (adicionar, visualizar, atualizar e remover itens). |
| Passos | - Acessar o navegador <br> - Efetuar login na aplicação com um usuário válido <br> - Navegar até a página de cardápio <br> - Em um produto qualquer, clicar em “Adicionar ao carrinho” <br> - Repetir o passo anterior para 1 ou mais produtos diferentes <br> - Acessar a página “Carrinho” <br> - Verificar se todos os produtos adicionados aparecem listados com quantidade e valor unitário <br> - Alterar a quantidade de um dos produtos para outro valor válido (ex.: de 1 para 2) <br> - Clicar em “Atualizar” (ou ação equivalente) <br> - Remover um dos itens clicando em “Remover”/“Excluir” no carrinho <br> - Atualizar a página (F5) |
| Critério de êxito | - Todos os produtos adicionados aparecem corretamente no carrinho, com quantidades e valores corretos <br> - Ao alterar a quantidade, o subtotal do item e o total do carrinho são recalculados corretamente <br> - Ao remover um item, ele deixa de aparecer no carrinho e o total é recalculado <br> - Após atualizar a página, o conteúdo do carrinho permanece consistente. |
| Responsável pela elaboração do caso de teste | Gabriel Madureira Matos |

<br>

| **Caso de teste**  | **CT-010 – Finalizar pedido (checkout)**  |
|:---: |:---: |
| Requisito associado | RF-009 – Processo de Pedido (Checkout) |
| Objetivo do teste | Verificar se o usuário consegue finalizar um pedido com base nos itens do carrinho, preenchendo os dados necessários e escolhendo a forma de pagamento. |
| Passos | - Acessar o navegador <br> - Efetuar login na aplicação com um usuário válido <br> - Adicionar 2 ou mais produtos ao carrinho (conforme CT-008) <br> - Acessar a página “Carrinho” <br> - Clicar em “Finalizar pedido” / “Concluir compra” <br> - Preencher os dados solicitados no checkout (ex.: dados de entrega ou retirada, observações, etc., conforme o sistema) <br> - Selecionar uma forma de pagamento válida (Cartão, Pix ou Dinheiro) <br> - Confirmar a finalização do pedido <br> - Verificar a tela de confirmação do pedido (código/localizador, valores, forma de pagamento) |
| Critério de êxito | - O pedido é criado no sistema vinculado ao usuário logado <br> - Os itens do carrinho são copiados corretamente para o pedido, com quantidades e valores corretos <br> - O total do pedido é igual ao total do carrinho no momento da finalização <br> - O carrinho anterior deixa de ficar com status “ativo” (marcado como convertido ou equivalente) e, se previsto, um novo carrinho vazio é disponibilizado para novas compras <br> - A tela de confirmação exibe um identificador/código do pedido e os dados corretos. |
| Responsável pela elaboração do caso de teste | Gabriel Madureira Matos |

<br>

| **Caso de teste**  | **CT-011 – Acompanhar status do pedido em tempo real**  |
|:---: |:---: |
| Requisito associado | RF-010 – Acompanhar status do pedido |
| Objetivo do teste | Verificar se o cliente consegue visualizar o status atualizado do seu pedido após a finalização. |
| Passos | - Efetuar um pedido seguindo o CT-009 e anotar o código/localizador do pedido <br> - Acessar a página “Meus pedidos” ou área de acompanhamento de pedido <br> - Localizar o pedido recém-criado pela lista ou pelo código/localizador <br> - Verificar o status inicial exibido (ex.: “Aceito”) <br> - Em outra sessão (ou com usuário de operador/administrador), alterar o status desse pedido para “Preparando” e depois “Pronto” utilizando a tela de gerenciamento de pedidos (RF-011) <br> - Atualizar a página de acompanhamento do cliente (ou aguardar atualização automática, se houver) |
| Critério de êxito | - O pedido aparece na lista de “Meus pedidos” do cliente <br> - O status inicial exibido é coerente com o definido no backend (ex.: “Aceito”) <br> - Após as mudanças feitas pelo operador, o status exibido para o cliente é atualizado corretamente para “Preparando” e depois “Pronto” <br> - Não há inconsistências entre o status mostrado para o operador e o status mostrado para o cliente. |
| Responsável pela elaboração do caso de teste | Gabriel Madureira Matos |

<br>

| **Caso de teste**  | **CT-012 – Gerenciar Pedidos em tempo real**  |
|:---: |:---: |
| Requisito associado | RF-011 – Gerenciar pedidos |
| Objetivo do teste | Verificar se os Pedidos estão sendo marcados Corretamente |
| Passos | - Acessar o navegador <br> - Abrir a página Painel de Pedidos <br> - Clicar em um dos botões de Confirmar e Pronto |
| Critério de êxito | - O usuario deve conseguir marcar o Pedido com Pronto ou Confirmado <br> - Deve aparecer uma mensagem na tela dizendo que o pedido foi marcado como pronto ou confirmado |
| Responsável pela elaboração do caso de teste | Caio Antonio Coelho |

<br>

| **Caso de teste**  | **CT-013 –  Visualizar Oficinas com Filtro**  |
|:---: |:---: |
| Requisito associado | RF-00Z – A aplicação deve permitir que o usuário visualize a lista de oficinas disponíveis e utilize filtros (data, categoria ou instrutor) para refinar a busca. |
| Objetivo do teste | Verificar se o sistema lista as oficinas e se os filtros funcionam corretamente. |
| Passos | - Acessar a página "Oficinas" <br> - Visualizar a lista geral  <br> - Selecionar um filtro (ex: Categoria "Tecnologia")  <br> - Clicar no botão "Filtrar" ou "Buscar" <br> - Verificar se a lista foi atualizada apenas com os itens correspondentes |
| Critério de êxito | - As oficinas são listadas corretamente. <br> - O filtro retorna apenas os resultados esperados.  |
| Responsável pela elaboração do caso de teste | Marco Túlio Alves Benevides |

<br>

| **Caso de teste**  | **CT-014 – Realizar inscrição em oficina**  |
|:---: |:---: |
| Requisito associado | RF-01A – A aplicação deve permitir que um usuário logado se inscreva em uma oficina com vagas disponíveis. |
| Objetivo do teste | Verificar se o usuário consegue confirmar sua participação na oficina. |
| Passos | - Efetuar login no sistema <br> - Acessar a página de detalhes de uma oficina com vagas abertas <br> - Clicar no botão "Inscrever-se" <br> - Confirmar os dados na modal/janela de confirmação <br> - Clicar em "Confirmar Inscrição" |
| Critério de êxito | O sistema exibe mensagem de "Inscrição realizada com sucesso". <br> - O número de vagas disponíveis da oficina é decrementado. <br> - A oficina aparece na área "Minhas Inscrições" do usuário. |
| Responsável pela elaboração do caso de teste | Marco Túlio Alves Benevides |

<br>

| **Caso de teste**  | **CT-015 – Gerenciar inscrições (Perfil Administrador)**  |
|:---: |:---: |
| Requisito associado | RF-01B – A aplicação deve permitir que o administrador visualize a lista de inscritos e gerencie o status da inscrição (Confirmar presença/Cancelar) |
| Objetivo do teste | Verificar se o administrador consegue visualizar e alterar o status dos inscritos. |
| Passos | - Efetuar login como Administrador  <br> - Acessar o "Painel Administrativo" <br> - Clicar em "Gerenciar Oficinas" <br> - Selecionar uma oficina específica e clicar em "Ver Inscritos" <br> - Localizar um usuário na lista <br> - Alterar o status (ex: clicar em "Cancelar Inscrição" ou "Confirmar Presença").|
| Critério de êxito | - A lista de participantes é exibida corretamente. <br> - O status da inscrição do usuário é atualizado no banco de dados e na interface. |
| Responsável pela elaboração do caso de teste | Marco Túlio Alves Benevides |

<br>

## Ferramentas de testes (opcional)

Comente sobre as ferramentas de testes utilizadas.
 
> **Links úteis**:
> - [IBM - criação e geração de planos de teste](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Práticas e técnicas de testes ágeis](http://assiste.serpro.gov.br/serproagil/Apresenta/slides.pdf)
> - [Teste de software: conceitos e tipos de testes](https://blog.onedaytesting.com.br/teste-de-software/)
> - [Criação e geração de planos de teste de software](https://www.ibm.com/developerworks/br/local/rational/criacao_geracao_planos_testes_software/index.html)
> - [Ferramentas de teste para JavaScript](https://geekflare.com/javascript-unit-testing/)
> - [UX Tools](https://uxdesign.cc/ux-user-research-and-user-testing-tools-2d339d379dc7)
