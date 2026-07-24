# Interface — Marketplace de Moda Feminina

Este projeto já está ligado ao backend publicado em:
`https://famme-marketplace-backend.onrender.com`

## Como testar no teu computador (opcional)

1. `npm install`
2. `npm run dev`
3. Abre o endereço que aparecer no terminal (normalmente `http://localhost:5173`)

## Como publicar (Vercel)

1. Cria um novo repositório no GitHub chamado `femme-marketplace-frontend`
2. Faz upload de todos os ficheiros e pastas deste projeto para lá (incluindo a pasta `src`, com a mesma atenção que tiveste no backend, para as pastas não ficarem misturadas)
3. Vai a vercel.com, entra com a tua conta GitHub
4. Clica em "Add New… → Project", escolhe o repositório `femme-marketplace-frontend`
5. A Vercel deteta automaticamente que é um projeto Vite — não precisas de mudar nada nas definições
6. Clica em "Deploy"

Ao fim de um a dois minutos, a Vercel dá-te um endereço público, tipo `https://femme-marketplace-frontend.vercel.app` — esse já é o site final, pronto a partilhar.

## Nota sobre o backend gratuito

O backend na Render "adormece" após 15 minutos sem uso. Isto significa que a primeira pessoa a visitar o site depois de um tempo parado vai esperar entre 30 a 60 segundos até a loja carregar as peças. É normal, e resolve-se mais tarde ao mudar para um plano pago da Render.
