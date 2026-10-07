// Teek 主题专属配置
// 该文件定义 Teek 主题的各项功能：Banner、博主信息、文章列表、分类、标签、侧边栏自动生成等
import { defineTeekConfig } from 'vitepress-theme-teek/config'

/**
 * Teek 主题配置
 * 所有配置项均为可选，这里只配置博客常用的核心功能
 */
const teekConfig = defineTeekConfig({
  // ===== 基础开关 =====
  teekTheme: true, // 启用 Teek 主题全部功能
  teekHome: true, // 启用 Teek 博客风格首页
  vpHome: false, // 不使用 VitePress 默认首页风格

  // ===== 首页 Banner 配置（全屏壁纸风格，仿 Teek 官方示例站） =====
  banner: {
    enabled: true, // 启用 Banner
    name: '烟雨流年的博客', // Banner 标题
    bgStyle: 'fullImg', // 背景风格：pure 纯色 / partImg 局部图片 / fullImg 全屏壁纸
    // 全屏壁纸图片（数组可多张轮播）。当前为占位图，替换方法见 .trae/documents/素材需求清单.md
    imgSrc: [
      '/img/banner/banner-1.webp',
      '/img/banner/banner-2.webp',
      '/img/banner/banner-3.webp',
    ],
    imgInterval: 15000, // 多图切换间隔（毫秒）
    imgShuffle: false, // 按顺序切换（true 为随机）
    imgWaves: true, // 开启全屏 Banner 底部波浪纹（官方站同款效果）
    mask: true, // 开启图片遮罩（保证文字可读性）
    maskBg: 'rgba(0, 0, 0, 0.55)', // 遮罩颜色（透明度 0.55，兼顾背景可见性与文字可读性）
    textColor: '#ffffff', // 文字颜色
    descStyle: 'types', // 描述风格：default 纯文字 / types 打字效果 / switch 切换效果
    description: [
      '记录日常开发中遇到的难点与错误',
      '沉淀排查思路与解决方案',
      '让每一次踩坑都成为成长的阶梯',
    ],
    typesInTime: 120, // 打字速度（毫秒/字）
    typesOutTime: 60, // 删字速度（毫秒/字）
    typesNextTime: 1200, // 打字与删字间隔（毫秒）
    // Banner 特性列表（bgStyle 为 fullImg 全屏时不显示，仅 partImg 局部模式显示）
    features: [
      { title: '前端开发', details: 'Vue / React / 工程化等问题记录', link: '/前端/' },
      { title: '后端开发', details: 'Node.js / Java / 数据库等问题记录', link: '/后端/' },
      { title: '开发工具', details: 'Git / VSCode / 构建工具等问题记录', link: '/工具/' },
    ],
  },

  // ===== 博主信息（首页侧边卡片） =====
  blogger: {
    name: '烟雨流年', // 博主昵称（版权标注、文章卡片等处引用）
    slogan: '代码虐我千百遍，我待代码如初恋', // 个性签名
    avatar: '/img/avatar.jpg', // 头像地址，暂留空，后续替换
    shape: 'circle', // 头像形状：square 方形 / circle 圆形 / circle-rotate 悬停旋转
  },

  // ===== 文章列表配置 =====
  post: {
    postStyle: 'list', // 列表风格：list 列表（长方形横向卡片，左右交替封面）/ card 卡片
    coverImgMode: 'full', // 封面图模式：small 小图 / full 全宽
    showCapture: true, // 自动截取前 300 字符作为摘要
    moreLabel: '阅读全文 >', // 更多按钮文字
    defaultCoverImg: ['/img/cover/default-cover.webp'], // 默认封面图地址，暂留空，后续替换
  },

  // ===== 分类卡片配置 =====
  category: {
    title: '分类', // 卡片标题
  },

  // ===== 标签卡片配置 =====
  tag: {
    title: '标签', // 卡片标题
  },

  // ===== 精选文章配置 =====
  topArticle: {
    title: '精选文章', // 卡片标题
  },

  // ===== 站点信息卡片配置 =====
  docAnalysis: {
    title: '站点信息', // 卡片标题
    statistics: {
      provider: 'local', // 统计来源：local 本地统计（无需第三方）
    },
  },

  // ===== 内置 Vite 插件配置 =====
  vitePlugins: {
    // 侧边栏自动生成插件配置
    sidebar: true, // 启用侧边栏自动生成
    sidebarOption: {
      path: '.', // 文章所在目录（基于 docs 根目录，'.' 表示 docs 根目录下的所有 md）
      type: 'object', // 侧边栏类型：object 多侧边栏 / array 单侧边栏
      collapsed: false, // 侧边栏默认展开（直接展示分类下的文章列表，避免用户看不到文章）
      ignoreIndexMd: false, // 不忽略 index.md
      titleFormMd: true, // 从 md 文件获取一级标题作为侧边栏文字
      fileIndexPrefix: false, // 不强制文件名以「序号.」开头（分类目录使用中文名）
      sortNumFromFileName: true, // 用文件名序号前缀排序
      ignoreList: ['@pages'], // 忽略 @pages（功能页）目录，分类目录正常生成侧边栏分组
      // 基于文件路径生成侧边栏：保持目录分组结构，切换分类时侧边栏正确匹配
      resolveRule: 'filePath',
    },
    // 永久链接插件：关闭，全部使用文件路径，避免 rewrites 导致侧边栏分组失效
    permalink: false,
    // 自动生成 frontmatter（标题、日期、分类等）
    autoFrontmatter: true,
    autoFrontmatterOption: {
      pattern: '**/*.md',
      globOptions: {
        // 忽略功能页、所有目录的 index.md 入口页（分类入口页不需要 permalink/自动分类）
        ignore: ['utils', '**/index.md', 'login.md', 'pages', '@pages/**'],
      },
      permalink: false, // 关闭自动生成永久链接
      categories: true, // 根据目录自动生成分类
    },
    // 目录页插件（自动生成目录页）
    catalogueOption: {
      ignoreList: ['pages'], // 忽略 pages 目录
    },
    // 文档分析插件（统计站点文章数等）
    docAnalysis: true,
    docAnalysisOption: {
      ignoreList: ['login.md', 'pages'], // 忽略登录页和 pages 目录
    },
    // 文章收集器忽略配置：以下文件不进入首页文章列表
    fileContentLoaderIgnore: [
      '@pages/**', // 功能页（分类/标签/归档/文章清单）
      'index.md', // 首页
      '*/index.md', // 分类入口页（前端/index.md、后端/index.md、工具/index.md）
    ],
  },

  // ===== 文章页风格 =====
  pageStyle: 'card', // 文章页风格：default 原生 / card 卡片 / segment 片段卡片
})

export default teekConfig
