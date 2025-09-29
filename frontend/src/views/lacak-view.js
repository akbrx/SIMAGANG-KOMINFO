export class TrackingView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
        this.app.innerHTML = `
            <div class="page-container">
                <div class="tracking-container">
                    <h1>Lacak Surat Pengajuan Anda</h1>
                    <p>Masukkan ID Pelacakan yang Anda dapatkan setelah mengajukan surat untuk melihat statusnya saat ini.</p>
                    
                    <form id="form-lacak" class="tracking-form">
                        <input type="text" id="tracking-id-input" placeholder="Contoh: PNV-123XYZ" required>
                        <button type="submit" class="btn btn-primary">🔍 Lacak</button>
                    </form>

                    <div id="tracking-result" class="tracking-result-container">
                        </div>
                </div>
            </div>
        `;
    }

    // Fungsi untuk menampilkan hasil status
    displayStatus(statusData) {
        const resultContainer = document.getElementById('tracking-result');
        const { id, status, logs } = statusData;

        // Menentukan step mana yang aktif
        const steps = ['Diajukan', 'Diverifikasi', 'Selesai'];
        let activeStepIndex = steps.indexOf(status);

        let timelineHTML = `
            <h3>Status untuk ID: ${id}</h3>
            <div class="status-timeline">
        `;

        steps.forEach((step, index) => {
            let statusClass = '';
            if (index < activeStepIndex) {
                statusClass = 'completed'; // Sudah selesai
            } else if (index === activeStepIndex) {
                statusClass = 'active'; // Sedang aktif
            }

            const log = logs.find(log => log.status === step) || {};

            timelineHTML += `
                <div class="timeline-item ${statusClass}">
                    <div class="timeline-dot"></div>
                    <div class="timeline-content">
                        <h4>${step}</h4>
                        <p>${log.timestamp || ''}</p>
                    </div>
                </div>
            `;
        });
        
        timelineHTML += '</div>';
        resultContainer.innerHTML = timelineHTML;
        resultContainer.style.display = 'block';
    }

    // Fungsi untuk menampilkan error
    displayError(message) {
        const resultContainer = document.getElementById('tracking-result');
        resultContainer.innerHTML = `<p class="error-message">${message}</p>`;
        resultContainer.style.display = 'block';
    }
}