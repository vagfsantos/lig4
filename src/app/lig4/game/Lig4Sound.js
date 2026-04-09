import { GameSound } from '@game-engine/GameSound'
import backgroundSound from 'url:../../../sound/background.mp3'
import failSound from 'url:../../../sound/fail.mp3'
import hoverSound from 'url:../../../sound/hover.mp3'
import machinePlaySound from 'url:../../../sound/machine-play.mp3'
import userPlaySound from 'url:../../../sound/user-play.mp3'
import winSound from 'url:../../../sound/win.mp3'

const allSoundsUrls = [
  { url: backgroundSound, id: 'background' },
  { url: failSound, id: 'fail' },
  { url: hoverSound, id: 'hover' },
  { url: machinePlaySound, id: 'machinePlay' },
  { url: userPlaySound, id: 'userPlay' },
  { url: winSound, id: 'win' },
]

export class Lig4Sound {
  Sound = new GameSound()

  bgSoundIsPlaying = false
  _hoverColumnindex = null

  async loadAllSounds() {
    return Promise.all(
      allSoundsUrls.map(async ({ url, id }) => {
        await this.Sound.loadSound({
          url,
          id,
        })
      })
    )
  }

  playBackgroundSound() {
    if (!this._bgSoundIsPlaying) {
      this.Sound.playSound({
        id: 'background',
        loop: true,
      })
      this._bgSoundIsPlaying = true
    }
  }

  playUserPlaySound() {
    this.Sound.playSound({
      id: 'userPlay',
    })
  }

  playMachinePlaySound() {
    this.Sound.playSound({
      id: 'machinePlay',
    })
  }

  playWinSound() {
    this.Sound.playSound({
      id: 'win',
    })
  }

  playFailSound() {
    this.Sound.playSound({
      id: 'fail',
    })
  }

  playHoverSound({ columnIndex }) {
    if (columnIndex !== this._hoverColumnindex) {
      this.Sound.playSound({
        id: 'hover',
      })
    }

    this._hoverColumnindex = columnIndex
  }
}
