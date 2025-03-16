const imageInput = document.getElementById('imageInput');
const watermarkText = document.getElementById('watermarkText');
const fontSizeInput = document.getElementById('fontSize');
const fontColorInput = document.getElementById('fontColor');
const angleInput = document.getElementById('angle');
const angleValue = document.getElementById('angleValue');
const angleNumber = document.getElementById('angleNumber');
const positionXInput = document.getElementById('positionX');
const positionXValue = document.getElementById('positionXValue');
const positionYInput = document.getElementById('positionY');
const positionYValue = document.getElementById('positionYValue');
const textAlignInput = document.getElementById('textAlign');
const exportBtn = document.getElementById('exportBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const scaleInput = document.getElementById('scale');
const compressionInput = document.getElementById('compression');
const imageWidth = document.getElementById('imageWidth');
const imageHeight = document.getElementById('imageHeight');
const imageSize = document.getElementById('imageSize');
const widthInput = document.getElementById('widthInput');
const heightInput = document.getElementById('heightInput');
const standardSize = document.getElementById('standardSize');
let img = new Image();

let batchImageData = [];

angleInput.addEventListener('input', () => {
    angleValue.textContent = angleInput.value;
    angleNumber.value = angleInput.value;
    if (img.src) redraw();
    updateBatchPreviews();
});

angleNumber.addEventListener('input', () => {
    angleInput.value = angleNumber.value;
    angleValue.textContent = angleNumber.value;
    if (img.src) redraw();
    updateBatchPreviews();
});

watermarkText.addEventListener('input', () => {
    redraw();
    updateBatchPreviews();
});

fontSizeInput.addEventListener('input', () => {
    redraw();
    updateBatchPreviews();
});

fontColorInput.addEventListener('input', () => {
    redraw();
    updateBatchPreviews();
});

positionXInput.addEventListener('input', () => {
    positionXValue.textContent = positionXInput.value;
    if (img.src) redraw();
    updateBatchPreviews();
});

positionYInput.addEventListener('input', () => {
    positionYValue.textContent = positionYInput.value;
    if (img.src) redraw();
    updateBatchPreviews();
});

textAlignInput.addEventListener('change', () => {
    redraw();
    updateBatchPreviews();
});

function compressImage(img, quality, callback) {
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;
    tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
    tempCanvas.toBlob((blob) => {
        const compressedImg = new Image();
        const url = URL.createObjectURL(blob);
        compressedImg.onload = () => {
            callback(compressedImg);
            URL.revokeObjectURL(url);
        };
        compressedImg.src = url;
    }, 'image/jpeg', quality);
}

imageInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(event) {
        img = new Image();
        img.onload = function() {
            compressImage(img, compressionInput.value / 100, (compressedImg) => {
                img = compressedImg;
                canvas.width = img.width;
                canvas.height = img.height;
                imageWidth.textContent = img.width;
                imageHeight.textContent = img.height;
                imageSize.textContent = (file.size / 1024).toFixed(2);
                redraw();
            });
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(file);
});

scaleInput.addEventListener('input', () => {
    if (img.src) redraw();
    updateBatchPreviews();
});

widthInput.addEventListener('input', () => {
    if (img.src) redraw();
    updateBatchPreviews();
});

heightInput.addEventListener('input', () => {
    if (img.src) redraw();
    updateBatchPreviews();
});

standardSize.addEventListener('change', () => {
    const [width, height] = standardSize.value.split(',');
    if (width && height) {
        widthInput.value = width;
        heightInput.value = height;
        if (img.src) redraw();
        updateBatchPreviews();
    }
});

function redraw() {
    if (!img.src) return;
    const scale = scaleInput.value / 100;
    const width = widthInput.value ? widthInput.value : img.width * scale;
    const height = heightInput.value ? heightInput.value : img.height * scale;
    canvas.width = width;
    canvas.height = height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    if (!img.src) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    
    const watermark = watermarkText.value;
    const fontSize = parseInt(fontSizeInput.value, 10);
    ctx.font = `${fontSize}px sans-serif`;
    ctx.fillStyle = fontColorInput.value;
    ctx.textBaseline = "middle";
    ctx.textAlign = textAlignInput.value;

    const x = (canvas.width * positionXInput.value) / 100;
    const y = (canvas.height * positionYInput.value) / 100;
    
    ctx.save();
    ctx.translate(x, y);
    const angle = angleInput.value * Math.PI / 180;
    ctx.rotate(angle);

    const lines = watermark.split('\n');
    const lineHeight = fontSize * 1.2;

    for (let i = 0; i < lines.length; i++) {
        ctx.fillText(lines[i], 0, (i - lines.length / 2) * lineHeight);
    }

    ctx.restore();
}

exportBtn.addEventListener('click', () => {
    const canvas = document.getElementById('canvas');
    const format = document.getElementById('imageFormat').value;
    const compression = document.getElementById('compression').value / 100;

    let mimeType;
    switch (format) {
        case 'jpeg':
            mimeType = 'image/jpeg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        default:
            mimeType = 'image/png';
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `exported_image.${format}`;
        link.click();
    }, mimeType, compression);
});

