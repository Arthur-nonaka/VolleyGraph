<template>
  <Header />

  <main>
    <div class="title">
      <router-link to="/user" class="back-button">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M15 19l-7-7 7-7"
          />
        </svg>
        <span style="font-size: 1.2em; outline: none">Minha Conta</span>
      </router-link>
    </div>

    <div class="container">
      <div class="options">
        
        <div class="option option-selected">
          <img src="/perfil.png" alt="Perfil" />
          <h2 class="h2-selected">Meu Cadastro</h2>
        </div>

        <router-link to="/orders" class="option">
          <img src="/carrinho.png" alt="Perfil" />
          <h2>Meus Pedidos</h2>
        </router-link>
        

        <router-link to="/address" class="option">
          <img src="/endereco.png" alt="Perfil" />
          <h2>Meus Endereços</h2>
        </router-link>

        <router-link to="/changepassword" class="option">
          <img src="/trocarsenha.png" alt="Perfil" />
          <h2>Trocar Senha</h2>
        </router-link>

        <router-link to="/" class="option">
          <img src="/sair.png" alt="Perfil" />
          <h2>Sair</h2>
        </router-link>
      </div>

      <div class="user-container">
        <span style="color: black; font-size: 1.2em; margin-bottom: 10px"
          >Meus Dados</span
        >

        <form action="">
          <span style="margin-bottom: -15px">Nome Completo</span>
          <input type="text" class="form-input form-input-full" />

          <div class="row">
            <div class="col">
              <span>Data de Nascimento</span>
              <input type="text" class="form-input" disabled />
            </div>
            <div class="col">
              <span>CPF</span>
              <input type="text" class="form-input" disabled />
            </div>
            <div class="col">
              <span>RG</span>
              <input type="text" class="form-input" />
            </div>
          </div>

          <div class="row">
            <div class="col">
              <span>Email</span>
              <input type="text" class="form-input" v-model="form.email" />
              <button type="button" class="link-button" @click="abrirModal">
                Alterar e-mail
              </button>
            </div>
            <div class="col">
              <span>Telefone</span>
              <input type="text" class="form-input" v-model="form.telefone" />
            </div>
          </div>

          <!-- Modal -->
          <div
            v-if="modalAberto"
            class="modal-overlay"
            @click.self="fecharModal"
          >
            <div class="modal-content">
              <h3>Alterar E-mail</h3>
              <input
                type="email"
                class="form-input"
                placeholder="Novo e-mail"
                v-model="emailNovo"
              />
              <input
                type="email"
                class="form-input"
                placeholder="Confirmar novo e-mail"
                v-model="emailConfirmado"
              />
              <input
                type="password"
                class="form-input"
                placeholder="Senha atual"
                v-model="senha"
              />

              <div class="modal-buttons">
                <button @click="confirmarAlteracao" class="modal-confirm">
                  Confirmar
                </button>
                <button @click="fecharModal" class="modal-cancel">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
          <hr />
          <div class="btns">
            <input class="btn-delete" type="submit" value="Excluir Minha Conta" />
            <input class="form-save" type="submit" value="Salvar" />
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import Header from "../../components/Header.vue";

import { ref } from "vue";

const modalAberto = ref(false);

const form = ref({
  email: "",
  telefone: "",
});

const emailNovo = ref("");
const emailConfirmado = ref("");
const senha = ref("");

const abrirModal = () => {
  modalAberto.value = true;
};

const fecharModal = () => {
  modalAberto.value = false;
  emailNovo.value = "";
  emailConfirmado.value = "";
  senha.value = "";
};

const confirmarAlteracao = () => {
  if (!emailNovo.value || !emailConfirmado.value || !senha.value) {
    alert("Preencha todos os campos.");
    return;
  }
  if (emailNovo.value !== emailConfirmado.value) {
    alert("Os e-mails não coincidem.");
    return;
  }

  // Aqui você pode chamar uma API para atualizar o e-mail
  form.value.email = emailNovo.value;
  fecharModal();
  alert("E-mail alterado com sucesso!");
};
</script>

<style scoped>
main {
  width: 100%;
  background-color: var(--vt-c-white);
  display: flex;
  align-items: center;
  flex-direction: column;
}

.title {
  width: 70%;
  display: flex;
  flex-direction: column;
  margin-top: 30px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: var(--vt-c-blue);
  transition: color 0.3s ease;
  margin-bottom: 10px;
  width: fit-content;
}

.back-button:hover {
  color: var(--vt-c-orange);
}

.icon {
  width: 30px;
  height: 30px;
}

.container {
  display: flex;
  flex-direction: row;
}

.options {
  margin: 30px;
  width: 22vw;
  height: auto;
  background-color: var(--vt-c-blue);
  border-radius: 10px;

  .option {
    width: 100%;
    height: 10vh;
    padding: 20px;
    display: flex;
    flex-direction: row;
    /* justify-content: space-between; */
    align-items: center;
    text-decoration: none;

    img {
      width: 30%;
      height: 100%;
    }

    h2 {
      font-size: 1.2em;
      color: white;
      margin-left: 15px;
      margin-top: 10px;
    }

    .h2-selected {
      font-size: 1.2em;
      color: var(--vt-c-orange);
      margin-left: 15px;
      margin-top: 10px;
    }
  }

  .option-selected {
    border-left: 5px solid var(--vt-c-orange);
    background-color: rgba(255, 255, 255, 0.1); /* opcional para dar destaque */
  }
}

.user-container {
  width: 70vw;
  min-height: 60vh;
  /* border: 1px solid black; */
  padding: 20px;
  box-sizing: border-box;

  form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .form-input-full {
    width: 100%;
    height: 5vh;
  }

  .row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 20px;
    flex-wrap: wrap;
  }

  .col {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
  }

  .form-input {
    height: 5vh;
    padding: 5px;
    font-size: 1em;
    outline: none;
    border: 1px solid #ccc;
    border-radius: 4px;
  }

  .form-input:focus {
    border-color: black;
  }

  .form-input:disabled {
    background-color: #bebebe;
  }

  .link-button {
    background: none;
    border: none;
    color: var(--vt-c-blue);
    cursor: pointer;
    font-size: 0.9em;
    padding: 0;
    margin-top: 5px;
    text-decoration: underline;
    width: fit-content;
  }

  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 999;
  }

  .modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 8px;
    width: 90%;
    max-width: 400px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  }

  .modal-content input {
    width: 100%;
    margin: 10px 0;
    padding: 10px;
    font-size: 1em;
  }

  .modal-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
  }

  .modal-confirm {
    background-color: var(--vt-c-blue);
    color: white;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
  }

  .modal-cancel {
    background-color: #ccc;
    color: black;
    border: none;
    padding: 8px 16px;
    cursor: pointer;
    border-radius: 4px;
  }

  .btns{
    width: 100%;
    display: flex;
    justify-content: right;

  }

  .btn-delete{
    background-color: var(--vt-c-orange);
    border: none;
    border-radius: 3px;
    width: 12vw;
    height: 4vh;
    
  }

  .form-save{
    background-color: var(--vt-c-blue);
    height: 4vh;
    width: 6vw;
    border: none;
    color: var(--vt-c-white);
    margin-left: 10px;
  }
}
</style>
