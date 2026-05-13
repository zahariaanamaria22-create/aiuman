export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text, tone, intensity } = req.body;

  const toneMap = {
    natural: 'conversational și autentic, ca și cum o persoană reală ar scrie',
    formal: 'profesionist și bine structurat, dar fără rigiditate excesivă',
    casual: 'relaxat, prietenos, cu ușurință și umor când e potrivit',
    academic: 'riguros și bine argumentat, cu vocabular precis',
  };

  const intensityMap = {
    subtil: 'păstrând 80% din structura originală, cu mici ajustări',
    moderat: 'rescriind semnificativ pentru a suna uman, păstrând ideile cheie',
    puternic: 'rescriind complet în stil uman, cu variații de ritm și personalitate',
  };

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      system: `Ești expert în transformarea textelor AI în texte umane autentice. Ton: ${toneMap[tone]}. Intensitate: ${intensityMap[intensity]}. Răspunde DOAR cu textul rescris.`,
      messages: [{ role: 'user', content: `Rescrie:\n\n${text}` }],
    }),
  });

  const data = await response.json();
  res.status(200).json({ result: data.content?.[0]?.text || 'Eroare.' });
}
