const profileService = require('../services/profileService');

async function createProfile(req, res, next) {
  try {
    const usuarioId = req.user.usuarioId; // Vem do middleware de autenticação
    const result = await profileService.createProfile(usuarioId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function getProfile(req, res, next) {
  try {
    const usuarioId = req.user.usuarioId;
    const profile = await profileService.getProfile(usuarioId);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function updateProfile(req, res, next) {
  try {
    const usuarioId = req.user.usuarioId;
    const result = await profileService.updateProfile(usuarioId, req.body);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
};