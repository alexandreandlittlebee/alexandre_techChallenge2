
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

console.log("SERVIDOR INICIADO");

const app = express();
app.use(cors());
app.use((req, res, next) => {
  console.log("Requisição recebida:", req.method, req.url);
  next();
});
app.use(express.json());



mongoose.connect(
  process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/blog'
)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch(err => console.error('Erro ao conectar no MongoDB:', err));


const PostSchema = new mongoose.Schema(
  {
    titulo: String,
    conteudo: String,
    autor: String
  },
  { timestamps: true }
);

const Post = mongoose.model('Post', PostSchema);


app.get('/', (req, res) => {
  res.send('API do Blog rodando 🚀');
});

app.get('/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


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


app.post('/posts', async (req, res) => {
  try {
    const post = new Post(req.body);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});


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


app.listen(4000, () => {
  console.log('Servidor rodando na porta 4000');
});