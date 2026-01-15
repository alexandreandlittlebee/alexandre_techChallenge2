
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// 🔹 Conexão com MongoDB
mongoose.connect(
  process.env.MONGO_URL || 'mongodb://localhost:27017/blog'
)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));

// 🔹 Schema e Model
const PostSchema = new mongoose.Schema(
  {
    titulo: String,
    conteudo: String,
    autor: String
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);

// 🔹 Rota teste
app.get('/', (req, res) => {
  res.send('API do Blog rodando 🚀');
});

// ===============================
// 📌 ENDPOINTS REST
// ===============================

// 🔹 GET /posts — listar todos
app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 GET /posts/:id — post específico
app.get('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: 'ID inválido' });
  }
});

// 🔹 POST /posts — criar post
app.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 PUT /posts/:id — editar post
app.put('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 DELETE /posts/:id — excluir post
app.delete('/posts/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);

    if (!post) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json({ message: 'Post removido com sucesso' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// 🔹 GET /posts/search?q=texto — buscar posts
app.get('/posts/search', async (req, res) => {
  const { q } = req.query;

  try {
    const posts = await Post.find({
      $or: [
        { titulo: { $regex: q, $options: 'i' } },
        { conteudo: { $regex: q, $options: 'i' } }
      ]
    });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 🔹 Servidor
app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});