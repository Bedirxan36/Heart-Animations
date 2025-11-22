// ---- DOM elements ----
    const $BACKDROP = document.getElementById('backdrop');
    const $HEARTS = document.getElementById('hearts');
    const $RAIN = document.getElementById('rain');
    const $BEAR = document.getElementById('bear');

    // specific sub-elements in the SVG
    const $BEAR_ARM_LEFT = $BEAR.querySelector('.care-bear__arm--left');
    const $BEAR_ARM_RIGHT = $BEAR.querySelector('.care-bear__arm--right');
    const $BEAR_EAR_LEFT = $BEAR.querySelector('.care-bear__ear--left');
    const $BEAR_EAR_RIGHT = $BEAR.querySelector('.care-bear__ear--right');
    const $BEAR_MOUTH = $BEAR.querySelector('.care-bear__mouth');
    const $BEAR_NOSE = $BEAR.querySelector('.care-bear__nose');
    const $BEAR_CHEEK_LEFT = $BEAR.querySelector('.care-bear__cheek--left');
    const $BEAR_CHEEK_RIGHT = $BEAR.querySelector('.care-bear__cheek--right');
    const $BEAR_EYE_LEFT = $BEAR.querySelector('.care-bear__eye--left');
    const $BEAR_EYE_RIGHT = $BEAR.querySelector('.care-bear__eye--right');
    const $BEAR_PUPIL_LEFT = $BEAR.querySelector('.care-bear__pupil--left');
    const $BEAR_PUPIL_RIGHT = $BEAR.querySelector('.care-bear__pupil--right');
    const $BEAR_BELLY = $BEAR.querySelector('.care-bear__belly');
    const $BEAR_MUZZLE = $BEAR.querySelector('.care-bear__muzzle');
    const $BEAR_HEART = $BEAR.querySelector('.care-bear__heart');

    // ---- speeds / state ----
    const SPEEDS = {
      BACKDROP: { SCALE: 0.25, SPIN: 0.85 },
      BREATHING: 1.5,
      SWITCH: 0.3
    };
    const STATE = { FIRING: false, CLOSING: false };

    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768;

    // Mouse/Touch tracking
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    document.addEventListener('mousemove', (e) => {
      if (!isMobile) {
        mouseX = e.clientX;
        mouseY = e.clientY;
      }
    });
    
    document.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (e.touches.length > 0) {
        mouseX = e.touches[0].clientX;
        mouseY = e.touches[0].clientY;
      }
    }, { passive: false });

    // set initial visible
    gsap.set(document.body, { opacity: 1 });

    // initial backdrop scale (closed)
    gsap.set($BACKDROP, { scale: 0 });

    // ÜZGÜN HAL - Başlangıç (Tamamen gri/monoton)
    gsap.set($BEAR, { '--hue': 0, '--saturation': '0%', '--lightness': '60%' });
    if ($BEAR_ARM_LEFT) gsap.set($BEAR_ARM_LEFT, { transformOrigin: '85% 80%', scale: .85, rotate: -110 });
    if ($BEAR_ARM_RIGHT) gsap.set($BEAR_ARM_RIGHT, { transformOrigin: '15% 80%', scale: .85, rotate: 110 });
    if ($BEAR_EAR_LEFT) gsap.set($BEAR_EAR_LEFT, { transformOrigin: '70% 85%', rotate: -60 });
    if ($BEAR_EAR_RIGHT) gsap.set($BEAR_EAR_RIGHT, { transformOrigin: '30% 85%', rotate: 60 });
    if ($BEAR_MOUTH) gsap.set($BEAR_MOUTH, { transformOrigin: '50% 0%', scaleY: 0, y: '+=2' });
    if ($BEAR_NOSE) gsap.set($BEAR_NOSE, { transformOrigin: '50% 50%', y: '+=2' });
    if ($BEAR_BELLY) gsap.set($BEAR_BELLY, { transformOrigin: '50% 50%' });
    if ($BEAR_MUZZLE) gsap.set($BEAR_MUZZLE, { transformOrigin: '50% 50%' });
    if ($BEAR_HEART) gsap.set($BEAR_HEART, { transformOrigin: '50% 50%', opacity: 0.5 });
    gsap.set([$BEAR_CHEEK_LEFT, $BEAR_CHEEK_RIGHT], { transformOrigin: '50% 50%', opacity: 0, y: '+=2' });
    gsap.set([$BEAR_EYE_LEFT, $BEAR_EYE_RIGHT], { transformOrigin: '50% 50%', y: '+=2', clipPath: 'inset(50% 0 0 0)' });
    gsap.set([$BEAR_PUPIL_LEFT, $BEAR_PUPIL_RIGHT], { transformOrigin: '50% 50%', z: 1, y: '+=1.25' });

    // --- backdrop open animation ---
    const OPEN_BACKDROP_TL = gsap.timeline({ paused: true })
      .to($BACKDROP, { scale: 1.5, duration: SPEEDS.BACKDROP.SCALE })
      .to($BACKDROP, { rotate: 360, duration: SPEEDS.BACKDROP.SPIN, repeat: -1, ease: 'none' }, 0);

    // close timeline
    const CLOSE_BACKDROP_TL = gsap.timeline({
      paused: true,
      onComplete: () => {
        STATE.CLOSING = false;
        STATE.FIRING = false;
        OPEN_BACKDROP_TL.pause();
        BREATHING_TL.play();
      }
    }).to($BACKDROP, { scale: 0, duration: SPEEDS.BACKDROP.SCALE });

    // heart SVG template
    const HEART_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 7.258088 6.7122535"><path d="M2.56864 1.32292c-.31816 0-.63626.12209-.88005.36587-.48757.48758-.48757 1.27253 0 1.7601l.18035.18035 1.7601 1.7601 1.7601-1.7601.18035-.18035c.48757-.48757.48757-1.27252 0-1.7601-.24379-.24378-.56189-.36587-.88005-.36587-.31815 0-.63626.12209-.88005.36587l-.18035.18035-.18035-.18035c-.24379-.24378-.5619-.36587-.88005-.36587z" fill="red"/></svg>`;

    let heartTimeline;
    function fireHearts(){
      if (heartTimeline) heartTimeline.kill();
      
      const heartCount = isMobile ? 20 : 30;
      const heartDelay = isMobile ? 0.15 : 0.1;
      
      heartTimeline = gsap.timeline({
        repeat: -1,
        onRepeat: () => {
          if (!STATE.FIRING || STATE.CLOSING) {
            heartTimeline.kill();
          }
        }
      });

      for (let i = 0; i < heartCount; i++) {
        heartTimeline.call(() => {
          const newHeart = document.createElement('div');
          newHeart.className = 'heart';
          const size = gsap.utils.random(5, 15);
          newHeart.style.setProperty('--size', size);
          newHeart.style.setProperty('--hue', gsap.utils.random(320, 360));
          newHeart.innerHTML = HEART_SVG;
          $HEARTS.appendChild(newHeart);
          gsap.set(newHeart, { rotate: gsap.utils.random(0, 360), transformOrigin: '50% 50%' });
          const svg = newHeart.querySelector('svg');
          gsap.to(svg, {
            y: '-100vmax',
            x: gsap.utils.random(-20, 20),
            duration: gsap.utils.random(1, 2),
            ease: 'none',
            onComplete: () => newHeart.remove()
          });
        }, [], i * heartDelay);
      }
    }

    // MUTLU HAL Timeline (Turuncu/Kahverengi renk)
    const RAISE_TL = gsap.timeline({ paused: true })
      .to([$BEAR_ARM_LEFT, $BEAR_ARM_RIGHT], { duration: SPEEDS.SWITCH, scale: 1, rotate: 0 })
      .to([$BEAR_EAR_LEFT, $BEAR_EAR_RIGHT], { duration: SPEEDS.SWITCH, rotate: 0 }, 0)
      .to($BEAR_HEART, { duration: SPEEDS.SWITCH, scale: 1.2, opacity: 1 }, 0)
      .to($BEAR_NOSE, { duration: SPEEDS.SWITCH, y: 0 }, 0)
      .to($BEAR_MOUTH, { duration: SPEEDS.SWITCH, y: 0, scaleY: 1 })
      .to([$BEAR_CHEEK_LEFT, $BEAR_CHEEK_RIGHT], { duration: SPEEDS.SWITCH, opacity: 1, y: 0 }, 0)
      .to([$BEAR_EYE_LEFT, $BEAR_EYE_RIGHT], { duration: SPEEDS.SWITCH, clipPath: 'inset(0 0 0 0)', y: 0 }, 0)
      .to([$BEAR_PUPIL_LEFT, $BEAR_PUPIL_RIGHT], { duration: SPEEDS.SWITCH, y: 0 }, 0)
      .to($BEAR, { 
        duration: SPEEDS.SWITCH, 
        '--hue': 25,
        '--saturation': '75%', 
        '--lightness': '55%',
        onStart: () => {
          $BEAR.classList.add('happy');
        }
      }, 0);

    // breathing animation
    const BREATHING_TL = gsap.timeline({ repeat: -1, yoyo: true })
      .to($BEAR_BELLY, { scale: 1.025, duration: SPEEDS.BREATHING })
      .to($BEAR_ARM_RIGHT, { rotate: 108, duration: SPEEDS.BREATHING }, 0)
      .to($BEAR_ARM_LEFT, { rotate: -108, duration: SPEEDS.BREATHING }, 0)
      .to($BEAR_NOSE, { y: '-=0.4', duration: SPEEDS.BREATHING }, 0)
      .to([$BEAR_EYE_LEFT, $BEAR_EYE_RIGHT], { y: '-=0.4', duration: SPEEDS.BREATHING }, 0)
      .to([$BEAR_EAR_LEFT, $BEAR_EAR_RIGHT], { y: '-=0.4', duration: SPEEDS.BREATHING }, 0)
      .to($BEAR_MUZZLE, { y: '-=0.4', duration: SPEEDS.BREATHING }, 0);

    BREATHING_TL.play();

    // blinking
    let BLINKING_TL;
    function blink(){
      const DELAY = gsap.utils.random(1, 5);
      BLINKING_TL = gsap.timeline()
        .to([$BEAR_EYE_LEFT, $BEAR_EYE_RIGHT], { 
          delay: DELAY, 
          scaleY: 0, 
          duration: 0.1, 
          repeat: 1, 
          yoyo: true, 
          onComplete: blink 
        });
    }
    blink();

    // Pupil tracking
    let pupilAnimationFrame;
    function updatePupils() {
      if (!STATE.FIRING || STATE.CLOSING) {
        if (pupilAnimationFrame) {
          cancelAnimationFrame(pupilAnimationFrame);
          pupilAnimationFrame = null;
        }
        return;
      }
      
      const bearRect = $BEAR.getBoundingClientRect();
      const bearCenterX = bearRect.left + bearRect.width / 2;
      const bearCenterY = bearRect.top + bearRect.height / 2;
      
      const deltaX = mouseX - bearCenterX;
      const deltaY = mouseY - bearCenterY;
      
      const maxMove = 1.5;
      const sensitivity = isMobile ? 60 : 80;
      const moveX = Math.max(-maxMove, Math.min(maxMove, deltaX / sensitivity));
      const moveY = Math.max(-maxMove, Math.min(maxMove, deltaY / sensitivity));
      
      gsap.to([$BEAR_PUPIL_LEFT, $BEAR_PUPIL_RIGHT], {
        x: moveX,
        y: moveY,
        duration: 0.3,
        ease: 'power2.out'
      });
      
      if (STATE.FIRING && !STATE.CLOSING) {
        pupilAnimationFrame = requestAnimationFrame(updatePupils);
      }
    }

    function tease(){ 
      BLINKING_TL.pause(); 
      gsap.to([$BEAR_EYE_RIGHT, $BEAR_EYE_LEFT], { 
        duration: SPEEDS.SWITCH, 
        clipPath: 'inset(0 0 0 0)' 
      }); 
    }
    
    function sadden(){ 
      BLINKING_TL.restart(); 
      gsap.to([$BEAR_EYE_RIGHT, $BEAR_EYE_LEFT], { 
        clipPath: 'inset(50% 0 0 0)', 
        duration: SPEEDS.SWITCH 
      }); 
      gsap.to([$BEAR_PUPIL_LEFT, $BEAR_PUPIL_RIGHT], {
        x: 0,
        y: 0,
        duration: 0.3
      });
    }

    // key handling
    function handleKeyDown(e){ 
      if (e.code === 'Space' && !STATE.FIRING && !STATE.CLOSING) {
        e.preventDefault();
        start();
      }
    }
    function handleKeyUp(e){ 
      if (e.code === 'Space' && STATE.FIRING && !STATE.CLOSING) {
        e.preventDefault();
        end();
      }
    }

    function start(){
      if (STATE.CLOSING) return;
      STATE.FIRING = true;
      OPEN_BACKDROP_TL.restart();
      RAISE_TL.play();
      BREATHING_TL.pause();
      if (BLINKING_TL) { BLINKING_TL.pause(); BLINKING_TL.seek(0); }
      
      gsap.to($RAIN, { opacity: 0, duration: 0.3 });
      
      fireHearts();
      updatePupils();
    }

    function end(){
      if (STATE.CLOSING || !STATE.FIRING) return;
      STATE.CLOSING = true;
      
      CLOSE_BACKDROP_TL.restart();
      if (BLINKING_TL) BLINKING_TL.restart();
      RAISE_TL.reverse();
      
      gsap.to($RAIN, { opacity: 1, duration: 0.5 });
      
      $BEAR.classList.remove('happy');
      gsap.to($BEAR, { 
        duration: SPEEDS.SWITCH, 
        '--hue': 0,
        '--saturation': '0%', 
        '--lightness': '60%'
      });
      
      sadden();
      
      if (heartTimeline) {
        heartTimeline.kill();
        gsap.to($HEARTS.children, {
          opacity: 0,
          duration: 0.3,
          onComplete: () => {
            $HEARTS.innerHTML = '';
          }
        });
      }
    }

    // attach events
    $BEAR.addEventListener('mousedown', (e) => {
      if (!isMobile) start();
    });
    
    $BEAR.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      start();
    }, { passive: false });
    
    document.addEventListener('mouseup', (e) => {
      if (!isMobile) end();
    });
    
    document.addEventListener('touchend', (e) => {
      e.preventDefault();
      e.stopPropagation();
      end();
    }, { passive: false });
    
    if (!isMobile) {
      $BEAR.addEventListener('mouseover', tease);
      $BEAR.addEventListener('mouseleave', sadden);
    }
    
    document.body.addEventListener('keydown', handleKeyDown);
    document.body.addEventListener('keyup', handleKeyUp);

    // --- rain generation ---
    const letItRain = true;
    if (letItRain) {
      const dropCount = Math.floor(Math.random()*25) + 10;
      for (let d=0; d<dropCount; d++){
        const s = document.createElementNS('http://www.w3.org/2000/svg','svg');
        s.setAttribute('viewBox','0 0 5 50');
        s.style.left = `${Math.floor(Math.random()*100)}%`;
        s.style.top = `${-Math.floor(Math.random()*200)}px`;
        const animA = (Math.random() + 0.5).toFixed(2);
        const animDelay = (Math.random() * -1).toFixed(2);
        const opacity = Math.random().toFixed(2);
        s.style.opacity = opacity;
        s.style.animationDuration = `${animA}s`;
        s.style.animationDelay = `${animDelay}s`;
        s.style.animationName = 'drop';
        s.style.animationTimingFunction = 'linear';
        s.style.animationIterationCount = 'infinite';
        const path = document.createElementNS('http://www.w3.org/2000/svg','path');
        path.setAttribute('d', 'M 2.5,0 C 2.6949458,3.5392017 3.344765,20.524571 4.4494577,30.9559 5.7551357,42.666753 4.5915685,50 2.5,50 0.40843152,50 -0.75513565,42.666753 0.55054234,30.9559 1.655235,20.524571 2.3050542,3.5392017 2.5,0 Z');
        s.appendChild(path);
        $RAIN.appendChild(s);
      }
    }

    // small safety: if elements missing, don't break
    window.addEventListener('error', e => console.warn('JS error (nonfatal):', e.message));