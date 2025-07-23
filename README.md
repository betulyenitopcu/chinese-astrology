# Çin Astrolojisi Hesaplama Uygulaması

Bu proje, doğum tarihinize göre Çin astrolojisine ait hayvan, element, Yin/Yang, şanslı renk/gün/yön ve detaylı kişilik analizi sunan tam kapsamlı bir web uygulamasıdır. Uygulama iki ana bileşenden oluşur: **Backend (Node.js/Express)** ve **Frontend (HTML/JS)**. Gemini API ile detaylı yorumlar sunar.

---

## Özellikler

- Doğum günü, ayı ve yılına göre Çin astrolojisi hesaplama
- Hayvan, element, Yin/Yang, ay hayvanı, gün elementi, uyumlu ve zıt burçlar
- Şanslı renkler, günler ve yönler
- Gemini API ile kişiye özel detaylı analiz ve öngörü
- Modern ve mobil uyumlu kullanıcı arayüzü
- Docker ile kolay kurulum ve dağıtım

---

## Kullanılan Teknolojiler

- **Backend:** Node.js, Express, Axios, dotenv, cors
- **Frontend:** HTML5, CSS (Milligram), Vanilla JS
- **API:** Google Gemini (Generative Language API)
- **Container:** Docker, Docker Compose

---

## Kurulum ve Çalıştırma

### 1. Gereksinimler
- [Docker](https://www.docker.com/) ve [Docker Compose](https://docs.docker.com/compose/) yüklü olmalı
- Google Gemini API anahtarınız olmalı ([API anahtarı alın](https://aistudio.google.com/app/apikey))

### 2. Ortam Değişkenleri (.env)

Backend klasöründe bir `.env` dosyası oluşturun ve aşağıdaki satırları ekleyin:

```env
GEMINI_API_KEY=buraya_kendi_gemini_api_anahtarınızı_yazın
PORT=3001
```

> Örnek dosya yolu: `backend/.env`

---

### 3. Docker ile Başlatma
Proje kök dizininde aşağıdaki komutu çalıştırın:

```
docker-compose -f backend/docker-compose.yml up --build
```

- Backend: [http://localhost:3001](http://localhost:3001)
- Frontend: [http://localhost:8080](http://localhost:8080)

### 4. Manuel (Docker'sız) Çalıştırma
#### Backend:
```bash
cd backend
npm install
node server.js
```
#### Frontend:
Basit bir HTTP sunucusu ile (örn. [http-server](https://www.npmjs.com/package/http-server))
```bash
cd frontend
npx http-server -p 8080
```

---

## API Kullanımı

### POST `/chinese-astrology`
Doğum tarihi ile Çin astrolojisi bilgisi ve detaylı yorum döner.

**Body:**
```json
{
  "day": 15,
  "month": 6,
  "year": 1995
}
```

**Yanıt:**
```json
{
  "animal": "Domuz",
  "element": "Ahşap",
  "yinYang": "Yin",
  "monthAnimal": "At",
  "dayElement": "Ateş",
  ...
  "comment": "...detaylı analiz..."
}
```

### POST `/test-gemini`
Serbest bir prompt ile Gemini API'den yanıt alır.

---

## Klasör Yapısı

```
chinese-astrology/
  backend/
    server.js         # Express API
    Dockerfile        # Backend Docker
    docker-compose.yml
    package.json
    .env              # (GİZLİ, paylaşmayın!)
  frontend/
    index.html        # Ana arayüz
    script.js         # Tüm JS mantığı
    Dockerfile        # Frontend Docker
```

---

## Notlar
- Gemini API anahtarı olmadan detaylı analiz alınamaz.
- `.env` dosyanızı asla paylaşmayın veya repoya eklemeyin.
- Frontend ve backend ayrı portlarda çalışır, CORS açıktır.
- Mobil ve masaüstü uyumludur.

---

