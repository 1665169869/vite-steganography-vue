<!--
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 08:34:53
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-11-01 05:03:33
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
import { UploadFilled } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type UploadFile } from 'element-plus'
import { ref } from 'vue'
import { unzipFile, type ZipDataEntry } from '@/utils/zip/index'
// 仅支持的文件类型
const accept = 'video/mp4, video/mkv, .mov, .mkv, .mp4'

// refs
const progressValue = ref(0)
const progressShow = ref(false)

// models
const uploadDisabled = defineModel('uploadDisabled', {
  type: Boolean,
  default: false,
})

// emits
const emit = defineEmits<{
  success: [zipInfo: ZipDataEntry, password?: string]
  error: [errorString: string]
}>()

// methods
const processFile = async (file: File, password?: string) => {
  try {
    const zipInfo = await unzipFile({
      file,
      password,
      useWebWorkers: true,
      onprogress: (loaded, total) => {
        console.log('progress', loaded, total)
        progressValue.value = Math.floor((loaded / total) * 100)
      }
    })

    emit('success', zipInfo)
    ElMessage.success(password ? '密码正确，文件解密成功' : '文件解密成功')
  } catch (err) {
    throw err
  }
}

const addFile = async (file: UploadFile) => {
  progressShow.value = true
  progressValue.value = 0
  uploadDisabled.value = true

  try {
    await processFile(file.raw as File)
  } catch (err) {
    if (err instanceof Error) {
      if (err.message === 'File contains encrypted entry') {
        ElMessageBox.prompt('请输入密码', '提示', {
          showCancelButton: false,
          inputPlaceholder: '请输入解压密码',
        }).then(async ({ value }) => {
          await processFile(file.raw as File, value)
        }).catch((err) => {
          ElMessage.error(err.message)
        })
      } else {
        ElMessage.error(err.message)
      }
    }
  } finally {
    progressShow.value = false
    uploadDisabled.value = false
  }
}
</script>
