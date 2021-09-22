$(function(){
    const qs = new URLSearchParams( window.location.search );
    const menu = document.querySelector( 'nav' )
    const videoContainer = document.querySelector('.video-container');
    const video = document.querySelector('.video-container video');

    const controlsContainer = document.querySelector('.video-container .controls-container');

    const playPauseButton = document.querySelector('.video-container .controls button.play-pause');
    const rewindButton = document.querySelector('.video-container .controls button.rewind');
    const fastForwardButton = document.querySelector('.video-container .controls button.fast-forward');
    const volumeButton = document.querySelector('.video-container .controls button.volume');
    const fullScreenButton = document.querySelector('.video-container .controls button.full-screen');
    const playButton = playPauseButton.querySelector('.playing');
    const pauseButton = playPauseButton.querySelector('.paused');
    const fullVolumeButton = volumeButton.querySelector('.full-volume');
    const mutedButton = volumeButton.querySelector('.muted');
    const maximizeButton = fullScreenButton.querySelector('.maximize');
    const minimizeButton = fullScreenButton.querySelector('.minimize');


    const progressBar = document.querySelector('.video-container .progress-controls .progress-bar');
    const watchedBar = document.querySelector('.video-container .progress-controls .progress-bar .watched-bar');
    const timeLeft = document.querySelector('.video-container .progress-controls .time-remaining');

    const next = document.querySelector( '.video-container .progress-controls .next' );
    const episodes = $( '.episodes' );

    let controlsTimeout;
    controlsContainer.style.opacity = '0';
    watchedBar.style.width = '0px';
    pauseButton.style.display = 'none';
    minimizeButton.style.display = 'none';

    const displayControls = () => {
        controlsContainer.style.opacity = '1';
        menu.style.opacity = '1';
        document.body.style.cursor = 'initial';
        if (controlsTimeout) {
            clearTimeout(controlsTimeout);
        }
        controlsTimeout = setTimeout(() => {
            controlsContainer.style.opacity = '0';
            menu.style.opacity = '0';
            document.body.style.cursor = 'none';
        }, 5000);
    };

    const playPause = () => {
        if (video.paused) {
            video.play();
            playButton.style.display = 'none';
            pauseButton.style.display = '';
        } else {
            video.pause();
            playButton.style.display = '';
            pauseButton.style.display = 'none';
        }
    };

    const toggleMute = () => {
        video.muted = !video.muted;
        if (video.muted) {
            fullVolumeButton.style.display = 'none';
            mutedButton.style.display = '';
        } else {
            fullVolumeButton.style.display = '';
            mutedButton.style.display = 'none';
        }
    };

    const toggleFullScreen = () => {
        if (!document.fullscreenElement) {
            videoContainer.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    document.addEventListener('fullscreenchange', () => {
        if (!document.fullscreenElement) {
            qs.delete( "fullscreen" )
            maximizeButton.style.display = '';
            minimizeButton.style.display = 'none';
        } else {
            qs.set( "fullscreen", "t" )
            maximizeButton.style.display = 'none';
            minimizeButton.style.display = '';
        }
    });

    document.addEventListener('keyup', (event) => {
        if (event.code === 'Space') {
            playPause();
        }

        if (event.code === 'KeyM') {
            toggleMute();
        }

        if (event.code === 'KeyF') {
            toggleFullScreen();
        }

        displayControls();
    });

    document.addEventListener('mousemove', () => {
        displayControls();
    });

    video.addEventListener('timeupdate', () => {
        watchedBar.style.width = ((video.currentTime / video.duration) * 100) + '%';
        const totalSecondsRemaining = video.duration - video.currentTime;
        // THANK YOU: BEGANOVICH
        const time = new Date(null);
        time.setSeconds(totalSecondsRemaining);
        let hours = null;

        if(totalSecondsRemaining >= 3600) {
            hours = (time.getHours().toString()).padStart( 2, '0' );
        }

        let minutes = (time.getMinutes().toString()).padStart( 2, '0' );
        let seconds = (time.getSeconds().toString()).padStart( 2, '0' );

        timeLeft.textContent = `${hours ? hours : '00'}:${minutes}:${seconds}`;
    });

    progressBar.addEventListener('click', (event) => {
        const pos = (event.pageX  - (progressBar.offsetLeft + progressBar.offsetParent.offsetLeft)) / progressBar.offsetWidth;
        video.currentTime = pos * video.duration;
    });

    playPauseButton.addEventListener('click', playPause);

    rewindButton.addEventListener('click', () => {
        video.currentTime -= 10;
    });

    fastForwardButton.addEventListener('click', () => {
        video.currentTime += 10;
    });

    volumeButton.addEventListener('click', toggleMute);

    fullScreenButton.addEventListener('click', toggleFullScreen);

// TODO: add event handlers for next episode, episode list

    const episodeList = $( "#episodes-list" );
    const dialogHeight = Math.floor(window.innerHeight * 0.45 );
    const dialogWidth = Math.floor(window.innerWidth * 0.60 );

    episodeList.dialog({
        modal: true,
        autoOpen:false,
        closeText: "X",

        minHeight: Math.floor( dialogHeight * 0.5 ),
        maxHeight: Math.floor( dialogHeight * 1.5 ),

        minWidth: Math.floor( dialogWidth * 0.5 ),
        maxWidth: Math.floor( dialogWidth * 1.5 ),

    }).prev(".ui-dialog-titlebar")
        .addClass("episode-list-header");

    episodes.on( "click", function() {
        if(!episodeList.dialog("isOpen")) {
            episodeList.dialog("open");
        } else {
            episodeList.dialog("close");
        }
        $( '.ui-dialog' ).position({
            my: "right bottom",
            at: "left top+10",
            of: ".episodes"
        });
    });



    if( !!qs.get( "autoStart" ) ){
        playPauseButton.click();
    }

    if( !!qs.get( "fullscreen" ) ){
        toggleFullScreen();
    }
})