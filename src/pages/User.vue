<template>
    <Header />
  <main>
    <h1 style="margin-top: 30px">Minha Conta</h1>

    <div class="container">
      <router-link to="/user/my-page" class="card-container">
          <Card img="/perfil.png" />
          <h3>Meu Cadastro</h3>
      </router-link>

      <div class="card-container">
        <Card img="/carrinho.png" />
        <h3>Meus Pedidos</h3>
      </div>

      <div class="card-container">
        <Card img="/endereco.png" />
        <h3>Meus Endereços</h3>
      </div>

      <div class="card-container">
        <Card img="/trocarsenha.png" />
        <h3>Trocar Senha</h3>
      </div>

      <div class="card-container">
        <Card img="/sair.png" />
        <h3>Sair</h3>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from "../components/Header.vue";
import Card from "../components/Card.vue";
</script>

<style scoped>
.container {
  width: 100%;
  height: 60vh;
  /* background-color: var(--vt-c-dark-blue); */
  display: flex;
  align-content: center;
  align-items: flex-start;
  justify-content: center;
  /* align-content:space-around; */
  flex-direction: row;
  flex-wrap: wrap;
  gap: 15px;
}

main {
  width: 100%;
  background-color: var(--vt-c-white);
  display: flex;
  align-items: center;
  flex-direction: column;
}

.card-container {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  text-decoration: none;
}

h3 {
    font-size: 1.3rem;
    margin-top: 10px;
    color: black;
}
</style>
