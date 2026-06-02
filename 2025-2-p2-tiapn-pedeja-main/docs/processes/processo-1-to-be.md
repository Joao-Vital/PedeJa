### PROCESSO 1 TO BE – Pedido do Cliente Otimizado

No novo fluxo, o processo de pedido é totalmente integrado e transparente. O cliente acessa o site, vê informações claras como tempo de preparo, escolhe seus itens e confirma o pedido. A cozinha é notificada automaticamente. Uma vez pronto, o atendente notifica o cliente, que se dirige ao local para pagar e retirar, eliminando a incerteza e otimizando a comunicação.

<img width="1701" height="900" alt="1Desenho TO BE - Bartô ( Pede já ) Pedido" src="https://github.com/user-attachments/assets/5fd2625d-fc33-4fe9-a62b-3cc1ac58341a" />


#### Detalhamento das atividades

_Os tipos de dados a serem utilizados são:_

* **Área de texto** - Para exibir informações gerais ao cliente, como horário de funcionamento e tempo de preparo.
* **Tabela** - Para apresentar o cardápio digital de forma organizada e a comanda na cozinha.
* **Seleção múltipla** - Para permitir que o cliente monte seu pedido selecionando vários itens.
* **Número** - Para calcular e exibir o valor total do pedido.
* **Hora** - Para registrar e controlar o tempo de preparo na cozinha.
* **Caixa de texto** - Para conter a mensagem de notificação de que o pedido está pronto para retirada.

**Cliente entra no site e seleciona a opção de pedir o lanche**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Informações (Horário, Tempo de Preparo) | Área de texto | Leitura | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Fazer Pedido | Escolhe seu lanche e sua bebida | default |

**Escolhe seu lanche e sua bebida**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Cardápio Digital | Tabela | Leitura | |
| Itens Selecionados | Seleção múltipla | Pelo menos 1 item selecionado | |
| Valor Total | Número | Calculado automaticamente | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Confirmar e Enviar para Cozinha | Pedido aceito (evento de mensagem) | default |

**Funcionário responsável prepara o lanche**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Comanda do Pedido | Tabela | Leitura | |
| Tempo Estimado de Preparo | Hora | Leitura (ex: 00:40:00) | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Pedido Pronto | Pedido é entregue para o balcão | default |

**Comunica ao cliente que o pedido está pronto para a retirada**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Mensagem de "Pedido Pronto" | Caixa de texto | Leitura | "Seu pedido está pronto para retirada!" |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Notificar Cliente | Vai até o local para retirar e realizar o pagamento | default |
