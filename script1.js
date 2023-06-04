const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const player = $('.player');
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const playBtn = $('.btn-toggle-play');
const progress = $('#progress');
const prevBtn = $('.btn-prev');
const nextBtn = $('.btn-next');
const randomBtn = $('.btn-random');
const repeatBtn = $('.btn-repeat');
const playlist = $('.playlist');

const app = {
    currentIndex: 0,
    isPlaying: false,
    isRandom: false,
    isRepeat: false,
    songs: [
            {
            name: "Whatcha say",
            singer: "Jason Derulo",
            path: "./media/music/Jason_Derulo_Whatcha_Say_Official_Music_Video_.mp3",
            image: "./media/img/whatchasay.jpeg"
            },
            {
            name: "Cupid",
            singer: "Fifty Fifty",
            path: "./media/music/FIFTY_FIFTY_Cupid_Twin_Version_Lyrics_I_gave.mp3",
            image: "./media/img/cupid.png"
            },
            {
            name: "Boy's Liar",
            singer: "Pink Pantheress",
            path: "./media/music/PinkPantheress_Ice_Spice_Boy’s_a_liar_Pt_2_Of.mp3",
            image: "./media/img/boysaliar.jpeg"
            },
            {
            name: "Apologize",
            singer: "Timbaland",
            path:
                "./media/music/Timbaland_Apologize_ft_OneRepublic.mp3",
            image:
                "https://sun9-17.userapi.com/impf/UuG0z8MWaVay3Sn47hDsUe0ZcPnTt7w1VXlqLw/vNkeGs2ISbY.jpg?size=506x425&quality=96&sign=626d63026188456d7748734f5fcfba8b&c_uniq_tag=Iq1p2YTvKgK94m4jOJYDc5bZ6bCdHfk273cBUNRlcTs&type=album"
            },
            {
            name: "Shivers",
            singer: "Ed Sheeran",
            path: "./media/music/Ed_Sheeran_Shivers_Official_Video_.mp3",
            image: "./media/img/shivers.jpeg"        
            },
            {
            name: "Sunroof",
            singer: "Nicky Youre",
            path: "./media/music/Nicky_Youre_dazy_Sunroof_Lyrics_.mp3",
            image:
                "./media/img/sunroof.jpeg"
            },
            
            {
            name: "Mood",
            singer: "24kGoldn",
            path: "./media/music/24kGoldn_Mood_Official_Video_ft_iann_dior.mp3",
            image: "./media/img/24kGoldnMood.png"         
            },
            {
            name: "Damn",
            singer: "Raftaar x KrSNa",
            path: "./media/music/Damn Song Raftaar Ft KrSNa.mp3",
            image: "./media/img/damn.jpeg"
            }
        ],
    
    render: function() {
        const htmls = this.songs.map((song, index)=> {
            return `
            <div class="song ${index === this.currentIndex ? 'active' : ''}" data-index=${index}>
                <div class="thumb" style="background-image: url('${song.image}');">
                </div>
                <div class="body">
                <h3 class="title">${song.name}</h3>
                <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>
            `
        })
        playlist.innerHTML = htmls.join('');
    },

    defineProperties: function() {
        Object.defineProperty(this, 'currentSong', {
            get: function() {
                return this.songs[this.currentIndex];
            }
        })
    },

    handleEvents: function() {
        const cdWidth = cd.offsetWidth;
        
        const _this = this;

        // Handle CD rotates / pause
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'}
        ], {
            duration: 10000,
            iterations: Infinity
        })
        cdThumbAnimate.pause();

        // When scroll the app
        document.onscroll = function() {
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const newCdWidth = cdWidth - scrollTop;

            cd.style.width = newCdWidth > 0 ? newCdWidth + 'px' : 0;
            cd.style.opacity = newCdWidth / cdWidth;
        }

        // Handle play or pause button
        playBtn.onclick = function() {
            if(_this.isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
                
        }

        audio.onplay = function() {
            _this.isPlaying = true;
            player.classList.add('playing');
            cdThumbAnimate.play();
        }

        audio.onpause = function() {
            _this.isPlaying = false;
            player.classList.remove('playing');
            cdThumbAnimate.pause();
        }
        // when change the progress of a song
        audio.ontimeupdate = function() {
            if(audio.duration) {
                const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
                progress.value = progressPercent;
            }
        }
        
        progress.onchange = function(e) {
            const seekTime = audio.duration / 100 * e.target.value;
            audio.currentTime = seekTime;
        }
        // When click next button
        nextBtn.onclick = function() {
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.nextSong();              
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();            
        }
        // When click previous button
        prevBtn.onclick = function(){
            if (_this.isRandom) {
                _this.playRandomSong();
            } else {
                _this.prevSong();          
            }
            audio.play(); 
            _this.render();
            _this.scrollToActiveSong();         
        }

        // When click random button
        randomBtn.onclick = function(e) {
            _this.isRandom = !_this.isRandom;
            randomBtn.classList.toggle('active', _this.isRandom);          
        }

        // When click repeat button
        repeatBtn.onclick = function() {
            _this.isRepeat = !_this.isRepeat;
            repeatBtn.classList.toggle('active', _this.isRepeat);
        }

        // When a song ended
        audio.onended = function() {
            if (_this.isRepeat) {
                audio.play();
            } else {
                nextBtn.click();
            }          
        }
        // When click on playlist
        playlist.onclick = function(e){
            const songNote = e.target.closest('.song:not(.active)')
            // When click on the song
            if (songNote || !e.target.closest('.option')) {
                if (songNote) {
                    _this.currentIndex = Number(songNote.dataset.index);
                    _this.loadCurrentSong();
                    _this.render();
                    audio.play();
                }
                // When click on option button
                if (!e.target.closest('.option')) {

                }
            }           
        }
    },

    scrollToActiveSong: function() {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })
        },300)
    },

    loadCurrentSong: function() {
        
        heading.textContent = this.currentSong.name;
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src = this.currentSong.path;
        console.log(heading, cdThumb, audio);
    },
    nextSong: function() {
        this.currentIndex++;
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0;
        }
        this.loadCurrentSong();
    },
    prevSong: function() {
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length;
        }
        this.loadCurrentSong();
    },
    playRandomSong: function(){
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)

        this.currentIndex = newIndex;
        this.loadCurrentSong();
    },

    start: function() {
        this.defineProperties();
        this.handleEvents();
        this.loadCurrentSong();
        this.render();
    },
}

app.start();