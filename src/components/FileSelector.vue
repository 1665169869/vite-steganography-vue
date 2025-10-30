<!--
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 08:34:53
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 14:22:53
 * @FilePath: \vite-steganography-vue\src\components\FileSelector.vue
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
-->
<template>
  <el-upload action="" :accept="accept" :auto-upload="false" :show-file-list="false" @change="addFile"
    :disabled="uploadDisabled" drag>
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
import { isZip, verifyZipPassword } from '@/utils/zip'
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus'
import { ref } from 'vue'
// 仅支持的文件类型
const accept = 'video/mp4, video/mkv, .mov, .mkv, .mp4'

// refs
const progressValue = ref(0)
const progressShow = ref(false)
const uploadDisabled = ref(false)

// emits
const emit = defineEmits<{
  success: [zipFile: File]
  error: [errorString: string]
}>()

// methods
const addFile = async (file: UploadFile) => {
  progressShow.value = true
  progressValue.value = 0
  uploadDisabled.value = true

  if (!(await isZip(file.raw as File))) {
    emit('error', '文件格式不正确')
    ElMessage.error('文件格式不正确')
    progressShow.value = false
    uploadDisabled.value = false
    return
  }

  if (!((await verifyZipPassword(file.raw as File)).success)) {
    ElMessageBox.prompt('该文件需要密码才能解压，请输入密码', '提示', {
      showCancelButton: false,
      inputPlaceholder: '请输入解压密码',
    }).then(async ({ value }) => {
      const result = await verifyZipPassword(file.raw as File, value);
      if (result.success) {
        emit('success', file.raw as File)
      } else {
        emit('error', result.error)
        ElMessage.error(result.error)
      }
    }).catch(() => {
      emit('error', '取消解压')
    }).finally(() => {
      progressShow.value = false
      uploadDisabled.value = false
    })
  }


}
</script>
