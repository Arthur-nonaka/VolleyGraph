<template>
  <v-dialog v-model="showModal" persistent max-width="600px">
    <template #default>
      <v-card>
        <v-card-title>Editar tamanhos e quantidades</v-card-title>
        <v-card-text>
          <div
            v-for="(size, sizeIndex) in selectedVariation.sizes"
            :key="sizeIndex"
          >
            <input
              type="text"
              v-model="size.size"
              placeholder="Tamanho"
              style="margin-right: 10px"
            />
            <input
              type="number"
              v-model="size.quantity"
              placeholder="Quantidade"
              style="margin-right: 10px"
            />
            <button @click="removeSize(selectedVariationIndex, sizeIndex)">
              Remover tamanho
            </button>
          </div>
          <button type="button" @click="addSize(selectedVariationIndex)">
            Adicionar tamanho
          </button>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" @click="closeModal">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </template>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
</script>
