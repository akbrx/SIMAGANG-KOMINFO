export class PengajuanModel {
    constructor() {
        this.apiUrl = 'http://127.0.0.1:8000/api/submission';
    }

    /**
     * Mengirim data form ke API backend
     * @param {FormData} formData - Data dari form, termasuk file
     * @returns {Promise<object>} - Hasil dari API
     */
    async kirim(formData) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                body: formData,
                // PENTING: JANGAN set header 'Content-Type' saat mengirim FormData.
                // Browser akan menanganinya secara otomatis.
            });

            const result = await response.json();

            if (!response.ok) {
                // Jika ada error validasi dari Laravel, tampilkan pesannya
                let errorMessage = result.message || 'Terjadi kesalahan pada server.';
                if (result.errors) {
                    errorMessage = Object.values(result.errors).join('\n');
                }
                throw new Error(errorMessage);
            }

            return result;

        } catch (error) {
            console.error('Gagal mengirim pengajuan:', error);
            throw error;
        }
    }
}