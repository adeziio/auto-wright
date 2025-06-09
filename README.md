[DEMO](https://auto-wright.onrender.com/)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Terminal 1:

```bash
npm run dev
```

Terminal 2:

```bash
node src/lib/worker.js
```

Alternatively, in a single Terminal:

```bash
npm run build
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

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

