<template>
  <footer>
    <div class="footer-container">
      <div class="footer-content">
        <h3>Sobre o Vôlei</h3>
        <p>
          O vôlei é um esporte emocionante e dinâmico, jogado em todo o mundo.
          Aqui, você encontra as últimas notícias, dicas, e estatísticas sobre o
          mundo do vôlei.
        </p>
      </div>

      <div class="footer-links">
        <h3>Links Úteis</h3>
        <ul>
          <li><a href="#home">Início</a></li>
          <li><a href="#tabela">Tabela de Jogos</a></li>
          <li><a href="#equipes">Times</a></li>
          <li><a href="#equipes">Jogadores</a></li>
          <li><a href="#contato">Contato</a></li>
        </ul>
      </div>

      <div class="footer-social">
        <h3>Siga-nos</h3>
        <ul>
          <li>
            <a href="https://www.facebook.com" target="_blank">
              <i class="fab fa-facebook-f"></i> Facebook
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com" target="_blank">
              <i class="fab fa-instagram"></i> Instagram
            </a>
          </li>
          <li>
            <a href="https://www.twitter.com" target="_blank">
              <i class="fab fa-twitter"></i> Twitter
            </a>
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <p>&copy; 2025 VolleyGraph. Todos os direitos reservados.</p>
    </div>
  </footer>
</template>

<style scoped>
footer {
  background-color: var(--vt-c-blue);
  color: var(--vt-c-white);
  padding: 30px 0;
  font-family: "Britannic", sans-serif;
  text-align: center;
}

.footer-container {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.footer-content,
.footer-links,
.footer-social {
  width: 100%;
  max-width: 300px;
  margin: 10px;
}

.footer-content h3,
.footer-links h3,
.footer-social h3 {
  margin-bottom: 15px;
  font-size: 1.6em;
  color: var(--vt-c-orange);
}

.footer-content p {
  font-size: 1.3em;
  line-height: 1.5;
}

.footer-links ul,
.footer-social ul {
  list-style: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.footer-links li,
.footer-social li {
  margin-bottom: 10px;
}

.footer-links a,
.footer-social a {
  color: #fff;
  text-decoration: none;
  font-size: 1.3em;
  display: flex;
  align-items: center;
}

.footer-links a:hover,
.footer-social a:hover {
  color: var(--vt-c-orange);
}

.footer-social a {
  font-size: 1.3em;
}

.footer-social i {
  margin-right: 10px; /* Espaço entre o ícone e o texto */
}

.footer-bottom {
  margin-top: 20px;
  font-size: 0.9em;
}

.footer-bottom p {
  margin: 0;
  color: #bbb;
}

/* Responsividade */
@media (max-width: 768px) {
  .footer-container {
    flex-direction: column;
    text-align: center;
  }
}
</style>
