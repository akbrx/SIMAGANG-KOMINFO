// /src/views/lupa-id-view.js

export class LupaIdView {
    constructor() {
        this.app = document.getElementById('app');
    }

    render() {
    this.app.innerHTML = `
        <div class="page-container">
            <div class="tracking-container">
                <h1>Lupa ID Pelacakan?</h1>
                <p>Tidak perlu khawatir jika Anda lupa ID Pelacakan. Cukup masukkan alamat email yang Anda gunakan saat mendaftar, dan kami akan mengirimkan tautan untuk mengakses halaman status pengajuan Anda.</p>
                
                <form id="form-lupa-id" class="tracking-form-new">
                    <div class="input-wrapper">
                        <input type="email" id="email-input" placeholder="Ketik alamat email Anda..." required>
                        <button type="submit" aria-label="Kirim">

                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <line x1="22" y1="2" x2="11" y2="13"></line>
                                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                            </svg>
                            
                        </button>
                    </div>
                </form>
                
            </div>
        </div>
    `;
    }
    displaySubmissions(submissions) {
        const container = document.getElementById('submission-list');
        if (!submissions || submissions.length === 0) {
            container.innerHTML = `<p class="info-message">Tidak ada pengajuan aktif yang ditemukan untuk email ini.</p>`;
            return;
        }

        let html = '<h3>Pengajuan Ditemukan:</h3>';
        submissions.forEach(sub => {
            html += `
                <a href="/#/lacak?id=${sub.token}" class="submission-card">
                    <span class="submission-token">ID: ${sub.token}</span>
                    <span class="submission-status status-${sub.status.toLowerCase()}">${sub.status}</span>
                    <span class="submission-date">Diajukan: ${sub.created_at}</span>
                </a>
            `;
        });
        container.innerHTML = html;
    }   
}