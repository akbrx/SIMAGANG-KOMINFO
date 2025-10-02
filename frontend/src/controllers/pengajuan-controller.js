import { PengajuanView } from '../views/pengajuan-view.js';
import { PengajuanModel } from '../models/pengajuan-model.js';

export class PengajuanController {
    constructor() {
        this.view = new PengajuanView();
        this.model = new PengajuanModel();  
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
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            // Tampilkan status loading
            submitButton.disabled = true;
            submitButton.textContent = 'Mengirim...';

            try {
                // Panggil method 'kirim' dari model
                const result = await this.model.kirim(formData);
                
                // Tampilkan pesan sukses dengan ID Pelacakan
                alert(`Pengajuan berhasil!\nID Pelacakan Anda: ${result.unique_token}\nHarap simpan ID ini.`);
                
                modal.style.display = 'none';
                form.reset();

            } catch (error) {
                // Tampilkan pesan error jika gagal
                alert(`Gagal mengirim pengajuan:\n${error.message}`);
            } finally {
                // Kembalikan tombol ke kondisi semula
                submitButton.disabled = false;
                submitButton.textContent = 'Kirim Pengajuan';
            }
        });
    }
}