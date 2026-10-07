<!--
  文章底部版权标注组件
  功能：在每篇文章正文末尾展示「文章作者 / 文章链接 / 版权声明」三行信息
  注入方式：通过 Teek 布局的 teek-doc-update-before 插槽渲染（见 theme/index.ts）
-->
<script setup lang="ts">
    import { computed } from 'vue'
    import { useData } from 'vitepress'

    // ===== 站点常量 =====
    // 站点访问地址：与 docs/.vitepress/config.mts 中的 SITE_URL 保持一致，修改时需同步
    const SITE_URL = 'https://yanyusln.github.io'
    // CC 协议链接（中文页面）
    const LICENSE_URL = 'https://creativecommons.org/licenses/by-nc-sa/4.0/deed.zh'

    // VitePress 站点数据：site 含 base，theme 含主题配置，page 含当前文章信息
    const { site, theme, page } = useData()

    // 博主昵称：读取 Teek 主题配置 blogger.name，未配置时回退为站点标题
    const author = computed(() => theme.value?.blogger?.name || theme.value?.title || '本博客')

    /**
     * 拼接当前文章的完整访问链接
     * 规则：站点地址 + base 路径 + 文章相对路径（去掉 .md 后缀，cleanUrls 模式下无 .html）
     * 返回值：如 https://yanyusln.github.io/smoke-rain-year-blog/前端/02.ts类型报错
     */
    const articleUrl = computed(() => {
        // base 形如 "/smoke-rain-year-blog/"，首尾已带斜杠
        const base = site.value.base || '/'
        // 文章相对路径，如 "前端/02.ts类型报错.md"，去掉 .md 后缀
        const relPath = (page.value.relativePath || '').replace(/\.md$/, '')
        return `${SITE_URL}${base}${relPath}`
    })
</script>

<template>
    <!-- 版权标注卡片：浅色背景 + 左侧品牌色竖线，自动适配暗色模式 -->
    <div class="tk-article-copyright">
        <p>
            <span class="label">文章作者</span>
            <span>{{ author }}</span>
        </p>
        <p>
            <span class="label">文章链接</span>
            <!-- 文章完整链接，新标签页打开 -->
            <a :href="articleUrl" target="_blank" rel="noopener">{{ articleUrl }}</a>
        </p>
        <p>
            <span class="label">版权声明</span>
            <span>
                本博客所有文章除特别声明外，均采用
                <a :href="LICENSE_URL" target="_blank" rel="noopener">CC BY-NC-SA 4.0</a>
                许可协议。转载请注明来源 {{ author }}！
            </span>
        </p>
    </div>
</template>

<style scoped>
/* 版权标注容器：与正文底部留出间距 */
.tk-article-copyright {
    margin: 24px 0 16px;
    padding: 12px 16px;
    font-size: 14px;
    line-height: 1.9;
    color: var(--vp-c-text-2);
    background: var(--vp-c-bg-soft);
    border-left: 4px solid var(--vp-c-brand-1);
    border-radius: 6px;
    /* 长链接自动换行，防止溢出容器 */
    overflow-wrap: anywhere;
}

/* 每行信息间距 */
.tk-article-copyright p {
    margin: 2px 0;
}

/* 行首标签：加粗高亮，与内容区分 */
.tk-article-copyright .label {
    display: inline-block;
    min-width: 64px;
    margin-right: 8px;
    font-weight: 600;
    color: var(--vp-c-text-1);
}

/* 链接使用主题品牌色，悬停下划线 */
.tk-article-copyright a {
    color: var(--vp-c-brand-1);
    text-decoration: none;
}

.tk-article-copyright a:hover {
    text-decoration: underline;
}
</style>
