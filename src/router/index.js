import { createRouter, createWebHistory } from 'vue-router'
import Upload from '@/components/Upload.vue'
import FileList from '@/components/FileList.vue'

const routes = [
  { path: '/', component: Upload },
  { path: '/files', component: FileList },
]

export default createRouter({
  history: createWebHistory(),
  routes
})