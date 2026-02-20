# 1. Imagen base para instalar dependencias
FROM node:20-alpine AS deps
WORKDIR /app

# Copiamos package.json y lockfile
COPY package.json package-lock.json* ./

# Instalamos dependencias (incluyendo las de desarrollo para que el build funcione)
RUN npm ci --legacy-peer-deps

# 2. Imagen para construir el proyecto (Builder)
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Deshabilitamos telemetría de Next.js
ENV NEXT_TELEMETRY_DISABLED=1

# Argumentos de construcción (Las variables de entorno de Easypanel se pasan aquí)
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

# Ejecutamos el build (Aquí es donde te daba el error 127, ahora funcionará)
RUN npm run build

# 3. Imagen final para producción (Runner)
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 perriolidesarrollando140612

RUN adduser --system --uid 1001 perriolidesarrollando140612

# --- PERMISOS ---
COPY --from=builder --chown=perriolidesarrollando140612:perriolidesarrollando140612 /app/public ./public
COPY --from=builder --chown=perriolidesarrollando140612:perriolidesarrollando140612 /app/.next/standalone ./
COPY --from=builder --chown=perriolidesarrollando140612:perriolidesarrollando140612 /app/.next/static ./.next/static

USER perriolidesarrollando140612

EXPOSE 3000

ENV PORT=3000

ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]