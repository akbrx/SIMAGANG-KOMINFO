// /src/controllers/tracking-controller.js

import { TrackingView } from '../views/lacak-view.js';
// Nantinya, Anda akan mengimpor model untuk mengambil data dari API
// import { TrackingModel } from '../models/tracking-model.js';

export class TrackingController {
    constructor() {
        this.view = new TrackingView();
        // this.model = new TrackingModel(); 
    }

    showTrackingPage() {
        this.view.render();
        this.setupEventListeners();
    }

    setupEventListeners() {
        const form = document.getElementById('form-lacak');
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const trackingId = document.getElementById('tracking-id-input').value;
            this.handleTracking(trackingId);
        });
    }

    handleTracking(id) {
        if (!id) {
            this.view.displayError('ID Pelacakan tidak boleh kosong.');
            return;
        }

        // --- SIMULASI PENGAMBILAN DATA DARI API ---
        // Nantinya, bagian ini akan memanggil this.model.fetchStatus(id)
        console.log(`Mencari status untuk ID: ${id}`);
        const fakeApiResponse = this.getFakeStatus(id);

        if (fakeApiResponse) {
            this.view.displayStatus(fakeApiResponse);
        } else {
            this.view.displayError(`Surat dengan ID "${id}" tidak ditemukan.`);
        }
    }

    // Fungsi ini HANYA untuk simulasi, nantinya akan dihapus
    // /src/controllers/tracking-controller.js

// ... (kode lain)

// Ganti fungsi ini dengan versi yang lebih lengkap
getFakeStatus(id) {
    const statuses = {
        "PNV-DITERIMA": { 
            id: "PNV-DITERIMA", 
            status: "Diterima", 
            catatan: "Selamat! Surat balasan telah dikirim ke email Anda. Silakan periksa folder inbox atau spam.",
            logs: [
                { status: "Diajukan", timestamp: "25 Sep 2025, 14:20" },
                { status: "Diverifikasi", timestamp: "26 Sep 2025, 11:00" },
                { status: "Diterima", timestamp: "28 Sep 2025, 10:15" }
            ] 
        },
        "PNV-DITOLAK": { 
            id: "PNV-DITOLAK", 
            status: "Ditolak", 
            catatan: "Mohon maaf, kuota magang untuk periode yang diajukan sudah penuh. Silakan coba lagi di periode selanjutnya.",
            logs: [
                { status: "Diajukan", timestamp: "24 Sep 2025, 09:00" },
                { status: "Diverifikasi", timestamp: "25 Sep 2025, 15:45" }
            ] 
        },
        "PNV-DISPOSISI": { 
            id: "PNV-DISPOSISI", 
            status: "Disposisi",
            catatan: "Pengajuan Anda sedang dalam proses peninjauan oleh tim kami.", 
            logs: [
                { status: "Diajukan", timestamp: "28 Sep 2025, 10:05" },
                { status: "Diverifikasi", timestamp: "29 Sep 2025, 09:30" }
            ] 
        },
        "PNV-DIAJUKAN": { 
            id: "PNV-DIAJUKAN", 
            status: "Diajukan",
            catatan: "Pengajuan Anda sedang dalam proses.", 
            logs: [
                { status: "Diajukan", timestamp: "28 Sep 2025, 10:05" }
            ] 
        }
    };
    return statuses[id.toUpperCase()];
}
}