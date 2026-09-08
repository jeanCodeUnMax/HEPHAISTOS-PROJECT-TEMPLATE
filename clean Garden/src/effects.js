// Effects management for timed power-up effects
// Provides functions to start and stop timed effects

export function startEffect(effectName, duration, callback) {
  // In a full implementation, this would start a timer and call callback after duration
  console.log(`Effect started: ${effectName} for ${duration}ms`);
  // For now, we just call callback immediately (or not)
  // We'll implement a simple timeout if needed
  if (duration > 0) {
    setTimeout(() => {
      console.log(`Effect ended: ${effectName}`);
      if (callback) callback();
    }, duration);
  } else {
    if (callback) callback();
  }
}

export function stopEffect(effectName) {
  console.log(`Effect stopped: ${effectName}`);
}