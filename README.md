# Wearthly Frontend

Wearthly's Vite/React storefront and administration interface.

## Local development

```powershell
npm ci
npm run dev
```

Create `.env` from `.env.example` and set `VITE_API` to the backend API URL.

## Render deployment

Create a Render Static Site from this repository:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`
- Environment variable: `VITE_API`

The included `render.yaml` configures the same settings and adds an SPA
rewrite so React Router routes work after refresh.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
