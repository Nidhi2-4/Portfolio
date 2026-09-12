/**
 * ==========================================================================
 * AVATAR GAZE TRACKER ENGINE - V2.0 ULTRA-SMOOTH CINEMATIC
 * Zero-Stutter, State-Machine Driven Head & Eye Tracking with Natural Inertia
 * ==========================================================================
 */

class AvatarTracker {
  constructor() {
    this.canvas = document.getElementById('avatarCanvas');
    if (!this.canvas) return;

    this.ctx = this.canvas.getContext('2d', { alpha: true });
    this.totalFrames = 240;
    this.frames = new Array(this.totalFrames);
    this.loadedCount = 0;
    this.isReady = false;

    // DOM UI elements
    this.loadingOverlay = document.getElementById('avatarLoadingOverlay');
    this.progressText = document.getElementById('avatarProgressText');

    // Pointer & Gaze Targets
    this.targetGazeX = 0;
    this.targetGazeY = 0;
    this.currentGazeX = 0;
    this.currentGazeY = 0;

    // State Machine Properties
    this.currentBranch = 'idle'; // 'center' | 'left' | 'right' | 'up' | 'down' | 'idle'
    this.targetBranch = 'idle';
    this.currentIntensity = 0.0; // 0.0 (Center) -> 1.0 (Full Turn)
    this.targetIntensity = 0.0;
    
    // Smoothness Tuning
    this.lerpSpeed = 0.12;          // Smoothness of gaze following
    this.returnToCenterSpeed = 0.16;// Speed of returning to center before switching direction
    
    // Idle Animation Loop
    this.isIdle = false;
    this.idleTimer = null;
    this.idleFrameCounter = 190.0;

    // Transition Crossfade
    this.lastDrawnFrame = -1;
    this.crossfadeFrame = -1;
    this.crossfadeAlpha = 1.0;

    this.init();
  }

  init() {
    this.setupCanvasResolution();
    this.bindEvents();
    this.preloadFrames();
    this.startRenderLoop();
  }

  setupCanvasResolution() {
    this.canvas.width = 1280;
    this.canvas.height = 720;
    if (this.ctx) {
      this.ctx.fillStyle = '#dfc9b5';
      this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  preloadFrames() {
    const framePromises = [];

    for (let i = 0; i < this.totalFrames; i++) {
      const pad = String(i).padStart(3, '0');
      const src = `assets/frames/frame_${pad}.webp`;

      const p = new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          this.frames[i] = img;
          this.loadedCount++;
          this.updateProgress();
          resolve();
        };
        img.onerror = () => {
          this.loadedCount++;
          this.updateProgress();
          resolve();
        };
        img.src = src;
      });

      framePromises.push(p);
    }

