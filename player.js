function createPlayer({
  elementId,
  src='https://dvmn.org/media/filer_public/78/db/78db3456-3fd3-4504-9ed9-d2d1fd843c0b/highest_peak.mp4'
}){
  const player = Playable.create({
    fillAllSpace: true,
    src: src,
    hideOverlay: true,
    hideMainUI: true,
  });
  const playerContainer = document.getElementById(elementId)

  if (!playerContainer){
    throw Error(`Element with id "${elementId}" not found.`);
  }

  const videoContainers = playerContainer.getElementsByClassName('js-video-container');

  if (!videoContainers.length){
    throw Error(`Element with class "js-video-container" not found.`);
  }

  if (videoContainers.length > 1){
    throw Error(`Expects single element with class "js-video-container", but ${videoContainers.length} were found.`);
  }

  const videoContainer = videoContainers[0];
  player.attachToElement(videoContainer);

  const $playerContainer = $(playerContainer);

  (function activatePlayButtons(){
    const $playButton = $playerContainer.find('.js-play-button');
    const $pauseButton = $playerContainer.find('.js-pause-button');

    $playButton.click(()=>{
      player.play();
    });
    $pauseButton.click(()=>{
      player.pause();
    });

    function activatePlayBtn(){
      $playButton.attr("hidden", false);
      $pauseButton.attr("hidden", true);
    }

    function activatePauseBtn(){
      $playButton.attr("hidden", true);
      $pauseButton.attr("hidden", false);
    }

    activatePlayBtn();

    player.on(Playable.ENGINE_STATES.PLAYING, activatePauseBtn);
    player.on(Playable.ENGINE_STATES.PAUSED, activatePlayBtn);
    player.on(Playable.ENGINE_STATES.ENDED, ()=>{
      player.reset();
      activatePlayBtn();
    });
  })();

  (function activateVolumeButtons(){
    const $volumeButton = $playerContainer.find('.js-volume-button');
    const $muteButton = $playerContainer.find('.js-mute-button');

    $volumeButton.click(()=>{
      player.setVolume(100);
    });
    $muteButton.click(()=>{
      player.setVolume(0);
    });

    function activateVolumeButton(){
      $volumeButton.attr("hidden", false);
      $muteButton.attr("hidden", true);
    }

    function activateMuteBtn(){
      $volumeButton.attr("hidden", true);
      $muteButton.attr("hidden", false);
    }

    function toggleVolumeMuteBtns(){
      if (player.getVolume() > 0){
        activateMuteBtn();
      } else {
        activateVolumeButton();
      }
    }

    player.on(Playable.VIDEO_EVENTS.VOLUME_CHANGED, toggleVolumeMuteBtns);
    toggleVolumeMuteBtns();
  })();

  const $fullscreenButton = $playerContainer.find('.js-fullscreen-button');
  $fullscreenButton.click(()=>{
    player.enterFullScreen();
  });

  function formatTime(seconds) {
    // StackOverflow snippet https://stackoverflow.com/a/52560608
    const format = val => `0${Math.floor(val)}`.slice(-2);
    const hours = seconds / 3600;
    const minutes = (seconds % 3600) / 60;

    return [Math.floor(hours), format(minutes), format(seconds % 60)].join(':');
  }

  (function activateTimeLabels(){
    const $currentTime = $playerContainer.find('.js-current-time');
    function showCurrentTime(){
      const totalSeconds = player.getCurrentTime();
      const formattedTime = formatTime(totalSeconds);
      $currentTime.text(formattedTime);
    }
    player.on(Playable.VIDEO_EVENTS.CURRENT_TIME_UPDATED, showCurrentTime);
    showCurrentTime();

    const $duration = $playerContainer.find('.js-duration');
    function showDuration(){
      const totalSeconds = player.getDuration();
      const formattedTime = formatTime(totalSeconds);
      $duration.text(formattedTime);
    }
    player.on(Playable.VIDEO_EVENTS.DURATION_UPDATED, showDuration);
    showDuration();
  })();

  function throttle(func, ms) {
    // Source code snippet https://learn.javascript.ru/task/throttle

    let isThrottled = false,
      savedArgs,
      savedThis;

    function wrapper() {

      if (isThrottled) { // (2)
        savedArgs = arguments;
        savedThis = this;
        return;
      }

      func.apply(this, arguments); // (1)

      isThrottled = true;

      setTimeout(function() {
        isThrottled = false; // (3)
        if (savedArgs) {
          wrapper.apply(savedThis, savedArgs);
          savedArgs = savedThis = null;
        }
      }, ms);
    }

    return wrapper;
  }

  (function activateProgressbar(){
    const $progress = $playerContainer.find('.js-progress');
    const $slider = $progress.find('.js-progress-slider');

    function setSliderWidth(percentage){
      $slider.css("width", `${percentage}%`);
    }

    function updateSliderWidth(){
      const durationSeconds = player.getDuration();
      if (!durationSeconds){
        $slider.css("width", "0%");
        return;
      }
      const percentage = player.getCurrentTime() / durationSeconds * 100;
      setSliderWidth(percentage);
    }
    player.on(Playable.VIDEO_EVENTS.CURRENT_TIME_UPDATED, updateSliderWidth);
    player.on(Playable.VIDEO_EVENTS.DURATION_UPDATED, updateSliderWidth);
    updateSliderWidth();

    // Code snippet from https://codepen.io/frytyler/pen/juGfk

    function updateVideoProgress(x){
      const durationSeconds = player.getDuration();

      //calculate drag position
      //and update video currenttime
      //as well as progress bar

      var relPosition = x - $progress.offset().left;
      var percentage = 100 * relPosition / $progress.width();
      if(percentage > 100) {
        percentage = 100;
      }
      if(percentage < 0) {
        percentage = 0;
      }
      setSliderWidth(percentage);  // Redraw before CURRENT_TIME_UPDATED event for better responsiveness
      seconds = durationSeconds * percentage / 100;
      player.seekTo(seconds);
    };

    const throttledUpdateVideoProgress = throttle(updateVideoProgress, 100);


    $progress.on('mousedown', function(e) {
      throttledUpdateVideoProgress(e.pageX);
      $(document).on('mousemove', (e) => {
        throttledUpdateVideoProgress(e.pageX)
      });
    });
    $progress.on('mouseup', function(e) {
      $(document).off('mousemove');
      throttledUpdateVideoProgress(e.pageX);
    });
  })();
}