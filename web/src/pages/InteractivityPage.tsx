import { useState, type FormEvent } from 'react'
import { PageHeader, Panel } from '../components/layout.tsx'

// Interactivity in React follows one loop:
//   1. Store a value in state with useState.
//   2. Show that value in the JSX.
//   3. An event handler (onClick, onChange, onSubmit) calls the setter.
//   4. React re-renders the component with the new value.

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <Panel index={1} title="Click events" description="Each button calls setCount, and React redraws the number.">
      <output className="counter-value" aria-live="polite">
        {count}
      </output>
      <div className="button-row">
        {/* Pass a function when the new value depends on the old one. */}
        <button type="button" onClick={() => setCount((c) => c - 1)} aria-label="Decrease by one">
          −1
        </button>
        <button type="button" className="btn-primary" onClick={() => setCount((c) => c + 1)} aria-label="Increase by one">
          +1
        </button>
        <button type="button" className="btn-ghost" onClick={() => setCount(0)} disabled={count === 0}>
          Reset
        </button>
      </div>
    </Panel>
  )
}

function LiveText() {
  const [name, setName] = useState('')
  const trimmed = name.trim()

  return (
    <Panel index={2} title="Typing" description="A controlled input: state holds the value, and every keystroke updates it.">
      <div className="field">
        <label htmlFor="name-input" className="field-label">
          Your name
        </label>
        {/* The input's value comes from state, and every keystroke updates state. */}
        <input
          id="name-input"
          type="text"
          value={name}
          maxLength={40}
          placeholder="Ada"
          autoComplete="off"
          onChange={(event) => setName(event.target.value)}
        />
      </div>
      {/* React escapes text, so typing <script> shows the characters instead of running them. */}
      <p className="greeting" aria-live="polite">
        {trimmed ? (
          <>
            Hello, <strong>{trimmed}</strong>!
          </>
        ) : (
          'Type to see a greeting.'
        )}
      </p>
    </Panel>
  )
}

function ShowHide() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Panel index={3} title="Showing and hiding" description="A boolean in state decides whether an element exists.">
      <div>
        <button
          type="button"
          aria-expanded={isOpen}
          aria-controls="hidden-tip"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? 'Hide the tip' : 'Show a tip'}
        </button>
      </div>
      {isOpen && (
        <p id="hidden-tip" className="tip">
          <code>{'{condition && <Element />}'}</code> renders the element only
          while the condition is true.
        </p>
      )}
    </Panel>
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
    <Panel index={4} title="Forms and lists" description="Add, tick, and remove items. The count is calculated from the list.">
      <form onSubmit={addTask} className="inline-form">
        <label htmlFor="task-input" className="visually-hidden">
          New task
        </label>
        <input
          id="task-input"
          type="text"
          placeholder="Add a task"
          value={draft}
          maxLength={80}
          autoComplete="off"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" className="btn-primary" disabled={!draft.trim()}>
          Add
        </button>
      </form>

      {tasks.length === 0 ? (
        <p className="empty">No tasks yet. Add one above.</p>
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
                  className="btn-ghost btn-small"
                  aria-label={`Remove ${task.text}`}
                  onClick={() => removeTask(task.id)}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
          {/* A value calculated from state, not stored separately. */}
          <p className="muted" aria-live="polite">
            {remaining} of {tasks.length} left to do
          </p>
        </>
      )}
    </Panel>
  )
}

export function InteractivityPage() {
  return (
    <div className="container container-narrow">
      <PageHeader
        eyebrow="Experiment"
        title="Interactivity"
        lede="Each example keeps a value in state and updates it when you click, type, or submit. State resets when you leave the page or refresh."
        journalSlug="interactivity-with-state"
      />
      <div className="panel-stack">
        <Counter />
        <LiveText />
        <ShowHide />
        <TaskList />
      </div>
    </div>
  )
}
