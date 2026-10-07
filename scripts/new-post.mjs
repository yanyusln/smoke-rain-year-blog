/**
 * 新建文章模板脚本
 * 用法：npm run new -- 分类/序号.标题
 * 示例：npm run new -- 前端/05.闭包陷阱
 * 功能：在 docs/分类/ 目录下生成带 frontmatter 的初始文章模板
 * 返回值：成功输出文件路径；参数不合法或文件已存在时以退出码 1 结束
 */
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

// 项目根目录（scripts 目录的上一级）
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
// 文章存放的 docs 目录
const docsDir = join(rootDir, 'docs')

// ===== 解析命令行参数 =====
// 取第一个参数，如 "前端/05.闭包陷阱"
const arg = process.argv[2]
// 参数必须包含 "/"，即"分类/标题"格式
if (!arg || !arg.includes('/')) {
    console.error('用法：npm run new -- 分类/序号.标题（示例：npm run new -- 前端/05.闭包陷阱）')
    process.exit(1)
}

// 按 "/" 拆分为分类和文件名
const [category, rawName] = arg.split('/')
if (!category || !rawName) {
    console.error('参数格式错误，应为 分类/标题（示例：前端/05.闭包陷阱）')
    process.exit(1)
}

// 文件名：未带 .md 后缀时自动补全
const fileName = rawName.endsWith('.md') ? rawName : `${rawName}.md`
// 文章标题：去掉序号前缀（如 "05."）和 .md 后缀
const title = rawName.replace(/\.md$/, '').replace(/^\d+\./, '')

// 目标目录与完整文件路径
const dir = join(docsDir, category)
const filePath = join(dir, fileName)

// 防止覆盖已有文章
if (existsSync(filePath)) {
    console.error(`文件已存在，跳过创建：${filePath}`)
    process.exit(1)
}

// ===== 生成当天日期（本地时区，格式 YYYY-MM-DD）=====
const now = new Date()
// 补零函数：个位数前补 0
const pad = (n) => String(n).padStart(2, '0')
const today = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`

// ===== 文章初始 frontmatter 模板 =====
// title 取自文件名（去掉序号），date 取当天，categories 取自目录名
const template = `---
title: ${title}
date: ${today}
categories:
  - ${category}
tags: []
description: ''
---

`

// 递归创建分类目录（已存在则跳过），并写入模板文件
mkdirSync(dir, { recursive: true })
writeFileSync(filePath, template, 'utf8')

console.log(`文章已创建：${filePath}`)
console.log('打开文件即可开始写作。')
