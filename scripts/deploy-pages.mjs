/**
 * 构建产物发布脚本（孤儿提交 + 强制推送）
 * 用途：将 docs/.vitepress/dist 发布为 origin 仓库的 main 分支（GitHub Pages 部署分支）
 * 用法：npm run publish-dist（由 npm run deploy 自动调用，一般无需手动执行）
 * 逻辑：临时目录复制 dist 内容 -> git init 独立提交 -> push --force 覆盖远程 main
 * 异常场景：网络失败时命令以非 0 退出码结束，待网络恢复后重新执行即可
 * 注意：此为"双分支部署模式"的核心环节，main 分支内容会被每次发布完整替换
 */
import { cpSync, mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { execSync } from 'node:child_process'

// 项目根目录（scripts 目录的上一级）
const rootDir = join(dirname(fileURLToPath(import.meta.url)), '..')
// 本地构建产物目录（由 npm run docs:build 生成）
const distDir = join(rootDir, 'docs', '.vitepress', 'dist')
// 临时发布目录（gitignore 中已排除，不会污染源码仓库）
const tmpDir = join(rootDir, '.deploy-tmp')

/**
 * 在指定目录执行 git 命令
 * @param {string} cmd - 不含 "git" 前缀的命令参数，如 "add -A"
 * @param {string} cwd - 执行命令的工作目录
 */
const git = (cmd, cwd) => execSync(`git ${cmd}`, { cwd, stdio: 'inherit' })

try {
    // ===== 1. 准备干净的临时目录 =====
    rmSync(tmpDir, { recursive: true, force: true })
    mkdirSync(tmpDir, { recursive: true })

    // ===== 2. 复制全部构建产物（递归复制，天然包含 .nojekyll 等隐藏文件）=====
    cpSync(distDir, tmpDir, { recursive: true })
    // 等价于 gh-pages 的 --nojekyll：写入空文件，防止 GitHub Pages 用 Jekyll 处理
    writeFileSync(join(tmpDir, '.nojekyll'), '')

    // ===== 3. 在临时目录建立独立 git 仓库并提交 =====
    git('init -b main', tmpDir)
    git('add -A', tmpDir)
    git('commit -m "deploy: 发布站点构建产物"', tmpDir)

    // ===== 4. 强制推送到远程 main 分支（孤儿提交覆盖，不含源码历史）=====
    // 读取源码仓库的远程地址，保证发布目标与源码仓库一致
    const repoUrl = execSync('git config --get remote.origin.url', {
        cwd: rootDir,
    })
        .toString()
        .trim()
    git(`push --force ${repoUrl} main`, tmpDir)
} finally {
    // ===== 5. 无论成功失败都清理临时目录 =====
    rmSync(tmpDir, { recursive: true, force: true })
}

console.log('构建产物已发布到 main 分支')
