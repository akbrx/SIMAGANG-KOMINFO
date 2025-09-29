export class TrackingView {
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
    const { id, status, catatan, logs } = statusData;

    let statusCardHTML = '';
    let statusClass = '';
    let statusIcon = '';

    // 1. Tentukan tampilan Kartu Status berdasarkan status akhir
    switch (status) {
        case 'Diterima':
            statusClass = 'status-diterima';
            statusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`;
            break;
        case 'Ditolak':
            statusClass = 'status-ditolak';
            statusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>`;
            break;
        default: // Untuk 'Diverifikasi' atau 'Diajukan'
            statusClass = 'status-proses';
            statusIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 8v4l3 3m6-3a9 9 0 1 1-18 0 9 9 0 0 1 18 0z"></path></svg>`;
            break;
    }

    statusCardHTML = `
        <div class="status-card ${statusClass}">
            <div class="status-icon">${statusIcon}</div>
            <div class="status-details">
                <h4>${status}</h4>
                <p>${catatan}</p>
            </div>
        </div>
    `;

    // 2. Buat Timeline Proses
    const steps = ['Diajukan', 'Diverifikasi', 'Diterima'];
    // Jika ditolak, timeline hanya sampai 'Diverifikasi'
    const finalStepIndex = logs.length - 1;

    let timelineHTML = `<div class="status-timeline">`;
    steps.forEach((step, index) => {
        // Jangan tampilkan step 'Diterima' jika statusnya 'Ditolak'
        if (status === 'Ditolak' && step === 'Diterima') return;

        let statusClass = '';
        const log = logs.find(l => l.status === step);

        if (log) {
            statusClass = (status === 'Ditolak' && index === finalStepIndex) ? 'active-rejected' : 'completed';
        }
        if (status !== 'Ditolak' && status === step) {
            statusClass = 'active';
        }
        
        timelineHTML += `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${step}</h4>
                    <p>${log ? log.timestamp : ''}</p>
                </div>
            </div>
        `;
    });
    timelineHTML += '</div>';

    // 3. Gabungkan dan tampilkan hasilnya
    resultContainer.innerHTML = statusCardHTML + timelineHTML;
    resultContainer.style.display = 'block';
}

    // Fungsi untuk menampilkan error
    displayError(message) {
        const resultContainer = document.getElementById('tracking-result');
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
        resultContainer.style.display = 'block';
    }
}