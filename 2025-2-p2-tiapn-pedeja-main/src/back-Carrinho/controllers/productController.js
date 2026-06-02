const fs = require('fs');
const path = require('path');
const productRepository = require('../repositories/productRepository');

const PUBLIC_UPLOAD_SUBPATH = '/uploads/produtos';
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads', 'produtos');

function buildPublicPath(filename) {
  if (!filename) return null;
  return `${PUBLIC_UPLOAD_SUBPATH}/${filename}`;
}

function toResponse(produto) {
  if (!produto) return null;
  return {
    id: produto.id,
    ProdutoId: produto.id,
    nome: produto.nome,
    Nome: produto.nome,
    descricao: produto.descricao,
    Descricao: produto.descricao,
    preco: produto.preco,
    Preco: produto.preco,
    foto: produto.foto,
    ImagemUrl: produto.foto,
    categoria: produto.categoria,
    Categoria: produto.categoria,
    categoriaId: produto.categoriaId,
    CategoriaId: produto.categoriaId,
    disponivel: produto.disponivel,
    Disponivel: produto.disponivel,
    criadoEm: produto.criadoEm,
    atualizadoEm: produto.atualizadoEm,
  };
}

function deleteFileIfExists(publicPath) {
  if (!publicPath || !publicPath.startsWith(PUBLIC_UPLOAD_SUBPATH)) {
    return;
  }

  const fileName = path.basename(publicPath);
  const filePath = path.join(UPLOAD_DIR, fileName);

  if (fs.existsSync(filePath)) {
    fs.unlink(filePath, (err) => {
      if (err) {
        console.warn('Erro ao remover imagem antiga:', err.message);
      }
    });
  }
}

async function listProducts(req, res, next) {
  try {
    const { categoria } = req.query;

    const produtos = categoria
      ? await productRepository.listByCategory(categoria)
      : await productRepository.listAll();

    res.json(produtos.map(toResponse));
  } catch (error) {
    next(error);
  }
}

async function getProductById(req, res, next) {
  try {
    const id = Number(req.params.id);
    const produto = await productRepository.findById(id);

    if (!produto) {
      return res.status(404).json({ message: 'Produto não encontrado' });
    }

    res.json(toResponse(produto));
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { nome, preco, categoria, descricao } = req.body;

    if (!nome || !preco) {
      return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
    }

    const duplicated = await productRepository.findDuplicateByName(nome);
    if (duplicated) {
      if (req.file) {
        deleteFileIfExists(buildPublicPath(req.file.filename));
      }
      return res.status(409).json({ error: 'Já existe um produto com este nome.' });
    }

    const imagemUrl = req.file ? buildPublicPath(req.file.filename) : null;

    const produto = await productRepository.createProduct({
      nome,
      descricao,
      preco: Number(preco),
      categoriaNome: categoria,
      imagemUrl,
    });

    res.status(201).json(toResponse(produto));
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const produtoId = Number(req.params.id);
    const { nome, preco, categoria, descricao, fotoAtual } = req.body;

    if (!produtoId) {
      return res.status(400).json({ error: 'ID do produto inválido.' });
    }

    const existente = await productRepository.findById(produtoId, true);
    if (!existente) {
      if (req.file) {
        deleteFileIfExists(buildPublicPath(req.file.filename));
      }
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    const duplicado = await productRepository.findDuplicateByName(nome, produtoId);
    if (duplicado) {
      if (req.file) {
        deleteFileIfExists(buildPublicPath(req.file.filename));
      }
      return res.status(409).json({ error: 'Já existe um produto com este nome.' });
    }

    let imagemUrl = fotoAtual || existente.foto || null;

    if (req.file) {
      const novaImagem = buildPublicPath(req.file.filename);
      if (imagemUrl && imagemUrl !== novaImagem) {
        deleteFileIfExists(imagemUrl);
      }
      imagemUrl = novaImagem;
    }

    const produtoAtualizado = await productRepository.updateProduct(produtoId, {
      nome,
      descricao,
      preco: Number(preco),
      categoriaNome: categoria,
      imagemUrl,
    });

    res.json(toResponse(produtoAtualizado));
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const produtoId = Number(req.params.id);
    if (!produtoId) {
      return res.status(400).json({ error: 'ID do produto inválido.' });
    }

    const existente = await productRepository.findById(produtoId, true);
    if (!existente) {
      return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    await productRepository.deleteProduct(produtoId);
    deleteFileIfExists(existente.foto);

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
