const {
  criarPost,
  atualizarPost,
  excluirPost
} = require('../controllers/postController');

const Post = require('../models/Post');

jest.mock('../models/Post');

describe('Testes Unitários - Post Controller', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ===============================
  // CRIAR POST
  // ===============================
  it('deve criar um post com sucesso', async () => {
    Post.prototype.save = jest.fn().mockResolvedValue({
      titulo: 'Post Teste',
      conteudo: 'Conteúdo Teste',
      autor: 'Alexandre'
    });

    const resultado = await criarPost({
      titulo: 'Post Teste',
      conteudo: 'Conteúdo Teste',
      autor: 'Alexandre'
    });

    expect(resultado.titulo).toBe('Post Teste');
    expect(resultado.autor).toBe('Alexandre');
  });

  it('deve lançar erro se campos obrigatórios não forem informados', async () => {
    await expect(criarPost({}))
      .rejects
      .toThrow('Campos obrigatórios');
  });

  // ===============================
  // ATUALIZAR POST
  // ===============================
  it('deve atualizar um post existente', async () => {
    Post.findByIdAndUpdate.mockResolvedValue({
      titulo: 'Post Atualizado'
    });

    const req = {
      params: { id: '123' },
      body: { titulo: 'Post Atualizado' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await atualizarPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });

  // ===============================
  // EXCLUIR POST
  // ===============================
  it('deve excluir um post existente', async () => {
    Post.findByIdAndDelete.mockResolvedValue({
      _id: '123'
    });

    const req = {
      params: { id: '123' }
    };

    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    await excluirPost(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalled();
  });
});