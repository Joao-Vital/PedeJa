### PROCESSO 2 TO BE – Painel de Oficinas

Nesta proposta, o processo de inscrição em oficinas é automatizado. O candidato se cadastra e escolhe uma oficina pelo site. O sistema analisa o perfil e a disponibilidade de datas. Se os critérios forem atendidos, a vaga é reservada e o candidato é notificado; caso contrário, ele é instruído a escolher outra opção, tornando o processo mais ágil e organizado.

<img width="1701" height="748" alt="Desenho TO BE - Oficinas" src="https://github.com/user-attachments/assets/cd844dc2-029c-49f8-8f98-8d4b705fa6d7" />


#### Detalhamento das atividades

_Os tipos de dados a serem utilizados são:_

* **Caixa de texto** - Para preenchimento de nome e e-mail no formulário de cadastro.
* **Número** - Para preenchimento do campo de idade.
* **Data** - Para o candidato selecionar a data de preferência para a oficina.
* **Seleção única** - Para escolher a oficina de interesse e para a análise interna do perfil do candidato.
* **Tabela** - Para a visualização consolidada dos dados do candidato e dos critérios da oficina.
* **Área de texto** - Para exibir a mensagem de confirmação de inscrição ao usuário.

**Realiza seu cadastro**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Nome Completo | Caixa de texto | Obrigatório | |
| E-mail | Caixa de texto | Formato de e-mail válido, obrigatório | |
| Idade | Número | Apenas números inteiros | |
| Oficina de Interesse | Seleção única | Obrigatório | |
| Data de Preferência | Data | Obrigatório | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Enviar Inscrição | Recebe a solicitação | default |

**Analisa o perfil do candidato**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Dados do Candidato | Tabela | Leitura | |
| Critérios da Oficina | Tabela | Leitura | |
| Perfil Coerente | Seleção única | (Sim / Não) | |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| Confirmar Análise | Gateway (decisão de perfil) | default |

**Envia mensagem ao usuário (Confirmação)**

| **Campo** | **Tipo** | **Restrições** | **Valor default** |
| :--- | :--- | :--- | :--- |
| Mensagem de Confirmação | Área de texto | Leitura | "Seu cadastro foi aprovado! Em breve você receberá os detalhes." |

| **Comandos** | **Destino** | **Tipo** |
| :--- | :--- | :--- |
| OK | Reserva a vaga | default |
