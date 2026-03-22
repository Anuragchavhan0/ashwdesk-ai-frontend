import { useState, useRef, useEffect } from 'react'
import API from '../api/axios'

function Chat({ activeMode, setActiveMode }) {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Hey! I'm Ashw, your ${activeMode === 'CODE' ? 'Code Assistant 💻' : activeMode === 'CAREER' ? 'Career Advisor 🎯' : 'AI Assistant 🧠'}. How can I help you today?`
            
        }
    ])
    const [input, setInput] = useState('')
    const [loading, setLoading] = useState(false)
    const bottomRef = useRef(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const sendMessage = async () => {
        if (!input.trim() || loading) return
        const userMsg = input.trim()
        setInput('')
        setMessages(prev => [...prev, { role: 'user', text: userMsg }])
        setLoading(true)
        try {
            const res = await API.post('/api/chat/send', {
                message: userMsg,
                mode: activeMode
            })
            setMessages(prev => [...prev, {
                role: 'ai',
                text: res.data.aiResponse
            }])
        } catch (err) {
            setMessages(prev => [...prev, {
                role: 'ai',
                text: '⚠️ Could not reach AI. Please try again!'
            }])
        } finally {
            setLoading(false)
        }
    }

    const handleKey = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            sendMessage()
        }
    }

    return (
        <div style={styles.container}>
            {/* MODE PILLS */}
            <div style={styles.modePills}>
                {[
                    { id: 'CODE', label: '💻 Code Assistant' },
                    { id: 'CAREER', label: '🎯 Career Advisor' },
                    { id: 'GENERAL', label: '🧠 General' },
                ].map(m => (
                    <div
                        key={m.id}
                        style={activeMode === m.id ? styles.pillActive : styles.pill}
                        onClick={() => setActiveMode(m.id)}
                    >
                        {m.label}
                    </div>
                ))}
                <div style={styles.hint}>gemini-2.5-flash · Enter to send</div>
            </div>

            {/* MESSAGES */}
            <div style={styles.messages}>
                {messages.map((msg, i) => (
                    <div key={i} style={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
                        <div style={msg.role === 'user' ? styles.userBubble : styles.aiBubble}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={styles.aiMsg}>
                        <div style={styles.aiBubble}>
                            <span style={styles.typing}>● ● ●</span>
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={styles.inputArea}>
                <div style={styles.inputBox}>
                    <textarea
                        style={styles.input}
                        placeholder="Ask anything... (Enter to send)"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <div style={styles.sendBtn} onClick={sendMessage}>↑</div>
                </div>
            </div>
        </div>
    )
}

const styles = {
    container: { display:'flex', flexDirection:'column', height:'calc(100vh - 56px)', overflow:'hidden' },
    modePills: { display:'flex', gap:'8px', marginBottom:'16px', alignItems:'center', flexWrap:'wrap' },
    pill: { padding:'4px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', border:'1px solid #2A2A32', background:'#18181C', color:'#9A9590' },
    pillActive: { padding:'4px 12px', borderRadius:'20px', fontSize:'12px', cursor:'pointer', border:'1px solid #C9A84C', background:'#18181C', color:'#C9A84C' },
    hint: { marginLeft:'auto', fontSize:'11px', color:'#5A5650' },
    messages: { flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'16px', paddingBottom:'16px' },
    userMsg: { display:'flex', justifyContent:'flex-end' },
    aiMsg: { display:'flex', justifyContent:'flex-start' },
    userBubble: { background:'#202026', border:'1px solid #2A2A32', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'#F0EDE8', maxWidth:'75%', lineHeight:'1.6' },
    aiBubble: { background:'#111114', border:'1px solid #2A2A32', borderRadius:'12px', padding:'12px 16px', fontSize:'14px', color:'#F0EDE8', maxWidth:'75%', lineHeight:'1.6', whiteSpace:'pre-wrap' },
    typing: { color:'#C9A84C', letterSpacing:'4px' },
    inputArea: { borderTop:'1px solid #2A2A32', paddingTop:'16px' },
    inputBox: { background:'#18181C', border:'1px solid #2A2A32', borderRadius:'12px', padding:'12px 16px', display:'flex', alignItems:'center', gap:'10px' },
    input: { flex:1, background:'none', border:'none', outline:'none', fontFamily:'Geist,sans-serif', fontSize:'14px', color:'#F0EDE8', resize:'none' },
    sendBtn: { width:'32px', height:'32px', borderRadius:'8px', background:'#C9A84C', color:'#0A0A0B', display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', fontSize:'14px', fontWeight:'700', flexShrink:0 },
}

export default Chat