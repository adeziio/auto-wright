# Use the official Playwright image
FROM mcr.microsoft.com/playwright:v1.52.0-jammy

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
