// Nama fungsi diubah dari 'initialize' menjadi 'init' agar cocok dengan app.js
export const init = () => {
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('error-message');

    if (!loginForm) return; // Pastikan form ada sebelum menambahkan event listener

    loginForm.addEventListener('submit', (event) => {
        // Mencegah form dari 'refresh' halaman
        event.preventDefault();

        const username = usernameInput.value;
        const password = passwordInput.value;

        // --- Simulasi Logika Model ---
        // Di aplikasi nyata, Anda akan mengirim data ini ke server/API
        // menggunakan fetch() untuk validasi.
        if (username === 'admin' && password === '1') {
            console.log('Login berhasil!');
            if (errorMessage) errorMessage.style.display = 'none';
            
            // Arahkan ke halaman dashboard
            window.location.hash = '#dashboard';

        } else {
            // Tampilkan pesan error di halaman, bukan dengan alert
            errorMessage.textContent = 'Username atau password salah.';
            errorMessage.style.display = 'block';
            console.error('Login gagal');
        }
    });
    
    const forgotPasswordLink = document.getElementById('forgot-password');
    if(forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Fitur "Lupa Password" sedang dalam pengembangan.');
        });
    }
};
