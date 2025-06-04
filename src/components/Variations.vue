<template>
  <div style="margin-bottom: 20px">
    <div class="colors">
      <div v-for="(variation, index) in variations" :key="index">
        <ColorPicker v-model="variation.color" class="color"/>

        <!-- <div v-for="(size, sizeIndex) in variation.sizes" :key="sizeIndex">
          <input type="text" v-model="size.size" placeholder="Tamanho" />
          <input
            type="number"
            v-model="size.quantity"
            placeholder="Quantidade"
          />
          <button @click="removeSize(index, sizeIndex)">Remover tamanho</button>
        </div>

        <button type="button" @click="addSize(index)">Adicionar tamanho</button> -->
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
    color: "#FFFFFF",
    colorName: "Branco",
    sizes: [],
  };

  emit("update:variations", [...props.variations, newVariation]);
};

const addSize = (variationIndex: number) => {
  const updatedVariations = [...props.variations];
  updatedVariations[variationIndex].sizes.push({
    size: "",
    quantity: 0,
  });

  emit("update:variations", updatedVariations);
};

const removeSize = (variationIndex: number, sizeIndex: number) => {
  const updatedVariations = [...props.variations];
  updatedVariations[variationIndex].sizes.splice(sizeIndex, 1);

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
