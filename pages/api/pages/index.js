import { useState } from 'react';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [tone, setTone] = useState('natural');
  const [intensity, setIntensity] = useState('moderat');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function humanize() {
    if (!input.trim() || loading) return;
    setLoading(true);
    setOutput('');
    const res = await fetch('/api/humanize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: input, tone, intensity }),
    });
    const data = await res.json();
    setOutput(data.result);
    setLoading(false);
  }

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const chips = (options, active, setActive) =>
    options.map(o => (
      <button key={o} onClick={() => setActive(o)} style={{
        padding: '6px 16px', borderRadius: 20, border: '1.5px solid',
        borderColor: active === o ? '#b84c2e' : '#ccc',
        background: active === o ? '#b84c2e' : 'white',
        color: active === o ? 'white' : '#666',
        cursor: 'pointer', fontSize: 13, marginRight: 6,
      }}>{o}</button>
    ));

  return (
    <div style={{ minHeight: '100vh', background: '#f5f0e8', fontFamily: 'Georgia, serif', padding: 32 }}>
      <h1 style={{ fontSize: 32, marginBottom: 4 }}>Human<span style={{ color: '#b84c2e', fontStyle: 'italic' }}>AI</span></h1>
      <p style={{ color: '#888', fontSize: 13, marginBottom: 28 }}>Transformă textul AI în voce umană</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#999', marginBottom: 8, textTransform: 'uppercase' }}>Text original (AI)</div>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            placeholder="Lipește textul generat de AI aici…"
            style={{ width: '100%', height: 300, padding: 16, fontSize: 15, lineHeight: 1.7, border: '1.5px solid #ccc', borderRadius: 4, resize: 'none', background: '#faf7f0', fontFamily: 'Georgia, serif' }} />
        </div>
        <div>
          <div style={{ fontSize: 11, letterSpacing: 2, color: '#999', marginBottom: 8, textTransform: 'uppercase' }}>Text humanizat</div>
          <div style={{ height: 300, padding: 16, fontSize: 15, lineHeight: 1.7, border: '1.5px solid #ccc', borderRadius: 4, background: '#faf7f0', overflowY: 'auto', whiteSpace: 'pre-wrap' }}>
            {loading ? <span style={{ color: '#b84c2e' }}>Se procesează…</span> : output || <span style={{ color: '#ccc', fontStyle: 'italic' }}>Textul humanizat apare aici…</span>}
          </div>
        </div>
      </div>

      <div style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, color: '#999', marginRight: 10, textTransform: 'uppercase', letterSpacing: 2 }}>Ton</span>
        {chips(['natural', 'formal', 'casual', 'academic'], tone, setTone)}
      </div>
      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 11, color: '#999', marginRight: 10, textTransform: 'uppercase', letterSpacing: 2 }}>Intensitate</span>
        {chips(['subtil', 'moderat', 'puternic'], intensity, setIntensity)}
      </div>

      <div style={{ display: 'flex', gap: 12 }}>
        <button onClick={humanize} disabled={loading} style={{
          padding: '10px 32px', background: loading ? '#ccc' : '#b84c2e', color: 'white',
          border: 'none', borderRadius: 4, fontSize: 16, fontStyle: 'italic', fontFamily: 'Georgia, serif', cursor: loading ? 'not-allowed' : 'pointer',
        }}>
          {loading ? 'Se procesează…' : 'Humanizează →'}
        </button>
        {output && (
          <button onClick={copy} style={{
            padding: '10px 20px', border: '1.5px solid #ccc', background: 'white',
            borderRadius: 4, fontSize: 13, cursor: 'pointer', color: copied ? '#5a9e6e' : '#666',
          }}>
            {copied ? '✓ Copiat' : 'Copiază'}
          </button>
        )}
      </div>
    </div>
  );
}
