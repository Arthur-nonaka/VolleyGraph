<template>
  <div class="card-fixed">
    <div 
      class="card" 
      @click="handleClick"
    >
      <img :src="img" alt="" />
    </div>
  </div>
</template>

<style>
.card-fixed {
    width: 18vw;
    height: 17vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.card {
  width: 18vw;
  height: 17vh;
  background-color: var(--vt-c-blue);
  color: #ffffff;
  text-align: center;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  flex-direction: column;
  box-shadow: 0px 5px 5px rgba(0, 0, 0, 0.205);
  transition: ease 0.3s width, ease 0.3s height;

  img {
    width: 40%;
    height: 60%;
    transition: 0.5s;
  }
}

.card:hover {
  cursor: pointer;
  width: 17vw;
  height: 16vh;
}
</style>

<script setup lang="ts">
import { useRouter } from "vue-router";

const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  isLogout: {
    type: Boolean,
    default: false,
  },
});

const router = useRouter();

function handleClick() {
  if (props.isLogout) {
    // Se for logout, limpa e redireciona
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("userId");
    router.push("/login");
  } else {
    // Se não for logout, apenas loga no console (ou pode emitir evento)
    console.log("Card clicado, mas não é logout");
  }
}
</script>