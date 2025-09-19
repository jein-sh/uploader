<template>
  <header class="header">
    <div class="container">
      <div class="header__wrap">
        <div class="header__left">
            <h1 class="title">Files uploaded</h1>
        </div>
        <div class="hesder__right">
          <router-link class="btn" to="/">
              <span class="btn__icon">
                <inline-svg :src="uploadIcon" />
              </span>
              <span class="btn__text">Upload</span>
          </router-link>
        </div>
      </div>
    </div>
  </header>
  <main>
    <div class="files">
      <ul class="files__list">
        <li class="files__header">
          <div class="files__header-name">File name</div>
          <div class="files__header-name">File size</div>
          <div class="files__header-name">Date uploaded</div>
        </li>
        <li class="files__item file" v-for="file in files" :key="file.url">
          <div class="file__info">
            <div class="file__icon">
              <img :src="getIcon(file)"/>
            </div>
            <div class="file__desc">
                <div class="file__name">{{ file.originalName || file.name }}</div>
                <div class="file__text">{{ formatSize(file.size) }}</div>
            </div>
          </div>
          <div class="file__size">{{ formatSize(file.size) }}</div>
          <div class="file__date">{{ formatDate(file.uploadedAt) }}</div>
          <div class="file__actions" :class="{ show: openMenuFor === file.url }">
            <button class="file__btn btn btn--icon" @click="toggleMenu(file.url)">
              <inline-svg :src="moreIcon" />
            </button>
            <div class="file__menu">
              <button class="link" @click="downloadFile(file)">
                <span class="link__icon">
                  <inline-svg :src="downloadIcon" />
                </span>
                <span class="link__text">Download</span>
              </button>
              <button class="link" @click="copyLink(file.url)">
                <span class="link__icon">
                  <inline-svg :src="linkIcon" />
                </span>
                <span class="link__text">Copy link</span>
              </button>
              <button class="link" @click="deleteFile(file)">
                  <span class="link__icon">
                    <inline-svg :src="deleteIcon" />
                  </span>
                  <span class="link__text">Delete</span>
              </button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </main>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useFileStore } from '@/stores/fileStore'
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import { supabase } from '@/supabase'
const uploadIcon = new URL('@/assets/svg/upload-cloud.svg', import.meta.url).href
const moreIcon = new URL('@/assets/svg/icon-more-vertical.svg', import.meta.url).href
const downloadIcon = new URL('@/assets/svg/icon-download.svg', import.meta.url).href
const deleteIcon = new URL('@/assets/svg/icon-trash.svg', import.meta.url).href
const linkIcon = new URL('@/assets/svg/icon-link.svg', import.meta.url).href
const fileStore = useFileStore()
const files = computed(() => fileStore.files)
const router = useRouter()

import iconImage from '@/assets/img/icon-image.svg'
import iconFilm from '@/assets/img/icon-film.svg'
import iconFigma from '@/assets/img/icon-figma.svg'
import iconFramer from '@/assets/img/icon-framer.svg'
import iconFile from '@/assets/img/icon-file.svg'

const getIcon = (file) => {
  const type = file.type.toLowerCase()
  const name = file.name.toLowerCase()

  if (type.startsWith('image/')) return iconImage
  if (type.startsWith('video/')) return iconFilm

  if (name.endsWith('.fig')) return iconFigma
  if (name.endsWith('.framerx')) return iconFramer

  return iconFile
}

onMounted(() => {
  fileStore.fetchFiles()
    if (files.value.length === 0) {
      router.push('/')
    }
})

watch(files, (newFiles) => {
  if (newFiles.length === 0) {
    router.push('/')
  }
})

const formatSize = (size) => size > 1024*1024 ? (size/1024/1024).toFixed(0)+' MB' : (size/1024).toFixed(0)+' KB'
const formatDate = (date) => dayjs(date).format('MMM D, YYYY')

const downloadFile = async (file) => {
  try {
    const filePath = file.url.split('/uploads/')[1] 
    const { data, error } = await supabase.storage
      .from('uploads')
      .download(filePath)

    if (error) throw error

    const url = window.URL.createObjectURL(data)
    const a = document.createElement('a')
    a.href = url
    a.download = file.name
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Download failed:', err.message)
  }
}

const copyLink = async (url) => {
  try {
    await navigator.clipboard.writeText(url)
    alert('Link copied to clipboard!')
  } catch (err) {
    console.error('Failed to copy: ', err)
  }
}

const deleteFile = (file) => fileStore.deleteFile(file)

const openMenuFor = ref(null)

const toggleMenu = (fileUrl) => {
  openMenuFor.value = openMenuFor.value === fileUrl ? null : fileUrl
}
</script>

<style scoped>
  .files__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: 1fr minmax(max-content, 1018px) repeat(2, minmax(max-content, 176px)) 68px 1fr;
  }

  .files__header {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: subgrid;
    grid-template-areas: ". info size date . .";
    padding: 13px 0;
    font-weight: 500;
    font-size: 12px;
    line-height: 18px;
    color: #667085;
  }

  .files__header-name:nth-child(1) {
    grid-area: info;
    padding-left: 24px;
  }

  .files__header-name:nth-child(2) {
    grid-area: size;
    margin-right: 24px;
  }

  .files__header-name:nth-child(3) {
    grid-area: date;
  }

  .files__item {
    grid-column: 1 / -1;
    padding: 16px 0;
    border-top: 1px solid #EAECF0;
  }

  .files__item:nth-of-type(even) {
    background: #F9FAFB;
  }

  .files__item:last-of-type {
    border-bottom: 1px solid #EAECF0;
  }

  .file {
    display: grid;
    grid-template-columns: subgrid;
    grid-template-areas: ". info size date actions .";
    align-items: center;
  }

  .file__info {
    grid-area: info;
    display: flex;
    gap: 12px;
    padding: 0 24px;
  }

  .file__icon {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 40px;
    height: 40px;
    background: #F4EBFF;
    border-radius: 50%;
  }

  .file__icon img {
    width: 20px;
    height: 20px;
  }

  .file__name {
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
  }

  .file__text {
    font-size: 14px;
    line-height: 20px;
    color: #667085;
  }

  .file__size {
    grid-area: size;
    font-size: 14px;
    line-height: 20px;
    color: #667085;
    padding-right: 24px;
  }

  .file__date {
    grid-area: date;
    font-size: 14px;
    line-height: 20px;
    color: #667085;
    padding-right: 24px;
  }

  .file__actions {
    grid-area: actions;
    position: relative;
  }

  .file__menu {
    position: absolute;
    bottom: 0;
    right: 0;
    transform: translateY(100%);
    display: flex;
    flex-direction: column;
    width: max-content;
    gap: 10px;
    padding: 20px;
    border-radius: 10px;
    background-color: #F9FAFB;
    box-shadow:  0px 3px 5px rgba(16, 24, 40, 0.25);
    overflow: hidden;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.3s ease;
    z-index: 5;
  }

  .file__actions.show .file__menu {
    opacity: 1;
    visibility: visible;
  }
  
  @media(max-width: 767px) {
    .files__list {
      grid-template-columns: 1fr 68px;
    }
    .files__header {
      display: none;
    }
    .file {
      grid-template-areas: "info actions" "date date";
    }
    .file__info {
      padding: 0 15px;
    }
    .file__size {
      display: none;
    }
    .file__date {
      padding: 15px;
    }

  }

</style>