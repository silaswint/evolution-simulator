export const calculateRotation = (directionX: 1 | -1 | 0, directionY: 1 | -1 | 0): number => {
  // If both direction components are 0, there is no rotation
  if (directionX === 0 && directionY === 0) {
    return 0
  }

  // Calculate the angle in radians
  const angleRad = Math.atan2(directionY, directionX)

  // Convert the angle from radians to degrees
  let angleDeg = (angleRad * 180) / Math.PI

  // Adjust the rotation to take the orientation of the graphic into account
  // Note that Pixi.js considers 0 degrees as orientation to the right
  angleDeg += 90

  // Make sure that the angle is in the range [0, 360)
  angleDeg = (angleDeg + 360) % 360

  return angleDeg
}
