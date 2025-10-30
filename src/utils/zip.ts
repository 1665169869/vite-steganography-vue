/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 11:58:51
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 22:24:37
 * @FilePath: \vite-steganography-vue\src\utils\zip.ts
 * @Description: ZIP 读取工具函数（支持 AES 加密）
 */

import { BlobReader, BlobWriter, ZipReader, type Entry, type FileEntry } from '@zip.js/zip.js'
import { isNull, isUndefined } from 'lodash-es'

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

/**
 * 初步判断文件是否可能是 ZIP 文件
 * @param file
 * @returns boolean - 是否可能是 ZIP 文件
 */
export async function isProbablyZip(file: File) {
  const zipReader = new ZipReader(new BlobReader(file))
  try {
    const entries = await zipReader.getEntries()
    return entries && entries.length > 0
  } catch (err) {
    // 如果错误包含类似 “end of central directory” 或 “not a zip file” 等关键词，
    // 则可以认为不是 ZIP。
    return false
  } finally {
    await zipReader.close()
  }
}

/**
 * 检查 ZIP 文件是否受密码保护
 *
 * 该函数通过尝试读取 ZIP 文件中最小非目录文件的数据来判断是否需要密码。
 * 如果能够成功读取数据，说明文件不需要密码；如果读取时出现密码错误，说明文件需要密码。
 *
 * @param {File} file - 要检查的 ZIP 文件对象
 * @returns {Promise<boolean>} 返回 Promise，解析为布尔值：
 *   - `true`: ZIP 文件受密码保护
 *   - `false`: ZIP 文件不需要密码
 * @throws {Error} 当 ZIP 文件中没有文件或没有非目录文件时抛出错误
 * @throws {Error} 当读取过程中发生非密码相关的错误时抛出错误
 * @example
 * ```typescript
 * const file = document.querySelector('input[type="file"]').files[0];
 * const isProtected = await isZipPasswordProtected(file);
 * if (isProtected) {
 *   console.log('文件需要密码');
 * } else {
 *   console.log('文件不需要密码');
 * }
 * ```
 */
export async function isZipPasswordProtected(file: File) {
  const zipReader = new ZipReader(new BlobReader(file))
  try {
    const entries = await zipReader.getEntries()
    if (!entries?.length) throw new Error('ZIP 文件中没有文件')

    // 取文件最小的非目录文件进行密码验证（避免读取目录）
    const entry = findSmallestZipFile(entries)
    if (!entry) throw new Error('ZIP 文件中没有非目录文件')

    try {
      // 无需实际获取数据，只需尝试读取以验证密码 成功返回undefined 失败弹出异常
      await entry.getData(new BlobWriter())
      return false // 能够成功读取数据，说明不需要密码
    } catch (error) {
      if (error instanceof Error && error.message.includes('File contains encrypted entry')) {
        return true // 抛出密码错误，说明需要密码
      }
      throw error // 其他错误继续抛出
    }
  } catch (error) {
    throw error
  } finally {
    await zipReader.close().catch(() => {})
  }
}

/**
 * 验证 ZIP 密码是否正确
 * @param file 要验证的 ZIP 文件
 * @param password 待测试密码
 * @returns boolean - 密码是否正确
 */
export async function verifyZipPassword(file: File, password?: string) {
  const zipReader = new ZipReader(new BlobReader(file), {
    password,
    checkPasswordOnly: true, // ✅ 正确放在 options 中
  })

  console.log(zipReader)
  try {
    const entries = await zipReader.getEntries()
    if (!entries?.length) throw new Error('ZIP 文件中没有文件')

    // 取文件最小的非目录文件进行密码验证（避免读取目录）
    const entry = findSmallestZipFile(entries)
    if (!entry) throw new Error('ZIP 文件中没有非目录文件')

    // 无需实际获取数据，只需尝试读取以验证密码 成功返回undefined 失败弹出异常
    await entry.getData(new BlobWriter())
    return true
  } catch (error) {
    if (error instanceof Error && error.message.includes('Invalid password')) {
      return false
    }
    // 其他错误继续抛出
    throw error
  } finally {
    // ✅ 确保 reader 被关闭，即使抛错也不会阻断
    await zipReader.close().catch(() => {})
  }
}
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

/**
 * 异步读取 ZIP 文件内容（支持 AES 加密）
 * @param file ZIP 文件
 * @param password 可选的解压密码
 * @returns ZipInfo 对象，包含文件名与条目列表
 */
export async function readZipAsync(file: File, password?: string) {
  const blob = new BlobReader(file)
  const zipReader = new ZipReader(blob, { password })

  try {
    const entries = await zipReader.getEntries()

    if (isUndefined(entries) || entries.length === 0) {
      throw new Error('ZIP 文件中没有文件条目')
    }

    const fileList = entries.map((entry, index) => {
      return {
        id: index,
        filename: entry.filename,
        size: entry.uncompressedSize,
        lastModified: entry.lastModDate,
        isDirectory: entry.directory,
        raw: entry,
      } as ZipFileInfoEntry
    })
    return fileList
  } catch (err) {
    if (err instanceof Error) {
      if (err.message?.includes('wrong password')) {
        throw new Error('解压失败：密码错误或文件已损坏')
      }
      throw new Error(`解压 ZIP 文件失败：${err.message}`)
    }

    // fallback：非 Error 类型时（极少数情况）
    throw new Error(`解压 ZIP 文件失败：${String(err)}`)
  } finally {
    await zipReader.close().catch(() => {})
  }
}
