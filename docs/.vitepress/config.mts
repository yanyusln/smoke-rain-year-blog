// VitePress 站点主配置
// 该文件合并 Teek 主题配置与站点级配置（标题、base、nav、搜索、第三方插件等）
import { defineConfig } from 'vitepress'
import teekConfig from './teekConfig'
// 第三方 VitePress 插件
// withMermaid 会自动处理 mermaid 的依赖预构建（dayjs、sanitize-url 等）和 resolve.alias
import { withMermaid } from 'vitepress-plugin-mermaid'
import { pagefindPlugin } from 'vitepress-plugin-pagefind'
import { RssPlugin } from 'vitepress-plugin-rss'

// 站点基础信息配置
const SITE_URL = 'https://yanyusln.github.io'

// 构建基础配置（不含 mermaid，后续由 withMermaid 包装注入）
const baseConfig = defineConfig({
  // 展开 Teek 主题配置（不使用 extends，以便手动合并 vite.plugins 和 markdown.config）
  ...teekConfig,

  // ===== 站点级配置 =====
  title: '烟雨流年的博客', // 站点标题
  description: '记录日常开发中遇到的难点与错误，沉淀排查思路与解决方案', // 站点描述
  lang: 'zh-CN', // 语言
  base: '/smoke-rain-year-blog/', // 部署根路径（对应 GitHub Pages 子目录仓库）
  cleanUrls: true, // 启用简洁 URL（去除 .html 后缀）
  ignoreDeadLinks: true, // 忽略死链（永久链接插件需要）
  lastUpdated: true, // 显示最后更新时间

  // ===== 头部标签 =====
  head: [
    // 网站图标（SVG 格式，来自阿里矢量图标库）
    ['link', { rel: 'icon', href: '/img/favicon.svg' }],
    // 移动端 viewport
    [
      'meta',
      {
        name: 'viewport',
        content: 'width=device-width,initial-scale=1,minimum-scale=1.0,maximum-scale=1.0',
      },
    ],
    // 禁止谷歌翻译
    ['meta', { name: 'google', content: 'notranslate' }],
  ],

  // ===== Vite 配置 =====
  vite: {
    ...teekConfig.vite, // 继承 Teek 的 Vite 配置（含 SCSS、SSR 等）
    // 合并插件：Teek 内置插件 + 第三方插件（MermaidPlugin 由 withMermaid 自动注入）
    plugins: [
      ...(teekConfig.vite?.plugins || []),
      pagefindPlugin({
        // 离线全文搜索配置
        btnPlaceholder: '搜索',
        placeholder: '搜索文章...',
        emptyText: '未找到相关内容',
        loadingText: '搜索中...',
        forceLanguage: 'zh', // 强制中文索引
      }),
      RssPlugin({
        // RSS 订阅源配置
        baseUrl: SITE_URL,
        filename: 'feed.rss',
        ignoreHome: true, // 忽略首页
      }),
    ],
    build: {
      chunkSizeWarningLimit: 1500, // chunk 大小警告阈值（KB）
    },
    optimizeDeps: {
      // 预构建 mermaid 及其间接依赖（withMermaid 已处理 dayjs、sanitize-url 等）
      // mermaid 是 CommonJS 大包，必须预构建，否则内部 require 会失败
      include: ['mermaid', 'fastdom', 'fastdom/extensions/fastdom-promised'],
    },
    ssr: {
      ...teekConfig.vite?.ssr,
      // SSR 时不外部化相关依赖，避免导入错误
      noExternal: ['vitepress-theme-teek', 'dayjs'],
    },
  },

  // ===== Markdown 配置 =====
  markdown: {
    ...teekConfig.markdown, // 继承 Teek 的 Markdown 配置（含 todo、container、demo 等插件）
    lineNumbers: true, // 显示代码行号
    image: {
      lazyLoading: true, // 图片懒加载
    },
    container: {
      // 容器标签中文化
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息',
    },
    // 自定义 markdown 配置：调用 Teek 的插件注册（MermaidMarkdown 由 withMermaid 自动注入）
    config: (md) => {
      teekConfig.markdown?.config?.(md) // 调用 Teek 的 markdown 插件注册
    },
  },

  // ===== 主题配置（VitePress 默认主题 + Teek 扩展） =====
  themeConfig: {
    ...teekConfig.themeConfig, // 继承 Teek 的主题配置
    logo: '/img/logo.svg', // 导航栏 Logo
    // 导航栏配置
    // 分类入口直接指向各分类下的第一篇文章文件路径，点击直达文章详情页
    nav: [
      { text: '首页', link: '/' },
      { text: '前端', link: '/前端/01.Vue3响应式丢失问题' },
      { text: '后端', link: '/后端/02.Node.js内存泄漏排查' },
      { text: '工具', link: '/工具/03.Git合并冲突解决方法' },
      {
        text: '功能页',
        items: [
          // Teek 功能页，URL 由 @pages 下对应页面的 permalink 决定
          { text: '分类', link: '/categories' },
          { text: '标签', link: '/tags' },
          { text: '归档', link: '/archives' },
          { text: '文章清单', link: '/articleOverview' },
        ],
      },
    ],
    // 搜索配置（使用 pagefind 提供的本地搜索）
    search: {
      provider: 'local',
      options: {
        _render(src, env, md) {
          const html = md.render(src, env)
          if (env.frontmatter?.search === false) return ''
          return html
        },
      },
    },
    // 页面导航（右侧目录）
    outline: {
      level: [2, 3], // 显示 h2 和 h3 标题
      label: '页面导航',
    },
    // 上一页/下一页
    docFooter: {
      prev: '上一页',
      next: '下一页',
    },
    externalLinkIcon: true, // 外部链接显示图标
    lastUpdated: {
      text: '最后更新于',
      formatOptions: {
        dateStyle: 'short',
        timeStyle: 'medium',
      },
    },
    // 社交链接（RSS 插件需要此字段为数组，暂留空，后续可添加 GitHub 等）
    socialLinks: [],
  },
})

// 使用 withMermaid 包装配置，自动注入 MermaidPlugin、MermaidMarkdown 及依赖预构建
export default withMermaid(baseConfig)
