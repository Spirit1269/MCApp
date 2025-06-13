# syntax=docker/dockerfile:1

FROM node:20 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Production image (can use node:20-slim for a smaller image)
FROM node:20
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]