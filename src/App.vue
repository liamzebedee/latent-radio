<script setup>
import ImageTransition from './components/ImageTransition.vue'
import { ref, onMounted, onUnmounted, computed } from 'vue';

const sampleImages = [
    ...`public/images/replicate-prediction-kjqemqtbyzf52rvzhwbzpbsuku.png public/images/replicate-prediction-klaniulbv6zo7w46gtwfz5hpoy.png public/images/replicate-prediction-mjom2w3blvihqofdnx3th47bly.png public/images/replicate-prediction-np54iflbzn7qiznshugnj2fk2m.png public/images/replicate-prediction-zux5lwlbxldfqxmlw2g2obyemi.png`.split(' ').map(x => x.split('public')[1])
]

import InvisibleYoutubePlayer from './components/InvisibleYoutubePlayer.vue';


// Every INTERVAL ms, advance the image.
const INTERAL = 3000
const advanceImageInterval = ref(null)

const youtubePlayer = ref(null);
const isPlaying = ref(false);
const youtubeVideo = ref(null);
const videoId = 'p22EqQBYRBM';

const togglePlay = () => {
  isPlaying.value = !isPlaying.value;
  
  if(!isPlaying.value) {
    clearInterval(advanceImageInterval.value);
  } else {
    advanceImageInterval.value = setInterval(advanceImage, INTERAL);
  }
  // If you need to directly interact with the YoutubeVideo component, you can use youtubeVideo ref
  // For example, to access methods or data inside YoutubeVideo, use youtubeVideo.value.methodName()
};

const playState = computed(() => isPlaying.value ? 'Pause' : 'Play');




const prompt = ref("what gets human, what gets automated, surrealism, ultra HD, real, aesthetic finsta spit po, hell cap scape, more ikea aesthetic, clean banal brutalism, happy orange warmth colour, natural hues, futurist gpu's on walls, more gta filter shader, unreal engine")
// const prompt = ref("green, calming, abstract, surrealist art, riding bikes, netherlands")
// const prompt = ref("a scene from nature, in the style of tony hawk underground 2")

const currentImageIndex = ref(0);
const currentImageUrl = ref(sampleImages[currentImageIndex.value]);

const fetchingMoreImgs = ref(false)
const imgs = ref([])

console.log('running')

const fetchMoreImages = async () => {
  console.log('fetchMoreImages')
  fetchingMoreImgs.value = true;
  
  const urlParams = new URLSearchParams();
  urlParams.append('prompt', prompt.value);
  const res = await fetch("/images/new?" + urlParams.toString())
  const data = await res.json()
  console.log('res', data)

  // Fetch all images concurrently and then convert them to blob url's.
  console.log('downloading images')
  const newImgs = await Promise.all(data.imageURLs.map(async (img) => {
    const blob = await fetch(img).then((res) => res.blob());
    return URL.createObjectURL(blob);
  }));
  
  console.log('images downloaded, pushing to queue.')
  imgs.value.push(...newImgs);
  fetchingMoreImgs.value = false;
}

const advanceImage = () => {
  if (!isPlaying.value) return

  console.log('advanceImage', `generated=${imgs.value}`, currentImageUrl.value, sampleImages.length, currentImageIndex.value)

  if (imgs.value.length) {
    // Iterate over generated images.
    // Pop one image from queue.
    currentImageUrl.value = imgs.value.shift();

    // If we're running low on images, fetch more.
    if (imgs.value.length < 5 && !fetchingMoreImgs.value) {
      console.log(`running low on images, fetching more. ${imgs.value.length} left.`)
      fetchMoreImages()
    }
  } else {
    // Iterate over sample images.
    currentImageIndex.value = (currentImageIndex.value + 1) % sampleImages.length;
    currentImageUrl.value = sampleImages[currentImageIndex.value];
  }
};

onMounted(() => {
  if(!fetchingMoreImgs.value) {
    console.log('fetching initial images')
    fetchMoreImages()
  }
});

</script>

<template>
  <div>
      <!-- <div class="app bg-gradient-to-br from-black to-gray-800 min-h-screen flex col justify-center items-center"> -->
      <div class="app bg-gradient-to-br from-black to-gray-800 min-h-screen flex flex-col justify-center items-center px-4 py-8">
        
      <!-- heading is large and centre
      <h1 class="text-4xl text-white font-sans-serif mb-8 text-center">Orange Room</h1> -->

        <div class="image-pane relative">
          <ImageTransition :imageUrl="currentImageUrl" />
          
          <div class="controls absolute top-0 right-0 m-4">
            <!-- <button class="button bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-l">
              <FontAwesomeIcon icon={faCrop} />
            </button>

            <button class="button bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4">
              <FontAwesomeIcon icon={faAdjust} />
            </button> -->
          </div>
        </div>

        <div class="m-4 p-4 text-white text-center font-sans-serif max-w-lg">
          <InvisibleYoutubePlayer ref="youtubeVideo" :videoId="videoId" :playVideo="isPlaying" />
          
          <button @click="togglePlay" class="mb-4 text-white bg-gray-700 hover:bg-gray-600 font-bold py-2 px-4 rounded-full transition-all duration-300 ease-in-out">{{ playState }}</button><br/>
          
          <p
            class="text-xs text-gray-400"
          ><strong>Prompt:</strong> {{ prompt }}</p><br/>
          
          <!-- <p
            class="text-xs text-gray-400"
          ><strong>Vibe:</strong> Jazz</p> -->
        </div>

        <!-- <SpacebarHeartEmitter/> -->
        
      </div>
    </div>
</template>

<style scoped>

</style>
