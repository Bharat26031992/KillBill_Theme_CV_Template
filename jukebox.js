// [ KILL_BILL_SOUNDTRACK_MODULE - VOL. 1 ]
const playlist = [
    { title: "Bhairav", file: "track1.mp3" },
    { title: "Kalawati", file: "track2.mp3" },
    { title: "Malkauns", file: "track3.mp3" },
    { title: "Yaman", file: "track4.mp3" },
    { title: "Bad Bitch", file: "track5.mp3" },
    { title: "Перепутала", file: "track6.mp3" },
    { title: "Acenda o farol", file: "track7.mp3" },
    { title: "O Descobridor Dos Sete Mares", file: "track8.mp3" },
    { title: "Amores Lejanos", file: "track9.mp3" },
    { title: "Mi Manera de querer", file: "track10.mp3" },
    { title: "Aja mahi", file: "track11.mp3" },
    { title: "خونه ی ما", file: "track12.mp3" },
    { title: "Vienna Calling", file: "track13.mp3" },
    { title: "Ciudad de la furia", file: "track14.mp3" },
    { title: "ВИРТУАЛЬНАЯ ЛЮБОВЬ", file: "track15.mp3" },
    { title: "Oye mi amor", file: "track16.mp3" },
    { title: "Come", file: "track17.mp3" },
    { title: "Mas que nada", file: "track18.mp3" },
    { title: "Ring my bell", file: "track19.mp3" },
    { title: "Soledad y el mar", file: "track20.mp3" },
    { title: "Take 5", file: "track21.mp3" },
    { title: "Babaji ki Booti", file: "track22.mp3" },
];

let currentTrackIndex = Math.floor(Math.random() * playlist.length);
let isShuffle = false;

const audio = new Audio();
audio.volume = 0.3;

