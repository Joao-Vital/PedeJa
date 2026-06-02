# Backend PedeJá (MySQL)

API em Node.js/Express para autenticação, carrinho de compras e pedidos do PedeJá, usando MySQL.

---

## 1. Pré‑requisitos

- **Node.js** 18+ (verifique com `node -v`)
- **npm** 9+ (`npm -v`)
- **MySQL** 8+ rodando localmente
- Acesso ao terminal / PowerShell no Windows

---

## 2. Configurar o banco de dados

1. Abra o terminal na raiz do projeto:

   ```powershell
   cd C:\Projetos\PedeJa\2025-2-p2-tiapn-pedeja
   ```

2. Tente executar o script SQL que cria o banco, tabelas e dados de exemplo via terminal:

   ```powershell
   mysql -u SEU_USUARIO -p < src\db\MyPedeJa.sql
   ```

   - O script cria o banco **PedeJa**.
   - Também cria um usuário demo (caso não queira criar um):
     - Email: `exemplo@pedeja.com`
     - Senha: `exmp123`
   - Também cria um usuário administrador padrão:
     - Email: `teste@pedeja.com`
     - Senha: `Senha@123`

3. **Se der erro no terminal**, você pode executar o script pelo **MySQL Workbench**:

   - Abra o MySQL Workbench.
   - Conecte na sua instância local.
   - Menu **File > Open SQL Script...** e selecione  
     `C:\Projetos\PedeJa\2025-2-p2-tiapn-pedeja\src\db\MyPedeJa.sql` ou apenas copie e cole.
   - Clique no ícone de raio (Execute) para rodar o script completo.
   - Verifique se o banco **PedeJa** foi criado na lista de Schemas.

## 3. Configurar variáveis de ambiente

1. Dentro da pasta do backend SQL Server/MySQL:

   ```powershell
   cd C:\Projetos\PedeJa\2025-2-p2-tiapn-pedeja\src\back-Carrinho
   ```

2. Copie o arquivo de exemplo:

   ```powershell
   copy .env.example .env
   ```

3. Edite o arquivo `.env` e ajuste as credenciais do MySQL:

   ```env
   # Banco de dados MySQL
   DB_HOST=localhost
   DB_PORT=3306
   DB_NAME=PedeJa
   DB_USER=pedeja        # ou root, se preferir
   DB_PASSWORD=Senha@123 # ou deixe vazio se o usuário não tiver senha

   # JWT / autenticação
   JWT_SECRET=uma_chave_secreta_segura_aqui
   JWT_EXPIRES_IN=1d

   # Porta do servidor HTTP
   PORT=3333
   ```

---

## 4. Instalar dependências

Na pasta `src\back-Carrinho`:

```powershell
cd C:\Projetos\PedeJa\2025-2-p2-tiapn-pedeja\src\back-Carrinho

# (opcional) limpar instalações anteriores
rd /s /q node_modules 2> NUL
del package-lock.json 2> NUL

# instalar as dependências necessárias
npm install express cors mysql2 dotenv bcryptjs jsonwebtoken
```

Se quiser instalar também as dependências de desenvolvimento (não obrigatório):

```powershell
npm install --save-dev nodemon
```

---

## 5. Subir o servidor

Ainda na pasta `src\back-Carrinho`:

```powershell
npm start
```

Se tudo estiver correto, você deverá ver algo como:

```text
[MySQL] Pool criado com sucesso.
Servidor rodando em http://localhost:3333
```

---

## 6. Rotas principais da API

Base URL: `http://localhost:3333`

### Autenticação

- `POST /api/auth/register`  
  Corpo: `{ "email": "...", "senha": "...", "confirmarSenha": "..." }`  
  Cria usuário e retorna token JWT.

- `POST /api/auth/login`  
  Corpo: `{ "email": "...", "senha": "..." }`  
  Retorna token JWT e dados básicos do usuário.

Usuário demo (se o script SQL foi executado):

- Email: `teste@pedeja.com`
- Senha: `Senha@123`

### Carrinho

Todas as rotas abaixo exigem header `Authorization: Bearer <token>`.

- `GET /api/cart`  
  Retorna carrinho ativo do usuário (itens e totais).

- `POST /api/cart/items`  
  Adiciona ou incrementa um item:  
  Corpo: `{ "produtoId": 1, "quantidade": 2 }`.

- `PATCH /api/cart/items/:itemId`  
  Atualiza quantidade de um item do carrinho.

- `DELETE /api/cart/items/:itemId`  
  Remove um item do carrinho.

### Pedidos

- `GET /api/orders/checkout`  
  Retorna resumo do carrinho para conferência antes do pedido.

- `POST /api/orders`  
  Finaliza pedido a partir do carrinho ativo.  
  Corpo: `{ "formaPagamento": "Cartão" }` (`"Pix"` ou `"Dinheiro"` também são aceitos).

- `GET /api/orders/latest`  
  Retorna o último pedido do usuário, com itens e histórico de status.

---

## 7. Erros comuns

- **`ER_ACCESS_DENIED_ERROR` (MySQL)**  
  Verifique `DB_USER` e `DB_PASSWORD` no `.env` e teste no terminal:

  ```powershell
  mysql -u pedeja -p
  ```

- **`ECONNREFUSED` ou `ENOTFOUND`**  
  Verifique se o serviço MySQL está em execução e se `DB_HOST`/`DB_PORT` estão corretos.