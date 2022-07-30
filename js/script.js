const wrapper = document.querySelector(".wrapper"),
    musicImg = wrapper.querySelector(".img-area img"),
    musicName = wrapper.querySelector(".song-details .name"),
    musicArtist = wrapper.querySelector(".song-details .artist"),
    mainAudio = wrapper.querySelector("#main-audio"),
    playPauseBtn = wrapper.querySelector(".play-pause"),
    prevBtn = wrapper.querySelector("#prev"),
    nextBtn = wrapper.querySelector("#next"),
    progressArea = wrapper.querySelector(".progress-area"),
    progressBar = wrapper.querySelector(".progress-bar"),
    musicList = wrapper.querySelector(".music-list"),
    showMoreBtn = wrapper.querySelector("#more-music"),
    hideMusicBtn = musicList.querySelector("#close"),
    shaker = document.querySelector(".shake"),
    mainBody = document.getElementById("main-body");


let musicIndex = Math.floor((Math.random() * allMusic.length) + 1);

window.addEventListener("load", () => {
    loadMusic(musicIndex);
    playingNow();
})

function loadMusic(indexNumb) {
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].img}.mp3`;
}

// Controller Functions

// Function to play music
function playMusic() {
    mainBody.classList.add("shake")
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause"
    mainAudio.play();
}
// Function to stop music
function pauseMusic() {
    mainBody.classList.remove("shake");
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    mainAudio.pause();
}
// Function to play next music
function nextMusic() {
    musicIndex++;
    musicIndex > allMusic.length ? musicIndex = 1 : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}
// Function to play previous music
function prevMusic() {
    musicIndex--;
    musicIndex < 1 ? musicIndex = allMusic.length : musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}





// Controller Events

// Play/Pause Button Event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
    playingNow();
})

// Next Song Button Event
nextBtn.addEventListener("click", () => {
    nextMusic();
    playingNow();
});
// Previous Song Button Event
prevBtn.addEventListener("click", () => {
    prevMusic();
    playingNow();
});

// Updating Time as per the song
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;

    // Progress Bar Status
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current");
    let musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", () => {
        // Update Total Song Duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        // Adding 0 infront if seconds are less than 10
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;

    });

    // Update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if (currentSec < 10) {
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
})

progressArea.addEventListener("click", (e) => {
    // Getting width of progress bar
    let progressWidthVal = progressArea.clientWidth;
    // Getting Offset X value of progress bar
    let clickedOffSetX = e.offsetX;
    // Getting song's total duration 
    let songDuration = mainAudio.duration;

    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    // If song is paused and user clicks on progressBar, song will resume.
    playMusic()
})

// Functioning Repeat/Shuffle Button
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    // Getting the inner text of button to change the icon
    let getText = repeatBtn.innerText;

    // Changing icon on click
    switch (getText) {
        case "repeat": // If the icon is repeat, we will change the icon to repeat one.
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song Looped")
            break;
        case "repeat_one": // If the icon is repeat one, we will change the icon to shuffle.
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback Shuffle")
            break;
        case "shuffle": // If the icon is shufle, we will change the icon to repeat.
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist Looped")
            break;
    }
})

// When the song ends...

mainAudio.addEventListener("ended", () => {
    // We will function accordingly. If the icon is set to loop, we ll repeat the song..

    let getText = repeatBtn.innerText; //Getting inner text of icon
    // Changing icon on click
    switch (getText) {
        case "repeat": // If the icon is repeat, we will call the "nextMusic() function so next song will play".
            nextMusic();
            playingNow();

            break;
        case "repeat_one": // If the icon is repeat one, we will change the current song playing time to zero once whole song is played.
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic();
            playingNow();


            break;
        case "shuffle": // If the icon is shufle, we will play random songs.

            // Generating random index number between 1 and the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length));

            //This do while loop will run until the next random number will not be same as of the current music index number
            do {
                randIndex = Math.floor((Math.random() * allMusic.length));
            } while (musicIndex == randIndex);

            //Passing Random index to music index so songs will play randomly
            musicIndex = randIndex;
            loadMusic(musicIndex);
            playMusic();
            playingNow();
            break;
    }
})

// Show and hide Music Lists
showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
})

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
})


// Creating li according to Music Playlist 
const ulTag = wrapper.querySelector("ul");
for (let i = 0; i < allMusic.length; i++) {

    let liTag = `<li li-index="${i + 1}">
                    <div class="row">
                        <span>${allMusic[i].name}</span>
                        <p>${allMusic[i].artist}</p>
                    </div>
                    <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
                    <span id="${allMusic[i].src}" class="audio-duration">3:40</span>
                </li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#${allMusic[i].src}`);
    let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`)

    liAudioTag.addEventListener("loadeddata", () => {

        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        // Adding 0 infront if seconds are less than 10
        if (totalSec < 10) {
            totalSec = `0${totalSec}`;
        }
        liAudioDuration.innerText = `${totalMin}:${totalSec}`;
        liAudioDuration.setAttribute('t-duration', `${totalMin}:${totalSec}`)
    })
}


// Play particular song on click from the playlist button

const allLiTags = ulTag.querySelectorAll("li");

function playingNow() {
    for (let j = 0; j < allLiTags.length; j++) {
        let audioTag = allLiTags[j].querySelector(".audio-duration");
        if (allLiTags[j].classList.contains("playing")) {
            allLiTags[j].classList.remove("playing");
            audioTag.innerText = "Playing"
            let adDuration = audioTag.getAttribute("t-duration");
            audioTag.innerText = adDuration;
        }

        if (allLiTags[j].getAttribute("li-index") == musicIndex) {
            allLiTags[j].classList.add("playing")
            audioTag.innerText = "Playing"
        }

        allLiTags[j].setAttribute("onclick", "clicked(this)")
    }
}


function clicked(element) {
    let getLiIndex = element.getAttribute("li-index");
    musicIndex = getLiIndex;
    loadMusic(musicIndex);
    playMusic();
    playingNow();
}