# 使用官方 Node.js 18 镜像作为基础镜像
FROM node:18-alpine as base

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 和 pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制项目文件
COPY . .

# 构建应用
RUN pnpm build

# 生产环境镜像
FROM node:18-alpine as production

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 只安装生产依赖
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --frozen-lockfile

# 从构建环境复制构建产物
COPY --from=base /app/.next ./.next
COPY --from=base /app/public ./public

# 暴露端口
EXPOSE 3000

# 设置环境变量
ENV NODE_ENV production

# 启动应用
CMD ["pnpm", "start"]
