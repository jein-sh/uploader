<template>
    <header class="header border-b">
      <div class="container">
          <div class="header__wrap">
              <div class="header__left">
                  <router-link to="/files" class="title">My projects</router-link>
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
        <label for="input_file" class="btn">
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
import { ref } from 'vue'
import { useFileStore } from '@/stores/fileStore'
import { useRouter } from 'vue-router'

const uploadIcon = new URL('@/assets/svg/upload-cloud.svg', import.meta.url).href

const fileStore = useFileStore()
const router = useRouter()

const loading = ref(false)
const error = ref(null)

const onFileSelect = async (e) => {
  const files = e.target.files
  await uploadFiles(files)
}

const onDrop = async (e) => {
  const files = e.dataTransfer.files
  await uploadFiles(files)
}

const uploadFiles = async (files) => {
  loading.value = true
  error.value = null
  try {
    await fileStore.addFiles(Array.from(files))
    router.push('/files')
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}
</script>
<style scoped>
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