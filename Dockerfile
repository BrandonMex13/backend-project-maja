FROM node:22-alpine AS build
WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY package*.json ./

RUN npm ci

COPY . .
RUN npm run build

RUN npm prune --omit=dev

FROM node:22-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/main.js"]
