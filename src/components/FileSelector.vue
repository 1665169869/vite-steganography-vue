<!--
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 08:34:53
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 10:59:38
 * @FilePath: \vite-steganography-vue\src\components\FileSelector.vue
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
-->
<template>
  <el-upload action="" :accept="accept" :auto-upload="false" :show-file-list="false" @change="addFile" drag>
    <el-icon class="el-icon--upload"><upload-filled /></el-icon>
    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>

    <template #tip>
      <div class="flex flex-col items-center">
        <div class="el-upload__tip">仅在浏览器内对文件进行解锁，无需消耗流量</div>
        <div class="el-upload__tip">只能上传mp4、mkv、mov文件</div>
      </div>
    </template>

    <transition name="el-fade-in"><!--todo: add delay to animation-->
      <el-progress v-show="progressShow" :percentage="progressValue" :stroke-width="16" :text-inside="true"
        style="margin: 16px 6px 0 6px"></el-progress>
    </transition>
  </el-upload>
</template>

<script lang="ts" setup>
import { UploadFilled } from "@element-plus/icons-vue";
import type { UploadFile } from 'element-plus';
import { ref } from "vue";
// 仅支持的文件类型
const accept = "video/mp4, video/mkv, .mov, .mkv, .mp4";

// refs
const progressValue = ref(0);
const progressShow = ref(false);

// emits
const emit = defineEmits<{
  success: [newFile: File, rawFile?: UploadFile],
  error: [error: Error, rawFile?: UploadFile]
}>()

// methods
const addFile = (file: UploadFile) => {
  console.log(file);
  progressShow.value = true;
  progressValue.value = 0;

  // todo: add file to store
  const timeId = setInterval(() => {
    progressValue.value = progressValue.value + 10;
    if (progressValue.value >= 100) {
      progressShow.value = false;
      clearInterval(timeId);
    }
  }, 400)

}
</script>
