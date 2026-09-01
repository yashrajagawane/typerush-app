# Deploying to Vercel

This guide provides step-by-step instructions on how to deploy this React + Vite application to [Vercel](https://vercel.com).

## Prerequisites

1. A [GitHub](https://github.com), [GitLab](https://gitlab.com), or [Bitbucket](https://bitbucket.org) account.
2. A [Vercel](https://vercel.com) account (you can sign up using your Git provider).

## Step 1: Push your code to a Git Repository

Before deploying to Vercel, your code needs to be hosted in a Git repository.

1. Initialize a Git repository in your project folder if you haven't already:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   ```
2. Create a new repository on GitHub (or your preferred provider).
3. Push your code to the remote repository:
   ```bash
   git remote add origin <your-repository-url>
   git push -u origin main
   ```

## Step 2: Import the Project to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard).
2. Click the **"Add New..."** button and select **"Project"**.
3. Locate your Git repository in the list and click **"Import"**.

## Step 3: Configure Project Settings

Vercel is very smart and will automatically detect that you are using **Vite**. It will configure most of the settings for you. Verify that the settings look like this:

* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Install Command**: `npm install`

### Environment Variables

If your application uses the Gemini API, you must provide your API key securely to Vercel. 

1. Expand the **"Environment Variables"** section in the Vercel deployment configuration.
2. Add your environment variables:
   * **Name**: `VITE_GEMINI_API_KEY` (or `GEMINI_API_KEY` depending on your `.env` configuration)
   * **Value**: Paste your actual Gemini API key here.
3. Click **"Add"**.

## Step 4: Deploy

1. Click the **"Deploy"** button.
2. Vercel will now build and deploy your application. You will see a live build log.
3. Once finished, you will be redirected to a success screen with screenshots of your app and the live URL.

## Step 5: (Optional) Single Page Application (SPA) Routing

Because this app manages screens internally via a global state (Zustand store), you don't necessarily need advanced routing rules. However, if you ever implement standard browser routing (like React Router), you will need to tell Vercel to redirect all traffic to `index.html`.

To do this, create a file named `vercel.json` in the root of your project with the following content:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

## Continuous Integration (CI/CD)

Vercel automatically sets up CI/CD for you. Now, every time you push a new commit to your `main` branch, Vercel will automatically trigger a new deployment and update your live website. 

For pull requests, Vercel will generate temporary "Preview Deployments" so you can test changes before merging them into production.
