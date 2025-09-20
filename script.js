document.addEventListener('DOMContentLoaded', () => {
    const video = document.getElementById('video-element');
    const playPauseBtn = document.getElementById('play-pause-btn');
    const seekBar = document.getElementById('seek-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const durationSpan = document.getElementById('duration');
    const volumeBar = document.getElementById('volume-bar');
    const mediaLibrary = document.getElementById('media-library');
    const timeline = document.getElementById('video-track');

    let videoQueue = []; // An array to hold the clips on the timeline
    let currentClipIndex = 0;

    // --- Player Controls ---
    playPauseBtn.addEventListener('click', () => {
        if (video.src) {
            if (video.paused || video.ended) {
                video.play();
                playPauseBtn.innerHTML = '<span class="icon">&#10074;&#10074;</span>'; // Pause icon
            } else {
                video.pause();
                playPauseBtn.innerHTML = '<span class="icon">&#9658;</span>'; // Play icon
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
        playPauseBtn.innerHTML = '<span class="icon">&#9658;</span>';
    });

    seekBar.addEventListener('input', () => {
        if (video.src) {
            video.currentTime = seekBar.value;
        }
    });

    volumeBar.addEventListener('input', () => {
        video.volume = volumeBar.value;
    });

    function updateTimeDisplay(time, element) {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        element.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // --- Drag and Drop Functionality ---
    let draggedItem = null;

    mediaLibrary.addEventListener('dragstart', (e) => {
        if (e.target.classList.contains('media-item')) {
            draggedItem = e.target;
            e.dataTransfer.setData('text/plain', draggedItem.dataset.src);
            e.dataTransfer.effectAllowed = 'copy';
        }
    });

    timeline.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'copy';
    });

    timeline.addEventListener('drop', (e) => {
        e.preventDefault();
        if (draggedItem) {
            const src = draggedItem.dataset.src;
            const duration = draggedItem.dataset.duration;
            const newClip = document.createElement('div');
            newClip.classList.add('timeline-clip');
            newClip.textContent = draggedItem.querySelector('.item-name').textContent;
            newClip.dataset.src = src;
            newClip.dataset.duration = duration;
            timeline.appendChild(newClip);

            // Add the new clip to our playback queue
            videoQueue.push({ src, duration: parseFloat(duration) });
            
            // If this is the first clip, load it into the viewer
            if (videoQueue.length === 1) {
                video.src = videoQueue[0].src;
                video.load();
            }

            // Simple event listener for playing a clip when clicked
            newClip.addEventListener('click', () => {
                const index = Array.from(timeline.children).indexOf(newClip);
                if (index !== -1) {
                    currentClipIndex = index;
                    video.src = videoQueue[currentClipIndex].src;
                    video.load();
                }
            });
        }
    });
});
