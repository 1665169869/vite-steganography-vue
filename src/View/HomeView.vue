<template>
  <el-container class="h-100vh items-center">
    <el-main>
      <div class="w-320px"><file-selector /></div>
      <div class="w-240px flex flex-row flex-wrap items-center justify-between mx-auto mt-4">
        <el-button type="primary" plain class="flex-1" :disabled="btnDownloadDisabled">
          <el-icon class="el-icon--left">
            <download />
          </el-icon>
          <span>下载</span>
        </el-button>
        <el-button type="danger" plain class="flex-1" :disabled="btnClearDisabled">
          <el-icon class="el-icon--left">
            <delete />
          </el-icon>
          <span>清空</span>
        </el-button>
      </div>
    </el-main>
    <el-footer class="flex flex-col items-center text-3">
      <div>
        隐写者 - 在线解密
        <a href="https://github.com/1665169869/vite-steganography-vuer">Github</a>
      </div>
      <div>Copyright © 2025 BaiYu 隐写者使用 MIT许可协议 开放源代码</div>
      <div>
        感谢
        <a href="https://github.com/cenglin123/SteganographierGUI/">SteganographierGUI</a>
        提供的源码
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { Download, Delete } from '@element-plus/icons-vue'
import FileSelector from '@/components/FileSelector.vue'
import { ref } from 'vue'

const btnDownloadDisabled = ref(true)
const btnClearDisabled = ref(true)
</script>

<style scoped></style>
