Para visualizar os artefatos de Oficina deve digitar os seguintes comandos:
cd src/back

node server-oficina.js

http://localhost:3000/Cadastro-Oficina.html

Para visualizar os artefatos de Oficina deve digitar os seguintes comandos:
cd src/back

node server-oficina.js

http://localhost:3000/Cadastro-Oficina.html

---

## Instruções para visualizar Login, Cadastro e Perfil:

1- Baixar e executar o aplicativo Xampp 

2- Ativar o MySQL e o Apache (devem ficar verdes os dois)

3- Importar o banco de dados:
   - Abrir http://localhost/phpmyadmin
   - Clicar em **Import** (Importar)
   - Escolher o arquivo `src/db/MyPedeJa.sql`
   - Clicar em **Go** (Executar)

4- Configurar o arquivo `.env` na pasta `src/back-Carrinho`:
```env
DB_HOST=localhost
DB_PORT=3306
DB_NAME=dbpedeja
DB_USER=root
DB_PASSWORD=
JWT_SECRET=minha_chave_secreta_minimo_32_caracteres_aqui
PORT=3333
```

5- Abrir o Visual Studio Code na pasta (2025-2-p2-tiapn-pedeja)

6- Digitar no terminal os comandos:
```bash
cd src/back-Carrinho
```
Depois
```bash
npm install
```
Depois
```bash
npm start
```

7- Agora só digitar os seguintes nomes em alguma página (Google, Microsoft Edge e entre outros):

http://localhost:3333/Login.html

http://localhost:3333/Cadastro.html

http://localhost:3333/CadastroPerfil.html