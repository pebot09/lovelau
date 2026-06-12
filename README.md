# lovelau 🤍

Retrospectiva interativa de namoro — presente de Dia dos Namorados.
Experiência linear e guiada: ela só avança, capítulo por capítulo.

**Stack:** React + Vite · Tailwind CSS · Framer Motion · Recharts · Web Audio API (todos os sons gerados por código, zero arquivos de áudio).

## Rodar local

```bash
npm install
npm run dev      # abre em http://localhost:5173/lovelau/
npm run build    # gera dist/
```

> Testar em 375px (iPhone SE) — é o dispositivo mais provável.

## Capítulos

| # | Capítulo | Conteúdo |
|---|----------|----------|
| 0 | Boot | Terminal digitando com bips + botão `[ iniciar ]` |
| 1 | Bumble | Card com swipe real (touch/mouse) → "É um Match!" |
| 2 | O Começo | Chat WhatsApp animado → vídeo → modal de trivia → gráfico de divergência |
| 3 | Você me conhece? | 3 jogos: quem disse isso (7 rodadas) · te amo primeiro · o que veio depois |
| 4 | A linguagem de vocês | Quiz (4 perguntas) + 6 painéis de dados |
| 5+ | _continua…_ | Caps 5, 6 e 7 chegam na próxima sessão |

Para adicionar um capítulo novo: criar `src/components/CapXX_Nome.jsx`
(recebe `onNext` como prop) e registrar no array `CHAPTERS` do `src/App.jsx`.

## ✋ Placeholders pendentes (Pedro)

Buscar por `PLACEHOLDER` no código:

1. **Foto do card Bumble** — `src/components/Cap01_Bumble.jsx` (trocar o bloco gradiente por `<img>`)
2. **Bio do card Bumble** — mesmo arquivo
3. **Vídeos** — colocar os `.mov` em `public/videos/` (ver `public/videos/README.md`). O Cap 2 usa `IMG_0574.mov`; sem o arquivo, o app mostra um placeholder e segue o fluxo.

## Deploy (GitHub Pages)

1. Uma vez só: **Settings → Pages → Source: GitHub Actions**
2. Push na `main` → o workflow `.github/workflows/deploy.yml` builda e publica
3. URL final: `https://pebot09.github.io/lovelau/`

## Dados

Tudo hardcoded em `src/data/data.js` (`DATA` + `PHOTOS`).
As fotos do Cloudinary já saem otimizadas (`w_800,q_auto,f_auto` injetado no path do CDN).
