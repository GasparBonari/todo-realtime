<script>
  import axios from 'axios';
  import io from 'socket.io-client';

  export default {
    name: 'TodoList',
    data() {
      return {
        tasks: [],
        newTask: ''
      };
    },
    created() {
      this.fetchTasks();
      const socket = io('http://localhost:3000');
      socket.on('newTask', task => this.tasks.unshift(task));
    },
    methods: {
      async fetchTasks() {
        const res = await axios.get('/api/tasks');
        this.tasks = res.data;
      },
      async addTask() {
        if (!this.newTask.trim()) return;
        await axios.post('/api/tasks', { text: this.newTask });
        this.newTask = '';
      },
      formatTime(ts) {
        return new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      }
    }
  };
</script>

<template>
  <div class="todo-container">
    <form class="todo-form" @submit.prevent="addTask">
      <input
        v-model="newTask"
        class="todo-input"
        placeholder="What’s your next task?"
        required
      />
      <button type="submit" class="todo-button">Add</button>
    </form>

    <ul class="todo-list">
      <li
        v-for="task in tasks"
        :key="task._id"
        class="todo-item"
      >
        <span class="task-text">{{ task.text }}</span>
        <span class="task-time">{{ formatTime(task.createdAt) }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
  .todo-container {
    max-width: 600px;
    margin: 2rem auto;
    padding: 0 1rem;
    font-family: 'Segoe UI', Roboto, sans-serif;
  }

  .todo-form {
    display: flex;
    background: #fff;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .todo-input {
    flex: 1;
    border: none;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    outline: none;
  }

  .todo-input::placeholder {
    color: #bbb;
  }

  .todo-button {
    background: #5c6ac4;
    color: #fff;
    border: none;
    padding: 0 1.5rem;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
  }

  .todo-button:hover {
    background: #4e58a4;
  }

  .todo-list {
    list-style: none;
    margin: 1.5rem 0 0;
    padding: 0;
  }

  .todo-item {
    display: flex;
    justify-content: space-between;
    background: #fff;
    border-radius: 8px;
    padding: 0.75rem 1rem;
    margin-bottom: 0.75rem;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
    transition: transform 0.2s, box-shadow 0.2s;
  }

  .todo-item:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }

  .task-text {
    font-size: 1rem;
    color: #333;
  }

  .task-time {
    font-size: 0.85rem;
    color: #888;
  }

  /* Responsive adjustments */
  @media (max-width: 600px) {
    .todo-container {
      margin: 1rem auto;
      padding: 0 0.5rem;
    }

    .todo-form {
      flex-direction: column;
    }

    .todo-input {
      padding: 0.75rem;
      font-size: 0.95rem;
    }
    
    .todo-button {
      width: 100%;
      padding: 0.75rem 0;
      margin-top: 0.5rem;
    }
  }
</style>