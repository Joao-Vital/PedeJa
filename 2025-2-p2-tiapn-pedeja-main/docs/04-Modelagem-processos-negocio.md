# Modelagem dos processos de negócio

## Modelagem da situação atual (Modelagem AS IS)

Atualmente, os processos da hamburgueria para receber e atender pedidos são realizados com etapas manuais e descentralizadas, o que gera gargalos e ineficiências. O fluxo de pedido e o atendimento ao cliente dependem de diferentes canais, como o Instagram, causando uma comunicação fragmentada e possíveis atrasos na produção e na entrega.

No cenário atual, para exemplificar essas ineficiências, foram selecionados dois processos principais no contexto de negócios da **Barto Hamburgueria**:

### 1. Processo de Pedido do Cliente
Este fluxo descreve o processo atual de pedidos, envolvendo o Cliente, o Atendente e a Cozinha.
   - Cliente: Inicia o processo e acessa o app (MenuDino) para selecionar o pedido.
   - Atendente: Fornece as opções de produtos (tarefa manual/de serviço) e informa o pedido à cozinha.
   - Cozinha: Inicia o preparo, que leva 30–40 minutos, e finaliza o pedido.
   - Atendente: Atualiza o status do produto e envia mensagem de atualização ao cliente.
   - Cliente: Recebe a atualização, retira o produto e o processo termina.
     
<img width="1036" height="714" alt="1Modelagem da situação atual  ( AS IS ) Pedidos" src="https://github.com/user-attachments/assets/05541e12-9e8d-4653-87d3-61db38afda13" />


### 2. Modelagem AS IS - Processo de Oficinas
Este fluxo descreve o processo atual de participação em oficinas, envolvendo um Voluntário e o Proprietário.
   - Voluntário: Demonstra interesse em participar da oficina.
   - Voluntário: Envia e-mail ou mensagem via Instagram (envia a solicitação).
   - Proprietário: Recebe o e-mail e entra em contato (para obter mais informações).
   - Proprietário: Coleta os dados e aguarda a resposta (do Voluntário) por um prazo de 3 dias.
   - Proprietário: O processo chega a um Gateway Exclusivo (Decisão):
       • Se não teve retorno → a solicitação é descartada e o processo termina.
       • Se recebeu a resposta → a solicitação é confirmada e uma mensagem é enviada.
   - Voluntário: Recebe a confirmação, com a data e o local, e o processo termina.
     
<img width="1097" height="596" alt="AS IS Oficinas" src="https://github.com/user-attachments/assets/04b012f2-b327-4d3c-8b27-4c36448cf4ff" />



## Descrição geral da proposta (Modelagem TO BE)

Após identificar os gargalos nos modelos AS-IS, a equipe propõe uma solução para otimizar e unificar o processo de pedidos, buscando maior eficiência com o uso da tecnologia. O fluxo manual e descentralizado de atendimento e a falta de visibilidade no processo de pedido serão substituídos por uma plataforma online centralizada.

Modelo TO BE - Pedido do Cliente

Este fluxo propõe um novo processo de pedido “Pede Já”, envolvendo o Cliente, o Atendente e a Cozinha.

   - Cliente: Inicia o processo (“Fome de hambúrguer”), entra no site e seleciona a opção de pedir o lanche.
     • O cliente visualiza informações como horário de funcionamento e tempo de preparo.
   - Cliente: Escolhe lanche e bebida.
   - Atendente: Recebe e aceita o pedido.
   - Cozinha: Prepara o lanche (40–60 minutos) e entrega no balcão.
   - Atendente: Comunica ao cliente que o pedido está pronto.
   - Cliente: Retira o pedido e realiza o pagamento (Fim).
     
<img width="1701" height="900" alt="1Desenho TO BE - Bartô ( Pede já ) Pedido" src="https://github.com/user-attachments/assets/1082671e-fd11-4e37-9930-2d33be3e0d15" />


