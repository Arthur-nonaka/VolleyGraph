<template>
  <div class="carousel">
    <div
      class="carousel-inner"
      :style="{ transform: `translateX(-${currentSlide * 100}%)` }"
    >
      <div class="carousel-item" v-for="(slide, index) in slides" :key="index">
        <img :src="slide.image" :alt="slide.alt" />
      </div>
    </div>
    <button class="carousel-control prev" @click="prevSlide">‹</button>
    <button class="carousel-control next" @click="nextSlide">›</button>
    <div class="carousel-indicators">
      <span
        v-for="(slide, index) in slides"
        :key="index"
        :class="{ active: index === currentSlide }"
        @click="goToSlide(index)"
      ></span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      currentSlide: 0,
      slides: [
        { image: "/image1.jpg", alt: "Slide 1" },
        { image: "/image2.jpg", alt: "Slide 2" },
        { image: "/image3.jpg", alt: "Slide 3" },
      ],
    };
  },
  methods: {
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    },
    prevSlide() {
      this.currentSlide =
        (this.currentSlide - 1 + this.slides.length) % this.slides.length;
    },
    goToSlide(index) {
      this.currentSlide = index;
    },
  },
  mounted() {
    // Auto-slide every 5 seconds
    this.autoSlide = setInterval(this.nextSlide, 5000);
  },
  beforeUnmount() {
    clearInterval(this.autoSlide);
  },
};
</script>

<style scoped>
.carousel {
  position: relative;
  width: 100%;
  max-width: 70vw;
  height: 400px;
  margin: 0 auto;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.carousel-inner {
  display: flex;
  transition: transform 0.5s ease-in-out;
}

.carousel-item {
  min-width: 100%;
  height: 400px;
}

.carousel-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.carousel-control {
  position: absolute;
  top: 50%;
  height: 100%;
  width: 100px;
  transform: translateY(-50%);
  color: white;
  border: none;
  font-size: 2rem;
  padding: 10px;
  cursor: pointer;
  z-index: 10;
}

.carousel-control.prev {
  background: linear-gradient(
    90deg,
    rgb(12, 47, 104) 0%,
    rgba(12, 47, 104, 0.295) 25%,
    rgba(12, 47, 104, 0) 75%
  );
  left: 0px;
}

.carousel-control.next {
  background: linear-gradient(
    -90deg,
    rgb(12, 47, 104) 0%,
    rgba(12, 47, 104, 0.295) 25%,
    rgba(12, 47, 104, 0) 75%
  );
  right: 0px;
}

.carousel-indicators {
  position: absolute;
  bottom: 10px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 5px;
}

.carousel-indicators span {
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  cursor: pointer;
}

.carousel-indicators span.active {
  background: white;
}
</style>
