// src/controllers/surat-controller.js

import { renderCards, renderModalContent } from '../views/surat-view.js';

// Fungsi untuk mengirim update status ke API (tidak berubah)
async function updateSubmissionStatus(id, newStatus) {
    const API_URL = `http://localhost:8000/api/admin/pengajuan/${id}`;
    const token = localStorage.getItem('authToken');
    try {
        const response = await fetch(API_URL, {
            method: 'PUT',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status: newStatus })
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Gagal memperbarui status.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error saat update status:', error);
        showToast(`Gagal memperbarui status: ${error.message}`, 'error'); // Diubah dari alert ke showToast
        return null;
    }
}

// [FUNGSI UNTUK MEMBUKA FILE DITAMBAHKAN DI SINI]
async function openProtectedFile(submissionId) {
    showToast('Mendapatkan link file...', 'success');
    
    const API_URL = `http://localhost:8000/api/admin/pengajuan/${submissionId}/file`;
    const token = localStorage.getItem('authToken');

    try {
        const response = await fetch(API_URL, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json' // Meminta respons JSON
            }
        });

        if (!response.ok) {
            throw new Error('Gagal mendapatkan link file. Pastikan Anda memiliki izin.');
        }

        // 1. Ambil respons sebagai JSON
        const data = await response.json();

        // 2. Jika sukses dan ada file_url, buka URL tersebut
        if (data.success && data.file_url) {
            window.open(data.file_url, '_blank');
        } else {
            throw new Error(data.message || 'URL file tidak ditemukan dalam respons.');
        }

    } catch (error) {
        console.error('Error membuka file:', error);
        showToast(error.message, 'error');
    }
}


// --- Fungsi Inisialisasi Controller ---
export async function init() {
    const cardGrid = document.getElementById('cardGrid');
    const detailModal = document.getElementById('detailModal');
    const modalBody = document.getElementById('modalBody');
    const closeModalBtn = document.getElementById('closeModalBtn');
    
    let daftarPengajuan = [];

    try {
        // ... Logika fetch data awal (tidak berubah) ...
        const API_URL_GET = 'http://localhost:8000/api/admin/pengajuan';
        const token = localStorage.getItem('authToken');
        if (!token) { window.location.hash = '#login'; return; }
        const response = await fetch(API_URL_GET, { headers: { 'Accept': 'application/json', 'Authorization': `Bearer ${token}` }});
        if (response.status === 401) { window.location.hash = '#login'; return; }
        if (!response.ok) { throw new Error(`Gagal mengambil data: ${response.statusText}`); }
        const responseData = await response.json();
        daftarPengajuan = responseData.data.data; 
        renderCards(cardGrid, daftarPengajuan);
    } catch (error) {
        console.error("Terjadi kesalahan:", error);
        cardGrid.innerHTML = `<p class="info-message error">Gagal memuat data.</p>`;
        showToast('Gagal memuat data.', 'error');
    }

    // --- [PERUBAHAN] Event Listener untuk Klik diperbarui ---
    cardGrid.addEventListener('click', async (event) => {
        const detailButton = event.target.closest('.btn-primary');
        const fileLink = event.target.closest('.file-link');

        // Logika untuk tombol detail
        if (detailButton) {
            const submissionId = detailButton.dataset.id;
            const submission = daftarPengajuan.find(s => s.id == submissionId);
            renderModalContent(modalBody, submission);
            detailModal.classList.add('show');
        }

        // Logika untuk link file
        if (fileLink) {
            event.preventDefault(); // Mencegah link pindah halaman
            const card = fileLink.closest('.card-surat');
            const submissionId = card.querySelector('.btn-primary').dataset.id;
            
            if (submissionId) {
                await openProtectedFile(submissionId);
            }
        }
    });
    
    // Event listener untuk 'change' (tidak berubah)
    cardGrid.addEventListener('change', async (event) => {
        if (event.target.classList.contains('select-status')) {
            const submissionId = event.target.dataset.id;
            const newStatus = event.target.value;
            const result = await updateSubmissionStatus(submissionId, newStatus);

            if (result && result.success) {
                const updatedSubmission = result.data.data || result.data;
                const index = daftarPengajuan.findIndex(s => s.id == submissionId);
                if (index !== -1) {
                    daftarPengajuan[index] = updatedSubmission;
                }
                renderCards(cardGrid, daftarPengajuan);
                showToast('Status berhasil diperbarui!');
            } else {
                const submission = daftarPengajuan.find(s => s.id == submissionId);
                if(submission) { event.target.value = submission.status; }
            }
        }
    });

    // Event listener untuk menutup modal (tidak berubah)
    closeModalBtn.addEventListener('click', () => detailModal.classList.remove('show'));
    detailModal.addEventListener('click', (event) => {
        if (event.target === detailModal) {
            detailModal.classList.remove('show');
        }
    });
}