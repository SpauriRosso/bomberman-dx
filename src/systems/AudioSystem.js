export default class AudioSystem {
  constructor(audioContext) {
    this.audioContext = audioContext;
    this.audioSources = [];
  }

  playMusic(audioFile) {
    const audioSource = this.audioContext.createBufferSource();

    fetch(audioFile)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
      .then((audioBuffer) => {
        audioSource.buffer = audioBuffer;
        audioSource.connect(this.audioContext.destination);
        audioSource.start();
        this.audioSources.push(audioSource);
      });
  }

  update() {}
}
