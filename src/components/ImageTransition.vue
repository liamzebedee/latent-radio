<template>
    <div class="relative w-full h-auto">
      <img
        :src="nextImage"
        alt=""
        class="rounded shadow-lg top-0 left-0"
        width="768"
        height="768"
      />
      <img
        :src="currentImage"
        alt=""
        width="768"
        height="768"
        class="rounded shadow-lg w-full h-auto absolute top-0 left-0 transition-opacity duration-700"
        :class="{ 'opacity-0': fade, 'opacity-100': !fade }"
      />
    </div>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue';
  
  const props = defineProps({
    imageUrl: String,
  });
  
  const currentImage = ref(props.imageUrl);
  const nextImage = ref(props.imageUrl);
  const fade = ref(false);
  
  watch(
    () => props.imageUrl,
    (newImageUrl) => {
      nextImage.value = newImageUrl;
      if (newImageUrl !== currentImage.value) {
        fade.value = true;
        setTimeout(() => {
          fade.value = false;
          currentImage.value = newImageUrl;
        }, 700); // Match this duration with the fade-out duration
      }
    },
    { immediate: true }
  );
  </script>
  
  <style scoped>
  /* Add your CSS styling here */
  </style>
  