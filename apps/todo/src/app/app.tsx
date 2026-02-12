import { useState, useEffect, useRef } from 'react';
import styles from './app.module.css';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
}

const STORAGE_KEY = 'things-to-do';

function loadTodos(): Todo[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

export function App() {
  const [todos, setTodos] = useState<Todo[]>(loadTodos);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    saveTodos(todos);
  }, [todos]);

  const addTodo = () => {
    const text = inputValue.trim();
    if (!text) return;

    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInputValue('');
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Things To Do</h1>
        <p className={styles.subtitle}>
          {todos.length === 0
            ? 'Add your first task to get started'
            : `${remaining} of ${todos.length} remaining`}
        </p>
      </header>

      <form
        className={styles.inputRow}
        onSubmit={(e) => {
          e.preventDefault();
          addTodo();
        }}
      >
        <input
          ref={inputRef}
          type="text"
          className={styles.input}
          placeholder="What needs to be done?"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          autoFocus
        />
        <button type="submit" className={styles.addButton} disabled={!inputValue.trim()}>
          Add
        </button>
      </form>

      <ul className={styles.list}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            className={`${styles.item} ${todo.completed ? styles.completed : ''}`}
          >
            <button
              className={styles.checkbox}
              onClick={() => toggleTodo(todo.id)}
              aria-label={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
            >
              {todo.completed && (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </button>
            <span className={styles.text}>{todo.text}</span>
            <button
              className={styles.deleteButton}
              onClick={() => deleteTodo(todo.id)}
              aria-label="Delete todo"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {todos.length > 0 && todos.some((t) => t.completed) && (
        <button
          className={styles.clearButton}
          onClick={() => setTodos((prev) => prev.filter((t) => !t.completed))}
        >
          Clear completed
        </button>
      )}
    </div>
  );
}

export default App;
