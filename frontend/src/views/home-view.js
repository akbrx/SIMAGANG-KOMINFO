// /src/views/home-view.js

export class HomeView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
    this.app.innerHTML = `
        <div  class="hero-container">
            <main id="home-section" class="content-container">
                <h1>Sistem Informasi Magang</h1>
                <h2>Dinas Komunikasi Informatika Statistik dan Persandian</h2>
                <p>
                    Selamat datang di portal resmi magang Diskominfo. Kami membuka kesempatan bagi mahasiswa dan siswa untuk mendapatkan pengalaman kerja profesional, mengembangkan kompetensi, dan berkontribusi dalam proyek-proyek inovatif di bidang teknologi dan komunikasi.
                </p>
                <div class="button-container">
                    <a href="#" id="btn-pengajuan" class="btn btn-primary">🚀 Ajukan Magang</a>
                    <a href="#" id="btn-lacak" class="btn btn-secondary">🛰️ Lacak Pengajuan</a>
                </div>
            </main>
        </div>

        <section id="about-section" class="how-it-works">
            <div class="container">
                <h2>Permudah Proses Magang Anda</h2>
                <p class="section-intro">
                    Website ini dirancang untuk menyederhanakan proses pengajuan surat magang di Diskominfo. Lupakan kerumitan birokrasi, semua dapat Anda lakukan dalam 3 langkah mudah.
                </p>
                <div class="steps-container">
                    <div class="step-card">
                        <div class="step-number">01</div>
                        <h3>📝 Ajukan Surat</h3>
                        <p>Isi formulir pengajuan online dengan data diri dan detail permohonan magang Anda. Prosesnya cepat dan tidak memerlukan dokumen fisik.</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">02</div>
                        <h3>⏳ Tunggu Verifikasi</h3>
                        <p>Tim kami akan meninjau dan memverifikasi pengajuan Anda. Anda dapat melacak status surat Anda secara real-time melalui halaman pelacakan.</p>
                    </div>
                    <div class="step-card">
                        <div class="step-number">03</div>
                        <h3>📧 Terima Balasan</h3>
                        <p>Setelah pengajuan disetujui, Anda akan menerima surat balasan resmi langsung ke alamat email yang Anda daftarkan. Mudah dan efisien.</p>
                    </div>
                </div>
            </div>
        </section>
        <footer class="site-footer">
            <div class="footer-container">
                <div class="footer-about">
                    <div class="footer-logo">
                        <img src="../assets/img/kominfo.png" alt="Logo Kominfo">
                        <img src="../assets/img/pemkot.png" alt="Logo Pemkot Pekanbaru">
                    </div>
                    <p>Sistem Informasi Magang (SIMAGANG) adalah platform resmi yang dikelola oleh Dinas Komunikasi dan Informatika Kota Pekanbaru untuk memfasilitasi proses administrasi magang.</p>
                </div>
                <div class="footer-contact">
                    <h4>Hubungi Kami</h4>
                    <p>
                        Kantor Wali Kota Pekanbaru, Tenayan Raya<br>
                        Pekanbaru, Riau, 28282<br>
                        <strong>Email:</strong> diskominfo@pekanbaru.go.id
                    </p>
                </div>
                <div class="footer-links">
                    <h4>Tautan Terkait</h4>
                    <ul>
                        <li><a href="https://www.pekanbaru.go.id/" target="_blank">Website Pemkot Pekanbaru</a></li>
                        <li><a href="https://diskominfo.pekanbaru.go.id/" target="_blank">Diskominfo Pekanbaru</a></li>
                        <li><a href="https://www.indonesia.go.id/" target="_blank">Portal Informasi Indonesia</a></li>
                    </ul>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} Dinas Komunikasi dan Informatika Kota Pekanbaru. All Rights Reserved.</p>
            </div>
        </footer>
    `;
}

    bindButtons(handlePengajuan, handleLacak) {
        // ... (kode bindButtons tetap sama)
        const pengajuanButton = document.getElementById('btn-pengajuan');
        if (pengajuanButton) {
            pengajuanButton.addEventListener('click', (event) => {
                event.preventDefault();
                handlePengajuan();
            });
        }

        const lacakButton = document.getElementById('btn-lacak');
        if (lacakButton) {
            lacakButton.addEventListener('click', (event) => {
                event.preventDefault();
                handleLacak();
            });
        }
    }
}