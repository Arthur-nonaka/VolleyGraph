<template>
  <div style="margin-bottom: 20px">
    <div class="colors">
      <div v-for="(variation, index) in variations" :key="index">
        <ColorPicker
          v-model="variation.color"
          :variation="variation"
          @update:variation="updateVariation(index, $event)"
          class="color"
        />
      </div>
    </div>
    <button
      type="button"
      class="btn btn-primary w-20"
      style="font-size: 20px"
      @click="addVariation()"
    >
      + Cor
    </button>
  </div>
</template>

<script setup lang="ts">
import ColorPicker from "./ColorPicker.vue";
import { ref } from "vue";

const props = defineProps<{
  variations: Array<{
    color: string;
    colorName: string;
    sizes: Array<{
      size: string;
      quantity: number;
    }>;
  }>;
}>();

const emit = defineEmits(["update:variations"]);

const addVariation = () => {
  const newVariation = {
    color: "#000000",
    colorName: "Branco",
    sizes: [],
  };

  emit("update:variations", [...props.variations, newVariation]);
};

const updateVariation = (index: number, updatedVariation: any) => {
  const updatedVariations = [...props.variations];
  updatedVariations[index] = updatedVariation;
  emit("update:variations", updatedVariations);
};
</script>

<style scoped>
.colors {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  gap: 10px;
}

.color {
  width: 225px;
  height: auto;
}
</style>
