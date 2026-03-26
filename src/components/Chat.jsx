import { useState, useRef, useEffect } from 'react'
import API from '../api/axios'

function Chat({ activeMode, setActiveMode, theme }) {
    const [messages, setMessages] = useState([
        {
            role: 'ai',
            text: `Hey! I'm Ashw, your ${
                activeMode === 'CODE' ? 'Code Assistant 💻'
                : activeMode === 'CAREER' ? 'Career Advisor 🎯'
                : 'AI Assistant 🧠'
            }. How can I help you today?`
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
            const aiText = res.data?.aiResponse || 'No response received'
            setMessages(prev => [...prev, { role: 'ai', text: aiText }])
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

    const t = theme || {
        bg: '#0A0A0B', bg2: '#111114', bg3: '#18181C',
        border: '#2A2A32', text: '#F0EDE8',
        text2: '#9A9590', text3: '#5A5650',
    }

    return (
        <div style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 56px)', overflow:'hidden' }}>

            {/* MODE PILLS */}
            <div style={{ display:'flex', gap:'8px', marginBottom:'16px', alignItems:'center', flexWrap:'wrap' }}>
                {[
                    { id: 'CODE',    label: '💻 Code Assistant' },
                    { id: 'CAREER',  label: '🎯 Career Advisor'  },
                    { id: 'GENERAL', label: '🧠 General'          },
                ].map(m => (
                    <div key={m.id}
                        style={{
                            padding:'4px 12px', borderRadius:'20px', fontSize:'12px',
                            cursor:'pointer',
                            border:`1px solid ${activeMode === m.id ? '#C9A84C' : t.border}`,
                            background: t.bg3,
                            color: activeMode === m.id ? '#C9A84C' : t.text2,
                            transition:'all .2s',
                        }}
                        onClick={() => setActiveMode(m.id)}
                    >
                        {m.label}
                    </div>
                ))}
                <div style={{ marginLeft:'auto', fontSize:'11px', color: t.text3 }}>
                    gemini-2.5-flash · Enter to send
                </div>
            </div>

            {/* MESSAGES */}
            <div style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column', gap:'16px', paddingBottom:'16px' }}>
                {Array.isArray(messages) && messages.map((msg, i) => (
                    <div key={i} style={{ display:'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                        <div style={{
                            background: msg.role === 'user' ? t.bg3 : t.bg2,
                            border:`1px solid ${t.border}`,
                            borderRadius:'12px', padding:'12px 16px',
                            fontSize:'14px', color: t.text,
                            maxWidth:'75%', lineHeight:'1.6',
                            whiteSpace:'pre-wrap',
                        }}>
                            {msg.text}
                        </div>
                    </div>
                ))}
                {loading && (
                    <div style={{ display:'flex', justifyContent:'flex-start' }}>
                        <div style={{
                            background: t.bg2, border:`1px solid ${t.border}`,
                            borderRadius:'12px', padding:'12px 16px',
                            fontSize:'14px', color:'#C9A84C', letterSpacing:'4px',
                        }}>
                            ● ● ●
                        </div>
                    </div>
                )}
                <div ref={bottomRef} />
            </div>

            {/* INPUT */}
            <div style={{ borderTop:`1px solid ${t.border}`, paddingTop:'16px' }}>
                <div style={{
                    background: t.bg3, border:`1px solid ${t.border}`,
                    borderRadius:'12px', padding:'12px 16px',
                    display:'flex', alignItems:'center', gap:'10px',
                }}>
                    <textarea
                        style={{
                            flex:1, background:'none', border:'none', outline:'none',
                            fontFamily:'Geist, sans-serif', fontSize:'14px',
                            color: t.text, resize:'none',
                        }}
                        placeholder="Ask anything... (Enter to send)"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKey}
                        rows={1}
                    />
                    <div onClick={sendMessage} style={{
                        width:'32px', height:'32px', borderRadius:'8px',
                        background:'#C9A84C', color:'#0A0A0B',
                        display:'flex', alignItems:'center', justifyContent:'center',
                        cursor:'pointer', fontSize:'14px', fontWeight:'700', flexShrink:0,
                    }}>↑</div>
                </div>
            </div>
        </div>
    )
}

export default Chat