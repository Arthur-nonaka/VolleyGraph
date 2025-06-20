<template>
    <Header />
  
    <main>
      <div class="title">
        <router-link to="/user" class="back-button">
          <svg xmlns="http://www.w3.org/2000/svg" class="icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span style="font-size: 1.2em;">Minha Conta</span>
        </router-link>
      </div>
  
      <div class="container">
        <div class="options">
          <router-link to="./my-page" class="option">
            <img src="/perfil.png" alt="Perfil" />
            <h2>Meu Cadastro</h2>
          </router-link>
  
          <router-link to="./orders" class="option">
            <img src="/carrinho.png" alt="Pedidos" />
            <h2>Meus Pedidos</h2>
          </router-link>
  
          <div class="option option-selected">
            <img src="/endereco.png" alt="Endereço" />
            <h2 class="h2-selected">Meus Endereços</h2>
          </div>
  
          <router-link to="./change-password" class="option">
            <img src="/trocarsenha.png" alt="Senha" />
            <h2>Trocar Senha</h2>
          </router-link>
  
          <router-link to="/" class="option">
            <img src="/sair.png" alt="Sair" />
            <h2>Sair</h2>
          </router-link>
        </div>
  
        <div class="user-container">
          <div class="header">
            <h2>Meus Endereços</h2>
            <button class="add-button" @click="showAddModal = true">+ Adicionar Endereço</button>
          </div>
  
          <div v-if="addresses.length === 0" style="text-align: center; padding: 20px;">
            <p>Você ainda não cadastrou nenhum endereço.</p>
          </div>
  
          <div v-else>
            <div v-for="(address, index) in addresses" :key="index" class="address-card">
              <p><strong>{{ address.nome }}</strong></p>
              <p>{{ address.rua }}, {{ address.numero }}{{ address.complemento ? ', ' + address.complemento : '' }}</p>
              <p>{{ address.bairro }} - {{ address.cidade }}/{{ address.uf }}</p>
              <p>CEP: {{ address.cep }}</p>
  
              <div class="actions">
                <button class="edit-btn" @click="editAddress(index)">Editar</button>
                <button class="delete-btn" @click="deleteAddress(index)">Excluir</button>
              </div>
            </div>
          </div>
        </div>
      </div>
  
      <!-- Modal Adicionar -->
      <div v-if="showAddModal" class="modal">
        <div class="modal-content">
          <h3>Adicionar Novo Endereço</h3>
          <form @submit.prevent="addAddress" class="address-form">
            <input v-model="form.nome" placeholder="Nome do endereço" required />
            <input v-model="form.rua" placeholder="Rua" required />
            <input v-model="form.numero" placeholder="Número" required />
            <input v-model="form.complemento" placeholder="Complemento (opcional)" />
            <input v-model="form.bairro" placeholder="Bairro" required />
            <input v-model="form.cidade" placeholder="Cidade" required />
            <input v-model="form.uf" placeholder="UF" maxlength="2" required />
            <input v-model="form.cep" placeholder="CEP" required />
            <div class="modal-buttons">
              <button type="submit">Salvar</button>
              <button type="button" @click="showAddModal = false">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
  
      <!-- Modal Editar -->
      <div v-if="showEditModal" class="modal">
        <div class="modal-content">
          <h3>Editar Endereço</h3>
          <form @submit.prevent="saveEditedAddress" class="address-form">
            <input v-model="editForm.nome" placeholder="Nome do endereço" required />
            <input v-model="editForm.rua" placeholder="Rua" required />
            <input v-model="editForm.numero" placeholder="Número" required />
            <input v-model="editForm.complemento" placeholder="Complemento (opcional)" />
            <input v-model="editForm.bairro" placeholder="Bairro" required />
            <input v-model="editForm.cidade" placeholder="Cidade" required />
            <input v-model="editForm.uf" placeholder="UF" maxlength="2" required />
            <input v-model="editForm.cep" placeholder="CEP" required />
            <div class="modal-buttons">
              <button type="submit">Salvar Alterações</button>
              <button type="button" @click="showEditModal = false">Cancelar</button>
            </div>
          </form>
        </div>
      </div>
    </main>
  </template>
  
  <script setup lang="ts">
  import Header from "../../components/Header.vue";
  import { ref } from "vue";
  
  interface Address {
    nome: string;
    rua: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    cep: string;
  }
  
  const addresses = ref<Address[]>([]);
  const form = ref<Address>({
    nome: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    uf: "",
    cep: ""
  });
  
  const showAddModal = ref(false);
  const showEditModal = ref(false);
  const editForm = ref<Address>({ ...form.value });
  const editingIndex = ref<number | null>(null);
  
  function addAddress() {
    addresses.value.push({ ...form.value });
    form.value = {
      nome: "",
      rua: "",
      numero: "",
      complemento: "",
      bairro: "",
      cidade: "",
      uf: "",
      cep: ""
    };
    showAddModal.value = false;
  }
  
  function deleteAddress(index: number) {
    addresses.value.splice(index, 1);
  }
  
  function editAddress(index: number) {
    editingIndex.value = index;
    editForm.value = { ...addresses.value[index] };
    showEditModal.value = true;
  }
  
  function saveEditedAddress() {
    if (editingIndex.value !== null) {
      addresses.value[editingIndex.value] = { ...editForm.value };
      showEditModal.value = false;
    }
  }
  </script>
  
  <style scoped>
  @import "../../assets/user.css"; /* Reaproveita o layout da conta */

/* Container superior dos endereços */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

/* Botão de adicionar endereço */
.add-button {
  background-color: var(--vt-c-blue);
  color: white;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}

/* Cartão de endereço */
.address-card {
  border: 1px solid #ccc;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  background-color: #f9f9f9;
}

/* Área de ações */
.actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

/* Botões padronizados */
.edit-btn, .delete-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9em;
}

.edit-btn {
  background-color: var(--vt-c-blue);
  color: white;
}

.delete-btn {
  background-color: var(--vt-c-red);
  color: white;
}

/* Modal geral */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

/* Conteúdo do modal */
.modal-content {
  background-color: white;
  padding: 30px;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
}

/* Estilo dos inputs */
.address-form input {
  width: 100%;
  padding: 10px;
  margin-bottom: 12px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1em;
}

/* Botões do modal */
.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-buttons button {
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-weight: bold;
  font-size: 0.9em;
  cursor: pointer;
}

.modal-buttons button[type="submit"] {
  background-color: var(--vt-c-blue);
  color: white;
}

.modal-buttons button[type="button"] {
  background-color: #ddd;
  color: #333;
}

  </style>
  