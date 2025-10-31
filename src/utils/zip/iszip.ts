/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-11-01 03:01:46
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-11-01 03:01:51
 * @FilePath: \vite-steganography-vue\src\utils\zip\iszip.ts
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
 */

import type { Entry } from "@zip.js/zip.js"

/**
 * 判断文件是否为 ZIP 文件，直接读取文件头信息
 * @param file 待检测的文件
 * @returns 是否为 ZIP 文件
 */
export async function headerIsZip(file: File): Promise<boolean> {
  const ZIP_FILE_HEADER = new Uint8Array([0x50, 0x4b, 0x03, 0x04])

  // 只读取文件的前4个字节，提高性能
  const slice = file.slice(0, 4)
  const buffer = await slice.arrayBuffer()
  const header = new Uint8Array(buffer)

  // 比较文件头
  return (
    header.length === 4 &&
    header[0] === ZIP_FILE_HEADER[0] &&
    header[1] === ZIP_FILE_HEADER[1] &&
    header[2] === ZIP_FILE_HEADER[2] &&
    header[3] === ZIP_FILE_HEADER[3]
  )
}

export interface ZipFileInfoEntry {
  id: number
  filename: string
  size: number
  lastModified: Date
  isDirectory: boolean
  raw: Entry
}
