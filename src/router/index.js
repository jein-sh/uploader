import { createRouter, createWebHistory } from 'vue-router'
import Upload from '@/components/Upload.vue'
import FileList from '@/components/FileList.vue'

const routes = [
  { path: '/', component: FileList },
  { path: '/upload', component: Upload },
]

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})