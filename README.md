
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
=======
# Vi-Notes

**Vi-Notes** is an authenticity verification platform designed to distinguish genuine human-written content from AI-generated or AI-assisted text. The system focuses on analyzing **writing behavior** alongside **statistical and linguistic characteristics** of the text to establish reliable authorship verification.

This repository represents the **design and conceptual foundation** for the Vi-Notes system.

---

## Motivation

With the widespread availability of AI writing tools, verifying true human authorship has become increasingly challenging. Most existing detection methods rely primarily on textual analysis, which can be inconsistent and easy to bypass.

Vi-Notes approaches this problem by combining:
- Behavioral signals from the writing process
- Statistical analysis of the written content
- Correlation between how content is written and what is written

---

## Core Idea

Human writing naturally includes:
- Variable typing speeds
- Pauses during thinking
- Revisions during idea formation
- Irregular sentence structures
- A relationship between content complexity and editing frequency

AI-generated or pasted text often lacks these behavioral signatures.

Vi-Notes is designed to capture and analyze these characteristics to assess authorship authenticity.

---

## Key Features

### Writing Session Monitoring
- Capture keystroke timing metadata (not raw key content)
- Track pauses, deletions, edits, and writing flow
- Detect pasted or externally inserted text blocks

### Behavioral Pattern Analysis
- Pause distribution before sentences and paragraphs
- Typing speed variance
- Revision frequency relative to text complexity
- Micro-pauses around punctuation and structural boundaries

### Textual Statistical Analysis
- Sentence length variation
- Vocabulary diversity metrics
- Stylistic consistency analysis
- Linguistic irregularities typical of human writing

### Cross-Verification Engine
- Correlate keyboard behavior with text evolution
- Identify mismatches between behavioral data and content
- Flag suspicious uniformity patterns

### Authenticity Reports
- Confidence score for human authorship
- Highlighted suspicious segments
- Supporting behavioral and textual indicators
- Shareable verification summaries

---

## Tech Stack (MERN Architecture)

### Frontend
- React
- TypeScript
- Electron for desktop-level keyboard event access

### Backend
- Node.js
- Express.js
- RESTful APIs for session handling and analysis

### Database
- MongoDB
- Encrypted storage for writing sessions, keystroke metadata, and reports

### Machine Learning
- TensorFlow / PyTorch
- Supervised learning for human vs AI-assisted writing
- Unsupervised anomaly detection
- NLP-based statistical signature analysis

---

## Privacy & Ethics

Vi-Notes is designed with privacy-first principles:

- No storage of raw keystroke content
- Only timing, frequency, and structural metadata is collected
- Encrypted data storage
- User-controlled session tracking
- Monitoring limited strictly to active writing sessions

---

## Project Goals

- Restore trust in written content authenticity
- Differentiate between human-written, AI-assisted, and AI-generated text
- Adapt detection methods as AI writing tools evolve
- Maintain ethical, transparent, and privacy-conscious verification

---

## Repository Scope

This repository currently serves as:
- A design reference
- A research and experimentation space
- A foundation for future MERN-based implementation

---

## Contributing

Contributions are welcome, especially for **feature requests and their implementation**.  
If you are interested in working on an existing feature request or proposing a new one, please open or comment on an issue to start the discussion.

---

## License

This project is licensed under the MIT License.

