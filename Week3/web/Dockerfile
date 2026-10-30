# Tier 1 (presentation) image. Slice 1 runs the Vite dev server; a production
# build (static files behind a CDN/Cloudflare) comes with the deploy slice.
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

COPY . .

EXPOSE 5173

# --host exposes the dev server on the container network.
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
