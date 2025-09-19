import { defineStore } from 'pinia'
import { ref } from 'vue'
import { supabase } from '@/supabase'

const cyrillicToLatinMap = {
  А: "A", а: "a", Б: "B", б: "b", В: "V", в: "v", Г: "G", г: "g",
  Д: "D", д: "d", Е: "E", е: "e", Ё: "Yo", ё: "yo", Ж: "Zh", ж: "zh",
  З: "Z", з: "z", И: "I", и: "i", Й: "Y", й: "y", К: "K", к: "k",
  Л: "L", л: "l", М: "M", м: "m", Н: "N", н: "n", О: "O", о: "o",
  П: "P", п: "p", Р: "R", р: "r", С: "S", с: "s", Т: "T", т: "t",
  У: "U", у: "u", Ф: "F", ф: "f", Х: "Kh", х: "kh", Ц: "Ts", ц: "ts",
  Ч: "Ch", ч: "ch", Ш: "Sh", ш: "sh", Щ: "Sch", щ: "sch", Ъ: "", ъ: "",
  Ы: "Y", ы: "y", Ь: "", ь: "", Э: "E", э: "e", Ю: "Yu", ю: "yu",
  Я: "Ya", я: "ya"
}

const translit = (text) => {
  return text.split('').map(char => cyrillicToLatinMap[char] || char).join('')
}

const sanitizeFileName = (name) => {
  return translit(name)
    .replace(/[^a-zA-Z0-9._-]/g, '_') 
}

export const useFileStore = defineStore('file', () => {
  const files = ref([])
  const loading = ref(false)
  const error = ref(null)

  const fetchFiles = async () => {
    loading.value = true
    error.value = null
    try {
      const { data, error: listError } = await supabase.storage
        .from('uploads')
        .list('', { limit: 100, sortBy: { column: 'created_at', order: 'desc' } })

      if (listError) throw listError

      files.value = data.map(file => {
        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(file.name)

        return {
          name: file.name,                         
          originalName: file.name.replace(/^\d+_/, ''), 
          size: file.metadata?.size || 0,
          type: file.metadata?.mimetype || '',
          url: urlData.publicUrl,
          uploadedAt: file.created_at ? new Date(file.created_at) : new Date(),
        }
      })
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const addFiles = async (selectedFiles) => {
    loading.value = true
    error.value = null
    try {
      for (const file of selectedFiles) {
        const safeName = sanitizeFileName(file.name)
        const filePath = `${Date.now()}_${safeName}`

        const { error: uploadError } = await supabase.storage
          .from('uploads')
          .upload(filePath, file, {
            contentType: file.type || 'application/octet-stream',
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('uploads')
          .getPublicUrl(filePath)

        files.value.push({
          name: filePath,
          originalName: safeName, 
          size: file.size,
          type: file.type,
          url: urlData.publicUrl,
          uploadedAt: new Date(),
        })
      }
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  const deleteFile = async (file) => {
    try {
      const filePath = file.url.split('/uploads/')[1]
      const { error: deleteError } = await supabase.storage
        .from('uploads')
        .remove([filePath])
      if (deleteError) throw deleteError

      files.value = files.value.filter(f => f.url !== file.url)
    } catch (err) {
      error.value = err.message
    }
  }

  return { files, loading, error, fetchFiles, addFiles, deleteFile }
})