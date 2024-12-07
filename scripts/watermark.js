document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const previewContainer = document.getElementById('previewContainer');
    const originalPreview = document.getElementById('originalPreview');
    const processedPreview = document.getElementById('processedPreview');
    const watermarkSelector = document.getElementById('watermarkSelector');
    const selectWatermarkBtn = document.getElementById('selectWatermark');
    const removeWatermarkBtn = document.getElementById('removeWatermark');
    const downloadBtn = document.getElementById('downloadBtn');

    let isSelecting = false;
    let startX, startY;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImageUpload(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 选择水印区域
    selectWatermarkBtn.addEventListener('click', () => {
        isSelecting = true;
        watermarkSelector.style.display = 'block';
        originalPreview.style.cursor = 'crosshair';
    });

    // 鼠标事件处理
    originalPreview.addEventListener('mousedown', (e) => {
        if (!isSelecting) return;
        const rect = originalPreview.getBoundingClientRect();
        startX = e.clientX - rect.left;
        startY = e.clientY - rect.top;
        
        watermarkSelector.style.left = startX + 'px';
        watermarkSelector.style.top = startY + 'px';
        watermarkSelector.style.width = '0px';
        watermarkSelector.style.height = '0px';
    });

    originalPreview.addEventListener('mousemove', (e) => {
        if (!isSelecting || e.buttons !== 1) return;
        const rect = originalPreview.getBoundingClientRect();
        const currentX = e.clientX - rect.left;
        const currentY = e.clientY - rect.top;
        
        const width = currentX - startX;
        const height = currentY - startY;
        
        watermarkSelector.style.width = Math.abs(width) + 'px';
        watermarkSelector.style.height = Math.abs(height) + 'px';
        watermarkSelector.style.left = (width < 0 ? currentX : startX) + 'px';
        watermarkSelector.style.top = (height < 0 ? currentY : startY) + 'px';
    });

    originalPreview.addEventListener('mouseup', () => {
        if (!isSelecting) return;
        isSelecting = false;
        originalPreview.style.cursor = 'default';
    });

    // 去除水印
    removeWatermarkBtn.addEventListener('click', () => {
        // 这里实现水印去除逻辑
        // 使用选定的区域坐标进行图片处理
        processImage();
    });

    // 处理图片上传
    function handleImageUpload(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            processedPreview.src = e.target.result;
            previewContainer.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }

    // 处理图片（去除水印）
    function processImage() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        canvas.width = originalPreview.naturalWidth;
        canvas.height = originalPreview.naturalHeight;
        
        // 绘制原始图片
        ctx.drawImage(originalPreview, 0, 0);
        
        // 获取选定区域的坐标
        const rect = watermarkSelector.getBoundingClientRect();
        const imageRect = originalPreview.getBoundingClientRect();
        
        // 计算选定区域在原始图片中的位置
        const scaleX = originalPreview.naturalWidth / imageRect.width;
        const scaleY = originalPreview.naturalHeight / imageRect.height;
        
        const x = (rect.left - imageRect.left) * scaleX;
        const y = (rect.top - imageRect.top) * scaleY;
        const width = rect.width * scaleX;
        const height = rect.height * scaleY;
        
        // 使用内容感知填充算法去除水印
        // 这里使用简单的模糊效果代替
        // 实际应用中可以使用更复杂的算法
        ctx.filter = 'blur(5px)';
        ctx.drawImage(originalPreview, x, y, width, height, x, y, width, height);
        
        // 显示处理后的图片
        processedPreview.src = canvas.toDataURL('image/jpeg', 0.9);
        
        // 设置下载按钮
        downloadBtn.onclick = () => {
            const link = document.createElement('a');
            link.download = 'processed-image.jpg';
            link.href = processedPreview.src;
            link.click();
        };
    }
}); 