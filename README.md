# 烟雨流年的博客

基于 **VitePress + Teek 主题** 的开发难点 / 错误收集博客，部署在 GitHub Pages。

## 常用命令

```bash
npm run docs:dev      # 本地开发预览（http://localhost:5173）
npm run docs:build    # 构建生产版本（输出到 docs/.vitepress/dist）
npm run docs:preview  # 本地预览构建产物（http://localhost:4173）
```

## ⚠️ 重要注意事项

### 1. 新增文章的正确流程（必须遵守）

permalink（永久链接）由 `autoFrontmatter` 插件在 **dev 启动时** 自动写入文章 frontmatter，
而 `rewrites` 在配置加载时扫描已有 permalink 生成路由映射。因此：

```
新增文章 → 先运行 npm run docs:dev（写入 permalink）→ 再执行 npm run docs:build
```

如果直接 build 新文章，该文章不会生成 permalink 页面，链接会 404。

### 2. 文章 frontmatter 规范

在对应分类目录（如 `docs/前端/`）下新建 `.md` 文件，frontmatter 只需手写以下字段，
`date`、`permalink`、`categories` 会自动生成（无需手动填写）：

```yaml
---
title: 文章标题
tags:
  - 标签1
  - 标签2
description: 一句话摘要（显示在文章卡片上）
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

1. 首次部署前，修改 [docs/.vitepress/config.mts](docs/.vitepress/config.mts) 中的
   `SITE_URL` 为实际地址（`https://<你的用户名>.github.io`）
2. 修改 [docs/.vitepress/teekConfig.ts](docs/.vitepress/teekConfig.ts) 中的
   `blogger.name`、`blogger.slogan` 为个人信息
3. 推送代码到 GitHub 仓库 `<你的用户名>.github.io` 的 `main` 分支
4. 在仓库 **Settings → Pages → Source** 选择 **GitHub Actions**
5. 之后每次 push 到 `main` 分支都会自动构建部署

### 6. 图片 / 图标素材

素材的规格要求与替换方法见临时文档
[.trae/documents/素材需求清单.md](.trae/documents/素材需求清单.md)，
素材准备好后按文档指引替换即可。

## 目录结构说明

```
docs/
├── .vitepress/          # 站点配置（config.mts 主配置、teekConfig.ts 主题配置）
├── @pages/              # 功能页（分类/标签/归档/文章清单），各插件自动忽略
├── public/img/          # 静态资源（logo、favicon、图片素材）
├── 前端/ 后端/ 工具/     # 分类目录（index.md 为入口页，文章按分类放入对应目录）
└── index.md             # 首页
```

## 已集成的插件

| 插件 | 用途 |
|------|------|
| vitepress-plugin-mermaid | Markdown 中绘制流程图 / 时序图 |
| vitepress-plugin-pagefind | 离线全文搜索 |
| vitepress-plugin-rss | RSS 订阅源（构建时生成 feed.rss） |
