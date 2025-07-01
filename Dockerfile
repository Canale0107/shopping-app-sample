# Development environment
FROM node:20-alpine
WORKDIR /app

# Install required libraries for Prisma
RUN apk add --no-cache openssl

COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
EXPOSE 3000
CMD ["npm", "run", "dev"] 