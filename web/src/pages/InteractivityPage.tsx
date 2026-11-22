import { useState, type FormEvent } from 'react'

// Interactivity in React follows one loop:
//   1. Store a value in state with useState.
//   2. Show that value in the JSX.
//   3. An event handler (onClick, onChange, onSubmit) calls the setter.
//   4. React re-renders the component with the new value.

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="demo">
      <h2>1. Click events</h2>
      <p>
        Count: <strong>{count}</strong>
      </p>
      <div className="button-row">
        {/* Pass a function when the new value depends on the old one. */}
        <button type="button" onClick={() => setCount((c) => c - 1)}>
          −1
        </button>
        <button type="button" onClick={() => setCount((c) => c + 1)}>
          +1
        </button>
        <button type="button" onClick={() => setCount(0)} disabled={count === 0}>
          Reset
        </button>
      </div>
    </div>
  )
}

function LiveText() {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  return (
    <div className="demo">
      <h2>2. Typing (a controlled input)</h2>
      <label htmlFor="name-input">Your name</label>
      {/* The input's value comes from state, and every keystroke updates state. */}
      <input
        id="name-input"
        type="text"
        value={name}
        maxLength={40}
        onChange={(event) => setName(event.target.value)}
      />
      {/* React escapes text, so typing <script> shows the characters instead of running them. */}
      <p aria-live="polite">{trimmed ? `Hello, ${trimmed}!` : 'Type to see a greeting.'}</p>
    </div>
  )
}

function ShowHide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="demo">
      <h2>3. Showing and hiding</h2>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="hidden-tip"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? 'Hide the tip' : 'Show a tip'}
      </button>
      {isOpen && (
        <p id="hidden-tip">
          <code>{'{condition && <Element />}'}</code> renders the element only
          while the condition is true.
        </p>
      )}
    </div>
  )
}

type Task = { id: number; text: string; done: boolean }

function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [draft, setDraft] = useState('')

  function addTask(event: FormEvent<HTMLFormElement>) {
    // Stop the browser's default form submit, which would reload the page.
    event.preventDefault()
    const text = draft.trim()
    if (!text) return
    // Never change state in place. Build a new array so React sees the change.
    setTasks((current) => [...current, { id: Date.now(), text, done: false }])
    setDraft('')
  }

  function toggleTask(id: number) {
    setTasks((current) =>
      current.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
    )
  }

  function removeTask(id: number) {
    setTasks((current) => current.filter((task) => task.id !== id))
  }

  const remaining = tasks.filter((task) => !task.done).length

  return (
    <div className="demo">
      <h2>4. Forms and lists</h2>
      <form onSubmit={addTask} className="button-row">
        <label htmlFor="task-input" className="visually-hidden">
          New task
        </label>
        <input
          id="task-input"
          type="text"
          placeholder="Add a task"
          value={draft}
          maxLength={80}
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <>
          <ul className="task-list">
            {/* Each item needs a stable, unique key so React can track it. */}
            {tasks.map((task) => (
              <li key={task.id}>
                <label className={task.done ? 'task-done' : undefined}>
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => toggleTask(task.id)}
                  />
                  {task.text}
                </label>
                <button
                  type="button"
                  aria-label={`Remove ${task.text}`}
                  onClick={() => removeTask(task.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {/* A value calculated from state, not stored separately. */}
          <p>
            {remaining} of {tasks.length} left to do
          </p>
        </>
      )}
    </div>
  )
}

export function InteractivityPage() {
  return (
    <section>
      <h1>Interactivity</h1>
      <p>
        Each example stores a value in state and updates it in response to a
        click, keystroke, or form submit. State resets when you leave the page
        or refresh.
      </p>
      <Counter />
      <LiveText />
      <ShowHide />
      <TaskList />
    </section>
  )
}
