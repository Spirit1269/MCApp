# syntax=docker/dockerfile:1

# Build Node/Next.js frontend
FROM node:20 AS node-build
WORKDIR /app
COPY package.json yarn.lock ./
RUN npm install --frozen-lockfile
COPY . .
RUN npm run build

# Production image (optional: use node:20-slim or a static web server)
FROM node:20
WORKDIR /app
COPY --from=build /app ./
EXPOSE 3000
CMD ["npm", "start"]

# Copy built frontend assets (adapt these paths to your project)
COPY --from=node-build /lib ./lib
COPY --from=node-build /src/types ./types
COPY --from=node-build /node_modules ./node_modules
COPY --from=node-build /app/globals.css ./globals.css
COPY --from=node-build /app/layout.tsx ./layout.tsx
COPY --from=node-build /app/page.tsx ./page.tsx