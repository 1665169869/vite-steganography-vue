<!--
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 19:22:42
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 22:37:57
 * @FilePath: \vite-steganography-vue\src\View\HomeView.vue
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
-->
<template>
  <el-container class="h-100vh items-center overflow-x-hidden">
    <el-main>
      <div class="flex flex-col items-center">
        <div class="min-w-320px max-w-400px">
          <div><file-selector @success="changeFile" /></div>
          <div class="flex flex-row flex-wrap items-center justify-between mx-auto mt-4">
            <el-button type="primary" plain class="flex-1" :disabled="btnDownloadDisabled">
              <el-icon class="el-icon--left">
                <download />
              </el-icon>
              <span>下载</span>
            </el-button>
            <el-button type="danger" plain class="flex-1" :disabled="btnClearDisabled" @click="clearFile">
              <el-icon class="el-icon--left">
                <delete />
              </el-icon>
              <span>清空</span>
            </el-button>
          </div>
        </div>

        <el-tree style="max-width: 600px" class="w-100vw min-w-320px mt-8" :data="zipFileListTree"
          :props="defaultProps" />
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
import { computed, reactive, ref } from 'vue'
import { readZipAsync, type ZipFileInfoEntry } from '@/utils/zip'
import { buildFileTree } from '@/utils/utils'


const btnDownloadDisabled = ref(true)
const btnClearDisabled = ref(true)

const zipInfo = reactive<{
  file: File | null,
  password?: string
}>({
  file: null
})

const zipFileList = ref<ZipFileInfoEntry[]>([])
const zipFileListTree = computed(() => {
  return buildFileTree(zipFileList.value)
})

const defaultProps = {
  children: 'children',
  label: 'label',
  icon: 'icon'
}



const changeFile = async (file: File, password?: string) => {
  console.log('file', file)
  btnDownloadDisabled.value = false
  btnClearDisabled.value = false
  zipInfo.file = file
  zipInfo.password = password

  zipFileList.value = await readZipAsync(zipInfo.file, password);

  debugger
}

const clearFile = () => {
  zipInfo.file = null
  zipInfo.password = undefined
  btnDownloadDisabled.value = true
  btnClearDisabled.value = true
  zipFileList.value = []
}
</script>

<style scoped></style>
