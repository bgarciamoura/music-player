window.player = {
    capa            : document.querySelector('.card-image'),
    titulo          : document.querySelector('.card-content h5'),
    artista         : document.querySelector('.card-content .artista'),
    playPause       : document.querySelector('#play-pause'),
    mute            : document.querySelector('#mute'),
    volume          : document.querySelector('#vol-control'),
    seekbar         : document.querySelector('#seekbar'),
    currentDuration : document.querySelector('#current-duration'),
    totalDuration   : document.querySelector('#total-duration'),
    previousTrack   : document.querySelector('#previous'),
    nextTrack       : document.querySelector('#btn-next'),
    audio           : '',
    audioList       : audios,
    currentAudio    : {},
    currentPlaying  : 0,
    isPlaying       : false,
    isMuted         : false,
    actions() {
        this.playPause.onclick          = () => this.togglePlayPause(),
        this.mute.onclick               = () => this.toggleMute(),
        this.nextTrack.onclick          = () => this.next(),
        this.previousTrack.onclick      = () => this.previous(),
        this.volume.oninput             = () => this.setVolume(this.volume.value),
        this.volume.onchange            = () => this.setVolume(this.volume.value),
        this.seekbar.oninput            = () => this.setSeek(this.seekbar.value),
        this.seekbar.onchange           = () => this.setSeek(this.seekbar.value),
        this.totalDuration.innerHTML    = secondsToMinutes(this.audio.duration),
        this.seekbar.max                = this.audio.duration,        
        this.seekbar.value              = 0,
        this.audio.ontimeupdate         = () => this.timeUpdate(),
        this.audio.onended              = () => this.next()
    },
    start() {
        this.update()
    },
    play(){
        this.isPlaying = true
        this.playPause.innerHTML = "pause"
        this.audio.play()
    },
    pause(){
        this.isPlaying = false
        this.playPause.innerHTML = "play_arrow"
        this.audio.pause()
    },
    update() {
        this.currentAudio             = this.audioList[this.currentPlaying]
        this.capa.style.background    = `url('${path(this.currentAudio.cover)}') no-repeat center center / contain`
        this.titulo.innerHTML         = this.currentAudio.titulo
        this.artista.innerHTML        = this.currentAudio.artista
        this.createAudioElement(path(this.currentAudio.file))
        this.audio.onloadeddata = () => {
            this.actions()
        }
    },
    last() {
        this.currentPlaying = this.audioList.length - 1
        this.update()
    },
    restart() {
        this.currentPlaying = 0
        this.update()
    },
    previous() {
        this.currentPlaying--
        this.isPlaying = true
        if (this.currentPlaying < 0) {
            this.last()
        }
        this.update()
        this.play()
    },
    next() {
        this.currentPlaying++
        if (this.currentPlaying == this.audioList.length) {
            this.restart()
        }
        this.update()
        this.play()
    },
    createAudioElement(audio) {
        if(this.audio == ''){
            this.audio = new Audio(audio)
        } else {
            this.audio.src = audio
        }
        
        document.body.append(this.audio)
    },
    togglePlayPause() {
        (this.isPlaying) ? this.pause() : this.play()
    },
    toggleMute() {
        this.audio.muted = !this.audio.muted
        this.mute.innerHTML = this.audio.muted ? "volume_off" : "volume_up"
    },
    setVolume(value) {
        this.mute.innerHTML = this.validaVolume(value)
        this.audio.volume = value / 100
    },
    setSeek(value) {
        this.audio.currentTime = value
    },
    validaVolume(value){
        if (value == 0) {
            return "volume_off"    
        } else if (value > 0 && value < 50) {
            return "volume_down"
        } else {
            return "volume_up"
        }
    },
    timeUpdate(){
        this.currentDuration.innerHTML = secondsToMinutes(this.audio.currentTime)
        this.seekbar.value = this.audio.currentTime
    },
    destroyCurrentTagAudio(){
        console.log('destroi')
        this.audio.remove()
    }
    
    
}