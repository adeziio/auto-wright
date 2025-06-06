[DEMO](https://auto-wright.onrender.com/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, in a terminal:

```bash
npm run dev
```

Then, in another terminal:

```bash
node src/lib/worker.js
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Render

Log in to [Render](https://render.com/) and Create a New Web Service

1. Go to Render Dashboard → New + → Web Service
2. Select your GitHub repo: auto-wright
3. Set Configs:
- Environment | Docker
- Dockerfile path | Dockerfile (default)
- Branch | master (or whichever you're using)
- Root Directory | leave empty unless you used a subdir
- Name | auto-wright
- Region | Closest to you

## Docker

```bash
docker-compose down --volumes --remove-orphans
docker-compose up --build
```

