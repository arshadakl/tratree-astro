export function initInterfaceSounds(): void {
  const ambient = document.querySelector<HTMLAudioElement>('#audio-ambient');
  const flick   = document.querySelector<HTMLAudioElement>('#audio-flick');

  // Toggle ambient sound
  document.querySelectorAll<HTMLElement>('[data-sound-toggle]').forEach((el) => {
    el.addEventListener('click', () => {
      if (!ambient) return;
      if (['not-active', 'not-started'].includes(document.body.dataset.audioAmbientStatus ?? '')) {
        document.body.dataset.audioAmbientStatus = 'active';
        ambient.currentTime = 0;
        ambient.volume = 0.5;
        ambient.play();
      } else {
        document.body.dataset.audioAmbientStatus = 'not-active';
        ambient.currentTime = 0;
        ambient.volume = 0;
      }
    });
  });

  // Hover flick on links and sound toggle
  document.querySelectorAll<HTMLElement>('a, [data-sound-toggle]').forEach((el) => {
    el.addEventListener('mouseenter', () => {
      if (document.body.dataset.audioAmbientStatus === 'active' && flick) {
        flick.currentTime = 0;
        flick.volume = 0.2;
        flick.play();
      }
    });
  });

  // Click: start ambient on first link click; play flick
  document.querySelectorAll<HTMLElement>('a').forEach((el) => {
    el.addEventListener('click', () => {
      if (document.body.dataset.audioAmbientStatus === 'not-started' && ambient) {
        ambient.currentTime = 0;
        ambient.volume = 0.5;
        ambient.play();
        document.body.dataset.audioAmbientStatus = 'active';
      }
      if (document.body.dataset.audioAmbientStatus === 'active' && flick) {
        flick.currentTime = 0;
        flick.volume = 0.2;
        flick.play();
      }
    });
  });
}
