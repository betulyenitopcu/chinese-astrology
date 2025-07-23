const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

app.post('/test-gemini', async (req, res, next) => {
  try {
    const prompt = req.body.prompt || 'Bana kısa bir motivasyon cümlesi yaz.';
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        }
      }
    );
    const geminiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yanıt alınamadı.';
    res.json({ result: geminiText });
  } catch (error) {
    next(error);
  }
});

// Çin astrolojisi hayvanları ve elementleri
const animals = [
  'Fare', 'Öküz', 'Kaplan', 'Tavşan', 'Ejderha', 'Yılan',
  'At', 'Keçi', 'Maymun', 'Horoz', 'Köpek', 'Domuz'
];
const elements = ['Ahşap', 'Ateş', 'Toprak', 'Metal', 'Su'];

function getChineseZodiac(year) {
  const animal = animals[(year - 4) % 12];
  const element = elements[Math.floor(((year - 4) % 10) / 2)];
  return { animal, element };
}

// Ay hayvanı hesaplama (Çin takvimine göre yaklaşık, basit yöntem)
function getMonthAnimal(month) {
  const animals = [
    'Kaplan', 'Tavşan', 'Ejderha', 'Yılan', 'At', 'Keçi',
    'Maymun', 'Horoz', 'Köpek', 'Domuz', 'Fare', 'Öküz'
  ];
  // Çin yeni yılı Şubat ortası başlar, bu yüzden 1: Şubat, 2: Mart, ...
  return animals[(month - 2 + 12) % 12];
}

// Gün elementi hesaplama (Çin takvimine göre yaklaşık, basit yöntem)
function getDayElement(day) {
  const elements = ['Ahşap', 'Ahşap', 'Ateş', 'Ateş', 'Toprak', 'Toprak', 'Metal', 'Metal', 'Su', 'Su'];
  return elements[(day - 1) % 10];
}

// Yin/Yang hesaplama
function getYinYang(year) {
  if (!year) return null;
  const lastDigit = Number(String(year).slice(-1));
  return lastDigit % 2 === 0 ? 'Yin' : 'Yang';
}

// Uyumlu ve zıt burçlar
const compatibility = {
  'Fare': { uyumlu: ['Ejderha', 'Maymun', 'Öküz'], zit: ['At', 'Keçi'] },
  'Öküz': { uyumlu: ['Yılan', 'Horoz', 'Fare'], zit: ['Keçi', 'At'] },
  'Kaplan': { uyumlu: ['At', 'Köpek', 'Domuz'], zit: ['Maymun', 'Yılan'] },
  'Tavşan': { uyumlu: ['Keçi', 'Domuz', 'Köpek'], zit: ['Horoz', 'Ejderha'] },
  'Ejderha': { uyumlu: ['Fare', 'Maymun', 'Horoz'], zit: ['Köpek', 'Tavşan'] },
  'Yılan': { uyumlu: ['Öküz', 'Horoz', 'Maymun'], zit: ['Domuz', 'Kaplan'] },
  'At': { uyumlu: ['Kaplan', 'Keçi', 'Köpek'], zit: ['Fare', 'Öküz'] },
  'Keçi': { uyumlu: ['Tavşan', 'Domuz', 'At'], zit: ['Öküz', 'Fare'] },
  'Maymun': { uyumlu: ['Ejderha', 'Fare', 'Yılan'], zit: ['Kaplan', 'Domuz'] },
  'Horoz': { uyumlu: ['Öküz', 'Yılan', 'Ejderha'], zit: ['Tavşan', 'Köpek'] },
  'Köpek': { uyumlu: ['Kaplan', 'At', 'Tavşan'], zit: ['Ejderha', 'Horoz'] },
  'Domuz': { uyumlu: ['Tavşan', 'Keçi', 'Kaplan'], zit: ['Yılan', 'Maymun'] },
};

