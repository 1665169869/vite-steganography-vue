<template>
  <el-container class="container">
    <el-main>
      <div class="upload">
        <el-upload drag :multiple="false">
          <el-icon class="el-icon--upload"><upload-filled /></el-icon>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        </el-upload>
        <div class="tips flex flex-col items-center text-3 color-#999">
          <div>仅在浏览器内对文件进行解锁，无需消耗流量</div>
          <div>支持mp4、mkv、mov</div>
        </div>
      </div>
    </el-main>
    <el-footer class="flex flex-col items-center text-3">
      <div>
        隐写者 - 在线解密
        <a href="https://github.com/1665169869/vite-steganography-vuer">Github</a>
      </div>
      <div>
        Copyright © 2019 - 2025 MengYX 音乐解锁使用 MIT许可协议 开放源代码
      </div>
    </el-footer>
  </el-container>
</template>

<script setup lang="ts">
import { UploadFilled } from "@element-plus/icons-vue";
</script>

<style scoped>
.container {
  /* width: 100%; */
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f7fa;
}

.upload {
  width: 400px;
  height: 200px;
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>
