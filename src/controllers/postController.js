const Post = require('../models/Post');

// ===============================
// CRIAR POST
// ===============================
const criarPost = async (dados) => {
  const { titulo, conteudo, autor } = dados;

  if (!titulo || !conteudo || !autor) {
    throw new Error('Campos obrigatórios');
  }

  const post = new Post({ titulo, conteudo, autor });
  return await post.save();
};

// ===============================
// ATUALIZAR POST
// ===============================
const atualizarPost = async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  return res.status(200).json(post);
};

// ===============================
// EXCLUIR POST
// ===============================
const excluirPost = async (req, res) => {
  const post = await Post.findByIdAndDelete(req.params.id);

  if (!post) {
    return res.status(404).json({ error: 'Post não encontrado' });
  }

  return res.status(200).json({ message: 'Post removido com sucesso' });
};

// 🔴 EXPORTAÇÃO CORRETA (ESSENCIAL)
module.exports = {
  criarPost,
  atualizarPost,
  excluirPost
};