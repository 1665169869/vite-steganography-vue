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

      if (!isFile) current = node.children!;
    });
  }

  // ✅ 递归排序：文件夹在前，文件在后
  function sortTree(nodes: FileNode[]): void {
    nodes.sort((a, b) => {
      const aIsDir = !!a.children;
      const bIsDir = !!b.children;
      if (aIsDir !== bIsDir) return aIsDir ? -1 : 1; // 文件夹在前
      return a.label.localeCompare(b.label, 'en');   // 同类型按字母顺序
    });

    for (const node of nodes) {
      if (node.children) sortTree(node.children);
    }
  }

  sortTree(root);
  return root;
}
