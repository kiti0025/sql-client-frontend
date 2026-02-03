<template>
  <div class="container">
    <div class="card">
      <div class="form-item">
        <label class="label">类型</label>
        <select v-model="sqlType" class="select">
          <option value="Query">查询</option>
          <option value="Execute">执行</option>
        </select>
      </div>

      <div class="form-item">
        <label class="label">SQL</label>
        <textarea
          v-model="sqlStatement"
          placeholder=""
          class="textarea"
        ></textarea>
      </div>

      <button
        @click="submitSql"
        class="btn"
        :disabled="isLoading || !sqlStatement.trim()"
      >
        {{ isLoading ? '执行中...' : '执行' }}
      </button>
    </div>

    <div class="card" v-if="result || error">
      <div v-if="error" class="error">{{ error }}</div>

      <div v-else-if="result.data && result.data.length > 0" class="table-wrap">
        <table class="table">
          <thead>
            <tr>
              <th v-for="(key, i) in Object.keys(result.data[0])" :key="i">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, i) in result.data" :key="i" :class="i%2===0?'even':'odd'">
              <td v-for="(val, j) in Object.values(row)" :key="j">{{ val === null ? 'NULL' : val }}</td>
            </tr>
          </tbody>
        </table>
        <div class="count">{{ result.data.length }} 条</div>
      </div>

      <div v-else-if="result.data && result.data.length === 0" class="empty">执行成功，无数据返回</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import request from './utils/request'

// 🔥 修改：默认选中「查询」，符合你的要求
const sqlType = ref('Query')
const sqlStatement = ref('')
const result = ref(null)
const error = ref('')
const isLoading = ref(false)

const submitSql = async () => {
  if (!sqlStatement.value.trim()) return
  isLoading.value = true
  error.value = ''
  result.value = null

  try {
    const res = await request.post('/api/sqlexecute/run-sql', {
      sqlStatement: sqlStatement.value.trim(),
      sqlType: sqlType.value
    })
    result.value = res
  } catch (err) {
    error.value = err || '执行失败'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* 🔥 iOS标准背景色：#F2F2F7（原生系统默认背景，比之前更精准） */
body {
  background: #F2F2F7;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", sans-serif;
  padding: 24px;
}

.container {
  max-width: 100%;
  margin: 0 auto;
}

/* 🔥 iOS原生卡片风格：纯净白+极柔和阴影+标准大圆角 */
.card {
  background: #FFFFFF;
  border-radius: 16px; /* iOS标准大圆角，更显精致 */
  padding: 32px; /* iOS交互控件标准内边距，更舒展 */
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 4px 6px rgba(0, 0, 0, 0.02); /* iOS轻质感阴影，不突兀 */
}

.form-item {
  margin-bottom: 28px; /* 优化间距，贴合iOS视觉节奏 */
}

/* 🔥 iOS标准辅助文本色：#86868B（原生二级文本，精准匹配） */
.label {
  font-size: 14px;
  color: #86868B;
  margin-bottom: 10px;
  display: block;
  font-weight: 400; /* iOS文本默认权重，不厚重 */
}

/* 🔥 iOS原生下拉框样式：标准边框+背景+聚焦过渡 */
.select {
  width: 100%;
  padding: 15px 16px; /* iOS控件标准内边距，手感更好 */
  border: 1px solid #E5E5EA; /* iOS标准分隔线/边框色，更细腻 */
  border-radius: 12px; /* 与卡片圆角呼应，符合iOS设计规范 */
  font-size: 16px;
  color: #1D1D1F; /* iOS标准一级文本色，精准匹配 */
  background: #FAFAFA; /* iOS输入控件默认背景，更柔和 */
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1); /* iOS原生动画曲线，过渡更顺滑 */
  -webkit-appearance: none; /* 移除浏览器默认样式，还原iOS原生风格 */
  appearance: none;
  background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2386868B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 16px center;
  background-size: 16px;
}

.select:focus {
  outline: none;
  border-color: #007AFF; /* iOS标准主色调（蓝色），精准匹配 */
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1); /* iOS原生聚焦高亮阴影，柔和不刺眼 */
}

/* 🔥 iOS原生文本域样式：支持上下拉动调整高度，保持视觉统一 */
.textarea {
  width: 100%;
  padding: 16px;
  border: 1px solid #E5E5EA;
  border-radius: 12px;
  font-family: 'SF Mono', Monaco, Consolas, monospace;
  font-size: 14px;
  color: #1D1D1F;
  /* 1. 调整高度范围，允许上下拉动，移除固定相等的min/max-height */
  min-height: 120px; /* 最小高度，保证不会拉得太矮 */
  max-height: 1000px; /* 最大高度，防止超出页面可视区域 */
  overflow-y: auto;
  /* 2. 允许垂直调整大小（仅上下拉动），移除resize: none; */
  resize: vertical;
  background: #FAFAFA;
  white-space: pre-wrap;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.textarea:focus {
  outline: none;
  border-color: #007AFF;
  background: #FFFFFF;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

/* 🔥 iOS原生按钮样式：标准主色调+圆角+顺滑过渡 */
.btn {
  width: 100%;
  padding: 16px;
  background: #007AFF; /* iOS标准主色调（蓝色），精准匹配原生按钮 */
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 500; /* iOS按钮文本权重，更显精致 */
  cursor: pointer;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.btn:hover:not(:disabled) {
  background: #0066CC; /* iOS按钮hover深色，精准匹配系统 */
  box-shadow: 0 2px 8px rgba(0, 122, 255, 0.2);
}

.btn:disabled {
  background: #E1E1E6; /* iOS按钮禁用色，精准匹配原生 */
  color: #AEAEB2;
  cursor: not-allowed;
  box-shadow: none;
}

/* 🔥 iOS原生错误提示样式：标准警告色+柔和背景 */
.error {
  color: #FF3B30; /* iOS标准警告色（红色），精准匹配 */
  background: rgba(255, 59, 48, 0.05);
  padding: 16px;
  border-radius: 12px;
  margin-bottom: 16px;
  font-size: 14px;
}

.table-wrap {
  overflow-x: auto;
}

/* 🔥 iOS原生表格样式：细腻分隔线+柔和背景 */
.table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  color: #1D1D1F;
}

.table th {
  padding: 16px;
  text-align: left;
  color: #86868B;
  border-bottom: 1px solid #E5E5EA;
  background: #FAFAFA;
  font-weight: 500;
}

.table td {
  padding: 16px;
  border-bottom: 1px solid #E5E5EA;
}

.table tr.even {
  background: #FAFAFA;
}

.table tr:hover {
  background: #F8F8F8; /* iOS表格行hover背景，柔和反馈 */
  transition: background 0.2s ease;
}

.count {
  text-align: right;
  font-size: 13px;
  color: #86868B;
  margin-top: 12px;
}

.empty {
  text-align: center;
  color: #86868B;
  padding: 28px;
  font-size: 14px;
}
</style>