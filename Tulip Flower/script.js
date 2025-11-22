 window.onload = () => {
      setTimeout(() => {
        document.body.classList.remove("not-loaded");
      }, 1000);

      createStars();
      createFireflies();
      addInteractivity();
    };

    // Rastgele Yıldız Oluşturma
    function createStars() {
        const starCount = 50;
        const body = document.body;
        for (let i = 0; i < starCount; i++) {
            const star = document.createElement('div');
            star.className = 'star';
            const x = Math.random() * 100;
            const y = Math.random() * 80; // Sadece üst kısımlarda
            const size = Math.random() * 0.3 + 0.1;
            const duration = Math.random() * 2 + 1;
            
            star.style.left = `${x}%`;
            star.style.top = `${y}%`;
            star.style.width = `${size}vmin`;
            star.style.height = `${size}vmin`;
            star.style.setProperty('--duration', `${duration}s`);
            
            body.appendChild(star);
        }
    }

    // Rastgele Ateş Böceği Oluşturma
    function createFireflies() {
        const count = 20;
        const body = document.body;
        for (let i = 0; i < count; i++) {
            const fly = document.createElement('div');
            fly.className = 'firefly';
            const x = Math.random() * 100;
            const y = Math.random() * 100;
            const moveX = (Math.random() - 0.5) * 20; // -10 ile 10 vmin arası hareket
            const moveY = (Math.random() - 0.5) * 20;
            const duration = Math.random() * 5 + 5;
            const delay = Math.random() * 5;

            fly.style.left = `${x}%`;
            fly.style.top = `${y}%`;
            fly.style.setProperty('--x-move', `${moveX}vmin`);
            fly.style.setProperty('--y-move', `${moveY}vmin`);
            fly.style.setProperty('--duration', `${duration}s`);
            fly.style.animationDelay = `${delay}s`;
            
            body.appendChild(fly);
        }
    }

    // Mouse ile Parallax Efekti
    function addInteractivity() {
        const flowers = document.querySelector('.flowers');
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.pageX) / 30;
            const y = (window.innerHeight / 2 - e.pageY) / 30;
            
            flowers.style.transform = `scale(0.9) translate(${x}px, ${y}px)`;
        });
    }