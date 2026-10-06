<script setup>
// 分类入口页头部组件
// 功能：
//   1. 在文章列表上方渲染当前分类的标题与描述（填充页面顶部，避免页面空旷）
//   2. 自动补全 URL query（裸路径 /前端/ 访问时自动加上 ?category=前端），
//      保证 Teek 文章列表组件（home-post）按分类正确过滤
// 使用位置：通过主题 Layout 的 teek-home-post-before 插槽注入
import { computed, inject, onMounted, watch } from 'vue'
import { useRoute } from 'vitepress'
// Teek 首页主体提供的“刷新文章列表”函数注入标识
import { postDataUpdateSymbol } from 'vitepress-theme-teek/es/components/theme/home-main/src/home-main.mjs'

// 分类路径与展示信息映射表（新增分类时在此补充即可）
const CATEGORY_META = {
  '/前端/': {
    name: '前端开发', // 分类展示名（标题）
    category: '前端', // frontmatter categories 字段值（用于 query 过滤）
    desc: '记录前端开发（Vue / React / 工程化等）中遇到的难点与错误', // 分类描述
  },
  '/后端/': {
    name: '后端开发',
    category: '后端',
    desc: '记录后端开发（Node.js / Java / 数据库等）中遇到的难点与错误',
  },
  '/工具/': {
    name: '开发工具',
    category: '工具',
    desc: '记录开发工具（Git / VSCode / 命令行等）使用中遇到的问题',
  },
}

const route = useRoute()

/**
 * 路径归一化：将 URL 编码的中文路径解码为中文
 * ⚠️ 背景：VitePress route.path 在中文目录下可能返回编码形式（如 /%E5%89%8D%E7%AB%AF/），
 * 直接与中文映射表匹配会失败，导致组件不渲染。decodeURI 解码后即可正常匹配。
 * @param rawPath 原始路径（可能含百分号编码）
 * @returns 解码后的路径；解码失败（含非法转义）时原样返回
 */
const normalizePath = (rawPath) => {
  try {
    return decodeURI(rawPath)
  } catch {
    return rawPath // 非法 URI 序列时原样返回，避免组件崩溃
  }
}

// 当前路径对应的分类信息（非分类入口页为 null，组件不渲染）
const meta = computed(() => CATEGORY_META[normalizePath(route.path)] || null)

// 注入 Teek 文章列表刷新函数（query 修正后需手动调用，因 route.path 未变化）
const refreshPostList = inject(postDataUpdateSymbol, null)

/**
 * 检查并补全分类 query
 * 触发时机：组件挂载后、路由路径变化时
 * 异常场景：SSR 环境无 window，直接跳过
 */
const ensureCategoryQuery = () => {
  if (typeof window === 'undefined' || !meta.value) return
  const params = new URLSearchParams(window.location.search)
  // query 已正确时不处理，避免多余的历史记录与刷新
  if (params.get('category') === meta.value.category) return
  params.set('category', meta.value.category)
  // replaceState 不产生新历史记录；path 不变，Teek 的 watch(route.path) 不会触发
  window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`)
  refreshPostList?.() // 手动刷新文章列表数据
}

onMounted(ensureCategoryQuery)
watch(() => route.path, ensureCategoryQuery)
</script>

<template>
  <div v-if="meta" class="category-page-header">
    <h1 class="title">{{ meta.name }}</h1>
    <p class="desc">{{ meta.desc }}</p>
  </div>
</template>

<style scoped>
/* 分类页头部：标题 + 描述，位于文章列表卡片上方 */
.category-page-header {
  margin-bottom: 20px;
  padding: 4px 2px;
}

.title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  /* 标题渐变色（与全站 H1 渐变风格呼应） */
  background-image: linear-gradient(120deg, #db2777, #9333ea, #4f46e5);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.desc {
  margin: 0;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-2);
}
</style>
