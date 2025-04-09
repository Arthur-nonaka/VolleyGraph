<template>
  <div class="my-carousel">
    <div
      class="my-carousel-track"
      ref="carouselTrack"
      @mousedown="startDrag"
      @mousemove="onDrag"
      @mouseup="stopDrag"
      @mouseleave="stopDrag"
      @touchstart="startDrag"
      @touchmove="onDrag"
      @touchend="stopDrag"
    >
      <div class="my-carousel-item" v-for="(image, index) in images" :key="index">
        <img :src="image" :alt="'Image ' + (index + 1)" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      images: [
        "/image1.jpg",
        "/image2.jpg",
        "/image3.jpg",
        "/image1.jpg",
        "/image2.jpg",
        "/image3.jpg",
      ],
      isDragging: false,
      startX: 0,
      scrollLeft: 0,
    };
  },
  methods: {
    startDrag(event) {
        event.preventDefault();
      this.isDragging = true;
      this.startX =
        event.type === "touchstart" ? event.touches[0].pageX : event.pageX;
      this.scrollLeft = this.$refs.carouselTrack.scrollLeft;
    },
    onDrag(event) {
      if (!this.isDragging) return;
      event.preventDefault();
      const x =
        event.type === "touchmove" ? event.touches[0].pageX : event.pageX;
      const walk = (this.startX - x) * 1.5; 
      this.$refs.carouselTrack.scrollLeft = this.scrollLeft + walk;
    },
    stopDrag() {
      this.isDragging = false;
    },
  },
};
</script>

<style scoped>
.my-carousel {
  position: relative;
  display: flex;
  align-items: center;
  overflow: hidden;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
   user-select: none;
}

.my-carousel-track {
  display: flex;
  overflow-x: auto;
  scroll-behavior: smooth;
  gap: 10px;
  padding-left: 20px;
  padding-right: 20px;

  scrollbar-width: thin;
  scrollbar-color: var(--vt-c-blue) #f1f1f1;
}


.my-carousel-track::-webkit-scrollbar {
  height: 8px; 
  border-radius: 10px;
}

.my-carousel-track::-webkit-scrollbar-track {
  background: #f1f1f1; 
  border-radius: 10px; 
}

.my-carousel-track::-webkit-scrollbar-thumb {
  background: var(--vt-c-blue); 
  border-radius: 10px;
}

.my-carousel-track::-webkit-scrollbar-thumb:hover {
    background: var(--vt-c-dark-blue); 
}

.my-carousel-track::-webkit-scrollbar-button {
  display: none; 
}

.my-carousel-track {
  scrollbar-gutter: stable both-edges; /* Remove as setas laterais no Firefox */
}

.my-carousel-item {
  flex: 0 0 auto;
  width: 350px;
  height: 200px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: grab;
  max-width: none;
  vertical-align: unset;
}
.my-carousel-track:active .my-carousel-item {
  cursor: grabbing; 
}

.my-carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
