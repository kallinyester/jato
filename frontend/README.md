# Jato Hub Frontend

## Requisitos
- Node.js 20+
- npm 9+
- Docker (opcional para produção)

## Instalação e Execução Local

```bash
cd frontend
npm install
cp .env.example .env # Edite VITE_API_URL se necessário
npm run dev
```
Acesse: http://localhost:5173

## Build para Produção

```bash
npm run build
```
Os arquivos finais estarão em `dist/`.

## Execução via Docker

```bash
docker compose up --build -d frontend
```
Acesse: http://localhost:3000

## Variáveis de Ambiente
- `VITE_API_URL`: URL do backend (ex: http://localhost:8000)

## Funcionalidades
- Login com autenticação JWT
- Dashboard com métricas em tempo real
- CRUD de projetos (criar, editar, excluir, visualizar)
- Filtros avançados (estágio, prioridade, cliente, tecnologia, nome)
- Notificações automáticas (sucesso, erro, prazos próximos)
- Visual moderno com Tailwind CSS

## Estrutura de Pastas
- `src/` - Código-fonte React
- `src/JatoHubDashboard.tsx` - Componente principal do dashboard
- `src/api.js` - Funções de integração com a API

## Observações
- O frontend espera que o backend esteja rodando e acessível na URL definida em `VITE_API_URL`.
- Para desenvolvimento, use o backend e frontend em containers Docker para ambiente completo.
