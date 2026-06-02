# 🚀 Guia de Deploy - PedeJá

Este guia mostra como fazer o deploy do projeto **PedeJá** usando:
- **Frontend**: Vercel (gratuito)
- **Backend**: Render (gratuito)
- **Banco de Dados**: Supabase PostgreSQL (gratuito)

---

## 📋 Pré-requisitos

1. Conta no GitHub (para versionamento)
2. Conta no [Vercel](https://vercel.com)
3. Conta no [Render](https://render.com)
4. Conta no [Supabase](https://supabase.com)

---

## 🗄️ Passo 1: Configurar Banco de Dados no Supabase

### 1.1 Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Faça login com GitHub
3. Clique em **"New Project"**
4. Preencha:
   - **Name**: `pedeja-db`
   - **Database Password**: crie uma senha forte e **anote!**
   - **Region**: South America (São Paulo) ou escolha a mais próxima
   - **Pricing Plan**: Free
5. Clique em **"Create new project"** (aguarde 2-3 minutos)

### 1.2 Executar SQL no Supabase
1. No menu lateral, vá em **"SQL Editor"**
2. Clique em **"New query"**
3. Copie todo o conteúdo do arquivo **`src/db/PedeJa-PostgreSQL.sql`**
4. Cole no editor SQL
5. Clique em **"Run"** ou pressione `Ctrl+Enter`

> ✅ **Importante**: Use o arquivo `PedeJa-PostgreSQL.sql` (versão PostgreSQL), NÃO o `MyPedeJa.sql` (MySQL)

### 1.3 Obter Credenciais de Conexão

**IMPORTANTE**: Você precisa pegar as informações de conexão no Supabase. Siga estes passos:

#### Opção 1: Connection String Completa (Mais Fácil)
1. No seu projeto Supabase, no menu lateral esquerdo, clique no ícone de **engrenagem** ⚙️ para abrir **"Project Settings"**
2. No menu que aparece, clique em **"Database"**
3. Role a página para baixo até encontrar a seção **"Connection string"**
4. Você verá várias abas: **URI**, **Golang**, **JDBC**, etc.
5. Clique na aba **"URI"**
6. **ATIVE** o toggle **"Use connection pooling"** 
7. Selecione o modo **"Session"** no dropdown
8. Copie a string que aparece, será algo assim:
   ```
   postgresql://postgres.abcdefghijklmnop:[YOUR-PASSWORD]@aws-0-sa-east-1.pooler.supabase.com:5432/postgres
   ```
9. **Substitua `[YOUR-PASSWORD]`** pela senha que você criou no Passo 1.1
10. **Guarde essa string completa**, você vai usar no Render!

#### Opção 2: Credenciais Separadas (se precisar)
Se você preferir pegar cada informação separadamente:

1. Na mesma página **"Project Settings"** > **"Database"**
2. Role até a seção **"Connection parameters"**
3. Você verá:
   - **Host**: Copie (ex: `aws-0-sa-east-1.pooler.supabase.com`)
   - **Database name**: Sempre é `postgres`
   - **Port**: Sempre é `5432`
   - **User**: Copie (ex: `postgres.abcdefghijklmnop`)
   - **Password**: Use a senha que você criou no Passo 1.1

**📸 Onde encontrar:**
```
Supabase Dashboard
└── Seu Projeto (pedeja-db)
    └── ⚙️ Project Settings (ícone de engrenagem no menu lateral)
        └── Database (no submenu)
            └── Role para baixo
                ├── Connection string (URI com pooling)
                └── Connection parameters (dados separados)
```

**💡 Dica**: Se você esqueceu sua senha do banco de dados:
1. Vá em **"Project Settings"** > **"Database"**
2. Role até **"Database Password"**
3. Clique em **"Reset database password"**
4. Copie e guarde a nova senha geradai usai usar no Render!

---

## 🔧 Passo 2: Deploy do Backend no Render

### 2.1 Preparar o Código
1. Certifique-se de que o código está no GitHub
2. Faça commit de todas as alterações:
```bash
git add .
git commit -m "Preparando para deploy"
git push origin main
```

### 2.2 Criar Web Service
1. Acesse [render.com](https://render.com)
2. Clique em **"New"** > **"Web Service"**
3. Conecte seu repositório GitHub
4. Selecione o repositório **2025-2-p2-tiapn-pedeja**
5. Configure:
   - **Name**: `pedeja-backend`
   - **Region**: Oregon (US West)
   - **Branch**: `main`
   - **Root Directory**: `src/back`
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### 2.3 Adicionar Variáveis de Ambiente
Na seção **"Environment Variables"**, adicione:

```
DB_HOST=aws-0-sa-east-1.pooler.supabase.com
DB_USER=postgres.xxx
DB_PASS=sua_senha_supabase
DB_NAME=postgres
DB_PORT=5432
PORT=10000
NODE_ENV=production
```

> ⚠️ Substitua pelos valores da connection string do Supabase!
> 📝 O **DB_USER** inclui o prefixo `postgres.xxx`
> ⚠️ **IMPORTANTE**: Você precisará instalar o driver PostgreSQL (`pg`) no backend

6. Clique em **"Create Web Service"**
7. Aguarde o deploy (5-10 minutos)
8. Copie a URL gerada (ex: `https://pedeja-backend.onrender.com`)

---

## 🎨 Passo 3: Deploy do Frontend no Vercel

### 3.1 Atualizar URLs da API
Antes de fazer o deploy, você precisa atualizar as URLs da API no frontend:

1. Abra os arquivos JavaScript em `src/front/js/` ou `src/front/scripts/`
2. Encontre todas as chamadas de API (ex: `fetch('http://localhost:3000/api/...`)
3. Substitua por: `fetch('https://pedeja-backend.onrender.com/api/...`

**Exemplo:**
```javascript
// Antes
fetch('http://localhost:3000/api/produtos')

// Depois
fetch('https://pedeja-backend.onrender.com/api/produtos')
```

4. Salve e faça commit:
```bash
git add .
git commit -m "Atualizar URLs da API para produção"
git push origin main
```

### 3.2 Atualizar vercel.json
1. Edite o arquivo `vercel.json` na raiz do projeto
2. Substitua `seu-backend.onrender.com` pela URL real do Render:

```json
{
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://pedeja-backend.onrender.com/api/:path*"
    }
  ]
}
```

### 3.3 Deploy na Vercel
1. Acesse [vercel.com](https://vercel.com)
2. Clique em **"Add New"** > **"Project"**
3. Importe seu repositório do GitHub
4. Configure:
   - **Project Name**: `pedeja`
   - **Framework Preset**: Other
   - **Root Directory**: `./` (raiz)
   - **Build Command**: deixe vazio
   - **Output Directory**: `src/front`

5. Clique em **"Deploy"**
6. Aguarde 2-3 minutos
7. Acesse a URL gerada (ex: `https://pedeja.vercel.app`)

---

## ✅ Passo 4: Testar o Deploy

### 4.1 Testar Backend
Acesse no navegador:
```
https://pedeja-backend.onrender.com/api/produtos
```
Deve retornar JSON com produtos (ou array vazio).

### 4.2 Testar Frontend
1. Acesse: `https://pedeja.vercel.app`
2. Teste funcionalidades:
   - Cadastro de usuário
   - Login
   - Visualizar produtos
   - Adicionar ao carrinho

---

## 🔧 Comandos Úteis

### Atualizar o site após mudanças:
```bash
git add .
git commit -m "Descrição da alteração"
git push origin main
```

O Vercel e Render farão deploy automático!

---

## 🐛 Resolução de Problemas

### Backend não conecta ao banco
- Verifique as variáveis de ambiente no Render
- **IMPORTANTE**: Instale o driver PostgreSQL: `npm install pg`
- Atualize `database.js` para usar `pg` ao invés de `mysql2`
- Use porta 5432 (PostgreSQL padrão)
- Teste queries no SQL Editor do Supabase primeiro
- Supabase permite conexões de qualquer lugar

### Frontend não carrega dados
- Abra o Console do navegador (F12)
- Verifique se as URLs da API estão corretas
- Confirme que o backend está rodando

### Erro de CORS
Adicione no `server.js`:
```javascript
app.use(cors({
  origin: ['https://pedeja.vercel.app', 'http://localhost:3000'],
  credentials: true
}));
```

### Render fica "dormindo"
O plano gratuito do Render hiberna após 15 minutos de inatividade.
- Primeira requisição pode demorar 30-60 segundos
- Use um serviço de ping (ex: UptimeRobot) para manter ativo

---

## 💰 Custos

| Serviço | Plano Gratuito | Limites |
|---------|----------------|---------|  
| Vercel | Sim | 100GB bandwidth/mês |
| Render | Sim | 750h/mês, hiberna após 15min |
| Supabase | Sim | 500MB database, 2GB bandwidth |

**Total: R$ 0,00/mês** 🎉

---

## 📚 Links Úteis

- [Documentação Vercel](https://vercel.com/docs)
- [Documentação Render](https://render.com/docs)
- [Documentação Supabase](https://supabase.com/docs)
- [Supabase Node.js Connection](https://supabase.com/docs/guides/database/connecting-to-postgres)

---

## 🆘 Suporte

Se tiver problemas:
1. Verifique os logs no Render (Runtime Logs)
2. Verifique o console do navegador (F12)
3. Revise as variáveis de ambiente
4. Confirme que o projeto está ativo no Supabase
5. Teste queries SQL no SQL Editor do Supabase
6. **Certifique-se de ter instalado `pg`: npm install pg**

---

**Deploy criado com sucesso! 🚀**
