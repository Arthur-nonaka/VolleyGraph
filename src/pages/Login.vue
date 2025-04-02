<template>
  <div class="login-container">
    <div class="background">
      <canvas id="particles"></canvas>
    </div>
    <div class="login-box">
      <div>
        <input type="text" placeholder="Usuário" />
        <input type="password" placeholder="Senha" />
        <button>Entrar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const canvas = document.getElementById("particles");
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let particlesArray = [];

  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.speedX = Math.random() * 1.5 - 0.75;
      this.speedY = Math.random() * 1.5 - 0.75;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
      if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
    }

    draw() {
      ctx.fillStyle = "rgba(255, 255, 255)";
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function init() {
    particlesArray = [];
    for (let i = 0; i < 40; i++) {
      particlesArray.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particlesArray.forEach((particle) => {
      particle.update();
      particle.draw();
    });
    requestAnimationFrame(animate);
  }

  init();
  animate();
});
</script>

<style scoped>
/* Estilização da Página */
.login-container {
  position: relative;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    135deg,
    var(--vt-c-blue) 80%,
    var(--vt-c-dark-blue)
  );
}

/* Fundo animado com partículas */
.background {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

canvas {
  position: absolute;
  width: 100%;
  height: 100%;
}

/* Estilo do Box de Login */
.login-box {
  position: relative;
  z-index: 10;
  background-image: url('./loginBackground.jpg');
  background-size: 100%;
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(15px);
  text-align: center;
  width: 60vw;
  height: 70vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.login-box input {
  width: 100%;
  padding: 10px;
  margin: 8px 0;
  border: none;
  border-radius: 5px;
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.login-box input::placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.login-box button {
  width: 100%;
  padding: 12px;
  background: #ff7f50;
  border: none;
  border-radius: 5px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s ease;
}

.login-box button:hover {
  background: #ff4500;
}
</style>
