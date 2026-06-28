# Diario Evolucao

Aplicacao full-stack para acompanhar objetivos, diario e entregas.

## Stack

- Frontend: React + Vite, pronto para Vercel.
- Backend: Express + MongoDB/Mongoose, pronto para Render.
- Auth: cadastro/login com JWT e senha criptografada com bcrypt.

## Rodar localmente

1. Instale dependencias:

```bash
npm install
```

2. Crie `.env` a partir de `.env.example` e configure:

```bash
VITE_API_URL=http://localhost:4000
PORT=4000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=um-segredo-forte
CLIENT_ORIGIN=http://localhost:5173
```

3. Rode frontend e backend:

```bash
npm run dev
```

Frontend: `http://localhost:5173`
API: `http://localhost:4000`

## Deploy

### Render

Crie um Web Service apontando para este repo ou use `render.yaml`.

Configure:

- `MONGODB_URI`: string de conexao do MongoDB Atlas.
- `JWT_SECRET`: segredo forte para assinar tokens.
- `CLIENT_ORIGIN`: URL final da Vercel, por exemplo `https://seu-app.vercel.app`.

### Vercel

Configure:

- Framework: Vite.
- Build command: `npm run build`.
- Output directory: `dist`.
- `VITE_API_URL`: URL publica da API no Render.
