# 👤 Dijital Gölgem: Verilerden Okunan Bir Sen

**Kişisel Sosyal Medya Mahremiyeti Risk Analizi Projesi**

Bu proje, bir Google Forms anketinden elde edilen katılımcı verilerini (`.xlsx` formatında) okuyarak otomatik olarak bir risk analizine dönüştüren ve interaktif bir web dashboard'u üzerinden görselleştiren bir sistemdir. Katılımcıların verdikleri cevaplara göre mahremiyet riskleri üç farklı kategoride değerlendirilir.

![Dijital Gölgem Dashboard](https://img.shields.io/badge/UI-Aydınlık_Tema_Cam_Tasarım-6366f1?style=for-the-badge)
![Python](https://img.shields.io/badge/Python-3.x-blue?style=for-the-badge&logo=python)
![HTML/CSS/JS](https://img.shields.io/badge/Frontend-HTML_|_CSS_|_JS-orange?style=for-the-badge)

---

## 🎯 Projenin Amacı
Sosyal medya kullanıcılarının günlük hayattaki çevrimiçi alışkanlıklarının **KVKK (Kişisel Verilerin Korunması Kanunu)** ve mahremiyet riskleri açısından değerlendirilmesi.

Anket soruları üç ana kategoriye ayrılmıştır:
1. 🛡️ **Sosyal Etkileşim ve Paylaşım Riskleri** (Soru 1-5)
2. 📍 **Kişisel Bilgi ve Konum Riskleri** (Soru 6-10)
3. 🔓 **Dijital İz ve Veri Sızıntısı Riskleri** (Soru 11-15)

---

## 📊 Risk Renklendirme Sistemi
Her kategori için (5 üzerinden "Evet" sayısına göre) farklı risk seviyeleri atanır. Premium arayüz tasarımı sayesinde renkler dinamik ve rastgele atanır:

| 🔴 Yüksek Risk | 🟡 Orta Risk | 🟢 Az Risk / Güvende |
|:---:|:---:|:---:|
| **4-5 Evet** | **3 Evet** | **0-2 Evet** |
| Kırmızı veya Siyah | Mavi veya Sarı | Yeşil |

*(Not: KVKK uyumluluğunu sağlamak ve mahremiyeti korumak amacıyla kişilerin ad-soyad bilgileri Python kodunda otomatik olarak kısaltılarak (örn: "Ca.. Ba.. So..") anonimleştirilir.)*

---

## 🚀 Kurulum ve Kullanım

### 1. Gereksinimler
- Bilgisayarınızda **Python 3** kurulu olmalıdır.
- Python `openpyxl` kütüphanesi gereklidir:
  ```bash
  pip install openpyxl
  ```

### 2. Verileri Güncelleme
Google Forms'dan indirdiğiniz veya projedeki **`.xlsx`** anket dosyasını ana dizine koyduktan sonra verileri derlemek için klasör içinde şu komutu çalıştırın:
```bash
python generate.py
```
Bu işlem `.xlsx` dosyasını okuyup web sitesi için gerekli olan `data.js` dosyasını oluşturur ve isimleri anonimleştirir.

### 3. Dashboard'u Çalıştırma
Aşağıdaki komut ile kendi bilgisayarınızda yerel bir sunucu başlatın:
```bash
python -m http.server 8080
```
Daha sonra tarayıcınızdan **`http://localhost:8080`** adresine giderek risk analizi sonuçlarını interaktif bir şekilde inceleyebilirsiniz!

---

## 📂 Dosya Yapısı

- `generate.py` — Excel dosyasını okuyup `data.js` üretir.
- `app.js` — Verileri işler ve risk algoritmasını HTML'e yansıtır.
- `index.html` — Ana rapor sayfası.
- `style.css` — Modern, Premium "Glassmorphism" tasarımı ve CSS animasyonları.
- `data.js` — Otomatik üretilen katılımcı ham veri dosyası.
