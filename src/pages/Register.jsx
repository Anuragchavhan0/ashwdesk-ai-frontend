import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import API from '../api/axios'

function Register() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const { login } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        try {
            const res = await API.post('/api/auth/register', {
                name, email, password
            })
            login({
                name: res.data.name,
                email: res.data.email,
                plan: res.data.plan
            }, res.data.token)
            navigate('/dashboard')
        } catch (err) {
            setError('Registration failed! Email may already exist.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <div style={styles.logo}>
                    <span style={styles.logoIcon}>⚡</span>
                    <span style={styles.logoText}>
                        Ashw<span style={styles.gold}>Desk</span> AI
                    </span>
                </div>
                <h2 style={styles.title}>Create account</h2>
                <p style={styles.sub}>Start your AI workspace today</p>
                {error && <div style={styles.error}>{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div style={styles.field}>
                        <label style={styles.label}>Full Name</label>
                        <input
                            style={styles.input}
                            type="text"
                            placeholder="Ashwajeet Chavhan"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Email</label>
                        <input
                            style={styles.input}
                            type="email"
                            placeholder="you@gmail.com"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={styles.field}>
                        <label style={styles.label}>Password</label>
                        <input
                            style={styles.input}
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        style={loading ? styles.btnDisabled : styles.btn}
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>
                <p style={styles.footer}>
                    Already have an account?{' '}
                    <Link to="/login" style={styles.link}>
                        Sign In
                    </Link>
                </p>
            </div>
        </div>
    )
}

const styles = {
    container: {
        minHeight: '100vh',
        background: '#0A0A0B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Geist, sans-serif',
    },
    card: {
        background: '#111114',
        border: '1px solid #2A2A32',
        borderRadius: '16px',
        padding: '40px',
        width: '100%',
        maxWidth: '400px',
    },
    logo: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '28px',
        justifyContent: 'center',
    },
    logoIcon: {
        fontSize: '24px',
        background: 'linear-gradient(135deg,#C9A84C,#8B6F30)',
        borderRadius: '8px',
        padding: '6px 8px',
    },
    logoText: {
        fontSize: '22px',
        fontFamily: 'serif',
        color: '#F0EDE8',
    },
    gold: { color: '#C9A84C' },
    title: {
        color: '#F0EDE8',
        fontSize: '22px',
        fontWeight: '600',
        marginBottom: '6px',
        textAlign: 'center',
    },
    sub: {
        color: '#9A9590',
        fontSize: '14px',
        textAlign: 'center',
        marginBottom: '28px',
    },
    error: {
        background: '#2A1010',
        border: '1px solid #E85555',
        color: '#E85555',
        padding: '10px 14px',
        borderRadius: '8px',
        fontSize: '13px',
        marginBottom: '16px',
    },
    field: { marginBottom: '16px' },
    label: {
        display: 'block',
        color: '#9A9590',
        fontSize: '13px',
        marginBottom: '6px',
    },
    input: {
        width: '100%',
        background: '#18181C',
        border: '1px solid #2A2A32',
        borderRadius: '8px',
        padding: '10px 14px',
        color: '#F0EDE8',
        fontSize: '14px',
        outline: 'none',
        boxSizing: 'border-box',
    },
    btn: {
        width: '100%',
        background: '#C9A84C',
        color: '#0A0A0B',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '8px',
    },
    btnDisabled: {
        width: '100%',
        background: '#8B6F30',
        color: '#0A0A0B',
        border: 'none',
        borderRadius: '8px',
        padding: '12px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'not-allowed',
        marginTop: '8px',
    },
    footer: {
        color: '#9A9590',
        fontSize: '13px',
        textAlign: 'center',
        marginTop: '20px',
    },
    link: { color: '#C9A84C', textDecoration: 'none' },
}

export default Register