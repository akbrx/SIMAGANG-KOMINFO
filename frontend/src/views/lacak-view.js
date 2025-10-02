export class LacakView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
    this.app.innerHTML = `
        <div class="page-container">
            <div class="tracking-container">
                <h1>Lacak Surat Pengajuan Anda</h1>
                <p>Masukkan ID Pelacakan yang Anda dapatkan setelah mengajukan surat untuk melihat statusnya saat ini.</p>
                
                <form id="form-lacak" class="tracking-form-new">
                    <div class="input-wrapper">
                        <input type="text" id="tracking-id-input" placeholder="Ketik ID Pelacakan Anda di sini..." required>
                        <button type="submit" aria-label="Lacak">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                        </button>
                    </div>
                </form>
                <div id="tracking-result" class="tracking-result-container">
                
                </div>
            </div>
        </div>
    `;
}

    // Fungsi untuk menampilkan hasil status
    displayStatus(statusData) {
    const resultContainer = document.getElementById('tracking-result');
    // Memberi nilai default untuk logs jika tidak ada dari backend
    const { 
        id, status, catatan, logs = [],
        nama, instansi, jurusan, email 
    } = statusData;

    const submissionDetailsHTML = `
        <div class="submission-details">
            <h3>Detail Pengajuan</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nama</span>
                    <span class="detail-value">${nama || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Instansi Asal</span>
                    <span class="detail-value">${instansi || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Jurusan</span>
                    <span class="detail-value">${jurusan || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Email</span>
                    <span class="detail-value">${email || '-'}</span>
                </div>
            </div>
        </div>
    `;

    const statusMap = {
        'DIAJUKAN': {
            displayText: 'DIAJUKAN',
            message: 'Surat Anda telah kami terima dan sedang dalam antrian untuk diverifikasi.',
            cssClass: 'status-proses',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>`,
            timelineStep: 0 // Posisi di timeline
        },
        'DISPOSISI': {
        displayText: 'DISPOSISI',
            message: 'Surat Anda telah diverifikasi dan sedang dalam proses peninjauan oleh pimpinan.',
            cssClass: 'status-proses',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>`,
            timelineStep: 1 // Posisi di timeline
        },
        'DITERIMA': {
            displayText: 'DITERIMA',
            message: 'Selamat! Surat balasan telah dikirim ke email Anda. Silakan periksa folder inbox atau spam.',
            cssClass: 'status-diterima',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`,
            timelineStep: 2 // Posisi di timeline
        },
        'DITOLAK': {
            displayText: 'DITOLAK YAHAHA MAMPUS',
            message: 'Mohon maaf, pengajuan Anda belum dapat kami proses saat ini.',
            cssClass: 'status-ditolak',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`,
            timelineStep: 1 // Ditolak setelah ditinjau
        }
    };

    const currentStatusInfo = statusMap[status.toUpperCase()] || {
        displayText: status,
        message: 'Status dalam proses.',
        cssClass: 'status-proses',
        icon: '?',
        timelineStep: 0
    };

    const statusCardHTML = `
        <div class="status-card ${currentStatusInfo.cssClass}">
            <div class="status-icon">${currentStatusInfo.icon}</div>
            <div class="status-details">
                <h4>${currentStatusInfo.displayText}</h4>
                <p>${catatan || currentStatusInfo.message}</p>
            </div>
            <div class="status-spacer"></div>
        </div>
    `;

    const steps = ['DIAJUKAN', 'DISPOSISI', 'DITERIMA'];
    let timelineHTML = `<div class="status-timeline">`;
    const activeTimelineStep = currentStatusInfo.timelineStep;

    steps.forEach((step, index) => {
        // Jangan tampilkan step 'DITERIMA' jika statusnya 'DITOLAK'
        if (status.toUpperCase() === 'DITOLAK' && step === 'DITERIMA') return;

        let statusClass = '';
        // Cari log yang sesuai dengan langkah saat ini dari data backend
        const log = logs.find(l => l.status.toUpperCase() === step);
        
        // Tentukan apakah langkah ini sudah selesai, sedang aktif, atau belum
        if (index < activeTimelineStep) {
            statusClass = 'completed';
        } else if (index === activeTimelineStep) {
            statusClass = (status.toUpperCase() === 'DITOLAK') ? 'active-rejected' : 'active';
        }
        
        timelineHTML += `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${step.charAt(0).toUpperCase() + step.slice(1).toLowerCase()}</h4>
                    <p>${log ? log.timestamp : ''}</p> 
                </div>
            </div>
        `;
    });
    timelineHTML += '</div>';

    resultContainer.innerHTML = statusCardHTML + timelineHTML;
    resultContainer.style.display = 'block';
}       
    displayError(message) {
        const resultContainer = document.getElementById('tracking-result');
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
        resultContainer.style.display = 'block';
    }
}