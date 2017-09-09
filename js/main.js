window.onload = function () {
    "use strict";
    var canvas = document.getElementById("avCanvas");
    var ctx = canvas.getContext("2d");
    
    // Create gradient
    var grd = ctx.createLinearGradient(0,0,0,800);
    grd.addColorStop(0,"red");
    grd.addColorStop(1,"green");
    
    // Fill with gradient
    ctx.fillStyle = grd;
    

    var soundAllowed = function (stream) {
        window.persistAudioStream = stream;
        var audioContent = new AudioContext();
        var audioStream = audioContent.createMediaStreamSource(stream);
        var analyser = audioContent.createAnalyser();
        audioStream.connect(analyser);
        analyser.fftSize = 32;
        var frequencyArray = new Uint8Array(analyser.frequencyBinCount);

        var doDraw = function () {
            requestAnimationFrame(doDraw);
            analyser.getByteFrequencyData(frequencyArray);
            var adjustedLength;
            for (var i = 1; i <= frequencyArray.length; i++) {
                adjustedLength = frequencyArray[i-1] * 3;
                ctx.fillStyle="#000000";
                ctx.fillRect(i*100, 0, 100, 800);
                
                
                ctx.fillStyle=grd;
                ctx.fillRect(i*100, 800-adjustedLength, 80, adjustedLength);
            }
        }
        doDraw();
    }

    var soundNotAllowed = function (error) {
        alert("You must allow your microphone.");
        console.log(error);
    }

    navigator.getUserMedia({ audio: true }, soundAllowed, soundNotAllowed);

};
