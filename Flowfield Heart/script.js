class Particle {
      constructor() {
        this.x = Math.random() * w;
        this.y = Math.random() * h;
        this.angle = Math.random() * Math.PI * 2;
      }

      move() {
        const zoom = 80;
        const stepSize = 0.5;
        const x = Math.floor(this.x);
        const y = Math.floor(this.y);
        const index = y * w + x;
        const isInside = index < imageBuffer.length && imageBuffer[index];

        if (isInside) {
          const strength = 1;
          const xn = simplex.noise3D(this.x / zoom, this.y / zoom, ticker + 4000) * strength;
          const yn = simplex.noise3D(this.x / zoom, this.y / zoom, ticker + 8000) * strength;
          this.x += xn;
          this.y += yn;
        } else {
          this.angle += (Math.random() - 0.5) * 0.5;
          this.x += Math.cos(this.angle) * stepSize;
          this.y += Math.sin(this.angle) * stepSize;
        }

        if (this.x < 0) this.x = w;
        if (this.x > w) this.x = 0;
        if (this.y < 0) this.y = h;
        if (this.y > h) this.y = 0;
      }

      draw() {
        ctx.fillRect(this.x, this.y, 1, 1);
      }
    }

    let canvas, ctx, w, h, imageBuffer, particles, ticker, simplex;

    function setup() {
      ticker = 0;
      simplex = new SimplexNoise();
      canvas = document.getElementById("canvas");
      ctx = canvas.getContext("2d");
      reset();
      window.addEventListener("resize", reset);
    }

    function setupParticles() {
      particles = [];
      const count = Math.floor(w * h / 35);
      for (let i = 0; i < count; i++) {
        particles.push(new Particle());
      }
    }

    function reset() {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
      storeHeartInBuffer();
      setupParticles();
      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, w, h);
    }

    function draw() {
      requestAnimationFrame(draw);
      ctx.fillStyle = "rgba(0,0,0,0.08)";
      ctx.fillRect(0, 0, w, h);
      ctx.fillStyle = "#ff0044"; // Daha canlı kırmızı
      particles.forEach(p => {
        p.move();
        p.draw();
      });
      ticker += 0.012;
    }

    function storeHeartInBuffer() {
      ctx.beginPath();
      for (let angle = 0; angle < Math.PI * 2; angle += 0.01) {
        const r = Math.min(w, h) * 0.03;
        const x = r * 16 * Math.pow(Math.sin(angle), 3);
        const y = -r * (13 * Math.cos(angle) - 5 * Math.cos(2 * angle) - 2 * Math.cos(3 * angle) - Math.cos(4 * angle));
        ctx.lineTo(w / 2 + x, h * 0.45 + y);
      }
      ctx.strokeStyle = "rgba(255, 50, 50, 0.4)";
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 50, 50, 0.2)";
      ctx.fill();

      const image = ctx.getImageData(0, 0, w, h);
      imageBuffer = new Uint32Array(image.data.buffer);
    }

    setup();
    draw();