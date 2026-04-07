# VI Notes

VI Notes is a Vite + React + TypeScript app for real-time writing analysis.

The app has two screens: a **landing** page (`/landing`) and the **editor** with analytics (`/editor`). There is no login or account flow; open the editor from the landing page.

## Run In VS Code

### 1) Prerequisites
- Node.js 18+ (recommended: latest LTS)
- npm 9+

### 2) Install dependencies
```bash
npm install
```

### 3) Start development server
```bash
npm run dev
```

Open: [http://localhost:8080](http://localhost:8080)

## Useful scripts
- `npm run dev` - start dev server
- `npm run start` - alias for dev server
- `npm run test` - run tests once
- `npm run lint` - run ESLint
- `npm run build` - production build
- `npm run check` - lint + test + build

## Deploy

### Build locally
```bash
npm ci
npm run build
```

The production build is output to `dist/`.

### Vercel / Netlify
- **Build command**: `npm run build`
- **Output directory**: `dist`

### Static hosting (any)
Deploy the `dist/` folder.

## VS Code setup included
- Recommended extensions in `.vscode/extensions.json`
- Workspace settings in `.vscode/settings.json`
- Tasks in `.vscode/tasks.json`
- Launch config in `.vscode/launch.json`

### Quick start inside VS Code
- Press `Ctrl+Shift+B` and run **Run dev server**, or
- Open **Run and Debug** and start **VI Notes (Chrome)**.
