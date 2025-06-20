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
          <router-link to="/user" class="option">
            <img src="/perfil.png" alt="Perfil" />
            <h2>Meu Cadastro</h2>
          </router-link>
  
          <router-link to="./orders" class="option">
            <img src="/carrinho.png" alt="Pedidos" />
            <h2>Meus Pedidos</h2>
          </router-link>
  
          <router-link to="./address" class="option">
            <img src="/endereco.png" alt="Endereços" />
            <h2>Meus Endereços</h2>
          </router-link>
  
          <div class="option option-selected">
            <img src="/trocarsenha.png" alt="Trocar Senha" />
            <h2 class="h2-selected">Trocar Senha</h2>
          </div>
  
          <router-link to="/" class="option">
            <img src="/sair.png" alt="Sair" />
            <h2>Sair</h2>
          </router-link>
        </div>
  
        <div class="user-container">
          <span style="color: black; font-size: 1.2em; margin-bottom: 10px">
            Alterar Senha
          </span>
  
          <form @submit.prevent="alterarSenha">
            <div class="password-section">
              <span style="margin-bottom: -15px">Senha Atual</span>
              <input 
                type="password" 
                class="form-input form-input-full" 
                v-model="form.senhaAtual"
                placeholder="Digite sua senha atual"
                required
              />
            </div>
  
            <div class="password-section">
              <span style="margin-bottom: -15px">Nova Senha</span>
              <input 
                type="password" 
                class="form-input form-input-full" 
                v-model="form.novaSenha"
                placeholder="Digite sua nova senha"
                required
                minlength="6"
              />
              <div class="password-requirements">
                <small>A senha deve ter pelo menos 6 caracteres</small>
              </div>
            </div>
  
            <div class="password-section">
              <span style="margin-bottom: -15px">Confirmar Nova Senha</span>
              <input 
                type="password" 
                class="form-input form-input-full" 
                v-model="form.confirmarSenha"
                placeholder="Confirme sua nova senha"
                required
                minlength="6"
              />
            </div>
  
            <!-- Indicadores de validação -->
            <div v-if="form.novaSenha" class="password-validation">
              <div class="validation-item" :class="{ valid: senhaValida.comprimento }">
                <span class="validation-icon">{{ senhaValida.comprimento ? '✓' : '✗' }}</span>
                Pelo menos 6 caracteres
              </div>
              <div v-if="form.confirmarSenha" class="validation-item" :class="{ valid: senhaValida.confirmacao }">
                <span class="validation-icon">{{ senhaValida.confirmacao ? '✓' : '✗' }}</span>
                As senhas coincidem
              </div>
            </div>
  
            <!-- Modal de confirmação -->
            <div
              v-if="modalAberto"
              class="modal-overlay"
              @click.self="fecharModal"
            >
              <div class="modal-content">
                <h3>Confirmar Alteração de Senha</h3>
                <p>Tem certeza que deseja alterar sua senha?</p>
                <p><small>Esta ação não pode ser desfeita.</small></p>
  
                <div class="modal-buttons">
                  <button type="button" @click="confirmarAlteracao" class="modal-confirm">
                    Confirmar
                  </button>
                  <button type="button" @click="fecharModal" class="modal-cancel">
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
  
            <hr />
            <div class="btns">
              <button 
                type="button" 
                class="btn-cancel"
                @click="limparFormulario"
              >
                Cancelar
              </button>
              <input 
                class="form-save" 
                type="submit" 
                value="Alterar Senha"
                :disabled="!formularioValido"
              />
            </div>
          </form>
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import Header from "../../components/Header.vue";
  import { ref, computed } from "vue";
  import { useRouter } from "vue-router";
  
  const router = useRouter();
  const modalAberto = ref(false);
  
  const form = ref({
    senhaAtual: "",
    novaSenha: "",
    confirmarSenha: "",
  });
  
  // Validações de senha
  const senhaValida = computed(() => ({
    comprimento: form.value.novaSenha.length >= 6,
    confirmacao: form.value.novaSenha === form.value.confirmarSenha && form.value.confirmarSenha !== "",
  }));
  
  // Verifica se o formulário está válido
  const formularioValido = computed(() => {
    return form.value.senhaAtual.length > 0 &&
           senhaValida.value.comprimento &&
           senhaValida.value.confirmacao;
  });
  
  const abrirModal = () => {
    modalAberto.value = true;
  };
  
  const fecharModal = () => {
    modalAberto.value = false;
  };
  
  const limparFormulario = () => {
    form.value = {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    };
  };
  
  const alterarSenha = () => {
    if (!formularioValido.value) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }
    
    abrirModal();
  };
  
  const confirmarAlteracao = async () => {
    try {
      // Aqui você pode chamar uma API para alterar a senha
      // const response = await api.alterarSenha({
      //   senhaAtual: form.value.senhaAtual,
      //   novaSenha: form.value.novaSenha
      // });
      
      fecharModal();
      alert("Senha alterada com sucesso!");
      limparFormulario();
      
      // Opcional: redirecionar para a página de usuário
      // router.push('/user');
      
    } catch (error) {
      console.error("Erro ao alterar senha:", error);
      alert("Erro ao alterar senha. Verifique se a senha atual está correta.");
    }
  };
  </script>
  
  <style>
  @import "../../assets/user.css";
  
  .password-section {
    margin-bottom: 25px;
  }
  
  .password-requirements {
    margin-top: 5px;
    color: #666;
  }
  
  .password-validation {
    margin: 20px 0;
    padding: 15px;
    background-color: #f8f9fa;
    border-radius: 8px;
    border: 1px solid #e9ecef;
  }
  
  .validation-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.9em;
    color: #dc3545;
  }
  
  .validation-item:last-child {
    margin-bottom: 0;
  }
  
  .validation-item.valid {
    color: #28a745;
  }
  
  .validation-icon {
    margin-right: 8px;
    font-weight: bold;
    width: 16px;
    text-align: center;
  }
  
  .btn-cancel {
    background-color: #6c757d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 1em;
    transition: background-color 0.3s;
  }
  
  .btn-cancel:hover {
    background-color: #5a6268;
  }
  
  .form-save:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
    opacity: 0.6;
  }
  
  .form-save:disabled:hover {
    background-color: #6c757d;
  }
  </style>