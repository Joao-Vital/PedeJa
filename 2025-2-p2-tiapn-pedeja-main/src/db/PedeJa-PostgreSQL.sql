-- Script de criação do banco PedeJa para PostgreSQL (Supabase)
-- Convertido de MySQL para PostgreSQL

-- Drop tables if exist
DROP TABLE IF EXISTS HistoricoStatusPedido CASCADE;
DROP TABLE IF EXISTS ItensPedido CASCADE;
DROP TABLE IF EXISTS Pedidos CASCADE;
DROP TABLE IF EXISTS ItensCarrinho CASCADE;
DROP TABLE IF EXISTS Carrinhos CASCADE;
DROP TABLE IF EXISTS Produtos CASCADE;
DROP TABLE IF EXISTS CategoriasProduto CASCADE;
DROP TABLE IF EXISTS PerfisUsuario CASCADE;
DROP TABLE IF EXISTS Usuarios CASCADE;
DROP TABLE IF EXISTS StatusPedido CASCADE;

-- Criar tabela Usuarios
CREATE TABLE Usuarios (
    UsuarioId      SERIAL PRIMARY KEY,
    Email          VARCHAR(255) NOT NULL UNIQUE,
    SenhaHash      VARCHAR(255) NOT NULL,
    SenhaSalt      VARCHAR(255) NULL,
    TipoUsuario    VARCHAR(20) NOT NULL DEFAULT 'cliente',
    PerfilCriado   BOOLEAN NOT NULL DEFAULT FALSE,
    Ativo          BOOLEAN NOT NULL DEFAULT TRUE,
    DataCadastro   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UltimoLogin    TIMESTAMP(3) NULL
);

-- Criar tabela PerfisUsuario
CREATE TABLE PerfisUsuario (
    PerfilId           SERIAL PRIMARY KEY,
    UsuarioId          INTEGER NOT NULL UNIQUE,
    PrimeiroNome       VARCHAR(80) NOT NULL,
    Sobrenome          VARCHAR(120) NOT NULL,
    CPF                CHAR(11) NULL UNIQUE,
    CEP                CHAR(8) NULL,
    Endereco           VARCHAR(255) NULL,
    Numero             VARCHAR(15) NULL,
    Complemento        VARCHAR(60) NULL,
    Telefone           VARCHAR(20) NULL,
    Instagram          VARCHAR(120) NULL,
    Facebook           VARCHAR(120) NULL,
    DataCriacao        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UltimaAtualizacao  TIMESTAMP(3) NULL,
    CONSTRAINT FK_PerfisUsuario_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (UsuarioId) ON DELETE CASCADE
);

-- Criar tabela CategoriasProduto
CREATE TABLE CategoriasProduto (
    CategoriaId    SERIAL PRIMARY KEY,
    Nome           VARCHAR(80) NOT NULL UNIQUE,
    Descricao      VARCHAR(255) NULL,
    Ativo          BOOLEAN NOT NULL DEFAULT TRUE
);

-- Criar tabela Produtos
CREATE TABLE Produtos (
    ProdutoId      SERIAL PRIMARY KEY,
    CategoriaId    INTEGER NULL,
    Nome           VARCHAR(150) NOT NULL,
    Descricao      VARCHAR(500) NULL,
    Preco          DECIMAL(10,2) NOT NULL CHECK (Preco >= 0),
    ImagemUrl      VARCHAR(255) NULL,
    Disponivel     BOOLEAN NOT NULL DEFAULT TRUE,
    CriadoEm       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    AtualizadoEm   TIMESTAMP(3) NULL,
    CONSTRAINT FK_Produtos_Categorias FOREIGN KEY (CategoriaId) REFERENCES CategoriasProduto (CategoriaId)
);

-- Criar tabela Carrinhos
CREATE TABLE Carrinhos (
    CarrinhoId     SERIAL PRIMARY KEY,
    UsuarioId      INTEGER NOT NULL,
    Status         VARCHAR(20) NOT NULL DEFAULT 'ativo' CHECK (Status IN ('ativo','convertido','abandonado')),
    CriadoEm       TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    AtualizadoEm   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_Carrinhos_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (UsuarioId) ON DELETE CASCADE
);

