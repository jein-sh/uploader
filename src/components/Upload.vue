<template>
    <header class="header border-b">
      <div class="container">
          <div class="header__wrap">
              <div class="header__left">
                  <div class="title">My projects</div>
              </div>
              <div class="hesder__right" v-if="!isEmptyList">
                <router-link class="btn" to="/">
                    <span class="btn__text">Back to files</span>
                    <span class="btn__icon">
                      <inline-svg :src="arrowIcon" />
                    </span>
                </router-link>
              </div>
          </div>
      </div>
  </header>
  <main>
    <div class="container">
      <div class="upload">
        <div 
          class="upload__wrap"
          @dragover.prevent
          @drop.prevent="onDrop"
        >
          <div class="upload__image">
            <img src="/img/image.png" alt="">
          </div>
          <div class="upload__title">Start by uploading a file</div>
          <div class="upload__text">Any assets used in projects will live here.<br> Start creating by uploading your files.</div>
        </div>
        <input id="input_file" type="file" multiple @change="onFileSelect" class="visually-hidden" />
        <div v-if="fileStore.loading" class="loader"></div>
        <label v-else for="input_file" class="btn">
          <span class="btn__icon">
            <inline-svg :src="uploadIcon" />
          </span>
          <span class="btn__text">Upload</span>
        </label>
      </div>
    </div>
  </main>
</template>

<script setup>
import { computed } from 'vue'
import { useFileStore } from '@/stores/fileStore'
import { useRouter } from 'vue-router'
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";

const uploadIcon = new URL('@/assets/svg/upload-cloud.svg', import.meta.url).href
const arrowIcon = new URL('@/assets/svg/icon-arrow.svg', import.meta.url).href

const fileStore = useFileStore()
const router = useRouter()
const isEmptyList = computed(() => fileStore.files.length === 0)

const onFileSelect = async (e) => {
  const files = e.target.files
  await uploadFiles(files)
}

const onDrop = async (e) => {
  const files = e.dataTransfer.files
  await uploadFiles(files)
}

const uploadFiles = async (files) => {
  fileStore.loading = true
  try {
    await fileStore.addFiles(Array.from(files))
    router.push('/')
  } catch (err) {
    toast("Upload failed!", {
      autoClose: 1000,
      type: "error",
    });
  } finally {
    fileStore.loading = false
  }
}
</script>
<style scoped>
  .loader {
    width: 15px;
    aspect-ratio: 1;
    border-radius: 50%;
    animation: l5 1s infinite linear alternate;
  }
  @keyframes l5 {
      0%  {box-shadow: 20px 0 #7F56D9, -20px 0 #bcacdd;background: #7F56D9 }
      33% {box-shadow: 20px 0 #7F56D9, -20px 0 #bcacdd;background: #bcacdd}
      66% {box-shadow: 20px 0 #bcacdd,-20px 0 #7F56D9; background: #bcacdd}
      100%{box-shadow: 20px 0 #bcacdd,-20px 0 #7F56D9; background: #7F56D9 }
  }
  .upload {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 24px;
    margin: 40px auto;
    max-width: 520px;
  }
  .upload__wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .upload__image {
    width: 152px;
    height: 120px;
    margin-bottom: 15px;
  }
  .upload__image img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .upload__title {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    text-align: center;
  }
  .upload__text {
    font-size: 14px;
    line-height: 20px;
    text-align: center;
    color: #667085;
  }
</style>