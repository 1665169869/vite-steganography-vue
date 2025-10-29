/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 07:14:14
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 07:46:13
 * @FilePath: \vite-steganography-vue\src\main.ts
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
 */
import 'virtual:uno.css'
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import '@/base.css'

const app = createApp(App)

app.use(ElementPlus)
app.mount('#app')
