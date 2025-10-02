// /src/app.js

import { HomeController } from './controllers/home-controller.js';
import { PengajuanController } from './controllers/pengajuan-controller.js';
import { LacakController } from './controllers/lacak-controller.js';

export class App {
    constructor() {
        // Controller tidak perlu lagi diberi 'this'
        this.homeController = new HomeController();
        this.pengajuanController = new PengajuanController();
        this.lacakController = new LacakController();

        this.setupNavigationListener(); // Panggil listener utama
        this.setupGlobalNavLinks();     // Panggil listener untuk navbar global
        
        this.navigateToHome(); // Tampilkan halaman home saat pertama kali buka
    }

    // Listener untuk navigasi antar "halaman"
    setupNavigationListener() {
        document.addEventListener('navigate', (event) => {
            const page = event.detail.page;
            const id = event.detail.id;

            switch (page) {
                case 'home':
                    this.navigateToHome();
                    break;
                case 'lacak':
                    this.navigateToLacak(id);
                    break;
                case 'pengajuan':
                    this.navigateToPengajuan();
                    break;
            }
        });
    }

    // Listener untuk link di navbar yang bersifat global
    setupGlobalNavLinks() {
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
                    this.navigateToHomeAndScroll(targetId);
                });
            }
        }
    }

    // --- FUNGSI NAVIGASI ---
    navigateToHome() {
        this.homeController.showHomePage();
    }

    // Fungsi baru untuk klik navbar: tampilkan home, lalu scroll
    navigateToHomeAndScroll(targetId) {
        this.navigateToHome();
        setTimeout(() => {
            const element = document.querySelector(targetId);
            if(element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
    }

    navigateToPengajuan() {
        this.pengajuanController.showPengajuanPage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    navigateToLacak(trackingId = null) {
        this.lacakController.showLacakPage(trackingId);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new App();
});