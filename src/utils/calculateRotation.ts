export const calculateRotation = (directionX: 1 | -1 | 0, directionY: 1 | -1 | 0): number => {
  // Wenn beide Richtungskomponenten 0 sind, gibt es keine Rotation
  if (directionX === 0 && directionY === 0) {
    return 0
  }

  // Berechne den Winkel im Bogenmaß
  const angleRad = Math.atan2(directionY, directionX)

  // Wandele den Winkel von Bogenmaß in Grad um
  let angleDeg = (angleRad * 180) / Math.PI

  // Passe die Rotation an, um die Ausrichtung der Grafik zu berücksichtigen
  // Beachte, dass Pixi.js 0 Grad als Ausrichtung nach rechts betrachtet
  angleDeg += 90

  // Stelle sicher, dass der Winkel im Bereich [0, 360) liegt
  angleDeg = (angleDeg + 360) % 360

  return angleDeg
}
