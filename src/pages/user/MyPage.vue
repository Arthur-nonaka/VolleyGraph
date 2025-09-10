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

        <router-link to="./orders" class="option">
          <img src="/carrinho.png" alt="Perfil" />
          <h2>Meus Pedidos</h2>
        </router-link>

        <router-link to="./address" class="option">
          <img src="/endereco.png" alt="Perfil" />
          <h2>Meus Endereços</h2>
        </router-link>

        <router-link to="./change-password" class="option">
          <img src="/trocarsenha.png" alt="Perfil" />
          <h2>Trocar Senha</h2>
        </router-link>

        <router-link to="/" class="option" @click="logout">
          <img src="/sair.png" alt="Perfil" />
          <h2>Sair</h2>
        </router-link>
      </div>

      <div class="user-container">
        <div style="display: flex; justify-content: center; width: 100%">
          <div style="width: 100%;">
            <span style="color: black; font-size: 1.2em; margin-bottom: 10px"
              >Foto de Perfil</span
            >
            <div class="photo-div">
              <img
                class="img-perfil"
                src="/volleyball.png"
                alt="Foto de Perfil"
              />
              <div class="img-options">
                <button class="form-save">Mudar Imagem</button>
                <button class="form-save">Remover Imagem</button>
              </div>
            </div>
          </div>
        </div>

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
            <input
              class="btn-delete"
              type="submit"
              value="Excluir Minha Conta"
            />
            <input class="form-save" type="submit" value="Salvar" />
          </div>
        </form>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import Header from "../../components/Header.vue";

import { ref } from "vue";

const modalAberto = ref(false);

const router = useRouter();

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


const logout = () => {
  localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    router.push("/login");
}
</script>

<style>
@import "../../assets/user.css";
</style>
