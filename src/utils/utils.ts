export interface FileNode {
  label: string;
  size?: number;
  children?: FileNode[];
}

/**
 * 将扁平的文件列表转换为树形结构
 * @param files
 * @returns
 */
export function buildFileTree(files: { filename: string; size: number }[]): FileNode[] {
  const root: FileNode[] = [];

  for (const { filename, size } of files) {
    const parts = filename.split('/');
    let current = root;

    parts.forEach((part, i) => {
      const isFile = i === parts.length - 1;
      let node = current.find(item => item.label === part);

      if (!node) {
        node = isFile
          ? { label: part, size }              // 文件节点
          : { label: part, children: [] };     // 文件夹节点
        current.push(node);
      }

      if (!isFile) {
        // 进入子目录继续处理
        current = node.children!;
      }
    });
  }

  return root;
}
