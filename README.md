# 烟雨流年的博客

基于 **VitePress + Teek 主题** 的开发难点 / 错误收集博客，
线上地址：https://yanyusln.github.io/smoke-rain-year-blog/

## 常用命令

```bash
npm run docs:dev      # 本地开发预览（http://localhost:5173）
npm run docs:build    # 构建生产版本（输出到 docs/.vitepress/dist）
npm run docs:preview  # 本地预览构建产物（http://localhost:4173）
npm run new -- 分类/序号.标题  # 生成新文章模板（自动填充 title/date/categories）
npm run deploy        # 一键部署：本地构建验证 + 自动提交 + 推送 master 触发部署
```

## ⚠️ 重要注意事项

### 1. 新增文章的正确流程（必须遵守）

推荐使用脚本生成文章模板（自动创建文件并填充 frontmatter）：

```bash
npm run new -- 前端/05.闭包陷阱
```

- 会在 `docs/前端/` 下创建 `05.闭包陷阱.md`，分类目录不存在时自动创建
- `title` 自动取文件名（去掉序号前缀），`date` 自动填当天，`categories` 按目录名推断
- 文件已存在时会拒绝覆盖，避免误伤已有文章

也可以手动在分类目录下新建 `.md` 文件，frontmatter 按下方规范手写全部字段。

### 2. 文章 frontmatter 规范

`npm run new` 生成的初始模板字段如下，`title`/`date`/`categories` 已自动填充，
`tags`、`description` 建议手动补充：

```yaml
---
title: 文章标题        # 自动取自文件名（去掉序号前缀）
date: 2026-10-07      # 自动填创建当天日期
categories:
  - 前端               # 自动取自所在分类目录名
tags: []              # 标签，按需手动填写
description: ''        # 一句话摘要（显示在文章卡片上）
---
```

### 3. 非文章页面必须加 `article: false`

功能页（`docs/@pages/` 下的分类/标签/归档/文章清单页）的 frontmatter
必须包含 `article: false`，否则会被当作文章显示在首页文章列表中。

### 4. 文章分类通过目录组织

文章按分类放在对应目录下（`docs/前端/`、`docs/后端/`、`docs/工具/`），
`autoFrontmatter` 插件会根据目录名自动给文章 frontmatter 写入 `categories` 分类。
每个分类目录下的 `index.md` 是分类入口页：使用 home 布局，**直接展示该分类的文章卡片列表**
（由 [CategoryPageHeader.vue](docs/.vitepress/theme/components/CategoryPageHeader.vue)
注入标题并自动补全 `?category=` query）。

**新增分类时需要做三件事**：

1. 新建分类目录 + 目录内 `index.md`（frontmatter 含
   `layout: home`、`categoriesPage: true`、`article: false`）
2. 在 [config.mts](docs/.vitepress/config.mts) 导航栏加入口，链接带 query，如
   `{ text: '新分类', link: '/新分类/?category=新分类' }`
3. 在 [CategoryPageHeader.vue](docs/.vitepress/theme/components/CategoryPageHeader.vue)
   的 `CATEGORY_META` 映射表中补充路径、标题与描述（⚠️ 漏配会导致分类页标题不显示）

### 5. 部署到 GitHub Pages

部署链路已全部配置完成，日常更新只需一条命令：

```bash
npm run deploy
```

执行逻辑：本地构建验证（失败则中断，不会推送）→ 自动提交所有变更（无变更则跳过）→
推送 `master` 分支 → GitHub Actions 自动构建并发布到
https://yanyusln.github.io/smoke-rain-year-blog/

关键配置（均已就绪，一般无需改动）：

- `base: '/smoke-rain-year-blog/'` 与 `SITE_URL`：见 [docs/.vitepress/config.mts](docs/.vitepress/config.mts)
- Pages 来源已选 **GitHub Actions**（仓库 Settings → Pages）
- 工作流定义：[.github/workflows/deploy.yml](.github/workflows/deploy.yml)（推送到 `master` 触发，也可在 Actions 页面手动触发）

### 6. 图片 / 图标素材

静态资源统一放在 `docs/public/img/` 下（logo、favicon、文章封面、首页横幅等），
替换同名文件即可生效；替换首页横幅后需同步修改
[docs/.vitepress/teekConfig.ts](docs/.vitepress/teekConfig.ts) 中 banner 的 `imgSrc` 列表。

## 目录结构说明

```
smoke-rain-year-blog/
├── docs/
│   ├── .vitepress/      # 站点配置（config.mts 主配置、teekConfig.ts 主题配置）
│   ├── @pages/          # 功能页（分类/标签/归档/文章清单），各插件自动忽略
│   ├── public/img/      # 静态资源（logo、favicon、图片素材）
│   ├── 前端/ 后端/ 工具/  # 分类目录（index.md 为入口页，文章按分类放入对应目录）
│   └── index.md         # 首页
├── scripts/             # 本地脚本（new-post.mjs：文章模板生成）
└── .github/workflows/   # GitHub Actions 部署工作流（deploy.yml）
```

## 已集成的插件

| 插件 | 用途 |
|------|------|
| vitepress-plugin-mermaid | Markdown 中绘制流程图 / 时序图 |
| vitepress-plugin-pagefind | 离线全文搜索 |
| vitepress-plugin-rss | RSS 订阅源（构建时生成 feed.rss） |
