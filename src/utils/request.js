// 引入axios
import axios from 'axios'

// 创建axios实例
const request = axios.create({
  // 核心：配置开发服务器的后端地址（替换成你的开发服务器IP+端口）
  baseURL: 'http://172.16.8.65:3019',
  timeout: 30000, // 超时时间30秒，适配复杂SQL查询
  headers: {
    'Content-Type': 'application/json'
  }
})

// 响应拦截器：统一处理结果
request.interceptors.response.use(
  (response) => {
    // 直接返回响应数据
    return response.data
  },
  (error) => {
    // 统一处理错误
    console.error('接口请求失败：', error)
    return Promise.reject(error.response?.data || '请求失败，请检查后端服务是否正常')
  }
)

// 导出实例
export default request