-- Criar tabela ItensCarrinho
CREATE TABLE ItensCarrinho (
    ItemCarrinhoId SERIAL PRIMARY KEY,
    CarrinhoId     INTEGER NOT NULL,
    ProdutoId      INTEGER NOT NULL,
    Quantidade     INTEGER NOT NULL CHECK (Quantidade > 0),
    PrecoUnitario  DECIMAL(10,2) NOT NULL CHECK (PrecoUnitario >= 0),
    Observacao     VARCHAR(200) NULL,
    AdicionadoEm   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_ItensCarrinho_Carrinhos FOREIGN KEY (CarrinhoId) REFERENCES Carrinhos (CarrinhoId) ON DELETE CASCADE,
    CONSTRAINT FK_ItensCarrinho_Produtos FOREIGN KEY (ProdutoId) REFERENCES Produtos (ProdutoId),
    CONSTRAINT UQ_ItensCarrinho_CarrinhoProduto UNIQUE (CarrinhoId, ProdutoId)
);

-- Criar tabela StatusPedido
CREATE TABLE StatusPedido (
    StatusId    SERIAL PRIMARY KEY,
    Nome        VARCHAR(30) NOT NULL UNIQUE,
    OrdemEtapa  INTEGER NOT NULL,
    Ativo       BOOLEAN NOT NULL DEFAULT TRUE
);

-- Criar tabela Pedidos
CREATE TABLE Pedidos (
    PedidoId          SERIAL PRIMARY KEY,
    CarrinhoId        INTEGER NULL,
    UsuarioId         INTEGER NOT NULL,
    FormaPagamento    VARCHAR(20) NOT NULL CHECK (FormaPagamento IN ('Cartão','Pix','Dinheiro')),
    StatusAtual       VARCHAR(30) NOT NULL CHECK (StatusAtual IN ('Aceito','Preparando','Pronto')),
    CodigoLocalizador CHAR(8) NOT NULL DEFAULT SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 25, 8),
    Observacoes       VARCHAR(300) NULL,
    Subtotal          DECIMAL(10,2) NOT NULL CHECK (Subtotal >= 0),
    TaxaServico       DECIMAL(10,2) NOT NULL DEFAULT 0 CHECK (TaxaServico >= 0),
    Total             DECIMAL(10,2) NOT NULL CHECK (Total >= 0),
    DataPedido        TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    DataAtualizacao   TIMESTAMP(3) NULL,
    CONSTRAINT FK_Pedidos_Usuarios FOREIGN KEY (UsuarioId) REFERENCES Usuarios (UsuarioId),
    CONSTRAINT FK_Pedidos_Carrinhos FOREIGN KEY (CarrinhoId) REFERENCES Carrinhos (CarrinhoId)
);

-- Criar tabela ItensPedido
CREATE TABLE ItensPedido (
    ItemPedidoId   SERIAL PRIMARY KEY,
    PedidoId       INTEGER NOT NULL,
    ProdutoId      INTEGER NOT NULL,
    NomeProduto    VARCHAR(150) NOT NULL,
    Quantidade     INTEGER NOT NULL CHECK (Quantidade > 0),
    PrecoUnitario  DECIMAL(10,2) NOT NULL CHECK (PrecoUnitario >= 0),
    Observacao     VARCHAR(200) NULL,
    CONSTRAINT FK_ItensPedido_Pedidos FOREIGN KEY (PedidoId) REFERENCES Pedidos (PedidoId) ON DELETE CASCADE,
    CONSTRAINT FK_ItensPedido_Produtos FOREIGN KEY (ProdutoId) REFERENCES Produtos (ProdutoId)
);

-- Criar tabela HistoricoStatusPedido
CREATE TABLE HistoricoStatusPedido (
    HistoricoId    SERIAL PRIMARY KEY,
    PedidoId       INTEGER NOT NULL,
    StatusPedido   VARCHAR(30) NOT NULL CHECK (StatusPedido IN ('Aceito','Preparando','Pronto')),
    Observacao     VARCHAR(200) NULL,
    RegistradoEm   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT FK_HistoricoStatusPedido_Pedidos FOREIGN KEY (PedidoId) REFERENCES Pedidos (PedidoId) ON DELETE CASCADE
);

-- Criar tabela Oficina
CREATE TABLE oficinas (
    ID_Oficina     SERIAL PRIMARY KEY,
    Titulo         VARCHAR(100) NOT NULL,
    Descricao      TEXT,
    Data           DATE NOT NULL,
    HoraInicio     TIME NOT NULL,
    HoraFim        TIME NOT NULL,
    Vagas          INT NOT NULL,
);

