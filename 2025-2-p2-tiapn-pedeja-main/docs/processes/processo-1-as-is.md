### PROCESSO AS IS 1 – Pedido do Cliente

O processo atual de pedido possui etapas sistêmicas e manuais. O cliente acessa o menu e faz o pedido, que é enviado à cozinha. Contudo, o cliente não tem visibilidade sobre o status em tempo real e a conclusão do processo (retirada ou descarte) é registrada internamente, sem uma comunicação proativa, gerando incerteza sobre o tempo de espera.

<img width="1036" height="714" alt="1Modelagem da situação atual  ( AS IS ) Pedidos" src="https://github.com/user-attachments/assets/49841ac3-019d-4602-83fd-48a15fb50bc5" />


#### Detalhamento das atividades

_Os tipos de dados a serem utilizados são:_

* **Tabela** - Para exibição do cardápio e da comanda do pedido para a cozinha.
* **Seleção múltipla** - Para o cliente escolher os itens que compõem seu pedido.
* **Área de texto** - Para o cliente poder adicionar observações ao pedido.
* **Número** - Para identificar o número único de cada pedido.
* **Seleção única** - Para a equipe definir o status final do pedido (retirada ou descarte).

**Fornece menu e opções de pedidos**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Cardápio | Tabela | Leitura | |
| Itens do Pedido | Seleção múltipla | Pelo menos 1 item selecionado | |
| Observações | Área de texto | Máximo de 200 caracteres | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Finalizar Pedido | Gateway (Finaliza/Cancela pedido) | default |
| Cancelar | Fim | cancel |

**Cozinha recebe pedido**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Comanda do Pedido | Tabela | Leitura | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Iniciar Preparo | Temporizador | default |

**Atualiza o status da tarefa**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Número do Pedido | Número | Obrigatório | |
| Status | Seleção única | (Pronto para retirada / Descartado) | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Salvar | Gateway (Retira/Descarta) | default |
