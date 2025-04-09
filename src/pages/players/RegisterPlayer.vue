<template>
  <Header />
  <main>
    <section class="container">
      <nav aria-label="breadcrumb">
        <ol class="breadcrumb">
          <li class="breadcrumb-item" aria-current="page">
            <router-link to="/jogadores">Jogadores</router-link>
          </li>
          <li class="breadcrumb-item active" aria-current="page">Registrar</li>
        </ol>
      </nav>

      <h1
        style="
          color: black;
          font-size: 2rem;
          font-family: 'Britannic';
          margin-left: 20px;
        "
      >
        Registrar Jogador
      </h1>
      <form class="w-100 mx-auto mt-4">
        <div class="row">
          <div class="col-md-8">
            <div class="form-group mb-3">
              <label for="nome" class="form-label"
                >Nome <span class="required">*</span></label
              >
              <input
                type="text"
                id="name"
                class="form-control"
                placeholder="Digite o nome do jogador"
              />
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="idade" class="form-label"
                >Idade <span class="required">*</span></label
              >
              <input type="number" id="age" class="form-control" />
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="altura" class="form-label"
                >Altura <span class="required">*</span></label
              >
              <input type="number" id="height" class="form-control" />
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col">
            <div class="form-group mb-3">
              <label for="posicao-principal" class="form-label"
                >Posição <span class="required">*</span></label
              >
              <select class="form-control" id="main-position">
                <option value="" disabled selected>Selecione a posição</option>
                <option value="Opposite Hitter">Oposto</option>
                <option value="Middle Blocker">Central</option>
                <option value="Outside Hitter">Ponta</option>
                <option value="Setter">Levantador</option>
                <option value="Libero">Líbero</option>
                <option value="Server Specialist">Especialista em saque</option>
                <option value="Defense Specialist">
                  Especialista em defesa
                </option>
              </select>
            </div>
          </div>
          <div class="col">
            <div class="form-group mb-3">
              <label for="segunda-posicao" class="form-label"
                >Segunda Posição</label
              >
              <select class="form-control" id="sub-position">
                <option value="" disabled selected>Selecione a posição</option>
                <option value="Opposite Hitter">Oposto</option>
                <option value="Middle Blocker">Central</option>
                <option value="Outside Hitter">Ponta</option>
                <option value="Setter">Levantador</option>
                <option value="Libero">Líbero</option>
                <option value="Server Specialist">Especialista em saque</option>
                <option value="Defense Specialist">
                  Especialista em defesa
                </option>
              </select>
            </div>
          </div>
        </div>

        <button type="submit" class="btn btn-primary w-100">Registrar</button>
      </form>
    </section>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Header from "@/components/Header.vue";

const formData = ref({
  name: "",
  age: null,
  height: null,
  mainPosition: "",
  subPosition: "",
});
</script>

<style scoped>
.container {
  color: black;
}

form {
  padding-right: 1rem;
  padding-left: 1rem;
}

select:hover {
  cursor: pointer;
}
</style>
