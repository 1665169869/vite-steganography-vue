const path = require('path');
const fs = require('fs');

const mp4_name = "Rick Astley - Never Gonna Give You Up_1.mp4"

const input_path = path.join(__dirname, 'input', mp4_name);
const output_path = path.join(__dirname, 'output', path.basename(mp4_file));

const supportedExtensions = {
    'mp4': {
        methods: [
            { name: 'mp4_zarchiver', desc: 'MP4 ZArchiver模式提取' },
            { name: 'free_atom', desc: 'MP4 free原子方法' },
            { name: 'mp4_trailing', desc: 'MP4文件末尾ZIP提取（WinRAR兼容）' }
        ]
    }
};


function main() {
    if (!fs.existsSync(input_path)) {
        console.error(`Input file does not exist: ${input_path}`);
        return;
    }

    const mp4_file = fs.readFileSync(input_path);
    const ext = path.extname(mp4_name).slice(1).toLowerCase();

    if (!supportedExtensions[ext]) {
        console.error(`Unsupported file extension: .${ext}`);
        return;
    }

    console.log(`Supported extraction methods for .${ext}:`);
    
}

