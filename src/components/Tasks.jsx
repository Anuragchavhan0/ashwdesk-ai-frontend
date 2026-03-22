import { useState, useEffect } from 'react'
import API from '../api/axios'

function Tasks() {
    const [tasks, setTasks] = useState([])
    const [newTask, setNewTask] = useState('')
    const [newTag, setNewTag] = useState('CODE')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        fetchTasks()
    }, [])

    const fetchTasks = async () => {
        try {
            const res = await API.get('/api/tasks')
            setTasks(res.data)
        } catch (err) {
            console.log('Error fetching tasks:', err)
        }
    }

    const addTask = async () => {
        if (!newTask.trim()) return
        setLoading(true)
        try {
            const res = await API.post('/api/tasks', {
                title: newTask,
                tag: newTag
            })
            setTasks(prev => [res.data, ...prev])
            setNewTask('')
        } catch (err) {
            console.log('Error adding task:', err)
            alert('Could not add task! Make sure you are logged in.')
        } finally {
            setLoading(false)
        }
    }

    const toggleTask = async (id) => {
        try {
            const res = await API.put(`/api/tasks/${id}/toggle`)
            setTasks(prev => prev.map(t => t.id === id ? res.data : t))
        } catch (err) {
            console.log('Error toggling task:', err)
        }
    }

    const deleteTask = async (id) => {
        try {
            await API.delete(`/api/tasks/${id}`)
            setTasks(prev => prev.filter(t => t.id !== id))
        } catch (err) {
            console.log('Error deleting task:', err)
        }
    }

    const tagColors = {
        CODE:   { bg: '#1A2535', color: '#5B9CF6' },
        CAREER: { bg: '#1A2520', color: '#5EC97A' },
        AI:     { bg: '#251A10', color: '#C9A84C' },
    }

    return (
        <div>
            <div style={styles.pageTitle}>Tasks</div>
            <div style={styles.pageSub}>Track your dev & career goals</div>

            <div style={styles.addCard}>
                <input
                    style={styles.taskInput}
                    placeholder="Add a new task..."
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && addTask()}
                />
                <select
                    style={styles.tagSelect}
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                >
                    <option value="CODE">Code</option>
                    <option value="CAREER">Career</option>
                    <option value="AI">AI</option>
                </select>
                <button
                    style={loading ? styles.addBtnDisabled : styles.addBtn}
                    onClick={addTask}
                    disabled={loading}
                >
                    {loading ? 'Adding...' : '+ Add'}
                </button>
            </div>

            <div style={styles.taskList}>
                {tasks.length === 0 && (
                    <div style={styles.empty}>
                        No tasks yet! Add your first task above 👆
                    </div>
                )}
                {tasks.map(task => (
                    <div key={task.id} style={styles.taskItem}>
                        <div
                            style={task.completed ? styles.checkDone : styles.check}
                            onClick={() => toggleTask(task.id)}
                        >
                            {task.completed && '✓'}
                        </div>
                        <div style={task.completed ? styles.taskTitleDone : styles.taskTitle}>
                            {task.title}
                        </div>
                        <div style={{
                            ...styles.tag,
                            background: tagColors[task.tag]?.bg || '#1A1A1A',
                            color: tagColors[task.tag]?.color || '#999',
                        }}>
                            {task.tag?.toLowerCase()}
                        </div>
                        <div style={styles.deleteBtn} onClick={() => deleteTask(task.id)}>✕</div>
                    </div>
                ))}
            </div>

            {tasks.length > 0 && (
                <div style={styles.statsRow}>
                    <span style={styles.statsText}>
                        {tasks.filter(t => t.completed).length} of {tasks.length} completed
                    </span>
                </div>
            )}
        </div>
    )
}

const styles = {
    pageTitle:      { fontFamily: 'serif', fontSize: '26px', color: '#F0EDE8', marginBottom: '4px' },
    pageSub:        { fontSize: '13px', color: '#9A9590', marginBottom: '24px' },
    addCard:        { display: 'flex', gap: '10px', marginBottom: '20px', background: '#111114', border: '1px solid #2A2A32', borderRadius: '12px', padding: '16px' },
    taskInput:      { flex: 1, background: '#18181C', border: '1px solid #2A2A32', borderRadius: '8px', padding: '10px 14px', color: '#F0EDE8', fontSize: '14px', outline: 'none', fontFamily: 'Geist, sans-serif' },
    tagSelect:      { background: '#18181C', border: '1px solid #2A2A32', borderRadius: '8px', padding: '10px 14px', color: '#F0EDE8', fontSize: '13px', outline: 'none', cursor: 'pointer' },
    addBtn:         { background: '#C9A84C', color: '#0A0A0B', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
    addBtnDisabled: { background: '#8B6F30', color: '#0A0A0B', border: 'none', borderRadius: '8px', padding: '10px 20px', fontSize: '13px', fontWeight: '600', cursor: 'not-allowed' },
    taskList:       { display: 'flex', flexDirection: 'column', gap: '8px' },
    empty:          { color: '#5A5650', fontSize: '14px', textAlign: 'center', padding: '40px', background: '#111114', border: '1px solid #2A2A32', borderRadius: '12px' },
    taskItem:       { display: 'flex', alignItems: 'center', gap: '12px', background: '#111114', border: '1px solid #2A2A32', borderRadius: '10px', padding: '14px 16px' },
    check:          { width: '18px', height: '18px', borderRadius: '4px', border: '1.5px solid #2A2A32', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' },
    checkDone:      { width: '18px', height: '18px', borderRadius: '4px', background: '#C9A84C', border: '1.5px solid #C9A84C', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0A0A0B', fontSize: '12px', fontWeight: '700' },
    taskTitle:      { flex: 1, fontSize: '14px', color: '#F0EDE8' },
    taskTitleDone:  { flex: 1, fontSize: '14px', color: '#5A5650', textDecoration: 'line-through' },
    tag:            { fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontFamily: 'monospace' },
    deleteBtn:      { color: '#5A5650', cursor: 'pointer', fontSize: '12px', padding: '4px 6px', borderRadius: '4px' },
    statsRow:       { marginTop: '16px', padding: '12px 16px', background: '#111114', border: '1px solid #2A2A32', borderRadius: '10px' },
    statsText:      { fontSize: '13px', color: '#9A9590' },
}

export default Tasks