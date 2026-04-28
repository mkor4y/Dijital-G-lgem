/**
 * Dijital Gölgem — Sosyal Medya Mahremiyeti Risk Analizi
 * data.js'den gelen SURVEY_DATA'yı okuyup sonuçları gösterir.
 *
 * Kategoriler (5'er soru):
 *   Kategori 1 (Soru 1-5): Sosyal Etkileşim ve Paylaşım Riskleri
 *   Kategori 2 (Soru 6-10): Kişisel Bilgi ve Konum Riskleri
 *   Kategori 3 (Soru 11-15): Dijital İz ve Veri Sızıntısı Riskleri
 *
 * Risk Seviyeleri:
 *   4-5 Evet → Yüksek Risk (Kırmızı/Siyah)
 *   3 Evet   → Orta Risk (Mavi/Sarı)
 *   1-2 Evet → Az Risk (Beyaz/Yeşil)
 *   0 Evet   → Güvende
 */

// ===== DOM Elements =====
const resultsGrid = document.getElementById('resultsGrid');
const statsBar = document.getElementById('statsBar');
const chartContainer = document.getElementById('chartContainer');

// ===== Category Definitions =====
const CATEGORIES = [
    {
        name: 'Kategori 1',
        title: 'Sosyal Etkileşim ve Paylaşım Riskleri',
        icon: '🛡️',
        questions: [0, 1, 2, 3, 4]
    },
    {
        name: 'Kategori 2',
        title: 'Kişisel Bilgi ve Konum Riskleri',
        icon: '📍',
        questions: [5, 6, 7, 8, 9]
    },
    {
        name: 'Kategori 3',
        title: 'Dijital İz ve Veri Sızıntısı Riskleri',
        icon: '🔓',
        questions: [10, 11, 12, 13, 14]
    }
];

// ===== Risk Level Definitions =====
// Her kategori için rastgele bir renk varyantı seçilir
function getRiskLevel(yesCount) {
    const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (yesCount >= 4) {
        // Yüksek Risk: Kırmızı veya Siyah
        const variant = pick(['high-red', 'high-black']);
        return { level: 'high', variant, label: 'Yüksek Risk', emoji: '🔴' };
    }
    if (yesCount === 3) {
        // Orta Risk: Mavi veya Sarı
        const variant = pick(['medium-blue', 'medium-yellow']);
        return { level: 'medium', variant, label: 'Orta Risk', emoji: '🟡' };
    }
    if (yesCount >= 1) {
        // Az Risk: Yeşil
        return { level: 'low', variant: 'low-green', label: 'Az Risk', emoji: '🟢' };
    }
    return { level: 'low', variant: 'low-green', label: 'Az Risk', emoji: '🟢' };
}

// ===== Background Particles =====
function createParticles() {
    const container = document.getElementById('bgParticles');
    const colors = ['#6366f1', '#a855f7', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 30; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 4 + 2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particle.style.cssText = `
            width: ${size}px; height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 15}s;
            animation-delay: ${Math.random() * 10}s;
        `;
        container.appendChild(particle);
    }
}

// ===== Analyze Data =====
function analyzeData(rawData) {
    return rawData.map(person => {
        const categories = CATEGORIES.map(cat => {
            const catAnswers = cat.questions.map(qIdx => person.answers[qIdx]);
            const yesCount = catAnswers.filter(a => a).length;
            return {
                ...cat,
                answers: catAnswers,
                yesCount,
                risk: getRiskLevel(yesCount),
                questionNumbers: cat.questions.map(q => q + 1)
            };
        });
        return {
            name: person.name,
            timestamp: person.timestamp,
            answers: person.answers,
            categories,
            totalYes: person.answers.filter(a => a).length
        };
    });
}

// ===== Render Stats =====
function renderStats(participants) {
    const total = participants.length;
    const avgYes = (participants.reduce((s, p) => s + p.totalYes, 0) / total).toFixed(1);
    let highCount = 0, mediumCount = 0, lowCount = 0, safeCount = 0;
    participants.forEach(p => {
        p.categories.forEach(cat => {
            if (cat.risk.level === 'high') highCount++;
            else if (cat.risk.level === 'medium') mediumCount++;
            else if (cat.risk.level === 'low') lowCount++;
            else safeCount++;
        });
    });
    statsBar.innerHTML = `
        <div class="stat-card">
            <div class="stat-value">${total}</div>
            <div class="stat-label">Katılımcı</div>
        </div>
        <div class="stat-card">
            <div class="stat-value">${avgYes}</div>
            <div class="stat-label">Ort. Evet Sayısı</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="background:linear-gradient(135deg,#ef4444,#dc2626);-webkit-background-clip:text;">${highCount}</div>
            <div class="stat-label">Yüksek Risk</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="background:linear-gradient(135deg,#3b82f6,#2563eb);-webkit-background-clip:text;">${mediumCount}</div>
            <div class="stat-label">Orta Risk</div>
        </div>
        <div class="stat-card">
            <div class="stat-value" style="background:linear-gradient(135deg,#22c55e,#16a34a);-webkit-background-clip:text;">${lowCount + safeCount}</div>
            <div class="stat-label">Düşük / Güvende</div>
        </div>
    `;
}

