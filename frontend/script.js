const animalEmojis = {
  'Fare': '🐭',
  'Öküz': '🐮',
  'Kaplan': '🐯',
  'Tavşan': '🐰',
  'Ejderha': '🐲',
  'Yılan': '🐍',
  'At': '🐴',
  'Keçi': '🐐',
  'Maymun': '🐵',
  'Horoz': '🐔',
  'Köpek': '🐶',
  'Domuz': '🐷'
};

const loadingHTML = `<div style="text-align:center;margin-top:20px;"><span class="loader"></span> Hesaplanıyor...</div>`;

// Loader animasyonu ekle
const style = document.createElement('style');
style.innerHTML = `
.loader {
  border: 4px solid #f3f3f3;
  border-top: 4px solid #6c47a6;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  animation: spin 1s linear infinite;
  display: inline-block;
  vertical-align: middle;
}
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}`;
document.head.appendChild(style);

// Basit markdown'dan HTML'e çevirici
function markdownToHtml(md) {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
    .replace(/\*(.*?)\*/gim, '<i>$1</i>')
    .replace(/\n\n/g, '<br><br>')
    .replace(/\n/g, '<br>');
}


document.getElementById('astro-form').addEventListener('submit', async function(e) {
  e.preventDefault();
  const day = document.getElementById('day').value;
  const month = document.getElementById('month').value;
  const year = document.getElementById('year').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = loadingHTML;

  try {
    const response = await fetch('http://localhost:3001/chinese-astrology', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ day, month, year })
    });
    const data = await response.json();
    if (data.error) {
      resultDiv.innerHTML = `<div style='color:#b00020;font-weight:bold;margin-top:18px;'>${data.error}</div>`;
    } else {
      const emoji = animalEmojis[data.animal] || '';
      const monthAnimalEmoji = animalEmojis[data.monthAnimal] || '';
      resultDiv.innerHTML = `
        <div class="result-card">
          <div style="font-size:1.2em;margin-bottom:8px;"><span class="animal-emoji">${emoji}</span><b>${data.animal}</b> yılı, <b>${data.element}</b> elementi</div>
          <div><b>Yin/Yang:</b> ${data.yinYang || '-'}</div>
          <div><b>Ay Hayvanı:</b> <span class="animal-emoji">${monthAnimalEmoji}</span> ${data.monthAnimal}</div>
          <div><b>Gün Elementi:</b> ${data.dayElement}</div>
          <div><b>Yıl:</b> ${data.year}</div>
          <div><b>Ay:</b> ${data.month}</div>
          <div><b>Gün:</b> ${data.day}</div>
          <div><b>Uyumlu Burçlar:</b> ${data.uyumlu && data.uyumlu.length ? data.uyumlu.join(', ') : '-'}</div>
          <div><b>Zıt Burçlar:</b> ${data.zit && data.zit.length ? data.zit.join(', ') : '-'}</div>
          <div><b>Şanslı Renkler:</b> ${data.luck?.renk || '-'}</div>
          <div><b>Şanslı Günler:</b> ${data.luck?.gun || '-'}</div>
          <div><b>Şanslı Yönler:</b> ${data.luck?.yon || '-'}</div>
          ${data.earlyYearWarning ? `<div style='color:#b00020;font-weight:bold;margin-top:10px;'>${data.earlyYearWarning}</div>` : ''}
          ${data.altAnimal ? `<div><b>Alternatif Burç:</b> ${data.altAnimal} (${data.altElement})</div>` : ''}
          <div style="margin-top:10px;"><b>Yorum:</b><br><div style='white-space:normal;'>${markdownToHtml(data.comment)}</div></div>
        </div>
      `;
    }
  } catch (err) {
    resultDiv.innerHTML = `<div style='color:#b00020;font-weight:bold;margin-top:18px;'>Sunucuya erişilemiyor.</div>`;
  }
});
