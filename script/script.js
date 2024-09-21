const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const loadingMessage = document.createElement('div');
loadingMessage.innerText = "Loading model, please wait...";
loadingMessage.style.position = 'absolute';
loadingMessage.style.top = '50%';
loadingMessage.style.left = '50%';
loadingMessage.style.transform = 'translate(-50%, -50%)';
loadingMessage.style.backgroundColor = '#3498db';
loadingMessage.style.color = '#fff';
loadingMessage.style.padding = '10px 20px';
loadingMessage.style.borderRadius = '10px';
loadingMessage.style.fontSize = '18px';
document.body.appendChild(loadingMessage);

async function setupWebcam() {
    return new Promise((resolve, reject) => {
        const constraints = {
            video: true
        };
        navigator.mediaDevices.getUserMedia(constraints).then(stream => {
            video.srcObject = stream;
            video.addEventListener('loadeddata', () => resolve(), false);
        }).catch(err => reject(err));
    });
}

var score = 10

async function runObjectDetection() {
    const model = await cocoSsd.load() 
    await setupWebcam()

    loadingMessage.style.display = 'none';

    setInterval(async () => {
        const predictions = await model.detect(video);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        predictions.forEach(prediction => {
            const [x, y, width, height] = prediction.bbox;
            const text = `${prediction.class} (${Math.round(prediction.score * 100)}%)`;
            
            ctx.strokeStyle = '#e74c3c';
            ctx.lineWidth = 1; 
            ctx.strokeRect(x, y, width/3, height/4);
            
            ctx.fillStyle = '#e74c3c';
            ctx.font = '12px Arial'; 
            ctx.fillText(text, x, y > 10 ? y - 5 : 10);
        });
    }, 100);
}

runObjectDetection();
