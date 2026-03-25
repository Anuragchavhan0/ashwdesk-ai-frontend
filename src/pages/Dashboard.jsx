import { useState } from 'react'
import { useEffect } from 'react'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Chat from '../components/Chat'

import API from '../api/axios'

function Dashboard() {

    const { user, logout } = useAuth()
    const navigate = useNavigate()
    const [activePage, setActivePage] = useState('overview')
    const [activeMode, setActiveMode] = useState('CODE')
    const [chatCount, setChatCount] = useState(0)
    const [isDark, setIsDark] = useState(true)

    const theme = isDark ? dark : light

    useEffect(() => {
        API.get('/api/chat/count')
            .then(res => setChatCount(res.data))
            .catch(() => { })
    }, [])

    const handleLogout = () => {
        logout()
        navigate('/login')



    }

    return (
        <div style={{ ...styles.container, background: theme.bg, fontFamily: "'Inter', sans-serif" }}>

            {/* SIDEBAR */}
            <div style={{ ...styles.sidebar, background: theme.bg2, borderRight: `1px solid ${theme.border}` }}>

                {/* LOGO */}
                <div style={{ ...styles.logo, borderBottom: `1px solid ${theme.border}` }}>
                    <div style={styles.logoIcon}>⚡</div>
                    <span style={{ ...styles.logoText, color: theme.text }}>
                        Ashw<span style={{ color: '#C9A84C' }}>Desk</span> AI
                    </span>
                </div>

                {/* NAV */}
                <div style={styles.navSection}>
                    <div style={{ ...styles.navLabel, color: theme.text3 }}>WORKSPACE</div>
                    {[
                        { id: 'overview', icon: '⊞', label: 'Overview' },
                        { id: 'chat', icon: '💬', label: 'AI Chat' },
                    ].map(item => (
                        <div
                            key={item.id}
                            style={activePage === item.id
                                ? { ...styles.navItem, ...styles.navActive, color: '#C9A84C', background: '#C9A84C15' }
                                : { ...styles.navItem, color: theme.text2 }
                            }
                            onClick={() => setActivePage(item.id)}
                            onMouseEnter={e => {
                                if (activePage !== item.id) e.currentTarget.style.background = theme.hover
                            }}
                            onMouseLeave={e => {
                                if (activePage !== item.id) e.currentTarget.style.background = 'transparent'
                            }}
                        >
                            <span style={{ fontSize: '15px' }}>{item.icon}</span>
                            {item.label}
                        </div>
                    ))}
                </div>

                {/* QUICK STATS */}
                <div style={{ ...styles.statsBox, background: theme.bg3, border: `1px solid ${theme.border}` }}>
                    <div style={{ fontSize: '10px', color: theme.text3, letterSpacing: '.1em', marginBottom: '10px' }}>TODAY</div>
                    <div style={styles.statRow}>
                        <span style={{ fontSize: '12px', color: theme.text2 }}>Chats</span>
                        <span style={{ fontSize: '12px', color: '#C9A84C', fontWeight: 600 }}>0</span>
                    </div>
                    <div style={styles.statRow}>
                        <span style={{ fontSize: '12px', color: theme.text2 }}>Tokens used</span>
                        <span style={{ fontSize: '12px', color: '#5EC97A', fontWeight: 600 }}>0</span>
                    </div>
                    <div style={{ height: '3px', background: theme.border, borderRadius: '2px', marginTop: '10px' }}>
                        <div style={{ width: '0%', height: '100%', background: 'linear-gradient(90deg,#8B6F30,#C9A84C)', borderRadius: '2px' }}></div>
                    </div>
                    <div style={{ fontSize: '10px', color: theme.text3, marginTop: '5px' }}>0 / 100k tokens</div>
                </div>

                <div style={{ flex: 1 }} />

                {/* DARK/LIGHT TOGGLE */}
                <div
                    style={{ ...styles.toggleRow, background: theme.bg3, border: `1px solid ${theme.border}`, cursor: 'pointer', transition: 'all .2s' }}
                    onClick={() => setIsDark(!isDark)}
                    onMouseEnter={e => e.currentTarget.style.borderColor = '#C9A84C50'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = theme.border}
                >
                    <span style={{ fontSize: '12px', color: theme.text2 }}>{isDark ? '🌙 Dark mode' : '☀️ Light mode'}</span>
                    <div style={{ ...styles.toggleTrack, background: isDark ? '#C9A84C' : theme.border }}>
                        <div style={{ ...styles.toggleKnob, left: isDark ? '14px' : '2px' }}></div>
                    </div>
                </div>

                {/* USER CARD */}
                <div style={{ ...styles.userCard, background: theme.bg3, border: `1px solid ${theme.border}` }}>
                    <div style={styles.avatar}>{user?.name?.charAt(0).toUpperCase()}</div>
                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '13px', fontWeight: 500, color: theme.text }}>{user?.name}</div>
                        <div style={{ fontSize: '10px', color: '#C9A84C' }}>✦ {user?.plan} Plan</div>
                    </div>
                    <div
                        style={{ fontSize: '12px', color: theme.text3, cursor: 'pointer', padding: '4px 8px', borderRadius: '6px', transition: 'all .2s' }}
                        onClick={handleLogout}
                        onMouseEnter={e => { e.currentTarget.style.color = '#E85555'; e.currentTarget.style.background = '#E8555510' }}
                        onMouseLeave={e => { e.currentTarget.style.color = theme.text3; e.currentTarget.style.background = 'transparent' }}
                    >
                        → Out
                    </div>
                </div>

            </div>

            {/* MAIN */}
            <div style={styles.main}>

                {/* TOPBAR */}
                <div style={{ ...styles.topbar, background: theme.bg2, borderBottom: `1px solid ${theme.border}` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <span style={{ fontSize: '15px', fontWeight: 600, color: theme.text }}>
                            {activePage === 'overview' ? 'Overview' : 'AI Chat'}
                        </span>
                        {activePage === 'chat' && (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                {[
                                    { id: 'CODE', label: '💻 Code' },
                                    { id: 'CAREER', label: '🎯 Career' },
                                    { id: 'GENERAL', label: '🧠 General' },
                                ].map(m => (
                                    <div
                                        key={m.id}
                                        style={{
                                            padding: '3px 12px',
                                            borderRadius: '20px',
                                            fontSize: '11px',
                                            cursor: 'pointer',
                                            border: `1px solid ${activeMode === m.id ? '#C9A84C' : theme.border}`,
                                            color: activeMode === m.id ? '#C9A84C' : theme.text2,
                                            background: activeMode === m.id ? '#C9A84C10' : theme.bg3,
                                            transition: 'all .2s',
                                            fontWeight: activeMode === m.id ? 500 : 400,
                                        }}
                                        onClick={() => setActiveMode(m.id)}
                                        onMouseEnter={e => { if (activeMode !== m.id) e.currentTarget.style.borderColor = '#C9A84C50' }}
                                        onMouseLeave={e => { if (activeMode !== m.id) e.currentTarget.style.borderColor = theme.border }}
                                    >
                                        {m.label}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div style={{ ...styles.modelChip, background: theme.bg3, border: `1px solid ${theme.border}`, color: theme.text2 }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#5EC97A', flexShrink: 0 }}></div>
                        gemini-2.5-flash
                    </div>
                </div>

                {/* CONTENT */}
                <div style={{ ...styles.content, background: theme.bg }}>

                    {/* OVERVIEW */}
                    {activePage === 'overview' && (
                        <div>
                            <div style={{ fontFamily: "'Inter', serif", fontSize: '26px', fontWeight: 600, color: theme.text, marginBottom: '4px' }}>
                                Good day, {user?.name?.split(' ')[0]}! 👋
                            </div>
                            <div style={{ fontSize: '13px', color: theme.text2, marginBottom: '28px' }}>
                                Welcome to your AI workspace
                            </div>

                            {/* STATS */}
                            <div style={styles.statsGrid}>
                                {[
                                    { label: 'CONVERSATIONS', value: '0', sub: '↑ Just started', subColor: '#5EC97A' },
                                    { label: 'TOKENS USED', value: '0', sub: 'of 100k limit', subColor: theme.text2 },
                                    { label: 'ACTIVE MODE', value: activeMode === 'CODE' ? '💻 Code' : activeMode === 'CAREER' ? '🎯 Career' : '🧠 General', sub: 'Click to switch', subColor: '#C9A84C' },
                                ].map((s, i) => (
                                    <div
                                        key={i}
                                        style={{ ...styles.statCard, background: theme.bg2, border: `1px solid ${theme.border}`, transition: 'all .2s' }}
                                        onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C50'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                        onMouseLeave={e => { e.currentTarget.style.borderColor = theme.border; e.currentTarget.style.transform = 'translateY(0)' }}
                                    >
                                        <div style={{ fontSize: '10px', color: theme.text3, letterSpacing: '.1em', marginBottom: '12px' }}>{s.label}</div>
                                        <div style={{ fontSize: '28px', fontWeight: 600, color: theme.text, marginBottom: '8px' }}>{s.value}</div>
                                        <div style={{ fontSize: '11px', color: s.subColor }}>{s.sub}</div>
                                    </div>
                                ))}
                            </div>

                            {/* AI MODES */}
                            <div style={{ ...styles.card, background: theme.bg2, border: `1px solid ${theme.border}` }}>
                                <div style={styles.cardHeader}>
                                    <div style={{ fontSize: '13px', fontWeight: 600, color: theme.text }}>AI Modes</div>
                                    <div
                                        style={{ fontSize: '12px', color: '#C9A84C', cursor: 'pointer', padding: '4px 10px', borderRadius: '6px', transition: 'all .2s' }}
                                        onClick={() => setActivePage('chat')}
                                        onMouseEnter={e => e.currentTarget.style.background = '#C9A84C15'}
                                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                    >
                                        Open Chat →
                                    </div>
                                </div>
                                <div style={styles.modesGrid}>
                                    {[
                                        { id: 'CODE', icon: '💻', name: 'Code Assistant', desc: 'Debug, write & review code' },
                                        { id: 'CAREER', icon: '🎯', name: 'Career Advisor', desc: 'Resume tips & interview prep' },
                                        { id: 'GENERAL', icon: '🧠', name: 'General Chat', desc: 'Ask anything, explore ideas' },
                                    ].map(mode => (
                                        <div
                                            key={mode.id}
                                            style={{
                                                ...styles.modeCard,
                                                background: activeMode === mode.id ? '#C9A84C10' : theme.bg3,
                                                border: `1px solid ${activeMode === mode.id ? '#C9A84C' : theme.border}`,
                                                transition: 'all .2s',
                                            }}
                                            onClick={() => { setActiveMode(mode.id); setActivePage('chat') }}
                                            onMouseEnter={e => { e.currentTarget.style.borderColor = '#C9A84C'; e.currentTarget.style.transform = 'translateY(-2px)' }}
                                            onMouseLeave={e => { e.currentTarget.style.borderColor = activeMode === mode.id ? '#C9A84C' : theme.border; e.currentTarget.style.transform = 'translateY(0)' }}
                                        >
                                            <div style={{ fontSize: '24px', marginBottom: '10px' }}>{mode.icon}</div>
                                            <div style={{ fontSize: '13px', fontWeight: 600, color: activeMode === mode.id ? '#C9A84C' : theme.text, marginBottom: '4px' }}>{mode.name}</div>
                                            <div style={{ fontSize: '11px', color: theme.text2, lineHeight: 1.5 }}>{mode.desc}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* CHAT */}
                    {activePage === 'chat' && (
                        <Chat activeMode={activeMode} setActiveMode={setActiveMode} theme={isDark ? dark : light} />
                    )}

                </div>
            </div>
        </div>
    )
}

const dark = {
    bg: '#0A0A0B', bg2: '#111114', bg3: '#18181C',
    border: '#2A2A32', text: '#F0EDE8',
    text2: '#9A9590', text3: '#5A5650',
    hover: '#ffffff08',
}

const light = {
    bg: '#F5F3EE', bg2: '#EDEAE3', bg3: '#E5E1D8',
    border: '#C8C3B8', text: '#1A1814',
    text2: '#5A5550', text3: '#9A9590',
    hover: '#00000008',
}

const styles = {
    container: { display: 'flex', height: '100vh', overflow: 'hidden' },
    sidebar: { width: '230px', display: 'flex', flexDirection: 'column', flexShrink: 0 },
    logo: { display: 'flex', alignItems: 'center', gap: '10px', padding: '20px 16px 16px' },
    logoIcon: { width: '30px', height: '30px', background: 'linear-gradient(135deg,#C9A84C,#8B6F30)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 },
    logoText: { fontFamily: 'serif', fontSize: '18px' },
    navSection: { padding: '14px 10px 8px' },
    navLabel: { fontSize: '10px', letterSpacing: '.12em', padding: '0 8px', marginBottom: '6px' },
    navItem: { display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', marginBottom: '2px', transition: 'all .15s' },
    navActive: { borderLeft: '3px solid #C9A84C' },
    statsBox: { margin: '8px 10px', padding: '12px', borderRadius: '10px' },
    statRow: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' },
    toggleRow: { margin: '8px 10px', padding: '8px 12px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'all .2s' },
    toggleTrack: { width: '32px', height: '18px', borderRadius: '10px', position: 'relative', transition: 'all .2s', flexShrink: 0 },
    toggleKnob: { width: '12px', height: '12px', background: '#0A0A0B', borderRadius: '50%', position: 'absolute', top: '3px', transition: 'left .2s' },
    userCard: { margin: '8px 10px 10px', padding: '10px 12px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '8px' },
    avatar: { width: '30px', height: '30px', borderRadius: '8px', background: 'linear-gradient(135deg,#8B6F30,#C9A84C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: '#0A0A0B', flexShrink: 0 },
    main: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' },
    topbar: { height: '54px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 22px', flexShrink: 0 },
    modelChip: { display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', padding: '5px 12px', fontSize: '12px', fontFamily: "'JetBrains Mono', monospace" },
    content: { flex: 1, overflowY: 'auto', padding: '28px' },
    statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' },
    statCard: { borderRadius: '12px', padding: '18px 20px', cursor: 'pointer' },
    card: { borderRadius: '12px', padding: '20px', marginBottom: '16px' },
    cardHeader: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' },
    modesGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' },
    modeCard: { borderRadius: '10px', padding: '16px', cursor: 'pointer' },
}

export default Dashboard