const initJukebox = () => {
    const jukeboxHTML = `
    <div id="jukebox-card" style="position: fixed; top: 20px; right: 20px; width: 180px; z-index: 999999; background: #fde000; border: 4px solid #000; padding: 12px; pointer-events: all; cursor: default; box-shadow: 10px 10px 0px #000; font-family: 'Oswald', sans-serif;">
        
        <div id="jukebox-header" style="color:#000; font-size:0.7rem; font-weight:bold; margin-bottom:10px; display:flex; justify-content:space-between; cursor: move; border-bottom: 2px solid #000; padding-bottom: 5px; text-transform: uppercase; letter-spacing: 1px;">
            <span>[ THE KILL LIST ]</span>
            <span>武</span>
        </div>

        <div id="track-info" style="font-size: 0.8rem; margin-bottom: 10px; color: #000; white-space: nowrap; overflow: hidden; position: relative; width: 100%; font-weight: bold; background: #fff; padding: 2px 0; border: 1px solid #000;">
            <span id="track-text">NOW PLAYING: SILENCE</span>
        </div>
        
        <div id="progress-container" style="width: 100%; height: 8px; background: #000; margin-bottom: 12px; cursor: pointer; position: relative;">
            <div id="progress-bar" style="width: 0%; height: 100%; background: #cc0000; transition: width 0.1s linear;"></div>
        </div>

        <div style="display: flex; justify-content: space-between; align-items: center; gap: 4px;">
            <button id="prev-btn" class="btn-kill">PREV</button>
            <button id="play-pause" class="btn-kill" style="flex-grow: 1; background: #000; color: #fde000;">PLAY</button>
            <button id="next-btn" class="btn-kill">NEXT</button>
            <button id="shuffle-btn" class="btn-kill" title="Shuffle Mode">🔀</button>
        </div>
        
        <input type="range" id="vol-slider" min="0" max="1" step="0.01" value="0.3" 
               style="width: 100%; margin-top: 12px; accent-color: #cc0000; cursor: pointer; height: 4px; background: #000;">
    </div>

    <style>
        @import url('https://fonts.googleapis.com/css2?family=Oswald:wght@700&display=swap');

        .btn-kill {
            background: transparent;
            border: 2px solid #000;
            color: #000;
            cursor: pointer;
            font-family: 'Oswald', sans-serif;
            padding: 4px 6px;
            font-size: 0.65rem;
            transition: 0.1s;
            text-transform: uppercase;
        }
        .btn-kill:hover { 
            background: #000; 
            color: #fde000; 
        }
        .btn-kill.active { 
            background: #cc0000; 
            color: #fff; 
            border-color: #cc0000; 
        }
        
        #jukebox-card:active { cursor: grabbing; }

        /* Grindhouse Marquee Animation */
        #track-text {
            display: inline-block;
            padding-left: 100%;
            animation: marquee-kill 12s linear infinite;
        }

        @keyframes marquee-kill {
            0% { transform: translate(0, 0); }
            100% { transform: translate(-100%, 0); }
        }
    </style>
    `;

    document.body.insertAdjacentHTML('beforeend', jukeboxHTML);

    const card = document.getElementById('jukebox-card');
    const header = document.getElementById('jukebox-header');
    const progressContainer = document.getElementById('progress-container');
    const playBtn = document.getElementById('play-pause');
    const nextBtn = document.getElementById('next-btn');
    const prevBtn = document.getElementById('prev-btn');
    const shuffleBtn = document.getElementById('shuffle-btn');
    const volSlider = document.getElementById('vol-slider');

    // Dragging Logic
    let isDragging = false, offset = { x: 0, y: 0 };
    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        offset = { x: card.offsetLeft - e.clientX, y: card.offsetTop - e.clientY };
    });
    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        card.style.left = (e.clientX + offset.x) + 'px';
        card.style.top = (e.clientY + offset.y) + 'px';
        card.style.right = 'auto';
        card.style.bottom = 'auto'; 
    });
    document.addEventListener('mouseup', () => isDragging = false);

    // logic functions
    const setNextTrack = () => {
        if (isShuffle) {
            let newIndex;
            do {
                newIndex = Math.floor(Math.random() * playlist.length);
            } while (newIndex === currentTrackIndex && playlist.length > 1);
            currentTrackIndex = newIndex;
        } else {
            currentTrackIndex = (currentTrackIndex + 1) % playlist.length;
        }
    };

    // controls
    shuffleBtn.addEventListener('click', () => {
        isShuffle = !isShuffle;
        shuffleBtn.classList.toggle('active', isShuffle);
    });

    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => console.log("Hanzo steel requires user interaction"));
            playBtn.innerText = "PAUSE";
            playBtn.style.backgroundColor = "#cc0000";
            playBtn.style.color = "#fff";
        } else {
            audio.pause();
            playBtn.innerText = "PLAY";
            playBtn.style.backgroundColor = "#000";
            playBtn.style.color = "#fde000";
        }
    });

    nextBtn.addEventListener('click', () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "PAUSE";
    });

    prevBtn.addEventListener('click', () => {
        currentTrackIndex = (currentTrackIndex - 1 + playlist.length) % playlist.length;
        loadTrack(currentTrackIndex);
        audio.play();
        playBtn.innerText = "PAUSE";
    });

    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const pos = (e.clientX - rect.left) / rect.width;
        if (audio.duration) audio.currentTime = pos * audio.duration;
    });

    volSlider.oninput = (e) => { audio.volume = e.target.value; };
    
    audio.ontimeupdate = () => {
        const pct = (audio.currentTime / audio.duration) * 100;
        document.getElementById('progress-bar').style.width = (pct || 0) + "%";
    };
    
    audio.onended = () => {
        setNextTrack();
        loadTrack(currentTrackIndex);
        audio.play();
    };

    function loadTrack(index) {
        const track = playlist[index];
        audio.src = track.file;
        document.getElementById('track-text').innerText = `CHAPTER ${index + 1}: ${track.title.toUpperCase()}`;
    }

    loadTrack(currentTrackIndex);
};

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initJukebox);
} else {
    initJukebox();
}