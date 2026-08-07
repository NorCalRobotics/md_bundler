const state = {
    selectedFiles: [],
    archiveUrl: null
};

const elements = {
    fileInput: document.getElementById('file-input'),
    titleInput: document.getElementById('title-input'),
    fileList: document.getElementById('file-list'),
    summary: document.getElementById('selection-summary'),
    status: document.getElementById('status'),
    downloadArea: document.getElementById('download-area')
};

function setStatus(message, isError = false) {
    elements.status.textContent = message;
    elements.status.className = `status${isError ? ' error' : ''}${message ? ' visible' : ''}`;
}

function formatFileSize(bytes) {
    if (!bytes) {
        return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const size = bytes / Math.pow(1024, exponent);
    return `${size.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

function inferLanguage(file) {
    const name = (file.name || '').toLowerCase();
    const type = (file.type || '').toLowerCase();
    const extension = name.split('.').pop() || '';

    const extensionMap = {
        c: 'c',
        cc: 'cpp',
        cpp: 'cpp',
        cfg: 'ini',
        conf: 'ini',
        config: 'ini',
        cxx: 'cpp',
        css: 'css',
        desktop: 'ini',
        html: 'html',
        h: 'c',
        hpp: 'cpp',
        ics: 'ini',
        ini: 'ini',
        java: 'java',
        js: 'javascript',
        json: 'json',
        kt: 'kotlin',
        kml: 'xml',
        md: 'markdown',
        php: 'php',
        properties: 'ini',
        py: 'python',
        rs: 'rust',
        service: 'ini',
        sh: 'bash',
        ts: 'typescript',
        txt: 'text',
        xml: 'xml',
        yaml: 'yaml',
        yml: 'yaml'
    };

    if (extensionMap[extension]) {
        return extensionMap[extension];
    }

    const typeMap = {
        'application/json': 'json',
        'application/javascript': 'javascript',
        'application/x-javascript': 'javascript',
        'application/xml': 'xml',
        'text/css': 'css',
        'text/html': 'html',
        'text/javascript': 'javascript',
        'text/markdown': 'markdown',
        'text/plain': 'text',
        'text/xml': 'xml',
        'application/x-desktop': 'ini'
    };

    if (typeMap[type]) {
        return typeMap[type];
    }

    if (type.endsWith('+xml')) {
        return 'xml';
    }

    if (type.endsWith('+json')) {
        return 'json';
    }

    if (type.startsWith('text/x-script.')) {
        return type.slice('text/x-script.'.length);
    }

    if (type.startsWith('application/')) {
        return type.slice('application/'.length).replace(/^x-/, '');
    }

    if (type.startsWith('text/')) {
        return type.slice('text/'.length);
    }

    return '';
}

function normalizeLanguage(language) {
    if (!language) {
        return '';
    }

    const normalized = language.toLowerCase();
    if (normalized === 'c++' || normalized === 'cpp' || normalized === 'cxx' || normalized === 'x-c++') {
        return 'cpp';
    }

    return language;
}

function renderFileList() {
    elements.fileList.replaceChildren();

    if (!state.selectedFiles.length) {
        const placeholder = document.createElement('li');
        placeholder.className = 'empty';
        placeholder.textContent = 'No files selected yet.';
        elements.fileList.appendChild(placeholder);
        return;
    }

    const fragment = document.createDocumentFragment();
    state.selectedFiles.forEach((file) => {
        const item = document.createElement('li');
        item.className = 'file-item';

        const name = document.createElement('span');
        name.textContent = file.name;

        const size = document.createElement('small');
        size.textContent = formatFileSize(file.size);

        item.appendChild(name);
        item.appendChild(size);
        fragment.appendChild(item);
    });

    elements.fileList.appendChild(fragment);
}

function updateSummary() {
    if (!state.selectedFiles.length) {
        elements.summary.textContent = 'No files selected.';
        return;
    }

    elements.summary.textContent = `${state.selectedFiles.length} file(s) selected.`;
}

async function readFileText(file) {
    if (typeof file.text === 'function') {
        return file.text();
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => resolve(event.target?.result || '');
        reader.onerror = () => reject(reader.error || new Error('Unable to read file.'));
        reader.readAsText(file, 'utf-8');
    });
}

async function buildArchive() {
    const title = elements.titleInput.value.trim() || 'Archive';

    if (!state.selectedFiles.length) {
        setStatus('Select at least one file to build an archive.', true);
        return;
    }

    setStatus('Building archive...');

    let archiveContent = `# ${title}\n---\n\n`;

    for (const file of state.selectedFiles) {
        const language = normalizeLanguage(inferLanguage(file));
        let fileContent = await readFileText(file);

        if (!fileContent.endsWith('\n')) {
            fileContent += '\n';
        }

        archiveContent += `## ${file.name}\n\n`;
        if (language) {
            archiveContent += `\`\`\`\`${language}\n`;
        } else {
            archiveContent += '````\n';
        }
        archiveContent += `${fileContent}`;
        archiveContent += '````\n\n';
    }

    const blob = new Blob([archiveContent], { type: 'text/markdown;charset=utf-8' });

    if (state.archiveUrl) {
        URL.revokeObjectURL(state.archiveUrl);
    }

    state.archiveUrl = URL.createObjectURL(blob);
    elements.downloadArea.replaceChildren();

    const link = document.createElement('a');
    link.href = state.archiveUrl;
    link.download = 'archive.md';
    link.className = 'download-link';
    link.textContent = 'Download archive.md';
    elements.downloadArea.appendChild(link);

    const preview = document.createElement('pre');
    preview.className = 'preview';
    preview.textContent = archiveContent.slice(0, 1200);
    elements.downloadArea.appendChild(preview);

    setStatus(`Archive ready with ${state.selectedFiles.length} file(s).`);
}

function handleFileSelection(event) {
    state.selectedFiles = Array.from(event.target.files || []);
    updateSummary();
    renderFileList();

    if (state.selectedFiles.length) {
        setStatus(`${state.selectedFiles.length} file(s) selected.`);
    } else {
        setStatus('');
    }
}

function clearSelection() {
    state.selectedFiles = [];
    elements.fileInput.value = '';

    if (state.archiveUrl) {
        URL.revokeObjectURL(state.archiveUrl);
        state.archiveUrl = null;
    }

    elements.downloadArea.replaceChildren();
    const placeholder = document.createElement('p');
    placeholder.textContent = 'No archive generated yet.';
    elements.downloadArea.appendChild(placeholder);

    updateSummary();
    renderFileList();
    setStatus('Selection cleared.');
}

elements.fileInput.addEventListener('change', handleFileSelection);
document.getElementById('build-btn').addEventListener('click', buildArchive);
document.getElementById('clear-btn').addEventListener('click', clearSelection);

updateSummary();
renderFileList();
setStatus('');
