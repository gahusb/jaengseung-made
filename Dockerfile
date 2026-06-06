# 쟁승메이드 Next.js — NAS self-host용 standalone 컨테이너
# 빌드는 로컬에서(NAS Celeron 빌드 금지). NEXT_PUBLIC_* 는 빌드타임 인라인이라 build-arg로 주입.
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY
ENV NEXT_TELEMETRY_DISABLED=1
# 빌드타임에만 필요한 더미(일부 route가 모듈 로드 시 env로 SDK 초기화 — 예: new Resend()).
# 런타임에는 env_file의 실제값이 사용되므로 무해.
ENV RESEND_API_KEY=re_build_dummy
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# next.config output:'standalone' 산출물
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
