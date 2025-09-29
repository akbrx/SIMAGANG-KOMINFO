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
    getFakeStatus(id) {
        // Data palsu untuk tujuan demonstrasi
        const statuses = {
            "PNV-123XYZ": { 
                id: "PNV-123XYZ", 
                status: "Diverifikasi", 
                logs: [
                    { status: "Diajukan", timestamp: "28 Sep 2025, 10:05" },
                    { status: "Diverifikasi", timestamp: "29 Sep 2025, 09:30" }
                ] 
            },
            "PNV-456ABC": { 
                id: "PNV-456ABC", 
                status: "Selesai", 
                logs: [
                    { status: "Diajukan", timestamp: "27 Sep 2025, 14:20" },
                    { status: "Diverifikasi", timestamp: "28 Sep 2025, 11:00" },
                    { status: "Selesai", timestamp: "29 Sep 2025, 10:15" }
                ] 
            }
        };
        return statuses[id.toUpperCase()];
    }
}