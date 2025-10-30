/*
 * @Author: 白羽 1665169869@qq.com
 * @Date: 2025-10-30 11:58:51
 * @LastEditors: 白羽 1665169869@qq.com
 * @LastEditTime: 2025-10-30 14:22:35
 * @FilePath: \vite-steganography-vue\src\utils\zip.ts
 * @Description: ZIP 读取工具函数（支持 AES 加密）
 */

import { BlobReader, BlobWriter, ZipReader, type Entry } from '@zip.js/zip.js'

export interface ZipInfo {
  /** 原始 ZIP 文件对象 */
  zipFile: File
  /** ZIP 文件名 */
  zipName: string
  /** ZIP 中的文件条目 */
  zipFileList: Entry[]
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

  const result = {
    success: false,
    error: '',
  }
  try {
    const entries = await zipReader.getEntries()
    if (!entries?.length) throw new Error('ZIP 文件中没有文件')

    // 取第一个非目录文件进行密码验证（避免读取目录）
    const entry = entries.find((e) => !e.directory)
    if (!entry) throw new Error('ZIP 文件中没有非目录文件')

    await entry.getData(new BlobWriter())
    result.success = true
    return result
  } catch (error) {
    // ✅ 更精简、更一致的错误处理
    result.success = false
    result.error = error instanceof Error ? error.message : 'Unknown ZIP verification error'
    console.error(result.error)
    return result
  } finally {
    // ✅ 确保 reader 被关闭，即使抛错也不会阻断
    try {
      await zipReader.close()
    } catch {
      /* ignore close errors */
    }
  }
}

/**
 * 异步读取 ZIP 文件内容（支持 AES 加密）
 * @param file ZIP 文件
 * @param password 可选的解压密码
 * @returns ZipInfo 对象，包含文件名与条目列表
 */
export async function readZipAsync(file: File, password?: string): Promise<ZipInfo> {
  const zipReader = new ZipReader(new BlobReader(file), { password })

  try {
    const entries = await zipReader.getEntries()

    return {
      zipName: file.name,
      zipFile: file,
      zipFileList: entries ?? [],
    }
  } catch (err: unknown) {
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

/**
 * 判断文件是否为 ZIP 文件，直接读取文件头信息即可
 * @param file 待检测的文件
 * @returns 是否为 ZIP 文件
 */
export async function isZip(file: File): Promise<boolean> {
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
