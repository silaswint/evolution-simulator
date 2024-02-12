import { Effect } from 'pixi-game-camera'
import { type Vector } from 'pixi-game-camera/src/vector'

import { type Container } from '@pixi/display'

export class FollowPlayer extends Effect {
  /**
     * The (x, y) coordinate pair to pan to.
     *
     * @private
     *
     * @property {Vector}
     */
  private readonly _coordinates: Vector

  /**
     * @param {Container} container A reference to the container to apply the panto effect to.
     * @param {number} x The x coordinate to pan to.
     * @param {number} y The y coordinate to pan to.
     * @param {number} duration The amount of time, in milliseconds, that the effect should take.
     */
  constructor (container: Container, x: number, y: number, duration: number) {
    super(container)

    this._coordinates = { x, y }
    this.duration = duration
  }

  /**
     * Updates the status of this effect on a frame by frame basis.
     */
  update (): void {
    if (this.criteriaMet()) {
      this.finished.dispatch()
      return
    }

    this.current = performance.now()

    this.container.position.x = this.container.width / 3
    this.container.position.y = this.container.height / 4

    // scale
    this.container.scale = {
      x: 1.5,
      y: 1.5
    }

    // now character inside stage is mapped to center of screen
    this.container.pivot.x = this._coordinates.x
    this.container.pivot.y = this._coordinates.y

    if (this.useRAF) this.id = requestAnimationFrame(() => { this.update() })
  }

  /**
     * Checks to see if the panto criteria has been met so that the effect can end.
     *
     * @returns {boolean} Returns true if the panto effect is finished or false otherwise.
     */
  criteriaMet (): boolean {
    return this.container.pivot.x === this._coordinates.x && this.container.pivot.y === this._coordinates.y && this.container.position.x === this.container.width / 3 && this.container.position.y === this.container.height / 4
  }
}
