<template>
  <div style="display: flex; align-items: center; gap: 8px">
    <v-menu>
      <template #activator="{ props }">
        <div
          v-bind="props"
          :style="{
            backgroundColor: selectedColor,
            width: '30px',
            height: '30px',
            borderRadius: '8px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }"
        ></div>
      </template>
      <v-color-picker
        @input="translateColor"
        v-model="selectedColor"
        flat
        mode="hexa"
        hide-inputs
      />
    </v-menu>
    {{ colorName }}
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const selectedColor = ref("#000000");
const colorName = ref("Desconhecido");

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
};

const calculateDistance = (color1: any, color2: any) => {
  return Math.sqrt(
    Math.pow(color1.r - color2.r, 2) +
      Math.pow(color1.g - color2.g, 2) +
      Math.pow(color1.b - color2.b, 2)
  );
};

const translateColor = (color: string) => {
  const rgb = hexToRgb(color);
  if (rgb) {
    const colors = [
      { name: "Preto", r: 0, g: 0, b: 0 },
      { name: "Branco", r: 255, g: 255, b: 255 },
      { name: "Vermelho", r: 255, g: 0, b: 0 },
      { name: "Verde", r: 0, g: 255, b: 0 },
      { name: "Azul", r: 0, g: 0, b: 255 },
      { name: "Amarelo", r: 255, g: 255, b: 0 },
      { name: "Ciano", r: 0, g: 255, b: 255 },
      { name: "Magenta", r: 255, g: 0, b: 255 },
      { name: "Prata", r: 192, g: 192, b: 192 },
      { name: "Cinza", r: 50, g: 50, b: 50 },
      { name: "Marrom", r: 128, g: 0, b: 0 },
      { name: "Azeitona", r: 128, g: 128, b: 0 },
      { name: "Lima", r: 0, g: 128, b: 0 },
      { name: "Água-marinha", r: 0, g: 128, b: 128 },
      { name: "Azul-marinho", r: 0, g: 0, b: 128 },
      { name: "Roxo", r: 128, g: 0, b: 128 },
      { name: "Laranja", r: 255, g: 165, b: 0 },
      { name: "Rosa", r: 255, g: 192, b: 203 },
      { name: "Dourado", r: 255, g: 215, b: 0 },
      { name: "Violeta", r: 238, g: 130, b: 238 },
      { name: "Índigo", r: 75, g: 0, b: 130 },
      { name: "Turquesa", r: 64, g: 224, b: 208 },
      { name: "Coral", r: 255, g: 127, b: 80 },
      { name: "Salmão", r: 250, g: 128, b: 114 },
      { name: "Cáqui", r: 240, g: 230, b: 140 },
      { name: "Lavanda", r: 230, g: 230, b: 250 },
      { name: "Bege", r: 245, g: 245, b: 220 },
      { name: "Chocolate", r: 210, g: 105, b: 30 },
      { name: "Carmesim", r: 220, g: 20, b: 60 },
      { name: "Azul Dodger", r: 30, g: 144, b: 255 },
      { name: "Verde Floresta", r: 34, g: 139, b: 34 },
      { name: "Fucsia", r: 255, g: 0, b: 255 },
      { name: "Verde Amarelado", r: 173, g: 255, b: 47 },
      { name: "Cinza Claro", r: 211, g: 211, b: 211 },
      { name: "Cinza Escuro", r: 169, g: 169, b: 169 },
      { name: "Verde Claro", r: 144, g: 238, b: 144 },
      { name: "Azul Claro", r: 173, g: 216, b: 230 },
      { name: "Rosa Claro", r: 255, g: 182, b: 193 },
      { name: "Amarelo Claro", r: 255, g: 255, b: 224 },
      { name: "Vermelho Escuro", r: 139, g: 0, b: 0 },
      { name: "Verde Escuro", r: 0, g: 100, b: 0 },
      { name: "Azul Escuro", r: 0, g: 0, b: 139 },
      { name: "Bordô", r: 128, g: 0, b: 0 },
      { name: "Vinho", r: 72, g: 11, b: 55 },
    ];

    let closestColor = colors[0];
    let minDistance = calculateDistance(rgb, colors[0]);

    for (let color of colors) {
      const distance = calculateDistance(rgb, color);
      if (distance < minDistance) {
        minDistance = distance;
        closestColor = color;
      }
    }

    colorName.value = closestColor.name;
  }
};

watch(selectedColor, (newColor) => {
  translateColor(newColor);
});

translateColor(selectedColor.value);
</script>
