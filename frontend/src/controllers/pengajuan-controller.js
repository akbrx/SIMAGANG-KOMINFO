// /src/controllers/pengajuan-controller.js

import { PengajuanView } from '../views/pengajuan-view.js';

export class PengajuanController {
    constructor() {
        this.view = new PengajuanView();
    }

    showPengajuanPage() {
        this.view.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const modal = document.getElementById('pengajuan-modal');
        const openModalBtn = document.getElementById('btn-open-modal');
        const closeModalBtn = document.getElementById('btn-close-modal');
        const form = document.getElementById('form-pengajuan-magang');

        // Buka modal saat tombol diklik
        openModalBtn.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // Tutup modal saat tombol 'x' diklik
        closeModalBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Tutup modal saat klik di luar area konten modal
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Handler saat form disubmit
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Mencegah reload halaman
            
            // Mengambil semua data dari form, termasuk file
            const formData = new FormData(form);
            
            // Untuk sekarang, kita tampilkan di console.
            // Nantinya, data ini akan dikirim ke backend.
            console.log('Data yang akan dikirim:');
            for (let [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }
            
            alert('Pengajuan berhasil dikirim! (Cek console untuk melihat data)');
            modal.style.display = 'none'; // Tutup modal setelah submit
            form.reset(); // Kosongkan form
        });
    }
}