import { PengajuanView } from '../views/pengajuan-view.js';
import { PengajuanModel } from '../models/pengajuan-model.js';

export class PengajuanController {
    constructor(app) {
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

                // Ambil token DAN pesan dari respons backend
                const trackingId = result.unique_token;
                const message = result.message; // <-- TAMBAHKAN BARIS INI

                if (!trackingId) {
                    throw new Error('Respons dari server tidak menyertakan token pelacakan.');
                }
                
                modal.style.display = 'none';
                form.reset();

                // Teruskan 'message' ke fungsi renderSuccess
                this.view.renderSuccess(trackingId, message); // <-- UBAH BARIS INI
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
            // Mengirim pesan untuk navigasi ke halaman lacak
            document.dispatchEvent(new CustomEvent('navigate', { 
                detail: { 
                    page: 'lacak',
                    id: trackingId 
                } 
            }));
        });

        document.getElementById('btn-go-home').addEventListener('click', () => {
            // Mengirim pesan untuk navigasi ke halaman home
            document.dispatchEvent(new CustomEvent('navigate', { 
                detail: { 
                    page: 'home' 
                } 
            }));
        });
    }
}