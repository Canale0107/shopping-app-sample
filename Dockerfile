# Development environment
FROM node:20-alpine
WORKDIR /app

# Install required libraries for Prisma and networking tools
RUN apk add --no-cache openssl netcat-openbsd

COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Copy entrypoint script and give execution permission
COPY entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["/app/entrypoint.sh"]