Modelo TO BE - Painel de Oficinas

 Este fluxo propõe um novo processo de inscrição em oficinas, envolvendo o Candidato e o Dono da Associação.

   - Candidato: Demonstra interesse em participar de oficinas (Início), entra no site e seleciona a área de oficinas.
     • As oficinas terão nome, descrição e uma prévia de como serão realizadas.
   - Candidato: Escolhe a oficina, realiza o cadastro com nome, idade, e-mail e respostas objetivas.
   - Dono da Associação: Recebe a solicitação, analisa disponibilidade de datas e perfil do candidato.
   - Gateway Exclusivo (Decisão):
       • Se o perfil/datas forem coerentes → envia mensagem de confirmação.
       • Caso contrário → o candidato escolhe outra oficina/data.
   - Candidato: Confirma presença (após aceite).
   - Dono da Associação: Realiza a oficina (Fim).
     
<img width="1701" height="748" alt="Desenho TO BE - Oficinas" src="https://github.com/user-attachments/assets/bd49b7e9-d949-4b5c-a206-37cbc9a0b26d" />


A equipe propõe a implementação de um sistema online onde o cliente pode realizar todo o processo de forma autônoma e transparente. Com a nova solução, o cliente terá acesso a informações objetivas automatizando todo o processo após a confirmação, eliminando a necessidade de atendimento manual para tarefas repetitivas. Nosso objetivo é simplificar o fluxo de ponta a ponta, eliminando tarefas manuais desnecessárias e utilizando a tecnologia para tornar o processo de compra mais rápido e conveniente para o cliente, e mais eficiente para a operação da **Barto Hamburgueria**.

## Modelagem dos processos

[PROCESSO 1 AS IS - Pedido do Cliente](./processes/processo-1-as-is.md "Detalhamento do processo 1 AS IS.")

[PROCESSO 1 TO BE - Pedido do Cliente](./processes/processo-1-to-be.md "Detalhamento do processo 1 TO BE.")

[PROCESSO 2 AS IS - Atendimento das Oficinas](./processes/processo-2-as-is.md "Detalhamento do processo 2 AS IS.")

[PROCESSO 2 TO BE - Atendimento das Oficinas](./processes/processo-2-to-be.md "Detalhamento do processo 2 TO BE.")

## Indicadores de desempenho

A seguir, são apresentados 5 indicadores de desempenho (KPIs) chave para monitorar e avaliar a eficiência do novo processo de pedidos online da Barto Hamburgueria. As informações necessárias para gerar esses indicadores devem ser contempladas no diagrama de classes do sistema.

| **Indicador** | **Objetivos** | **Descrição** | **Fonte de dados** | **Fórmula de cálculo** |
| --- | --- | --- | --- | --- |
| **Tempo Médio de Preparo do Pedido** | Otimizar a eficiência da cozinha e reduzir o tempo de espera do cliente. | Mede o tempo médio, em minutos, entre a confirmação do pedido no sistema e o momento em que ele é marcado como "pronto para retirada". | Tabela `Pedidos` | `SOMA(data_hora_pronto - data_hora_confirmacao) / número total de pedidos` |
| **Índice de Satisfação do Cliente (CSAT)** | Medir a qualidade percebida do serviço e do produto, visando a fidelização. | Percentual de clientes que avaliaram sua experiência como "satisfeito" ou "muito satisfeito" em uma escala de avaliação. | Tabela `Avaliacoes` | `(Número de clientes satisfeitos / Número total de clientes que avaliaram) * 100` |
| **Taxa de Conversão de Pedidos Online** | Medir a eficácia e usabilidade da nova plataforma online em transformar visitantes em clientes. | Percentual de usuários que entram no site/app e finalizam um pedido com sucesso. | Tabela `Pedidos` e Logs de Acesso | `(Número de pedidos finalizados / Número total de sessões iniciadas no site) * 100` |
| **Ticket Médio por Pedido** | Aumentar a receita por cada transação realizada na plataforma. | Valor médio gasto por cliente em cada pedido individual. | Tabela `Pedidos` | `Valor total faturado / Número total de pedidos` |
| **Taxa de Erros nos Pedidos** | Reduzir falhas operacionais na montagem dos pedidos e aumentar a confiança do cliente. | Percentual de pedidos que tiveram alguma reclamação registrada por erro (item errado, item faltando, etc.). | Tabela `Reclamacoes` ou `Pedidos` | `(Número de pedidos com erro reportado / Número total de pedidos) * 100` |
