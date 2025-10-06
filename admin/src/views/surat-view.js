// src/views/surat-view.js

// --- Helper Functions untuk Tampilan (pindahan dari controller) ---
const formatDate = (dateString) => {
    if (!dateString) return 'Tanggal tidak tersedia';
    try {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Mencoba format yang lebih robust untuk tanggal dari Laravel
        return new Date(dateString).toLocaleDateString('id-ID', options);
    } catch (e) {
        return dateString;
    }
};
const getFileName = (url) => url ? url.substring(url.lastIndexOf('/') + 1) : 'Tidak ada file';
const getStatusClass = (status) => {
    if (status === 'DITERIMA') return 'status-approved';
    if (status === 'DITOLAK') return 'status-rejected';
    if (status === 'DISPOSISI') return 'status-disposition'; // <-- BARU
    if (status === 'DIAJUKAN') return 'status-submitted';   // <-- BARU
    return 'status-default'; // <-- Fallback jika ada status lain
};


// FUNGSI 1: Membuat kerangka statis halaman
function render() {
    return `
        <div class="page-container">
            <h1>Daftar Pengajuan Surat Magang</h1>
            <div id="cardGrid" class="card-grid-surat"></div>
        </div>
        <div id="detailModal" class="modal-overlay">
          <div class="modal-content">
            <button id="closeModalBtn" class="modal-close-btn">&times;</button>
            <h2>Detail Pengajuan</h2>
            <div id="modalBody" class="detail-grid"></div>
          </div>
        </div>
    `;
}

// FUNGSI 2: Mengisi kerangka dengan kartu-kartu dinamis (pindahan dari controller)
// --- Fungsi Utama untuk Merender Kartu ---
function renderCards(cardGrid, daftarPengajuan) {
    if (!daftarPengajuan || daftarPengajuan.length === 0) {
        cardGrid.innerHTML = `<p class="info-message">Belum ada data pengajuan.</p>`;
        return;
    }
    cardGrid.innerHTML = '';
    daftarPengajuan.forEach(submission => {
        const cardElement = document.createElement('div');
        cardElement.className = 'card-surat';
        cardElement.innerHTML = `
            <div class="card-header-surat">
                <h3 class="student-name">${submission.student?.nama ?? 'Data Mahasiswa Hilang'}</h3>
                </div>
            <div class="card-body-surat">
                <div class="info-row">
                    <strong>Status:</strong>
                    <span class="status-badge ${getStatusClass(submission.status)}">${submission.status}</span>
                </div>
                
                <div class="info-row">
                    <strong>Diajukan pada:</strong>
                    <span>${formatDate(submission.created_at)}</span>
                </div>
                <div class="info-row file-info">
                    <strong>Surat Permohonan:</strong>
                    <a href="#" target="_blank" class="file-link">📄 ${submission.original_filename}</a>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn btn-primary" data-id="${submission.id}">Detail</button>
                <div class="select-wrapper">
                    <select class="select-status" data-id="${submission.id}">
                        <option value="DIAJUKAN" ${submission.status === 'DIAJUKAN' ? 'selected' : ''}>DIAJUKAN</option>
                        <option value="DISPOSISI" ${submission.status === 'DISPOSISI' ? 'selected' : ''}>DISPOSISI</option>
                        <option value="DITERIMA" ${submission.status === 'DITERIMA' ? 'selected' : ''}>DITERIMA</option>
                        <option value="DITOLAK" ${submission.status === 'DITOLAK' ? 'selected' : ''}>DITOLAK</option>
                    </select>
                </div>
            </div>
        `;
        cardGrid.appendChild(cardElement);
    });
}

// FUNGSI 3: Mengisi konten modal
function renderModalContent(modalBodyElement, submission) {
    if (!submission) return;
    // Gunakan ?. dan ?? untuk setiap data student agar aman
    const nama = submission.student?.nama ?? 'N/A';
    const instansi = submission.student?.asal_sekolah ?? 'N/A';
    const jurusan = submission.student?.jurusan ?? 'N/A';
    const email = submission.student?.email ?? 'N/A';
    const nomor_telepon = submission.student?.nomor_telepon ?? 'N/A';
    const durasi_magang = submission.durasi_magang ?? 'N/A';
    const unique_token = submission.unique_token ?? 'N/A';
    const processed_at = formatDate(submission.processed_at);
    const updated_at = formatDate(submission.updated_at);
    const accepted_at = formatDate(submission.accepted_at);
    const rejected_at = formatDate(submission.rejected_at);
    const nama_admin = submission.processor?.nama ?? 'N/A';

    // 1. Siapkan variabel kosong untuk baris "Diproses oleh"
    let processedByHtml = '';

    // 2. Cek apakah ada data admin (processor) DAN waktu prosesnya (processed_at)
    if (submission.processor && submission.processed_at) {
        const nama_admin = submission.processor.nama;
        const waktu_proses = formatDate(submission.processed_at);

        // 3. Jika ada, isi variabel dengan string HTML-nya
        processedByHtml = `
            <div class="detail-item">
                <strong>Diproses oleh:</strong> 
                <span>${nama_admin} pada ${waktu_proses}</span>
            </div>
        `;
    }

    // 4. Bangun string HTML final, sisipkan baris kondisional di paling atas
    modalBodyElement.innerHTML = `
        ${processedByHtml}
        <div class="detail-item"><strong>Nama:</strong> ${nama}</div>
        <div class="detail-item"><strong>Instansi Asal:</strong> ${instansi}</div>
        <div class="detail-item"><strong>Jurusan:</strong> ${jurusan}</div>
        <div class="detail-item"><strong>Alamat Email Aktif:</strong> ${email}</div>
        <div class="detail-item"><strong>No. Handphone:</strong> ${nomor_telepon}</div>
        <div class="detail-item"><strong>Lama Magang:</strong> ${durasi_magang}</div> 
        <div class="detail-item"><strong>Token:</strong> <span>${unique_token}</span></div>
    `;
}

// Ekspor semua fungsi yang akan digunakan oleh file lain
export { render, renderCards, renderModalContent };