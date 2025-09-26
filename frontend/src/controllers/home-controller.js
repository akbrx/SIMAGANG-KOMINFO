// /src/controllers/home-controller.js

import { HomeView } from '../Views/home-view.js';
import { HomeModel } from '../Models/home.js';
// Impor controller lain yang akan dipanggil
import { PengajuanController } from './pengajuan-controller.js'; 
// import { LacakController } from './lacak-controller.js';

export class HomeController {
    constructor() {
        this.homeView = new HomeView();
        this.homeModel = new HomeModel();
    }

    /**
     * Fungsi utama untuk menampilkan halaman home.
     */
    showHomePage() {
        this.homeView.render();
        this.homeView.bindButtons(this.handleNavigateToPengajuan, this.handleNavigateToLacak);
        this.setupNavLinks(); 
    }

    setupNavLinks() {
        const aboutLink = document.getElementById('nav-about');
        if (aboutLink) {
            aboutLink.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('about-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }

        const homeLink = document.getElementById('nav-home');
        if (homeLink) {
            homeLink.addEventListener('click', (event) => {
                event.preventDefault();
                document.getElementById('home-section').scrollIntoView({
                    behavior: 'smooth'
                });
            });
        }
    }

    

    /**
     * Handler yang dipanggil saat tombol "Ajukan Magang" diklik.
     */
    handleNavigateToPengajuan() {
        console.log("Navigasi ke halaman Pengajuan...");
        const pengajuanController = new PengajuanController();
        pengajuanController.showPengajuanPage();
    }

    /**
     * Handler yang dipanggil saat tombol "Lacak Pengajuan" diklik.
     */
    handleNavigateToLacak() {
        console.log("Navigasi ke halaman Lacak...");
        // Di sini Anda akan menginisialisasi dan memanggil LacakController
        // Contoh:
        // const lacakController = new LacakController();
        // lacakController.showLacakPage();
        alert("TODO: Pindah ke halaman pelacakan");
    }
}