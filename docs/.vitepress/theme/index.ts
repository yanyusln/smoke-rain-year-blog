// 引入 Teek 主题及其样式
// Teek 是基于 VitePress 默认主题拓展的博客主题，提供侧边栏自动生成、分类、标签、归档等功能
import Teek, { TkLayout } from 'vitepress-theme-teek'
import 'vitepress-theme-teek/index.css'
import { h } from 'vue'
// 归档页贡献热力图组件（GitHub 风格，统计近一年每日发文数）
import ContributionChart from './components/ContributionChart.vue'
// 分类入口页头部组件（分类标题 + 描述 + query 自动补全）
import CategoryPageHeader from './components/CategoryPageHeader.vue'
// 文章底部版权标注组件（作者 / 链接 / 许可协议声明）
import ArticleCopyright from './components/ArticleCopyright.vue'

// ===== Teek 样式增强（需显式引入才会生效） =====
// 一级标题渐变色效果（用户明确要求的样式增强）
import 'vitepress-theme-teek/theme-chalk/tk-doc-h1-gradient.css'
// 鼠标悬停内容聚焦效果（spotlight hover，鼠标移动到哪高亮哪块内容）
import 'vitepress-theme-teek/theme-chalk/tk-spotlight-hover.css'
// 文章标题高亮效果（增强阅读体验）
import 'vitepress-theme-teek/theme-chalk/tk-article-heading-highlight.css'
// 首页卡片悬停效果增强（悬停时放大 + 阴影强化）
import 'vitepress-theme-teek/theme-chalk/tk-home-card-hover.css'
// Banner 描述文字渐变色（配合全屏壁纸效果更好）
import 'vitepress-theme-teek/theme-chalk/tk-banner-desc-gradient.css'
// 自定义全局样式覆盖（侧边栏标题单行省略号等，需放在 Teek 样式之后）
import './custom.css'

// 导出主题配置，extends 表示继承 Teek 主题的所有功能
export default {
  extends: Teek,
  // 自定义 Layout：在 Teek 布局基础上注入具名插槽
  Layout: () =>
    h(TkLayout, null, {
      // 归档页顶部插入贡献热力图
      'teek-archives-top-before': () => h(ContributionChart),
      // 分类入口页（前端/后端/工具）文章列表上方插入分类标题
      'teek-home-post-before': () => h(CategoryPageHeader),
      // 文章正文末尾（"最后更新时间"之前）插入版权标注
      'teek-doc-update-before': () => h(ArticleCopyright),
    }),
  // 全局注册自定义组件（页面 md 中也可通过 <ContributionChart /> 使用）
  enhanceApp({ app }) {
    app.component('ContributionChart', ContributionChart)
    app.component('CategoryPageHeader', CategoryPageHeader)
  },
}
