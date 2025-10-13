

export class LupaIdModel {
    constructor() {
        // Endpoint API Anda untuk mengirim link
        this.apiUrl = 'http://localhost:8000/api/pengajuan/send-link';
    }

    /**
     * Mengirim request ke backend untuk mengirim link ke email
     * @param {string} email - Email yang diinput oleh user
     * @returns {Promise<object>} - Pesan sukses atau gagal dari backend
     */
    async kirimLink(email) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email: email }) // Kirim email dalam format JSON
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.message || 'Terjadi kesalahan pada server.');
            }

            return result;

        } catch (error) {
            console.error('Gagal mengirim link:', error);
            throw error;
        }
    }
}