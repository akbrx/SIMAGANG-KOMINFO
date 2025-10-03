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
    
    // 1. Ambil semua data dari backend dengan nama yang BENAR
    const { 
        status, catatan, 
        student_name: nama,      // Ambil 'student_name' simpan sebagai 'nama'
        asal_sekolah: instansi,  // Ambil 'asal_sekolah' simpan sebagai 'instansi'
        jurusan,
        student_email: email,    // Ambil 'student_email' simpan sebagai 'email'
        created_at,              // Ambil tanggal diajukan
        processed_at,            // Ambil tanggal disposisi
        accepted_at,             // Ambil tanggal diterima (jika ada)
        rejected_at              // Ambil tanggal ditolak (jika ada)
    } = statusData;

    // Helper function untuk format tanggal agar lebih mudah dibaca
    const formatTanggal = (tanggal) => {
        if (!tanggal) return '';
        // Cek jika formatnya sudah '02 Oct 2025 17:04', langsung kembalikan
        if (typeof tanggal === 'string' && tanggal.includes(' ')) {
            return tanggal;
        }
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(tanggal).toLocaleDateString('id-ID', options);
    };

    // 2. Buat blok HTML untuk detail pengajuan
    const submissionDetailsHTML = `
        <div class="submission-details">
            <h3>Detail Pengaju</h3>
            <div class="detail-grid">
                <div class="detail-item">
                    <span class="detail-label">Nama</span>
                    <span class="detail-value">${nama || '-'}</span>
                </div>
                <div class="detail-item">
                    <span class="detail-label">Asal Sekolah/Instansi</span>
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

    // 3. Buat Kartu Status (tidak berubah)
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
    const currentStatusInfo = statusMap[status.toUpperCase()] || { /* ... */ };
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

    // 4. Buat Timeline Proses dengan Timestamp dari data yang benar
    const steps = ['DIAJUKAN', 'DISPOSISI', 'DITERIMA'];
    let timelineHTML = `<div class="status-timeline">`;
    const finalStatus = status.toUpperCase();

    steps.forEach((step) => {
        if (finalStatus === 'DITOLAK' && step === 'DITERIMA') return;

        let timestamp = '';
        let statusClass = '';

        switch (step) {
            case 'DIAJUKAN':
                timestamp = formatTanggal(created_at);
                break;
            case 'DISPOSISI':
                timestamp = formatTanggal(processed_at);
                break;
            case 'DITERIMA':
                timestamp = formatTanggal(accepted_at);
                break;
        }

        if (timestamp) statusClass = 'completed';
        if (finalStatus === step) statusClass = 'active';
        if (finalStatus === 'DITOLAK' && step === 'DISPOSISI') {
            statusClass = 'active-rejected';
            timestamp = formatTanggal(rejected_at || processed_at);
        }
        
        timelineHTML += `
            <div class="timeline-item ${statusClass}">
                <div class="timeline-dot"></div>
                <div class="timeline-content">
                    <h4>${step.charAt(0).toUpperCase() + step.slice(1).toLowerCase()}</h4>
                    <p>${timestamp}</p>
                </div>
            </div>
        `;
    });
    timelineHTML += '</div>';

    // 5. Gabungkan semua bagian dan tampilkan
    resultContainer.innerHTML = submissionDetailsHTML + statusCardHTML + timelineHTML;
    resultContainer.style.display = 'block';
}       
    displayError(message) {
        const resultContainer = document.getElementById('tracking-result');
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
        resultContainer.style.display = 'block';
    }
}