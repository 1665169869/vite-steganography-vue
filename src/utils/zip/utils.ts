/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-11-01 04:14:00
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-11-01 04:14:04
 * @FilePath: \vite-steganography-vue\src\utils\zip\utils.ts
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
 */

import type { Entry, FileEntry } from "@zip.js/zip.js"
import { isNull } from "lodash-es"

/**
 * 在 ZIP 条目中查找最小的非目录文件
 * @param entries
 * @returns
 */
export function findSmallestZipFile(entries: Entry[]): FileEntry {
  if (entries.length === 0) {
    throw new Error('ZIP 文件中没有文件条目')
  }

  let smallestFileEntry: FileEntry | null = null

  for (const entry of entries) {
    // 跳过目录条目
    if (entry.directory) {
      continue
    }

    // 如果 smallestFileEntry 为空，或者当前 entry 的大小小于 smallestFileEntry，则更新 smallestFileEntry
    if (
      isNull(smallestFileEntry) ||
      entry.uncompressedSize < (smallestFileEntry as Entry).uncompressedSize
    ) {
      smallestFileEntry = entry
    }
  }

  if (!isNull(smallestFileEntry)) {
    return smallestFileEntry
  }
  throw new Error('ZIP 文件中没有非目录文件')
}
