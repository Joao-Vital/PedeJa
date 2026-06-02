const profileRepository = require('../repositories/profileRepository');
const HttpError = require('../errors/HttpError');

async function createProfile(usuarioId, data) {
  // Verificar se já existe perfil
  const existingProfile = await profileRepository.findByUserId(usuarioId);
  if (existingProfile) {
    throw new HttpError(400, 'Usuário já possui perfil cadastrado');
  }

  // Validações básicas
  if (!data.nome || !data.sobrenome || !data.cpf || !data.cep || !data.endereco || !data.numero) {
    throw new HttpError(400, 'Campos obrigatórios não preenchidos');
  }

  const profileData = {
    usuarioId,
    nome: data.nome,
    sobrenome: data.sobrenome,
    cpf: data.cpf,
    cep: data.cep,
    endereco: data.endereco,
    numero: data.numero,
    complemento: data.complemento,
    telefone: data.telefone,
    instagram: data.instagram,
    facebook: data.facebook,
  };

  const perfilId = await profileRepository.createProfile(profileData);

  return {
    message: 'Perfil criado com sucesso',
    perfilId,
  };
}

async function getProfile(usuarioId) {
  const profile = await profileRepository.findByUserId(usuarioId);
  if (!profile) {
    throw new HttpError(404, 'Perfil não encontrado');
  }
  return profile;
}

async function updateProfile(usuarioId, data) {
  const existingProfile = await profileRepository.findByUserId(usuarioId);
  if (!existingProfile) {
    throw new HttpError(404, 'Perfil não encontrado');
  }

  await profileRepository.updateProfile(usuarioId, data);

  return {
    message: 'Perfil atualizado com sucesso',
  };
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};