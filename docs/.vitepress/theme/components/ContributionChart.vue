<script setup>
// 归档页贡献热力图组件（GitHub 风格）
// 功能：统计近一年每天的发文数量，以格子热力图展示活跃度
// 数据来源：Teek usePosts() 提供的全部文章（含 date 字段）
import { computed } from 'vue'
import { usePosts } from 'vitepress-theme-teek/es/components/theme/config-provider/index.mjs'

const posts = usePosts()

// 汇总每日发文数，产出 { 'YYYY-MM-DD': 篇数 } 映射
const dayMap = computed(() => {
  const map = {}
  for (const p of posts.value.sortPostsByDate || []) {
    const day = (p.date || '').slice(0, 10) // 截取日期部分，兼容带时间的格式
    if (/^\d{4}-\d{2}-\d{2}$/.test(day)) {
      map[day] = (map[day] || 0) + 1
    }
  }
  return map
})

// 生成格子矩阵：每列代表一周（7 格，周日在上），共覆盖近 53 周
const weeks = computed(() => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  // 起点：52 周前并对齐到当周周日
  const cursor = new Date(today)
  cursor.setDate(cursor.getDate() - 52 * 7 - cursor.getDay())

  const cols = []
  while (cursor <= today) {
    const col = []
    for (let d = 0; d < 7; d++) {
      const date = new Date(cursor)
      const key = [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, '0'),
        String(date.getDate()).padStart(2, '0'),
      ].join('-')
      col.push({
        key, // 日期字符串
        count: dayMap.value[key] || 0, // 当日发文数
        future: date > today, // 是否未来日期（不渲染）
        month: date.getMonth(), // 月份（用于列头标签）
      })
      cursor.setDate(cursor.getDate() + 1)
    }
    cols.push(col)
  }
  return cols
})

// 月份列头：某列首格月份与上一列不同则显示月份名
const monthLabels = computed(() =>
  weeks.value.map((col, i) => {
    if (i === 0) return `${col[0].month + 1}月`
    return weeks.value[i - 1][0].month !== col[0].month ? `${col[0].month + 1}月` : ''
  })
)

// 近一年发文总数
const totalCount = computed(() =>
  weeks.value.reduce((sum, col) => sum + col.reduce((s, cell) => s + cell.count, 0), 0)
)

// 按发文数返回格子色阶（0~4 级，对应 CSS 类 level-0 ~ level-4）
const levelOf = (count) => {
  if (count === 0) return 0
  if (count === 1) return 1
  if (count === 2) return 2
  if (count === 3) return 3
  return 4
}

// 星期标签（仅在一/三/五行显示文字，对齐格子）
const weekDays = ['日', '一', '二', '三', '四', '五', '六']
</script>

<template>
  <div class="contribution-chart">
    <div class="chart-header">
      <span class="chart-title">贡献图</span>
      <span class="chart-total">近一年共 {{ totalCount }} 篇</span>
    </div>
    <div class="chart-body">
      <!-- 左侧星期标签 -->
      <div class="weekday-labels">
        <span v-for="(day, i) in weekDays" :key="day" class="weekday">
          {{ i % 2 === 1 ? day : '' }}
        </span>
      </div>
      <div class="grid-wrap">
        <!-- 顶部月份标签 -->
        <div class="month-labels">
          <span v-for="(label, i) in monthLabels" :key="i" class="month">{{ label }}</span>
        </div>
        <!-- 热力格子：列 = 周 -->
        <div class="grid">
          <div v-for="(col, i) in weeks" :key="i" class="col">
            <span
              v-for="cell in col"
              :key="cell.key"
              class="cell"
              :class="[`level-${levelOf(cell.count)}`, { future: cell.future }]"
              :title="cell.future ? '' : `${cell.key}：${cell.count} 篇`"
            />
          </div>
        </div>
      </div>
    </div>
    <!-- 图例 -->
    <div class="chart-footer">
      <span class="legend-label">少</span>
      <span v-for="n in 5" :key="n" class="cell" :class="`level-${n - 1}`" />
      <span class="legend-label">多</span>
    </div>
  </div>
</template>

<style scoped>
.contribution-chart {
  padding: 16px 20px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  background-color: var(--vp-c-bg-soft);
  margin-bottom: 24px;
  overflow-x: auto; /* 小屏幕可横向滚动 */
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.chart-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.chart-total {
  font-size: 12px;
  color: var(--vp-c-text-2);
}

.chart-body {
  display: flex;
  gap: 6px;
}

/* 星期标签列 */
.weekday-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 18px; /* 与月份标签高度对齐 */
}

.weekday {
  height: 10px;
  line-height: 10px;
  font-size: 9px;
  color: var(--vp-c-text-3);
}

.grid-wrap {
  flex: 1;
  min-width: 0;
}

/* 月份标签行 */
.month-labels {
  display: flex;
  gap: 3px;
  margin-bottom: 5px;
  height: 13px;
}

.month {
  width: 10px;
  font-size: 9px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: visible;
}

/* 热力格子矩阵 */
.grid {
  display: flex;
  gap: 3px;
}

.col {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.cell {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  background-color: var(--vp-c-divider);
  transition: transform 0.1s;
}

.cell:hover {
  transform: scale(1.3);
}

.cell.future {
  visibility: hidden;
}

/* 色阶：基于 Teek 主题色靛蓝系，数量越多颜色越深 */
.cell.level-0 {
  background-color: var(--vp-c-divider);
}
.cell.level-1 {
  background-color: #c7d2fe;
}
.cell.level-2 {
  background-color: #818cf8;
}
.cell.level-3 {
  background-color: #4f46e5;
}
.cell.level-4 {
  background-color: #3730a3;
}

/* 暗色模式适配 */
html.dark .cell.level-0 {
  background-color: rgba(255, 255, 255, 0.08);
}

/* 图例 */
.chart-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 3px;
  margin-top: 10px;
}

.legend-label {
  font-size: 9px;
  color: var(--vp-c-text-3);
  margin: 0 4px;
}
</style>
