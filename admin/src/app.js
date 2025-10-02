// Import views dan controllers
import * as loginView from './views/login-view.js';
import * as loginController from './controllers/login-controller.js';
import * as dashboardView from './views/dashboard-view.js';
import * as dashboardController from './controllers/dashboard-controller.js';

// --- ROUTER SEDERHANA ---
const routes = {
    '#login': { view: loginView, controller: loginController },
    '#dashboard': { view: dashboardView, controller: dashboardController },
    // Tambahkan rute lain di sini (misal: '#surat')
};

function router() {
    const path = window.location.hash || '#login';
    const appContainer = document.getElementById('app');
    const appWrapper = document.getElementById('app-wrapper');
    const sidebar = document.querySelector('.sidebar');

    const route = routes[path];

    if (route) {
        // Tampilkan/sembunyikan elemen UI berdasarkan halaman
        if (path === '#login') {
            appWrapper.classList.add('login-layout');
            if(sidebar) sidebar.style.display = 'none';
        } else {
            appWrapper.classList.remove('login-layout');
            if(sidebar) sidebar.style.display = 'flex';
        }

        appContainer.innerHTML = route.view.render();
        if (route.controller && typeof route.controller.init === 'function') {
            route.controller.init();
        }
    } else {
        // Halaman default jika hash tidak cocok
        window.location.hash = '#login';
    }
}

// --- FUNGSI INISIALISASI ---
function initAppLayout() {
    // Logika untuk tombol logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Logout clicked');
            window.location.hash = '#login';
        });
    }

    // FUNGSI BARU: Logika untuk toggle sidebar
    const sidebarToggleBtn = document.getElementById('sidebar-toggle');
    const sidebarEl = document.querySelector('.sidebar');
    const mainContentEl = document.getElementById('main-content');

    if (sidebarToggleBtn && sidebarEl && mainContentEl) {
        sidebarToggleBtn.addEventListener('click', () => {
            sidebarEl.classList.toggle('closed');
            mainContentEl.classList.toggle('sidebar-closed');
        });
    }
}


// --- EVENT LISTENERS ---
window.addEventListener('hashchange', router);
window.addEventListener('DOMContentLoaded', () => {
    initAppLayout();
    router();
});

