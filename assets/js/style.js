/*
1. Render songs
2. Scroll top
3. Play / pause / seek /
4. CD rotate
5. Next / Previous
6. Random
7. Next/ Repeat when ended
8. Active song
9. Scroll active song into view
10. Play song when click
*/

const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)


const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const progress = $('#progress')
const cd = $('.cd')
const playBtn = $('.btn-toggle-play')
const nextBtn = $('.btn-next')
const volumePlus = $('.volume-plus')
const volumeMinus = $('.volume-minus')

const preBtn = $('.btn-previous')
const repeatBtn = $('.control .btn-repeat')
const randomBtn = $('.btn-random')
const songList = $$('.song')

const iconPlay = $('.control .icon-play')
const iconPause = $('.control .icon-pause')
const playList = $('.playlist')

function formatSecondsAsTime(secs, format) {
    var hr  = Math.floor(secs / 3600);
    var min = Math.floor((secs - (hr * 3600))/60);
    var sec = Math.floor(secs - (hr * 3600) -  (min * 60));
  
    if (min < 10){ 
      min = "0" + min; 
    }
    if (sec < 10){ 
      sec  = "0" + sec;
    }
  
    return min + ':' + sec;
  }


const app ={
    currentIndex: 0,
    isPlaying: false,
    isLoop: false,
    isRandom: false,
    volume: 1,
    songs: [
        {
            name: 'Ultimate weapon Alice OST 1',
            singer: 'Chung Chae Woong',
            path: '/assets/music/Ultimate weapon alice ost 1.mp3',
            image: '/assets/img/alice1.jpg'
        },
        {
            name: 'Ultimate weapon Alice OST 2',
            singer: 'Chung Chae Woong',
            path: '/assets/music/Ultimate weapon alice ost 2.mp3',
            image: '/assets/img/alice2.jpg'
        },
        {
            name: 'Ultimate weapon Alice OST 3',
            singer: 'Chung Chae Woong',
            path: '/assets/music/Ultimate weapon alice ost 3.mp3',
            image: '/assets/img/alice3.jpg'
        },
        {
            name: 'WANNABE',
            singer: 'ITZY',
            path: '/assets/music/ITZY-WANNABE.mp3',
            image: '/assets/img/wannabeItzy.png'
        },
        {
            name: 'NOT SHY',
            singer: 'ITZY',
            path: '/assets/music/ITZY-NOTSHY.mp3',
            image: '/assets/img/notshyItzy.jpg'
        },
        {
            name: 'TOMBOY',
            singer: 'GIDLE',
            path: '/assets/music/TOMBOY-GIDLE.mp3',
            image: '/assets/img/tomboyGidle.png'
        }
    ],
    render: function() {
        const htmls = this.songs.map((song, index) => {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index="${index}">
                <div class="thumb" 
                    style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                    <div class="title">${song.name}</div>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fa-solid fa-ellipsis"></i>
                </div>
            </div>
            `
        })
        playList.innerHTML = htmls.join('')
    },
    definedProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex]
            }    
        })
    },
    handleEvents: function() {
        const cdWidth = cd.offsetWidth
        
        document.onscroll = function() {
        const scrollTop =  document.documentElement.scrollTop || window.scrollY
        const newCdWidth = cdWidth - scrollTop
        
        cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0
        cd.style.opacity = newCdWidth / cdWidth
        }

        preBtn.onclick = function() {
            if(app.isRandom) {
                app.loadRandomSong()
            }
            else {
                app.loadPreSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        nextBtn.onclick = function() {
            if(app.isRandom) {
                app.loadRandomSong()
            }
            else {
                app.loadNextSong()
            }
            audio.play()
            app.render()
            app.scrollToActiveSong()
        }

        repeatBtn.onclick = function() {
            if(app.isLoop) {
                app.isLoop = !app.isLoop
                audio.removeAttribute('loop','')
                Object.assign(repeatBtn.style, {
                    color: '#666666'
                })
            }
            else {
                app.isLoop = !app.isLoop
                audio.setAttribute('loop','')
                Object.assign(repeatBtn.style, {
                    color: 'red'
                })
            }
        }
        
        randomBtn.onclick = function() {
            if(app.isRandom) {
                app.isRandom = !app.isRandom
                Object.assign(randomBtn.style, {
                    color: '#666666'
                })
            }
            else {
                app.isRandom = !app.isRandom
                Object.assign(randomBtn.style, {
                    color: 'red'
                })
            }
        }
        
        audio.onended = function() {
            if(app.isRandom) {
                app.loadRandomSong()
            }
            else {
                app.loadNextSong()
            }
            audio.play()
        }

        playList.onclick = function(e) {
            const songNode = e.target.closest('.song:not(.active)')
            if(songNode && !e.target.closest('.option') ) {
                if(songNode) {
                    app.currentIndex = Number(songNode.dataset.index) // dataset.index = getAttribute(.data-index)
                    app.loadCurrentSong()
                    audio.play()
                    app.render()
                }

                if(!e.target.closest('.option')) {

                }
            }
        }

        let cdThumbAnimate = cdThumb.animate([{
            transform: 'rotate(360deg)'
        }], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause()

        playBtn.onclick = function() {
            

            if(app.isPlaying) {
                app.isPlaying = !app.isPlaying
                audio.pause()
            }
            else {
                app.isPlaying = !app.isPlaying
                audio.play()
            }

        }
        
        volumePlus.onclick = function() {
            if(app.volume < 1) {
                app.volume += 0.1
                audio.volume = app.volume
            }
            else {
                audio.volume = 1
            }
        }

        volumeMinus.onclick = function() {
            if(app.volume > 0.1) {
                app.volume -= 0.1
                audio.volume = app.volume
            }
            else {
                audio.volume = 0
            }
        }

        audio.onplay = function() {
            app.isPlaying = true
            $('.control .icon-play').style.display = 'none'
            $('.control .icon-pause').style.display = 'block'
            cdThumbAnimate.play()    
        }
        audio.onpause = function() {
            app.isPlaying = false
            $('.control .icon-play').style.display = 'block'
            $('.control .icon-pause').style.display = 'none'
            cdThumbAnimate.pause()
        }
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100)
                progress.value = progressPercent
            }

            const currentTimeDiv = $('.current-time')
            const endedTimeDiv = $('.ended-time')

            const currTime = Math.floor(audio.currentTime).toString()
            const endedTime = Math.floor(audio.duration).toString()

            if(isNaN(endedTime)) {
                endedTimeDiv.innerHTML = `00:00`
            }
            else {
                endedTimeDiv.innerHTML = formatSecondsAsTime(endedTime)
            }

            if(isNaN(currTime)) {
                currentTimeDiv.innerHTML = `00:00`
            }
            else {
                currentTimeDiv.innerHTML = formatSecondsAsTime(currTime)
            }

        }

        progress.oninput = function(e) {
            const seekTime = Math.floor(e.target.value * audio.duration / 100)
            audio.currentTime = seekTime
        }
    },

    loadCurrentSong: function() {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url(${this.currentSong.image})`
        audio.src = this.currentSong.path
    },

    loadPreSong: function() {
        this.currentIndex--
        if(this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    loadNextSong: function() {
        this.currentIndex++
        if(this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    loadRandomSong: function() {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        }while (newIndex == this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },
    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior:'smooth',
                block: 'center',
            })
        }, 250)
    },
    start: function() {
        $('.control .icon-pause').style.display = 'none'

        //Dinh nghia thuoc thinh cho object
        this.definedProperties()
        //lang nghe va xu ly cac su kien (DOM events)
        this.handleEvents()
        // tai thong tin bai hat dau tien vao UI khi khoi chay web
        this.loadCurrentSong()
        //render cac bai hat
        this.render()
    }

}

app.start()

