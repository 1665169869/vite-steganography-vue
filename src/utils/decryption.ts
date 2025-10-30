import JsZip from 'jszip'

/**
 * 从mp4文件中直接尝试提取压缩包
 * @param rawFile - 原始文件
 */
export function try_mp4_direct_extraction(rawFile: File, password: string) {

  return JsZip.loadAsync(rawFile, {
    
  })
}
