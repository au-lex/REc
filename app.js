const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const videoElement = document.getElementById('video');

let mediaRecorder;
let recordedChunks = [];
let localStream;

startButton.onclick = async () => {
    // Capture the screen using WebRTC's getDisplayMedia
    localStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
    });

    videoElement.srcObject = localStream; // Preview the captured stream
    videoElement.play();

    startButton.disabled = true;
    stopButton.disabled = false;

    mediaRecorder = new MediaRecorder(localStream);

    mediaRecorder.ondataavailable = event => {
        if (event.data.size > 0) {
            recordedChunks.push(event.data);
        }
    };

    mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunks, {
            type: 'video/webm'
        });
        videoElement.srcObject = null;
        videoElement.src = URL.createObjectURL(blob);
        videoElement.play();
        localStream.getTracks().forEach(track => track.stop());
    };

    mediaRecorder.start();
};

stopButton.onclick = () => {
    mediaRecorder.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
};
