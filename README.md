# HackForge Website

HackForge event website for ACM Chapter NUML Lahore, built with Next.js App Router, TypeScript, Tailwind CSS v4, Firebase, Framer Motion, and Recharts.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy Firebase env template and fill values:
   ```bash
   cp .env.local.example .env.local
   ```
3. Run dev server:
   ```bash
   npm run dev
   ```

## Firebase Env Variables

Both `.env.local.example` and `.env` are included with empty placeholders:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

## Included Modules

- Public sections: Hero, About, Categories, Rules, Prizes, Timeline, Registration, FAQ, Contact, Footer
- Admin routes: `/admin/login` and `/admin/dashboard`
- Firestore rules: `firestore.rules`
- Vercel config: `vercel.json`

## Get Shit Done MCP

`mcp.json` has been added with:

```json
{
  "mcpServers": {
    "get-shit-done": {
      "command": "npx",
      "args": ["@xinyuzjj/get-shit-done-mcp"]
    }
  }
}
```

If your MCP client expects a different config file location, copy this block into that client config.