const batchImageInput = document.getElementById('batchImageInput');
const batchExportBtn = document.getElementById('batchExportBtn');
const batchPreview = document.getElementById('batchPreview');

batchImageInput.addEventListener('change', (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    batchImageData = [];
    let filesProcessed = 0;
    
    files.forEach((file) => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const tempImg = new Image();
            tempImg.onload = function() {
                compressImage(tempImg, compressionInput.value / 100, (compressedImg) => {
                    batchImageData.push({ file: file, dataURL: compressedImg.src });
                    filesProcessed++;
                    if (filesProcessed === files.length) {
                        updateBatchPreviews();
                    }
                });
            };
            tempImg.src = event.target.result;
        }
        reader.readAsDataURL(file);
    });
});

function updateBatchPreviews() {
    batchPreview.innerHTML = "";
    batchImageData.forEach((item) => {
        const tempImg = new Image();
        tempImg.onload = function() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = tempImg.width;
            tempCanvas.height = tempImg.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(tempImg, 0, 0, tempCanvas.width, tempCanvas.height);

            const watermark = watermarkText.value;
            const fontSize = parseInt(fontSizeInput.value, 10);
            tempCtx.font = `${fontSize}px sans-serif`;
            tempCtx.fillStyle = fontColorInput.value;
            tempCtx.textBaseline = "middle";
            tempCtx.textAlign = textAlignInput.value;

            const x = (tempCanvas.width * positionXInput.value) / 100;
            const y = (tempCanvas.height * positionYInput.value) / 100;
                          
            tempCtx.save();
            tempCtx.translate(x, y);
            const angle = angleInput.value * Math.PI / 180;
            tempCtx.rotate(angle);

            const lines = watermark.split('\n');
            const lineHeight = fontSize * 1.2;

            for (let i = 0; i < lines.length; i++) {
                tempCtx.fillText(lines[i], 0, (i - lines.length / 2) * lineHeight);
            }

            tempCtx.restore();

            batchPreview.appendChild(tempCanvas);
        }
        tempImg.src = item.dataURL;
    });
}

batchExportBtn.addEventListener('click', () => {
    if (batchImageData.length === 0) {
        alert("请先上传多张图片。");
        return;
    }
    const compression = compressionInput.value;
    batchImageData.forEach((item) => {
        const tempImg = new Image();
        tempImg.onload = function() {
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = tempImg.width;
            tempCanvas.height = tempImg.height;
            const tempCtx = tempCanvas.getContext('2d');
            tempCtx.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
            tempCtx.drawImage(tempImg, 0, 0, tempCanvas.width, tempCanvas.height);

            const watermark = watermarkText.value;
            const fontSize = parseInt(fontSizeInput.value, 10);
            tempCtx.font = `${fontSize}px sans-serif`;
            tempCtx.fillStyle = fontColorInput.value;
            tempCtx.textBaseline = "middle";
            tempCtx.textAlign = textAlignInput.value;

            const x = (tempCanvas.width * positionXInput.value) / 100;
            const y = (tempCanvas.height * positionYInput.value) / 100;
                          
            tempCtx.save();
            tempCtx.translate(x, y);
            const angle = angleInput.value * Math.PI / 180;
            tempCtx.rotate(angle);

            const lines = watermark.split('\n');
            const lineHeight = fontSize * 1.2;

            for (let i = 0; i < lines.length; i++) {
                tempCtx.fillText(lines[i], 0, (i - lines.length / 2) * lineHeight);
            }

            tempCtx.restore();

            const link = document.createElement('a');
            const baseName = item.file.name.replace(/\.(png|jpe?g|gif)$/i, '');
            link.download = baseName + '-watermarked.png';
            link.href = tempCanvas.toDataURL('image/png', compression / 100);
            link.click();
        }
        tempImg.src = item.dataURL;
    });
});document.getElementById('exportBtn').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const format = document.getElementById('imageFormat').value;
    const compression = document.getElementById('compression').value / 100;

    let mimeType;
    switch (format) {
        case 'jpeg':
            mimeType = 'image/jpeg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        default:
            mimeType = 'image/png';
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `exported_image.${format}`;
        link.click();
    }, mimeType, compression);
});

