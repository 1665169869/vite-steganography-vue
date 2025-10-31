import type { Entry } from "@zip.js/zip.js"

export interface UnZipOptions {
  file: File
  password?: string
  useWebWorkers?: boolean
  onprogress?: (loaded: number, total: number) => void
}

export interface ZipDataEntry {
  filename: string
  size: number
  raw: File
  entries?: Entry[]
}
