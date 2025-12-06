--
-- 1. TABELA PRINCIPAL: usuarios
-- Armazena os dados básicos, de contato, endereço e status do usuário.
--
CREATE TABLE usuarios (
    -- Dados de Identificação e Autenticação
    id BIGINT PRIMARY KEY, -- Chave primária: usa o ID do JSON (1701552000000)
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL, 
    telefone VARCHAR(15),
    documento VARCHAR(14) UNIQUE, -- CPF (123.456.789-00)
    senha VARCHAR(255) NOT NULL, -- Hash da senha
    
    -- Dados Pessoais e Endereço
    sexo VARCHAR(20),
    data_nasc DATE, -- Ex: '1990-05-15'
    endereco VARCHAR(255),
    cidade VARCHAR(100),
    estado VARCHAR(2), -- Sigla da UF
    
    -- Dados de Sistema e Preferências 
    status VARCHAR(50) NOT NULL DEFAULT 'Ativo', 
    tipo_usuario VARCHAR(50) NOT NULL DEFAULT 'Cliente', 
    data_cadastro TIMESTAMP WITH TIME ZONE NOT NULL, -- Ex: '2023-12-02T10:30:00Z'
    
    -- Preferências (diretamente na tabela principal para campos simples)
    newsletter BOOLEAN NOT NULL DEFAULT TRUE,
    notificacoes_push BOOLEAN NOT NULL DEFAULT TRUE,
    idioma VARCHAR(10) NOT NULL DEFAULT 'pt-BR',
    nivel_experiencia VARCHAR(50) -- Ex: 'Intermediário'
);

--
-- 2. TABELA DE RELAÇÃO: usuario_afinidades
-- Armazena as afinidades/interesses do usuário (relação 1:N).
--
CREATE TABLE usuario_afinidades (
    id SERIAL PRIMARY KEY,
    usuario_id BIGINT NOT NULL, -- Chave Estrangeira
    afinidade VARCHAR(100) NOT NULL, -- Ex: 'Desenvolvimento Web'
    
    -- Restrição para garantir que um usuário não tenha a mesma afinidade duplicada
    UNIQUE (usuario_id, afinidade), 
    
    -- Definição da Chave Estrangeira
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE -- Remove a afinidade se o usuário for deletado
);

--
-- 3. TABELA DE RELAÇÃO: usuario_formacao
-- Armazena os registros de formação do usuário (relação 1:N).
--
CREATE TABLE usuario_formacao (
    id SERIAL PRIMARY KEY, 
    usuario_id BIGINT NOT NULL, -- Chave Estrangeira
    instituicao VARCHAR(150) NOT NULL,
    curso VARCHAR(150) NOT NULL,
    nivel VARCHAR(50), 
    status VARCHAR(50) NOT NULL, 
    ano_conclusao INT, -- Pode ser NULL se ainda estiver em andamento
    
    -- Definição da Chave Estrangeira
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
        ON DELETE CASCADE
);

-- Índices para otimizar consultas
CREATE INDEX idx_afinidade_usuario ON usuario_afinidades (usuario_id);
CREATE INDEX idx_formacao_usuario ON usuario_formacao (usuario_id);