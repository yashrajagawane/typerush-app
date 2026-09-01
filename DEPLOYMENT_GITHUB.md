# Deploying to GitHub Pages

This guide provides step-by-step instructions on how to deploy this React + Vite application to GitHub Pages using GitHub Actions.

⚠️ **SECURITY WARNING regarding API Keys** ⚠️
GitHub Pages only hosts static frontend files. It does not have a backend server. If you use the Gemini API (or any other paid API), your API key will be exposed in the frontend code. **Anyone can inspect the code and steal your key.** If you need to keep API keys secure, use a platform with backend serverless functions like Vercel or Render instead.

---

## Step 1: Update your Vite Configuration

When deploying to a GitHub Pages repository (e.g., `https://your-username.github.io/your-repo-name/`), Vite needs to know the base URL so it links your CSS and JavaScript files correctly.

Open your `vite.config.ts` file and add the `base` property matching your GitHub repository name:

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  // REPLACE 'Typing-Speed-game' with your actual GitHub repository name!
  base: '/Typing-Speed-game/', 
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

## Step 2: Create the GitHub Actions Workflow

We will use GitHub Actions to automatically build and deploy your site every time you push to the `main` branch.

1. Inside your project folder, create a new directory path: `.github/workflows/`
2. Inside that folder, create a file named `deploy.yml`.
3. Add the following configuration to `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  # Runs on pushes targeting the default branch
  push:
    branches: ["main"]
  # Allows you to run this workflow manually from the Actions tab
  workflow_dispatch:

# Sets permissions of the GITHUB_TOKEN to allow deployment to GitHub Pages
permissions:
  contents: read
  pages: write
  id-token: write

# Allow only one concurrent deployment, skipping runs queued between the run in-progress and latest queued.
concurrency:
  group: "pages"
  cancel-in-progress: true

jobs:
  # Build job
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  # Deployment job
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    needs: build
    runs-on: ubuntu-latest
    name: Deploy
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Step 3: Push to GitHub

Commit your changes and push them to your GitHub repository:

```bash
git add .
git commit -m "Add GitHub Pages deployment workflow"
git push origin main
```

## Step 4: Configure GitHub Settings

1. Go to your repository on GitHub.
2. Click on the **Settings** tab.
3. In the left sidebar, click on **Pages**.
4. Under the **Build and deployment** section, look for the **Source** dropdown.
5. Change the source from "Deploy from a branch" to **"GitHub Actions"**.

## Step 5: Watch it Deploy!

1. Go to the **Actions** tab in your GitHub repository.
2. You should see your "Deploy to GitHub Pages" workflow running.
3. Once it finishes and turns green, go back to the **Settings > Pages** tab to find your live website URL!
