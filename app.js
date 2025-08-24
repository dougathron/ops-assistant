// Minimal skeleton. In Step 2–4 we’ll add: parsing DOCX/PDF, embeddings, search, and local LLM.
// For now we just store your preferences and show messages.

const el = (id) => document.getElementById(id);
const chat = el('chat');
const debug = el('debug');

function addMsg(role, text) {
  const div = document.createElement('div');
  div.className = `msg ${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function savePrefs() {
  const prefs = { tone: el('tone').value, lang: el('lang').value };
  localStorage.setItem('ops_assistant_prefs', JSON.stringify(prefs));
}
function loadPrefs() {
  try {
    const p = JSON.parse(localStorage.getItem('ops_assistant_prefs')||'{}');
    if (p.tone) el('tone').value = p.tone;
    if (p.lang) el('lang').value = p.lang;
  } catch {}
}
loadPrefs();
el('tone').addEventListener('change', savePrefs);
el('lang').addEventListener('change', savePrefs);

// Placeholder: file indexing (real indexing arrives in Step 2–3)
el('indexBtn').addEventListener('click', async () => {
  const f = el('file').files?.[0];
  if (!f) { el('indexStatus').textContent = 'Please choose a DOCX/PDF first.'; return; }
  el('indexStatus').textContent = `Loaded file: ${f.name}\nIndexing will be added in Step 2.`;
});

// Placeholder chat (RAG + model comes later)
el('askBtn').addEventListener('click', async () => {
  const q = el('q').value.trim();
  if (!q) return;
  addMsg('user', q);
  addMsg('bot', 'Thanks! In Step 2–4 I will index your manual and answer with citations to sections/sub-procedures.');
  el('q').value = '';
});

// Voice input (uses the browser’s SpeechRecognition if available)
let recog;
try {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SR) {
    recog = new SR();
    recog.lang = 'en-US';
    recog.interimResults = false;
    recog.maxAlternatives = 1;
    recog.onresult = e => {
      const text = e.results[0][0].transcript;
      el('q').value = text;
      addMsg('user', text);
      addMsg('bot', 'Voice captured. I will answer based on your manual once indexing is enabled in Step 2–4.');
    };
  }
} catch {}

const micBtn = el('micBtn');
if (micBtn) {
  micBtn.addEventListener('mousedown', () => { if (recog) recog.start(); });
  micBtn.addEventListener('mouseup',   () => { if (recog) recog.stop();  });
}

debug.textContent = 'Ready. Next steps will add local embeddings, search, and a small local LLM in the browser.';