    Promise.all(framePromises).then(() => {
      this.isReady = true;
      if (this.loadingOverlay) {
        this.loadingOverlay.classList.add('hidden');
      }
      this.currentBranch = 'idle';
      this.drawFrame(190);
    });
  }

  updateProgress() {
    const percent = Math.round((this.loadedCount / this.totalFrames) * 100);
    if (this.progressText) {
      this.progressText.textContent = `LOADING CHARACTER • ${percent}%`;
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => this.setupCanvasResolution());

    // Window-wide smooth pointer tracking
    window.addEventListener('mousemove', (e) => {
      this.handlePointerMove(e.clientX, e.clientY);
    });

    window.addEventListener('touchmove', (e) => {
      if (e.touches && e.touches[0]) {
        this.handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });

    // Inactivity detection
    this.resetIdleState();
  }

  handlePointerMove(clientX, clientY) {
    this.resetIdleState();

    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();

    // Eye level is ~38% from the top of the avatar canvas
    const avatarCenterX = rect.left + rect.width * 0.5;
    const avatarCenterY = rect.top + rect.height * 0.38;

    const dx = clientX - avatarCenterX;
    const dy = clientY - avatarCenterY;

    // Normalization radii for screen boundaries
    const maxRadiusX = Math.max(window.innerWidth * 0.30, 200);
    const maxRadiusY = Math.max(window.innerHeight * 0.25, 160);

    this.targetGazeX = Math.max(-1, Math.min(1, dx / maxRadiusX));
    this.targetGazeY = Math.max(-1, Math.min(1, dy / maxRadiusY));
  }

  resetIdleState() {
    this.isIdle = false;
    clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(() => {
      this.isIdle = true;
    }, 2800); // Enter ambient breathing loop after 2.8s of inactivity
  }

  /**
   * Determine Target Branch & Intensity with Angular Hysteresis (prevents edge jitter)
   */
  evaluateTargetGaze() {
    if (this.isIdle) {
      this.targetBranch = 'idle';
      this.targetIntensity = 0.0;
      return;
    }

    const dist = Math.hypot(this.currentGazeX, this.currentGazeY);

    // Deadzone: Looking straight at user
    if (dist < 0.06) {
      this.targetBranch = 'center';
      this.targetIntensity = 0.0;
      return;
    }

    // Organic power curve for responsive micro-movements
    this.targetIntensity = Math.min(1.0, Math.pow(dist, 0.85));

    const angle = Math.atan2(this.currentGazeY, this.currentGazeX);
    const radToDeg = (angle * 180) / Math.PI;

    // Angular Hysteresis: Give current branch a +15deg advantage to prevent flickering
    const h = 15;
    const isUpCurrent = this.currentBranch === 'up';
    const isDownCurrent = this.currentBranch === 'down';
    const isRightCurrent = this.currentBranch === 'right';
    const isLeftCurrent = this.currentBranch === 'left';

    // Up: ~ -135deg to -45deg
    if (radToDeg >= -135 - (isUpCurrent ? h : 0) && radToDeg <= -45 + (isUpCurrent ? h : 0)) {
      this.targetBranch = 'up';
      this.targetIntensity = Math.min(1.0, Math.abs(this.currentGazeY) * 1.1);
    }
    // Down: ~ +45deg to +135deg
    else if (radToDeg >= 45 - (isDownCurrent ? h : 0) && radToDeg <= 135 + (isDownCurrent ? h : 0)) {
      this.targetBranch = 'down';
      this.targetIntensity = Math.min(1.0, Math.abs(this.currentGazeY) * 1.1);
    }
    // Right: ~ -45deg to +45deg
    else if (radToDeg > -45 - (isRightCurrent ? h : 0) && radToDeg < 45 + (isRightCurrent ? h : 0)) {
      this.targetBranch = 'right';
      this.targetIntensity = Math.min(1.0, Math.abs(this.currentGazeX) * 1.1);
    }
    // Left: > 135deg or < -135deg
    else {
      this.targetBranch = 'left';
      this.targetIntensity = Math.min(1.0, Math.abs(this.currentGazeX) * 1.1);
    }

    this.targetIntensity = Math.min(1.0, this.targetIntensity);
  }

  /**
   * Main Physics & State-Machine Update
   */
  update() {
    if (!this.isReady) return;

    // Smooth continuous gaze coordinates
    this.currentGazeX += (this.targetGazeX - this.currentGazeX) * this.lerpSpeed;
    this.currentGazeY += (this.targetGazeY - this.currentGazeY) * this.lerpSpeed;

    this.evaluateTargetGaze();

    let calculatedFrame = 0;

    if (this.targetBranch === 'idle') {
      if (this.currentBranch !== 'idle') {
        // Return current branch smoothly to 0 before idle
        this.currentIntensity -= this.returnToCenterSpeed;
        if (this.currentIntensity <= 0.02) {
          this.currentIntensity = 0.0;
          this.currentBranch = 'idle';
          this.idleFrameCounter = 190.0;
        }
        calculatedFrame = this.getFrameForBranch(this.currentBranch, this.currentIntensity);
      } else {
        // Smooth ambient idle video loop (190 -> 238 at ~22fps)
        this.idleFrameCounter += 0.32;
        if (this.idleFrameCounter > 238.0) {
          this.idleFrameCounter = 190.0;
        }
        calculatedFrame = Math.round(this.idleFrameCounter);
      }
    } else {
      // Transitioning between directions: Must pass smoothly through Center (Intensity = 0)
      if (this.currentBranch !== this.targetBranch) {
        if (this.currentBranch === 'idle' || this.currentBranch === 'center') {
          // Switch branch at center with micro crossfade
          this.crossfadeFrame = this.lastDrawnFrame;
          this.crossfadeAlpha = 1.0;
          this.currentBranch = this.targetBranch;
          this.currentIntensity = 0.0;
        } else {
          // Smoothly tilt back to Center first
          this.currentIntensity -= this.returnToCenterSpeed;
          if (this.currentIntensity <= 0.02) {
            this.crossfadeFrame = this.lastDrawnFrame;
            this.crossfadeAlpha = 1.0;
            this.currentIntensity = 0.0;
            this.currentBranch = this.targetBranch;
          }
        }
      } else {
        // In the same branch: smoothly adjust intensity
        this.currentIntensity += (this.targetIntensity - this.currentIntensity) * this.lerpSpeed;
      }

      calculatedFrame = this.getFrameForBranch(this.currentBranch, this.currentIntensity);
    }

    const clampedFrame = Math.max(0, Math.min(this.totalFrames - 1, calculatedFrame));

    if (clampedFrame !== this.lastDrawnFrame) {
      this.drawFrameWithCrossfade(clampedFrame);
      this.lastDrawnFrame = clampedFrame;
    }
  }

  getFrameForBranch(branch, intensity) {
    const i = Math.max(0, Math.min(1, intensity));
    switch (branch) {
      case 'left':
        // Left Branch: 0 (Center) -> 42 (Max Left)
        return Math.round(0 + i * 42);
      case 'right':
        // Right Branch: 60 (Center) -> 78 (Max Right)
        return Math.round(60 + i * 18);
      case 'up':
        // Up Branch: 102 (Center) -> 126 (Max Up)
        return Math.round(102 + i * 24);
      case 'down':
        // Down Branch: 154 (Center) -> 172 (Max Down)
        return Math.round(154 + i * 18);
      case 'center':
      default:
        return 0;
    }
  }

  drawFrameWithCrossfade(frameIndex) {
    const img = this.frames[frameIndex];
    if (!img || !img.complete) return;

    if (this.crossfadeAlpha > 0.05 && this.crossfadeFrame >= 0) {
      const prevImg = this.frames[this.crossfadeFrame];
      if (prevImg && prevImg.complete) {
        this.ctx.globalAlpha = 1.0;
        this.ctx.drawImage(prevImg, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1.0 - this.crossfadeAlpha;
        this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.globalAlpha = 1.0;
        this.crossfadeAlpha -= 0.25; // 4-frame seamless micro-crossfade
        return;
      }
    }

    this.ctx.globalAlpha = 1.0;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
  }

  drawFrame(frameIndex) {
    const img = this.frames[frameIndex];
    if (img && img.complete) {
      this.ctx.globalAlpha = 1.0;
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  startRenderLoop() {
    const loop = () => {
      this.update();
      requestAnimationFrame(loop);
    };
    requestAnimationFrame(loop);
  }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.avatarTrackerInstance = new AvatarTracker();
});
