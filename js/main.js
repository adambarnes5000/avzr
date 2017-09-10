const BARS_COUNT = 256;

window.onload = function () {
    "use strict";
    var canvas = document.getElementById("avCanvas");
    var context = canvas.getContext("2d");

    var gradient = context.createLinearGradient(0, 0, 0, 800);
    gradient.addColorStop(0, "red");
    gradient.addColorStop(1, "green");
    context.fillStyle = gradient;

    var startAnalyzing = function (stream) {
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource(stream);
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = BARS_COUNT * 4;
        analyser.smoothingTimeConstant = 0.8;
        analyser.minDecibels = -100;
        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);
        var timeArray = new Uint8Array(analyser.frequencyBinCount);

        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
            analyser.getByteTimeDomainData(timeArray);
            var adjustedLength;
            var adjustedLength2;
            var barWidth = Math.floor(context.canvas.width / BARS_COUNT);
            var barDisplayWidth = Math.floor(barWidth * 0.9);
            var barHeight = context.canvas.height
            var barHeightUnit = Math.floor(barHeight / 256)
            for (var i = 1; i <= BARS_COUNT; i++) {
                adjustedLength = frequencyArray[i - 1] * barHeightUnit;
                adjustedLength2 = timeArray[i - 1] * barHeightUnit;

                context.fillStyle = "#000000";
                context.fillRect((i+16) * barWidth, 0, barWidth, barHeight);

                context.fillStyle = gradient;
                context.fillRect((i+16) * barWidth, barHeight - adjustedLength, barDisplayWidth, adjustedLength);

                context.fillStyle = "#ffffff";
                context.fillRect((i+16) * barWidth, (barHeight/2) - adjustedLength2, barWidth, 1);
            }
        }
        doDraw();
    }

    var showError = function (error) {
        alert("You must allow your microphone.");
        console.log(error);
    }

    navigator.getUserMedia({ audio: true }, startAnalyzing, showError);

};
