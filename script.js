document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-element');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const muteBtn = document.getElementById('mute-btn');

    // --- Play/Pause functionality ---
    playPauseBtn.addEventListener('click', () => {
        if (video.paused || video.ended) {
            video.play();
            playPauseBtn.textContent = 'Pause';
        } else {
            video.pause();
            playPauseBtn.textContent = 'Play';
        }
    });

    // --- Update seek bar and time display ---
    video.addEventListener('loadedmetadata', () => {
        seekBar.max = video.duration;
        let minutes = Math.floor(video.duration / 60);
        let seconds = Math.floor(video.duration % 60);
        durationSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    video.addEventListener('timeupdate', () => {
        seekBar.value = video.currentTime;
        let minutes = Math.floor(video.currentTime / 60);
        let seconds = Math.floor(video.currentTime % 60);
        currentTimeSpan.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    });

    // --- Seek functionality ---
    seekBar.addEventListener('input', () => {
        video.currentTime = seekBar.value;
    });

    // --- Volume control ---
    volumeBar.addEventListener('input', () => {
        video.volume = volumeBar.value;
    });

    // --- Mute functionality ---
    muteBtn.addEventListener('click', () => {
        video.muted = !video.muted;
        muteBtn.textContent = video.muted ? 'Unmute' : 'Mute';
    });
});
