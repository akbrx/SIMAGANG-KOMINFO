// /src/views/pengajuan-view.js

export class PengajuanView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
        this.app.innerHTML = `
            <div class="page-container">

                
            <div class="procedure-container">
                <h1>Prosedur Pengajuan Surat Magang</h1>
                <p>Ikuti alur di bawah ini untuk mengajukan permohonan magang Anda di Diskominfo Pekanbaru.</p>
                
                <div class="procedure-timeline">
                    <div class="timeline-step">
                        <div class="timeline-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                        </div>
                        <div class="timeline-content">
                            <h4>Langkah 1: Siapkan Dokumen</h4>
                            <p>Siapkan surat permohonan resmi dari instansi Anda dalam format PDF.</p>
                        </div>
                    </div>

                    <div class="timeline-step">
                        <div class="timeline-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path><polyline points="10 17 15 12 10 7"></polyline><line x1="15" y1="12" x2="3" y2="12"></line></svg>
                        </div>
                        <div class="timeline-content">
                            <h4>Langkah 2: Isi Formulir</h4>
                            <p>Klik tombol di bawah untuk membuka dan mengisi formulir pengajuan online.</p>
                        </div>
                    </div>

                    <div class="timeline-step">
                        <div class="timeline-icon">
                           <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                        </div>
                        <div class="timeline-content">
                            <h4>Langkah 3: Kirim & Tunggu</h4>
                            <p>Setelah mengirim, Anda akan mendapat ID untuk melacak status verifikasi surat.</p>
                        </div>
                    </div>
                </div>
                <button id="btn-open-modal" class="btn btn-primary">🚀 Mulai Pengajuan</button>
            </div>

            <div id="pengajuan-modal" class="modal-overlay">
                <div class="modal-content">
                    <button id="btn-close-modal" class="modal-close">&times;</button>
                    <h2>Formulir Pengajuan Magang</h2>
                    <form id="form-pengajuan-magang">
                        <div class="form-group">
                            <label for="nama">Nama Lengkap</label>
                            <input type="text" id="nama" name="nama" required>
                        </div>
                        <div class="form-group">
                            <label for="instansi">Instansi Asal (Universitas/Sekolah)</label>
                            <input type="text" id="instansi" name="instansi" required>
                        </div>
                        <div class="form-group">
                            <label for="email">Alamat Email Aktif</label>
                            <input type="email" id="email" name="email" required>
                        </div>
                        <div class="form-group">
                            <label for="no_hp">No. Handphone (WhatsApp)</label>
                            <input type="tel" id="no_hp" name="no_hp" required>
                        </div>
                        <div class="form-group">
                            <label for="durasi">Lama Magang (Contoh: 3 bulan)</label>
                            <input type="text" id="durasi" name="durasi" required>
                        </div>
                        <div class="form-group">
                            <label for="surat">Upload Surat Permohonan (PDF)</label>
                            <input type="file" id="surat" name="surat" accept=".pdf" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Kirim Pengajuan</button>
                    </form>
                </div>
            </div>
        `;
    }
}