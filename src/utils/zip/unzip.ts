/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-11-01 01:22:07
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-11-01 04:55:15
 * @FilePath: \vite-steganography-vue\src\utils\zip\unzip.ts
 * @Description:
 * Copyright (c) 2025 by 白羽 1665169869@qq.com, All Rights Reserved.
 */

import { BlobReader, BlobWriter, ZipReader } from '@zip.js/zip.js'
import type { UnZipOptions, ZipDataEntry } from './entity'
import { findSmallestZipFile } from './utils'
export async function unzipFile({
  file,
  password,
  onprogress,
  useWebWorkers,
}: UnZipOptions): Promise<ZipDataEntry> {
  // 内部安全封装，确保返回 Promise<void> | undefined
  const handleProgress = (loaded: number, total: number): undefined => {
    onprogress?.(loaded, total)
    return undefined;
  }

  const getEntries = async (reader: ZipReader<unknown>) => {
    const entries = await reader.getEntries({
      onprogress: (loaded, total) => handleProgress(loaded, total),
    })
    if (!entries.length) throw new Error('ZIP 文件中没有文件条目')
    return entries
  }

  const checkZipReader = new ZipReader(new BlobReader(file), {
    password,
    useWebWorkers,
    checkPasswordOnly: true,
  })

  try {
    // ① 先用 checkPasswordOnly 验证密码
    const checkZipEntries = await getEntries(checkZipReader)
    const smallestFile = findSmallestZipFile(checkZipEntries)
    if (!smallestFile) throw new Error('未找到可验证的 ZIP 条目')

    // 用最小文件进行快速密码验证
    await smallestFile.getData(new BlobWriter(), {
      onprogress: (loaded, total) => handleProgress(loaded, total),
    })

    // ② 再次完整读取
    const zipReader = new ZipReader(new BlobReader(file), {
      password,
      useWebWorkers,
    })

    try {
      const zipEntries = await getEntries(zipReader)
      return {
        filename: file.name,
        size: file.size,
        entries: zipEntries,
        raw: file,
      }
    } finally {
      await zipReader.close()
    }
  } catch (err) {
    throw new Error(err instanceof Error ? err.message : `解压失败: ${String(err)}`)
  } finally {
    await checkZipReader.close()
  }
}
