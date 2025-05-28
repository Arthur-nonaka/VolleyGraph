<template>
  <div class="card-fixed">
    <div class="card">
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
    height: 50%;
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
defineProps({
  img: {
    type: String,
  },
});
</script>