// Şanslı renk, gün ve yönler (örnek değerler)
const luckInfo = {
  'Fare':   { renk: 'Mavi, Altın, Yeşil', gun: '2, 3', yon: 'Kuzey' },
  'Öküz':   { renk: 'Beyaz, Sarı, Yeşil', gun: '13, 27', yon: 'Güneydoğu' },
  'Kaplan': { renk: 'Mavi, Gri, Turuncu', gun: '16, 27', yon: 'Doğu, Kuzey' },
  'Tavşan': { renk: 'Kırmızı, Pembe, Mor', gun: '26, 29', yon: 'Doğu, Güneydoğu' },
  'Ejderha':{ renk: 'Altın, Gümüş, Mor', gun: '1, 16', yon: 'Doğu, Güneydoğu' },
  'Yılan':  { renk: 'Kırmızı, Sarı, Siyah', gun: '1, 23', yon: 'Batı, Güneydoğu' },
  'At':     { renk: 'Kahverengi, Sarı, Mor', gun: '5, 20', yon: 'Güney' },
  'Keçi':   { renk: 'Yeşil, Kırmızı, Mor', gun: '7, 30', yon: 'Doğu, Güneybatı' },
  'Maymun': { renk: 'Beyaz, Mavi, Altın', gun: '4, 14', yon: 'Kuzey, Batı' },
  'Horoz':  { renk: 'Altın, Kahverengi, Sarı', gun: '5, 17', yon: 'Batı, Güneybatı' },
  'Köpek':  { renk: 'Kırmızı, Yeşil, Mor', gun: '3, 9', yon: 'Doğu, Kuzey' },
  'Domuz':  { renk: 'Sarı, Gri, Kahverengi', gun: '2, 7', yon: 'Doğu, Güney' },
};

// Çin yeni yılı başlangıcı (yaklaşık, her yıl değişir; burada 20 Şubat olarak alıyoruz)
function isBeforeChineseNewYear(day, month) {
  // Çin yeni yılı genellikle 20 Ocak - 20 Şubat arası başlar, burada 20 Şubat referans alınır
  return (month < 2) || (month === 2 && day < 20);
}

app.post('/chinese-astrology', async (req, res, next) => {
  let { year, month, day } = req.body;
  year = year ? Number(year) : null;
  month = month ? Number(month) : null;
  day = day ? Number(day) : null;
  if (!year || isNaN(year) || !month || isNaN(month) || !day || isNaN(day)) {
    return res.status(400).json({ error: 'Geçerli bir gün, ay ve yıl giriniz.' });
  }
  const result = getChineseZodiac(year);
  const monthAnimal = getMonthAnimal(month);
  const dayElement = getDayElement(day);
  const uyumlu = compatibility[result.animal]?.uyumlu || [];
  const zit = compatibility[result.animal]?.zit || [];
  const yinYang = getYinYang(year);
  const luck = luckInfo[result.animal] || {};

  // Çin yeni yılı öncesi doğanlar için alternatif burç/element
  let earlyYearWarning = null;
  let altAnimal = null;
  let altElement = null;
  if (isBeforeChineseNewYear(day, month)) {
    const alt = getChineseZodiac(year - 1);
    altAnimal = alt.animal;
    altElement = alt.element;
    earlyYearWarning = `Çin takvimine göre ${day}.${month}.${year} tarihi, Çin yeni yılı başlamadan önce olduğu için asıl burcunuz bir önceki yıl (${year - 1}) olan ${alt.animal} (${alt.element}) olabilir.`;
  }

  // Gemini API ile detaylı yorum al
  const prompt = `Kişinin doğum tarihi: ${day}.${month}.${year}. Çin astrolojisine göre bu kişinin hayvanı: ${result.animal}, elementi: ${result.element}, Yin/Yang: ${yinYang}. Doğum ayına göre ay hayvanı: ${monthAnimal}, doğum gününe göre gün elementi: ${dayElement}. Şanslı renkleri: ${luck.renk}, şanslı günleri: ${luck.gun}, şanslı yönleri: ${luck.yon}. Bu kişinin uyumlu burçları: ${uyumlu.join(', ')}, zıt burçları: ${zit.join(', ')}. ${earlyYearWarning ? earlyYearWarning : ''} Tüm bu bilgilere göre genel kişilik özellikleri, güçlü ve zayıf yönleri, bu yıl için kısa bir öngörü, Yin/Yang etkisi, şanslı renk/gün/yon ve uyumlu/zıt burçlarla ilişkiler hakkında başlıklar ve kısa paragraflar halinde açıklama ver.`;
  try {
    const response = await axios.post(
      GEMINI_API_URL,
      {
        contents: [{ parts: [{ text: prompt }] }]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-goog-api-key': GEMINI_API_KEY
        }
      }
    );
    const geminiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text || 'Yorum alınamadı.';
    res.json({
      animal: result.animal,
      element: result.element,
      yinYang,
      year,
      month,
      day,
      monthAnimal,
      dayElement,
      uyumlu,
      zit,
      luck,
      earlyYearWarning,
      altAnimal,
      altElement,
      comment: geminiText
    });
  } catch (error) {
    next(error);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Chinese Astrology API Server is running' });
});

app.get('/', (req, res) => {
  res.send('Chinese Astrology Backend Çalışıyor!');
});

// Genel hata yakalama middleware'i (en sona eklenmeli)
app.use((err, req, res, next) => {
  console.error('Hata:', err);
  res.status(500).json({ error: 'Sunucuda bir hata oluştu.', detay: err.message });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 