// Update angle value display
document.getElementById('angle').addEventListener('input', function() {
    document.getElementById('angleValue').textContent = this.value;
    document.getElementById('angleNumber').value = this.value;
});

document.getElementById('angleNumber').addEventListener('input', function() {
    document.getElementById('angle').value = this.value;
    document.getElementById('angleValue').textContent = this.value;
});

// Update position X value display
document.getElementById('positionX').addEventListener('input', function() {
    document.getElementById('positionXValue').textContent = this.value;
});

document.getElementById('positionX').addEventListener('input', function() {
    document.getElementById('positionXValue').textContent = this.value;
});

// Update position Y value display
document.getElementById('positionY').addEventListener('input', function() {
    document.getElementById('positionYValue').textContent = this.value;
});

document.getElementById('positionY').addEventListener('input', function() {
    document.getElementById('positionYValue').textContent = this.value;
});

// Handle batch export
document.getElementById('batchExportBtn').addEventListener('click', function() {
    const files = document.getElementById('batchImageInput').files;
    const format = document.getElementById('imageFormat').value;
    const compression = document.getElementById('compression').value / 100;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let mimeType;
                switch (format) {
                    case 'jpeg':
                        mimeType = 'image/jpeg';
                        break;
                    case 'webp':
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'image/png';
                }

                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${file.name.split('.')[0]}.${format}`;
                    link.click();
                }, mimeType, compression);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
});document.getElementById('exportBtn').addEventListener('click', function() {
    const canvas = document.getElementById('canvas');
    const format = document.getElementById('imageFormat').value;
    const compression = document.getElementById('compression').value / 100;

    let mimeType;
    switch (format) {
        case 'jpeg':
            mimeType = 'image/jpeg';
            break;
        case 'webp':
            mimeType = 'image/webp';
            break;
        default:
            mimeType = 'image/png';
    }

    canvas.toBlob(function(blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `exported_image.${format}`;
        link.click();
    }, mimeType, compression);
});

// Update angle value display
document.getElementById('angle').addEventListener('input', function() {
    document.getElementById('angleValue').textContent = this.value;
    document.getElementById('angleNumber').value = this.value;
});

document.getElementById('angleNumber').addEventListener('input', function() {
    document.getElementById('angle').value = this.value;
    document.getElementById('angleValue').textContent = this.value;
});

// Update position X value display
document.getElementById('positionX').addEventListener('input', function() {
    document.getElementById('positionXValue').textContent = this.value;
});

document.getElementById('positionX').addEventListener('input', function() {
    document.getElementById('positionXValue').textContent = this.value;
});

// Update position Y value display
document.getElementById('positionY').addEventListener('input', function() {
    document.getElementById('positionYValue').textContent = this.value;
});

document.getElementById('positionY').addEventListener('input', function() {
    document.getElementById('positionYValue').textContent = this.value;
});

// Handle batch export
document.getElementById('batchExportBtn').addEventListener('click', function() {
    const files = document.getElementById('batchImageInput').files;
    const format = document.getElementById('imageFormat').value;
    const compression = document.getElementById('compression').value / 100;

    Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);

                let mimeType;
                switch (format) {
                    case 'jpeg':
                        mimeType = 'image/jpeg';
                        break;
                    case 'webp':
                        mimeType = 'image/webp';
                        break;
                    default:
                        mimeType = 'image/png';
                }

                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `${file.name.split('.')[0]}.${format}`;
                    link.click();
                }, mimeType, compression);
            };
            img.src = event.target.result;
        };
        reader.readAsDataURL(file);
    });
});
