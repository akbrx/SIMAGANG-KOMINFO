// /src/controllers/home-controller.js

import { HomeView } from '../views/home-view.js';
import { HomeModel } from '../models/home.js';
// HAPUS SEMUA 'import' controller lain dari sini

export class HomeController {
    // Constructor tidak perlu lagi menerima 'app'
    constructor() {
        this.homeView = new HomeView();
        this.homeModel = new HomeModel();
    }

    showHomePage() {
        this.homeView.render();
        this.homeView.bindButtons(
            this.handleNavigateToPengajuan,
            this.handleNavigateToLacak
        );
        // Panggil juga setupNavLinks agar scroll berfungsi
        this.setupNavLinks();
    }

    handleNavigateToPengajuan() {
        // Kirim pesan untuk navigasi ke halaman pengajuan
        document.dispatchEvent(new CustomEvent('navigate', { 
            detail: { page: 'pengajuan' } 
        }));
    }

    handleNavigateToLacak() {
        // Kirim pesan untuk navigasi ke halaman lacak
        document.dispatchEvent(new CustomEvent('navigate', { 
            detail: { page: 'lacak' } 
        }));
    }

    // Fungsi ini tetap di sini untuk menangani scroll di halaman home
    setupNavLinks() {
        const homeLink = document.getElementById('nav-home');
        const aboutLink = document.getElementById('nav-about');
        const brandLink = document.getElementById('brand-link');

        if (homeLink) {
            homeLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
            });
        }
        if (aboutLink) {
            aboutLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
            });
        }
        if (brandLink) {
            brandLink.addEventListener('click', (e) => {
                e.preventDefault();
                document.getElementById('home-section').scrollIntoView({ behavior: 'smooth' });
            });
        }
    }
}