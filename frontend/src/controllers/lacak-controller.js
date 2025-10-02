import { LacakView } from '../views/lacak-view.js';
import { LacakModel } from '../models/lacak-model.js'; // Impor model yang asli

export class LacakController {
    constructor() {
        this.view = new LacakView();
        this.model = new LacakModel();
    }

    showLacakPage(trackingId = null) {
        this.view.render();
        this.setupEventListeners();

        if (trackingId) {
            document.getElementById('tracking-id-input').value = trackingId;
            this.handleLacak(trackingId);
        }
    }

    setupEventListeners() {
        const form = document.getElementById('form-lacak');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const trackingId = document.getElementById('tracking-id-input').value;
            this.handleLacak(trackingId);
        });
    }

    async handleLacak(id) {
        if (!id) {
            this.view.displayError('ID Pelacakan tidak boleh kosong.');
            return;
        }

        try {
            // Panggil model untuk mengambil data dari API backend
            const result = await this.model.getStatus(id);
            
            // Tampilkan hasilnya menggunakan view.
            // Asumsi backend mengembalikan data di dalam properti 'data'
            if (result.data) {
                this.view.displayStatus(result.data);
            } else {
                throw new Error("Format respons dari server tidak sesuai.");
            }

        } catch (error) {
            // Jika model mengembalikan error (misal: 404), tampilkan pesannya
            this.view.displayError(error.message);
        }
    }
    // Fungsi getFakeStatus() sudah dihapus dari sini
}