-- Criar índices
CREATE INDEX IX_Produtos_Categoria ON Produtos (CategoriaId);
CREATE INDEX IX_ItensCarrinho_Carrinho ON ItensCarrinho (CarrinhoId);
CREATE INDEX IX_ItensPedido_Pedido ON ItensPedido (PedidoId);
CREATE INDEX IX_Pedidos_StatusAtual ON Pedidos (StatusAtual);
CREATE INDEX IX_HistoricoStatusPedido_Pedido ON HistoricoStatusPedido (PedidoId, RegistradoEm DESC);

-- Índice único parcial para garantir apenas um carrinho ativo por usuário
CREATE UNIQUE INDEX UQ_Carrinhos_UsuarioAtivo
    ON Carrinhos (UsuarioId) WHERE Status = 'ativo';

-- Inserir dados iniciais
INSERT INTO StatusPedido (Nome, OrdemEtapa) VALUES
    ('Aceito', 1),
    ('Preparando', 2),
    ('Pronto', 3);

-- Inserir categorias
INSERT INTO CategoriasProduto (Nome, Descricao) VALUES
    ('Hambúrgueres Artesanais', 'Lanches autorais da casa.'),
    ('Acompanhamentos', 'Porções e molhos que acompanham os lanches.'),
    ('Bebidas', 'Refrescos artesanais e clássicos.'),
    ('Sobremesas Autorais', 'Doces frescos produzidos diariamente.');

-- Inserir produtos
INSERT INTO Produtos (CategoriaId, Nome, Descricao, Preco, ImagemUrl) VALUES
    (1, 'Classic Smash', 'Dois smash burgers 120g, queijo prato, picles e molho especial.', 32.90, NULL),
    (1, 'Brisket BBQ', 'Pão brioche, brisket defumado 12h, cheddar cremoso e barbecue da casa.', 39.50, NULL),
    (2, 'Batata Rústica com Páprica', 'Batatas assadas com páprica defumada e aioli cítrico.', 18.00, NULL),
    (3, 'Refrigerante Artesanal de Gengibre', '330ml - gaseificado, equilibrado e sem conservantes.', 12.00, NULL),
    (1, 'Truffle Melt', 'Smash burger 160g, queijo suíço, maionese trufada e cebola caramelizada.', 42.00, 'https://images.unsplash.com/photo-1550547660-d9450f859349'),
    (1, 'Veggie do Cerrado', 'Grão-de-bico, baru tostado, queijo minas e relish de pequi.', 34.50, 'https://images.unsplash.com/photo-1508739826987-b79cd8b7da12'),
    (2, 'Anéis de Cebola Defumados', 'Empanados leves com páprica, servidos com molho chipotle.', 22.00, 'https://images.unsplash.com/photo-1508737027454-e6454ef45afd'),
    (3, 'Mate da Casa com Limão Cravo', '500ml gelado, adoçado com melaço artesanal.', 14.00, 'https://images.unsplash.com/photo-1497534446932-c925b458314e'),
    (3, 'Soda de Hibisco e Framboesa', '330ml, levemente gaseificada e refrescante.', 16.00, 'https://images.unsplash.com/photo-1468465226960-8899e992537c'),
    (4, 'Cheesecake de Goiabada', 'Base amanteigada, creme leve e calda de goiabada cascão.', 21.00, 'https://images.unsplash.com/photo-1504674900247-0877df9cc836'),
    (4, 'Pudim de Dulce de Leche', 'Cremoso, com flor de sal e praliné de castanhas.', 19.00, 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0');

-- Inserir usuários de teste
INSERT INTO Usuarios (Email, SenhaHash, SenhaSalt, TipoUsuario, PerfilCriado, Ativo) VALUES
    ('teste@pedeja.com', '$2b$10$OL9S7vS4o.odOZj79jOFyOmtf21BNvPK5Twh26Y4601iQoMwqU/06', NULL, 'administrador', FALSE, TRUE),
    ('exemplo@pedeja.com', '$2b$10$ccAR29TiDd51LW20lSZ09uOyztILE0b9492bO5HPekZ.OmIhr6oqS', NULL, 'cliente', FALSE, TRUE);

-- Criar carrinhos para os usuários
INSERT INTO Carrinhos (UsuarioId, Status)
SELECT UsuarioId, 'ativo' FROM Usuarios WHERE Email IN ('teste@pedeja.com', 'exemplo@pedeja.com');

-- Alterando tabela da oficina
DROP TABLE IF EXISTS oficinas;

CREATE TABLE IF NOT EXISTS oficinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100),
    descricao TEXT,
    status VARCHAR(50),
    duracao VARCHAR(5) DEFAULT '00:00',
    isFavorito BOOLEAN DEFAULT FALSE
);