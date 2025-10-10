// /src/app.js
import { PengajuanView } from './views/pengajuan-view.js';
import { HomeController } from './controllers/home-controller.js';
import { PengajuanController } from './controllers/pengajuan-controller.js';
import { LacakController } from './controllers/lacak-controller.js';

export class App {
    constructor() {
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
}

export function showNotification(title, message) {
    const modal = document.getElementById('notification-modal');
    const titleElement = document.getElementById('notification-title');
    const messageElement = document.getElementById('notification-message');
    const closeBtn = document.getElementById('notification-close');

    if (modal && titleElement && messageElement && closeBtn) {
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

