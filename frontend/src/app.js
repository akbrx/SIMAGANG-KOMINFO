import { HomeController } from './controllers/home-controller.js';
import { PengajuanController } from './controllers/pengajuan-controller.js';

class App {
    constructor() {
        this.homeController = new HomeController(this); // Beri 'this' agar bisa panggil App
        this.pengajuanController = new PengajuanController();

        this.setupEventListeners();
        this.homeController.showHomePage(); // Tampilkan halaman home saat pertama kali buka
    }

    setupEventListeners() {
        // --- Navigasi Global Navbar ---
        const navLinks = {
            'nav-home': '#home-section',
            'nav-about': '#about-section',
            'brand-link': '#home-section'
        };

        for (const [id, targetId] of Object.entries(navLinks)) {
            const link = document.getElementById(id);
            if (link) {
                link.addEventListener('click', (event) => {
                    event.preventDefault();
                    // 1. Selalu tampilkan halaman home dulu
                    this.homeController.showHomePage();
                    // 2. Tunggu sesaat agar konten home sempat dirender
                    setTimeout(() => {
                        // 3. Scroll ke bagian yang dituju
                        document.querySelector(targetId).scrollIntoView({
                            behavior: 'smooth'
                        });
                    }, 100); // delay kecil
                });
            }
        }
    }

    // Fungsi ini akan dipanggil dari HomeController
    navigateToPengajuan() {
        this.pengajuanController.showPengajuanPage();
    }
}

// Jalankan aplikasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
    new App();
});