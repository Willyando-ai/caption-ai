<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Nota AI — Bikin Caption Jualan</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fredoka:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --bg: #123C34;
    --bg-deep: #0B2620;
    --paper: #FBF6EC;
    --paper-shadow: #E9E0CC;
    --accent: #F2A93B;
    --accent-2: #E85C4A;
    --ink: #1B2B27;
    --muted: #9DBBAE;
    --line: rgba(251,246,236,0.14);
  }
  *{box-sizing:border-box;}
  html,body{margin:0;padding:0;}
  body{
    min-height:100vh;
    background:
      radial-gradient(circle at 15% 10%, rgba(242,169,59,0.10), transparent 40%),
      radial-gradient(circle at 90% 85%, rgba(232,92,74,0.10), transparent 45%),
      var(--bg);
    font-family:'Plus Jakarta Sans', sans-serif;
    color: var(--paper);
    display:flex;
    align-items:flex-start;
    justify-content:center;
    padding: 48px 20px 80px;
  }
  .wrap{
    width:100%;
    max-width:980px;
  }
  header{
    text-align:center;
    margin-bottom:36px;
  }
  .eyebrow{
    font-family:'Space Mono', monospace;
    font-size:12px;
    letter-spacing:0.18em;
    text-transform:uppercase;
    color: var(--accent);
    display:inline-flex;
    align-items:center;
    gap:8px;
    margin-bottom:14px;
  }
  .eyebrow::before, .eyebrow::after{
    content:"";
    width:20px;height:1px;
    background: var(--accent);
    opacity:0.6;
  }
  h1{
    font-family:'Fredoka', sans-serif;
    font-weight:700;
    font-size: clamp(32px, 5vw, 48px);
    margin:0 0 10px;
    line-height:1.1;
  }
  h1 span{ color: var(--accent); }
  header p{
    color: var(--muted);
    font-size:15px;
    max-width:480px;
    margin:0 auto;
  }
  .grid{
    display:grid;
    grid-template-columns: 1fr 1fr;
    gap:28px;
    align-items:start;
  }
  @media (max-width: 820px){
    .grid{ grid-template-columns: 1fr; }
  }

  /* ---- Kios form panel ---- */
  .kios{
    background: var(--bg-deep);
    border:1px solid var(--line);
    border-radius:20px;
    padding:28px;
    position:relative;
  }
  .kios-tag{
    position:absolute;
    top:-14px; left:24px;
    background: var(--accent);
    color: var(--bg-deep);
    font-family:'Fredoka', sans-serif;
    font-weight:600;
    font-size:13px;
    padding:5px 14px;
    border-radius:999px;
  }
  label{
    display:block;
    font-size:13px;
    font-weight:600;
    color: var(--muted);
    margin: 22px 0 8px;
  }
  label:first-of-type{ margin-top:8px; }
  input[type=text], textarea{
    width:100%;
    background: rgba(251,246,236,0.06);
    border:1px solid var(--line);
    border-radius:12px;
    padding:13px 14px;
    color: var(--paper);
    font-family:'Plus Jakarta Sans', sans-serif;
    font-size:15px;
    resize: vertical;
    transition: border-color .15s, background .15s;
  }
  textarea{ min-height:96px; line-height:1.5; }
  input::placeholder, textarea::placeholder{ color: rgba(157,187,174,0.55); }
  input:focus, textarea:focus{
    outline:none;
    border-color: var(--accent);
    background: rgba(251,246,236,0.1);
  }
  .hint{
    font-size:12px;
    color: rgba(157,187,174,0.7);
    margin-top:6px;
  }
  .tone-row{
    display:flex;
    gap:8px;
    flex-wrap:wrap;
    margin-top:8px;
  }
  .tone-chip{
    font-family:'Space Mono', monospace;
    font-size:12px;
    padding:7px 12px;
    border-radius:999px;
    border:1px solid var(--line);
    background: transparent;
    color: var(--muted);
    cursor:pointer;
    transition: all .15s;
  }
  .tone-chip.active{
    background: var(--accent);
    border-color: var(--accent);
    color: var(--bg-deep);
    font-weight:700;
  }
  button.cta{
    width:100%;
    margin-top:26px;
    background: var(--accent-2);
    color: var(--paper);
    border:none;
    border-radius:12px;
    padding:15px 20px;
    font-family:'Fredoka', sans-serif;
    font-weight:600;
    font-size:16px;
    cursor:pointer;
    display:flex;
    align-items:center;
    justify-content:center;
    gap:10px;
    transition: transform .12s, box-shadow .12s, opacity .12s;
    box-shadow: 0 8px 20px -8px rgba(232,92,74,0.7);
  }
  button.cta:hover{ transform: translateY(-1px); }
  button.cta:active{ transform: translateY(0px); }
  button.cta:disabled{ opacity:0.6; cursor:default; transform:none; }
  .spinner{
    width:16px; height:16px;
    border-radius:50%;
    border:2px solid rgba(251,246,236,0.4);
    border-top-color: var(--paper);
    animation: spin .7s linear infinite;
    display:none;
  }
  .spinner.show{ display:inline-block; }
  @keyframes spin{ to{ transform: rotate(360deg); } }
  .error-msg{
    margin-top:12px;
    font-size:13px;
    color: var(--accent);
    display:none;
  }
  .error-msg.show{ display:block; }

  /* ---- Nota (receipt) result panel ---- */
  .nota-slot{
    position:relative;
    padding-bottom: 22px;
  }
  .nota{
    background: var(--paper);
    color: var(--ink);
    border-radius: 4px 4px 0 0;
    padding: 30px 26px 26px;
    position:relative;
    box-shadow: 0 30px 60px -25px rgba(0,0,0,0.5);
    min-height: 360px;
    display:flex;
    flex-direction:column;
  }
  .nota::after{
    content:"";
    position:absolute;
    left:0; right:0; bottom:-14px;
    height:20px;
    background:
      linear-gradient(-45deg, var(--paper) 8px, transparent 0),
      linear-gradient(45deg, var(--paper) 8px, transparent 0);
    background-size: 16px 20px;
    background-repeat: repeat-x;
    background-position: bottom;
  }
  .nota-head{
    text-align:center;
    border-bottom: 1px dashed rgba(27,43,39,0.3);
    padding-bottom:14px;
    margin-bottom:16px;
  }
  .nota-head .store{
    font-family:'Fredoka', sans-serif;
    font-weight:700;
    font-size:19px;
    letter-spacing:0.02em;
  }
  .nota-head .meta{
    font-family:'Space Mono', monospace;
    font-size:11px;
    color:#6b7a74;
    margin-top:4px;
  }
  .nota-body{
    flex:1;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .nota-placeholder{
    text-align:center;
    color:#8a9691;
    font-size:14px;
    padding: 20px 10px;
  }
  .nota-placeholder .big{
    font-size:34px;
    display:block;
    margin-bottom:10px;
  }
  .caption-text{
    font-family:'Plus Jakarta Sans', sans-serif;
    font-size:16px;
    line-height:1.65;
    white-space:pre-wrap;
    width:100%;
  }
  .nota-foot{
    border-top: 1px dashed rgba(27,43,39,0.3);
    margin-top:16px;
    padding-top:12px;
    display:flex;
    justify-content:space-between;
    align-items:center;
    font-family:'Space Mono', monospace;
    font-size:11px;
    color:#6b7a74;
  }
  .stamp-btn{
    position:absolute;
    top:-18px; right:20px;
    width:74px; height:74px;
    border-radius:50%;
    border: 2px dashed var(--accent-2);
    background: rgba(232,92,74,0.08);
    color: var(--accent-2);
    font-family:'Fredoka', sans-serif;
    font-weight:600;
    font-size:11px;
    letter-spacing:0.03em;
    display:flex;
    align-items:center;
    justify-content:center;
    text-align:center;
    line-height:1.2;
    cursor:pointer;
    transform: rotate(8deg);
    transition: transform .15s, background .15s;
    z-index: 5;
  }
  .stamp-btn:hover{ transform: rotate(0deg) scale(1.05); }
  .stamp-btn.copied{
    background: var(--accent-2);
    color: var(--paper);
  }
  .stamp-btn:disabled{
    opacity:0.35;
    cursor:default;
  }
  footer{
    text-align:center;
    margin-top:40px;
    font-size:12px;
    color: rgba(157,187,174,0.6);
  }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <div class="eyebrow">UMKM Toolkit</div>
    <h1>Nota <span>AI</span> — Caption Jualan</h1>
    <p>Isi detail produkmu, dan biarkan AI menuliskan caption jualan yang menarik lengkap dengan emoji dalam hitungan detik.</p>
  </header>

  <div class="grid">
    <!-- KIOS: INPUT PANEL -->
    <div class="kios">
      <span class="kios-tag">📝 Isi Data</span>

      <label for="kodeAkses">🔒 Kode Akses</label>
      <input type="text" id="kodeAkses" placeholder="Masukkan kode akses yang kamu terima">
      <div class="hint">Belum punya kode? Hubungi penyedia layanan ini untuk mendapatkannya.</div>

      <label for="nama">Nama Produk</label>
      <input type="text" id="nama" placeholder="Contoh: Keripik Singkong Balado Pedas">

      <label for="keunggulan">Keunggulan Produk</label>
      <textarea id="keunggulan" placeholder="Contoh: renyah tahan lama, tanpa pengawet, pedasnya nampol, cocok buat cemilan nonton"></textarea>
      <div class="hint">Tulis beberapa poin, dipisah koma. Semakin detail, semakin ciamik hasilnya.</div>

      <label>Gaya Caption</label>
      <div class="tone-row" id="toneRow">
        <button type="button" class="tone-chip active" data-tone="ceria dan enerjik">Ceria</button>
        <button type="button" class="tone-chip" data-tone="santai dan akrab ala warung">Santai</button>
        <button type="button" class="tone-chip" data-tone="elegan dan meyakinkan">Elegan</button>
        <button type="button" class="tone-chip" data-tone="lucu dan bikin gemes">Lucu</button>
      </div>

      <button class="cta" id="genBtn">
        <span class="spinner" id="spinner"></span>
        <span id="btnLabel">✍️ Buat Caption</span>
      </button>
      <div class="error-msg" id="errMsg"></div>
    </div>

    <!-- NOTA: RESULT PANEL -->
    <div class="nota-slot">
      <div class="nota">
        <button class="stamp-btn" id="copyBtn" disabled>Salin Caption</button>
        <div class="nota-head">
          <div class="store">NOTA CAPTION</div>
          <div class="meta" id="notaMeta">— / — / ——— · No. 0000</div>
        </div>
        <div class="nota-body" id="notaBody">
          <div class="nota-placeholder">
            <span class="big">🧾</span>
            Caption kamu akan tercetak di sini.<br>Isi form di sebelah, lalu tekan "Buat Caption".
          </div>
        </div>
        <div class="nota-foot">
          <span>Nota AI</span>
          <span>terima kasih 🙏</span>
        </div>
      </div>
    </div>
  </div>

  <footer>Dibuat dengan Nota AI · hasil caption bisa berbeda setiap kali digenerate</footer>
</div>

<script>
let selectedTone = "ceria dan enerjik";
let orderNo = Math.floor(1000 + Math.random()*8999);

document.querySelectorAll('.tone-chip').forEach(chip=>{
  chip.addEventListener('click', ()=>{
    document.querySelectorAll('.tone-chip').forEach(c=>c.classList.remove('active'));
    chip.classList.add('active');
    selectedTone = chip.dataset.tone;
  });
});

const genBtn = document.getElementById('genBtn');
const spinner = document.getElementById('spinner');
const btnLabel = document.getElementById('btnLabel');
const errMsg = document.getElementById('errMsg');
const notaBody = document.getElementById('notaBody');
const notaMeta = document.getElementById('notaMeta');
const copyBtn = document.getElementById('copyBtn');

function setLoading(isLoading){
  genBtn.disabled = isLoading;
  spinner.classList.toggle('show', isLoading);
  btnLabel.textContent = isLoading ? "Sedang meracik..." : "✍️ Buat Caption";
}

function showError(msg){
  errMsg.textContent = msg;
  errMsg.classList.add('show');
}
function clearError(){
  errMsg.classList.remove('show');
  errMsg.textContent = '';
}

// Auto-isi kode akses kalau sudah pernah dimasukkan sebelumnya
const kodeInput = document.getElementById('kodeAkses');
const savedKode = localStorage.getItem('notaAiKodeAkses');
if(savedKode){ kodeInput.value = savedKode; }

genBtn.addEventListener('click', async ()=>{
  clearError();
  const nama = document.getElementById('nama').value.trim();
  const keunggulan = document.getElementById('keunggulan').value.trim();
  const kode = document.getElementById('kodeAkses').value.trim();

  if(!kode){
    showError("🔒 Masukkan kode akses dulu, ya.");
    return;
  }
  if(!nama || !keunggulan){
    showError("❗ Isi dulu nama produk dan keunggulannya, ya.");
    return;
  }

  setLoading(true);
  copyBtn.disabled = true;

  const prompt = `Kamu adalah copywriter marketing media sosial berbahasa Indonesia yang ahli membuat caption jualan yang menarik untuk UMKM.

Buatkan SATU caption jualan untuk produk berikut:
- Nama produk: ${nama}
- Keunggulan produk: ${keunggulan}
- Gaya bahasa: ${selectedTone}

Ketentuan caption:
- Gunakan bahasa Indonesia sehari-hari yang natural, bukan bahasa baku kaku.
- Sisipkan emoji yang relevan di beberapa bagian (jangan berlebihan, secukupnya saja).
- Sertakan hook pembuka yang menarik perhatian di baris pertama.
- Jelaskan keunggulan produk dengan singkat dan meyakinkan.
- Tutup dengan call-to-action yang jelas (misalnya ajakan order/DM/checkout).
- Sertakan 3-5 hashtag relevan di baris paling akhir.
- Panjang caption sekitar 60-120 kata.
- JANGAN gunakan tanda kutip di awal/akhir, JANGAN beri judul atau label apapun (seperti "Caption:"), langsung tulis isi captionnya saja.`;

  try{
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, kode })
    });

    const data = await response.json();

    if(!response.ok){
      throw new Error(data.error || ("Gagal menghubungi layanan AI (status " + response.status + ")"));
    }

    // Kode benar (server menerima) → simpan biar tidak perlu ketik ulang
    localStorage.setItem('notaAiKodeAkses', kode);
    const textBlock = (data.content || []).find(b => b.type === "text");
    const captionText = textBlock ? textBlock.text.trim() : "";

    if(!captionText){
      throw new Error("AI tidak mengembalikan hasil. Coba lagi ya.");
    }

    orderNo += 1;
    const now = new Date();
    const tgl = now.toLocaleDateString('id-ID', { day:'2-digit', month:'2-digit', year:'numeric' });
    notaMeta.textContent = `${tgl} · No. ${orderNo}`;

    notaBody.innerHTML = '';
    const p = document.createElement('div');
    p.className = 'caption-text';
    p.textContent = captionText;
    notaBody.appendChild(p);

    copyBtn.disabled = false;
    copyBtn.dataset.text = captionText;
    copyBtn.textContent = "Salin Caption";
    copyBtn.classList.remove('copied');

  }catch(err){
    showError("⚠️ " + (err.message || "Terjadi kesalahan, coba lagi."));
  }finally{
    setLoading(false);
  }
});

copyBtn.addEventListener('click', async ()=>{
  const text = copyBtn.dataset.text || '';
  if(!text) return;
  try{
    await navigator.clipboard.writeText(text);
  }catch(e){
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
  }
  copyBtn.textContent = "Tersalin ✓";
  copyBtn.classList.add('copied');
  setTimeout(()=>{
    copyBtn.textContent = "Salin Caption";
    copyBtn.classList.remove('copied');
  }, 1800);
});
</script>
</body>
</html>
