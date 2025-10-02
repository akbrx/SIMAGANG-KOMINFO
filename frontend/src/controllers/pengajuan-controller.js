// /src/controllers/pengajuan-controller.js

import { PengajuanView } from '../views/pengajuan-view.js';
import { PengajuanModel } from '../models/pengajuan-model.js';
import { App } from '../app.js'; // Impor App untuk navigasi

export class PengajuanController {
    constructor(app) {
        this.app = app; // Simpan instance App
        this.view = new PengajuanView();
        this.model = new PengajuanModel();
    }

    showPengajuanPage() {
        this.view.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // ... (kode untuk buka/tutup modal tetap sama) ...
        const modal = document.getElementById('pengajuan-modal');
        const openModalBtn = document.getElementById('btn-open-modal');
        const closeModalBtn = document.getElementById('btn-close-modal');
        openModalBtn.addEventListener('click', () => modal.style.display = 'flex');
        closeModalBtn.addEventListener('click', () => modal.style.display = 'none');
        window.addEventListener('click', (event) => {
            if (event.target === modal) modal.style.display = 'none';
        });

        const form = document.getElementById('form-pengajuan-magang');
        form.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(form);
            const submitButton = form.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            submitButton.textContent = 'Mengirim...';

            try {
                const result = await this.model.kirim(formData);
                // Anda bisa menghapus console.log ini jika sudah tidak diperlukan
                console.log('Respons asli dari backend:', result);

                // PERBAIKANNYA DI SINI: Ambil 'unique_token' dari 'result'
                const trackingId = result.unique_token;

                // Pengaman jika karena suatu hal token tidak ada
                if (!trackingId) {
                    throw new Error('Respons dari server tidak menyertakan token pelacakan.');
                }
                
                modal.style.display = 'none';
                form.reset();

                this.view.renderSuccess(trackingId);
                this.setupSuccessPageListeners(trackingId);

            } catch (error) {
                alert(`Gagal mengirim pengajuan:\n${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.textContent = 'Kirim Pengajuan';
            }
        });
    }

    // FUNGSI BARU UNTUK HALAMAN SUKSES
    setupSuccessPageListeners(trackingId) {
        document.getElementById('btn-track-now').addEventListener('click', () => {
            // Panggil fungsi navigasi dari App
            this.app.navigateToTracking(trackingId);
        });

        document.getElementById('btn-submit-another').addEventListener('click', () => {
            // Kembali ke halaman pengajuan
            this.showPengajuanPage();
        });
    }
}