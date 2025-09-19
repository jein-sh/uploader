<script setup>
    const props = defineProps({
        type: {
            type: String,
            default: 'button',
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        text: {
            type: String,
            required: true,
        },
        loading: {
          type: Boolean,
          default: false,
        },
    })
</script>

<template>
  <button
    :type="type"
    :disabled="disabled || loading"
    :class="['btn', { 'btn--disabled': disabled || loading }]"
  >
    <span v-if="loading" class="loader"></span>
    <template v-else>
      <span v-if="$slots.icon" class="btn__icon">
        <slot name="icon" />
      </span>
      <span class="btn__text">{{ text }}</span>
    </template>
  </button>
</template>
