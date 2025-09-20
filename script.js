document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-element');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const mediaLibrary = document.getElementById('media-library');
    const timeline = document.getElementById('video-track');
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    let videoQueue = [];

    // --- Tab Switching ---
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            tabContents.forEach(content => content.classList.remove('active'));
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });

    // --- Player Controls ---
    playPauseBtn.addEventListener('click', () => {
        if (video.src) {
            if (video.paused || video.ended) {
                video.play();
                playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
            }
        }
    });

    video.addEventListener('timeupdate', () => {
        if (video.duration) {
            seekBar.value = video.currentTime;
            updateTimeDisplay(video.currentTime, currentTimeSpan);
        }
    });

    video.addEventListener('loadedmetadata', () => {
        seekBar.max = video.duration;
        updateTimeDisplay(video.duration, durationSpan);
    });

    video.addEventListener('ended', () => {
        playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
    });

    seekBar.addEventListener('input', () => {
        if (video.src) {
            video.currentTime = seekBar.value;
        }
    });

    function updateTimeDisplay(time, element) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- Drag and Drop Functionality ---
    mediaLibrary.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('media-item')) {
            const src = e.target.dataset.src;
            e.dataTransfer.setData('text/plain', src);
            e.dataTransfer.effectAllowed = 'copy';
            e.target.classList.add('is-dragging');
        }
    });
    
    mediaLibrary.addEventListener('dragend', (e) => {
        e.target.classList.remove('is-dragging');
    });

    timeline.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    timeline.addEventListener('drop', (e) => {
        e.preventDefault();
        const src = e.dataTransfer.getData('text/plain');
        if (src) {
            const newClip = document.createElement('div');
            newClip.classList.add('timeline-clip');
            newClip.textContent = `Clip ${videoQueue.length + 1}`;
            newClip.dataset.src = src;
            timeline.appendChild(newClip);
            videoQueue.push({ src });

            if (videoQueue.length === 1) {
                video.src = videoQueue[0].src;
            }
        }
    });
});
