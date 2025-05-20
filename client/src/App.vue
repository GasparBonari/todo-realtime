<script setup lang="ts">
  import TodoList from './components/TodoList.vue';
</script>

<template>
  <div class="app">
    <h1>To-Do List</h1>
    <TodoList />
  </div>
</template>

<style>
  body { font-family: sans-serif; padding: 2rem; }
  .app { max-width: 600px; margin: 0 auto; }
</style>