// ===== Create Person Card =====
function createPersonCard(person, index) {
    const card = document.createElement('div');
    card.className = 'person-card';
    card.style.animationDelay = `${index * 0.15}s`;

    const nameParts = person.name.split(' ');
    const initials = nameParts.length >= 2
        ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
        : person.name.substring(0, 2).toUpperCase();

    let dateStr = '';
    if (person.timestamp) {
        try {
            const d = new Date(person.timestamp);
            if (!isNaN(d.getTime())) {
                dateStr = d.toLocaleDateString('tr-TR', {
                    day: '2-digit', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                });
            }
        } catch (e) {
            dateStr = person.timestamp;
        }
    }

    let totalColor = '#22c55e';
    if (person.totalYes >= 10) totalColor = '#ef4444';
    else if (person.totalYes >= 7) totalColor = '#f59e0b';
    else if (person.totalYes >= 4) totalColor = '#3b82f6';

    card.innerHTML = `
        <div class="person-header">
            <div class="person-info">
                <div class="person-avatar">${initials}</div>
                <div>
                    <div class="person-name">${escapeHtml(person.name)}</div>
                    ${dateStr ? `<div class="person-date">${dateStr}</div>` : ''}
                </div>
            </div>
            <div class="person-total">
                <div class="person-total-value" style="color:${totalColor}">${person.totalYes}/15</div>
                <div class="person-total-label">Toplam Evet</div>
            </div>
        </div>
        <div class="person-categories">
            ${person.categories.map((cat, i) => createCategoryResult(cat, i)).join('')}
        </div>
    `;
    return card;
}

// ===== Create Category Result =====
function createCategoryResult(cat) {
    const progressWidth = (cat.yesCount / 5) * 100;
    const questionsHTML = cat.questionNumbers.map((qNum, i) => `
        <div class="question-row">
            <span class="question-num">Soru ${qNum}</span>
            <span class="${cat.answers[i] ? 'answer-yes' : 'answer-no'}">${cat.answers[i] ? 'Evet' : 'Hayır'}</span>
        </div>
    `).join('');

    return `
        <div class="category-result risk-${cat.risk.variant}">
            <div class="cat-result-header">
                <span class="cat-result-title">${cat.name}</span>
                <span class="cat-result-score">${cat.yesCount}/5</span>
            </div>
            <div class="risk-badge">
                <span class="risk-badge-dot"></span>
                ${cat.risk.label}
            </div>
            <div class="risk-progress">
                <div class="risk-progress-fill" data-width="${progressWidth}%"></div>
            </div>
            <div class="question-details">
                ${questionsHTML}
            </div>
        </div>
    `;
}

// ===== Render Chart =====
function renderChart(participants) {
    chartContainer.innerHTML = '';
    participants.forEach(person => {
        const donut = document.createElement('div');
        donut.className = 'donut-chart';
        const radius = 42;
        const circumference = 2 * Math.PI * radius;
        const percentage = (person.totalYes / 15) * 100;
        const dashArray = (percentage / 100) * circumference;

        let strokeColor = '#22c55e';
        if (person.totalYes >= 10) strokeColor = '#ef4444';
        else if (person.totalYes >= 7) strokeColor = '#f59e0b';
        else if (person.totalYes >= 4) strokeColor = '#3b82f6';

        donut.innerHTML = `
            <svg class="donut-svg" viewBox="0 0 100 100">
                <circle class="donut-ring" cx="50" cy="50" r="${radius}"/>
                <circle class="donut-segment" cx="50" cy="50" r="${radius}"
                    stroke="${strokeColor}"
                    stroke-dasharray="0 ${circumference}"
                    data-dasharray="${dashArray} ${circumference - dashArray}"/>
                <text x="50" y="50" text-anchor="middle" dominant-baseline="central"
                    fill="${strokeColor}" font-size="16" font-weight="800"
                    font-family="JetBrains Mono, monospace"
                    transform="rotate(90, 50, 50)">
                    ${person.totalYes}
                </text>
            </svg>
            <div class="donut-label">${escapeHtml(person.name)}</div>
        `;
        chartContainer.appendChild(donut);
    });

    setTimeout(() => {
        document.querySelectorAll('.donut-segment').forEach(seg => {
            seg.style.strokeDasharray = seg.dataset.dasharray;
        });
    }, 500);
}

// ===== Escape HTML =====
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ===== INIT: Sayfa yüklendiğinde direkt çalış =====
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    if (typeof SURVEY_DATA === 'undefined' || !SURVEY_DATA.length) {
        resultsGrid.innerHTML = `
            <div style="text-align:center;padding:60px 20px;">
                <p style="font-size:1.2rem;color:#ef4444;margin-bottom:12px;">⚠️ Veri bulunamadı!</p>
                <p style="color:#a0a0b8;">Lütfen önce <code style="background:rgba(99,102,241,0.15);padding:2px 8px;border-radius:4px;color:#818cf8;">python generate.py</code> komutunu çalıştırın.</p>
            </div>
        `;
        return;
    }

    const participants = analyzeData(SURVEY_DATA);
    renderStats(participants);

    participants.forEach((person, i) => {
        resultsGrid.appendChild(createPersonCard(person, i));
    });

    // Animate progress bars
    requestAnimationFrame(() => {
        setTimeout(() => {
            document.querySelectorAll('.risk-progress-fill').forEach(bar => {
                bar.style.width = bar.dataset.width;
            });
        }, 300);
    });

    renderChart(participants);
});
