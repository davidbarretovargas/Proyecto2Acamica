let window_video = document.getElementById('window_video');
let btn_video = document.getElementById('btn_start');
let window_preview = document.getElementById('window_preview');
let uploading_img = document.getElementById('uploading_img');
let upload_img = document.getElementById('upload_img');
let is_recording = false;
let recorder;
let btn_repeat = document.getElementById('btn_repeat');
let temporizador = document.getElementById('temporizador');
let btnDowloadGif = document.getElementById('btnDowloadGif');
let linkMyGif = document.getElementById('linkMyGif');
let btn_1 = document.getElementById('btn_1');
let btn_2 = document.getElementById('btn_2');
let btn_3 = document.getElementById('btn_3');
let num1 = document.getElementById('num1');
let num2 = document.getElementById('num2');
let num3 = document.getElementById('num3');
function btn_blancos (){
    btn_1.classList.remove('morado');
    num1.classList.remove('blanco');
    btn_2.classList.remove('morado');
    num2.classList.remove('blanco');
    btn_3.classList.remove('morado');
    num3.classList.remove('blanco');
} 
btn_video.addEventListener('click', ()=>{
    switch(btn_video.textContent){
        case 'COMENZAR':
            startdivice();
            btn_video.textContent = 'GRABAR';
            window_video.hidden = false;
            window_preview.classList.add('hide');
            btn_1.classList.add('morado');
            num1.classList.add('blanco');
            break;
        case 'GRABAR':
            startrecord();
            btn_video.textContent = 'FINALIZAR';
            btn_1.classList.remove('morado');
            btn_2.classList.add('morado');
            num1.classList.remove('blanco');
            num2.classList.add('blanco');
            break;
        case 'FINALIZAR':
            stoprecord();
            btn_video.textContent = 'SUBIR GIFO';
            window_preview.classList.remove('hide');
            btn_repeat.classList.remove('hide');
            break;
        case 'SUBIR GIFO':
            uploading_img.classList.remove('hide');
            btn_repeat.classList.add('hide');
            btn_2.classList.remove('morado');
            num2.classList.remove('blanco');
            btn_3.classList.add('morado');
            num3.classList.add('blanco');
            uploadGifo();
            break;
    }
});
btn_repeat.addEventListener('click',()=>{
    startdivice();
    btn_video.textContent = 'GRABAR';
    window_video.hidden = false;
    window_preview.classList.add('hide');
    btn_repeat.classList.add('hide');
});
const startdivice = ()=>{
    navigator.mediaDevices.getUserMedia({video: true, audio: false}).then((stream)=>{
        window_video.srcObject = stream;
        window_video.play();
    });
};
const stopdivice = async(recorder)=>{
    stream.getTracks().forEach(function(track) {
        track.stop();
        recorder.stopRecording();
        is_recording=false;
        window_video.removeAttribute('src');
        window_video.load();
    });
};
const startrecord = ()=>{
    recorder = new RecordRTC(window_video.srcObject, {
        type: 'gif',
        frameRate: 1,
        quality: 10,
        width: 360,
        height: 240,
    });
    recorder.startRecording();
    is_recording = true;
    timer();
};
const stoprecord = () =>{
    recorder.stopRecording();
    is_recording=false
    let blob = recorder.getBlob();
    window_video.hidden = true;
    window_preview.classList.remove('hide');
    window_preview.setAttribute('src',URL.createObjectURL(blob));
    stopDivice();
    clearTimeout(t);
};
const stopDivice = ()=>{
    let tracks = window_video.srcObject.getTracks();
	tracks[0].stop();
};
let uploadGifo = () =>{
    btn_video.hidden=true;
    var form = new FormData();
    form.append('api_key','IkuYt6UrCtsIzd7Oj3xL7o32GrO1B6Ud');
    form.append('file',recorder.getBlob(),'misGifos.gif');
    fetch('https://upload.giphy.com/v1/gifs', {
        method: "POST",
        body: form
    }).then((resp)=>{
        resp.json().then((data)=>{
            btn_video.textContent = 'COMENZAR';
            let misGifos = localStorage.getItem('misGifos') == null?[]:localStorage.getItem('misGifos').split(',');
            misGifos.push(data.data.id);
            console.log(misGifos);
            localStorage.setItem('misGifos',misGifos);
            uploading_img.classList.add('hide');
            upload_img.classList.remove('hide');
            localStorage.setItem('resentUp',data.data.id);
        });
    });
}
btnDowloadGif.addEventListener('click', () => {
    descargarGif(URL.createObjectURL(recorder.getBlob()),'nuevoGif.gif');
});
linkMyGif.addEventListener('click',()=>{
    var link = document.createElement('a');
    link.target='blank';
    link.href=`https://giphy.com/gifs/${localStorage.getItem('resentUp')}`;
    link.click();
});
function add() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }
    temporizador.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}
let t;
let hours = 0;
let minutes = 0;
let seconds = 0;
function timer() {
    t = setTimeout(add, 10);
}
