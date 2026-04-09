export class GameSound {
  _audioCtx = new AudioContext()

  async playSound({ url, loop = false }) {
    // Load and decode the audio file
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'audio/mp3',
      },
      method: 'GET',
    })
    const arrayBuffer = await response.arrayBuffer()
    const audioBuffer = await this._audioCtx.decodeAudioData(arrayBuffer)

    // Create a source node
    const source = this._audioCtx.createBufferSource()
    source.buffer = audioBuffer
    source.loop = loop

    // Connect to speakers and start
    source.connect(this._audioCtx.destination)
    source.start()
  }
}
