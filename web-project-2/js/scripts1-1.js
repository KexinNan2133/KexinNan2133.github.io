function calculateVolume() {
    const length = parseFloat(document.getElementById('length').value);
    const width = parseFloat(document.getElementById('width').value);
    const height = parseFloat(document.getElementById('height').value);

    if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
        alert('请输入有效的数值');
        return;
    }

    const volume = length * width * height;
    document.getElementById('packageVolume').value = volume;
    document.getElementById('volumeResult').innerHTML = `外包装容积: ${volume.toFixed(2)} 立方毫米`;
}

function calculate() {
    const netWeight = parseFloat(document.getElementById('netWeight').value);
    const packageVolume = parseFloat(document.getElementById('packageVolume').value);
    
    if (isNaN(netWeight) || isNaN(packageVolume) || netWeight <= 0 || packageVolume <= 0) {
        alert('请输入有效的数值');
        return;
    }
    
    const voidSpace = packageVolume - 9 * 1000 * netWeight;
    const voidRate = (voidSpace / packageVolume) * 100;
    
    let maxVoidRate;
    if (netWeight <= 1) {
        maxVoidRate = 85;
    } else if (netWeight <= 5) {
        maxVoidRate = 70;
    } else if (netWeight <= 15) {
        maxVoidRate = 60;
    } else if (netWeight <= 30) {
        maxVoidRate = 50;
    } else if (netWeight <= 50) {
        maxVoidRate = 40;
    } else {
        maxVoidRate = 30;
    }
    
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `空隙空间: ${voidSpace.toFixed(2)} 立方毫米<br>空隙率: ${voidRate.toFixed(2)}%<br>最大允许空隙率: ${maxVoidRate}%<br>`;
    
    if (voidRate <= maxVoidRate) {
        resultDiv.innerHTML += '<span style="color: green;">包装符合要求</span>';
    } else {
        resultDiv.innerHTML += '<span style="color: red;">包装不符合要求</span>';
    }
}
