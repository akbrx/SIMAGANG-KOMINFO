// /src/app.js
import { PengajuanView } from './views/pengajuan-view.js';
import { HomeController } from './controllers/home-controller.js';
import { PengajuanController } from './controllers/pengajuan-controller.js';
import { LacakController } from './controllers/lacak-controller.js';
import { LupaIdController } from './controllers/lupa-id-controller.js';

export class App {
    constructor() {
        this.homeController = new HomeController();
        this.pengajuanController = new PengajuanController();
        this.lacakController = new LacakController();
        this.lupaIdController = new LupaIdController();

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
                case 'lupa-id': 
                    this.navigateToLupaId(); 
                    break;
            
            }
        });
    }

    // Listener untuk link di navbar yang bersifat global
    setupGlobalNavLinks() {
        const navLinks = {
            'nav-home': '#home-section',
            'nav-about': '#about-section',
            'brand-link': '#home-section',
            'nav-faq': '#faq-section'
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

    navigateToLupaId() {
        this.lupaIdController.showLupaIdPage();
        window.scrollTo({ top: 0, behavior: 'auto' });
    }
}

export function showNotification(title, message, type = 'warning') { // Tambah parameter 'type'
    const modal = document.getElementById('notification-modal');
    const modalContent = document.getElementById('notification-content'); // Kita butuh ini untuk ganti warna
    const iconElement = document.getElementById('notification-icon');
    const titleElement = document.getElementById('notification-title');
    const messageElement = document.getElementById('notification-message');
    const closeBtn = document.getElementById('notification-close');

    if (!modal || !modalContent) return;

    // Definisikan ikon dan class untuk setiap tipe notifikasi
    const notificationTypes = {
        success: {
            className: 'notif-success',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>`
        },
        warning: {
            className: 'notif-warning',
            icon: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`
        }
    };

    const selectedType = notificationTypes[type] || notificationTypes.warning;

    // Hapus class lama, tambahkan class baru untuk warna
    modalContent.classList.remove('notif-success', 'notif-warning');
    modalContent.classList.add(selectedType.className);
    
    // Ganti ikon, judul, dan pesan
    iconElement.innerHTML = selectedType.icon;
    titleElement.textContent = title;
    messageElement.textContent = message;

    modal.style.display = 'flex';

        const closeModal = () => {
            modal.style.display = 'none';
            closeBtn.removeEventListener('click', closeModal);
            modal.removeEventListener('click', closeOnOverlay);
        };

        const closeOnOverlay = (event) => {
            if (event.target === modal) {
                closeModal();
            }
        };

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', closeOnOverlay);
    }


export function makeDraggable(element) {
    let currentX, currentY, initialX, initialY;
    let xOffset = 0, yOffset = 0;
    let isDragging = false;
    const header = element.querySelector('.note-header');

    const dragStart = (e) => {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
        isDragging = true;
    };

    const drag = (e) => {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;
            xOffset = currentX;
            yOffset = currentY;
            element.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
        }
    };

    const dragEnd = () => {
        if (isDragging) {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        }
    };

    if (header) {
        header.addEventListener("mousedown", dragStart);
    }
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
}


document.addEventListener('DOMContentLoaded', () => {
    new App(); 
});

window.showNotification = showNotification;

