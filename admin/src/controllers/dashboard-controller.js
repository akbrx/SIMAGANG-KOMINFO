
// --- DUMMY DATA ---

const totalData = {
    total: 125,
    pending: 15,
    disposisi: 30,
    selesai: 80,
};

// Monthly data simulation
const monthlyData = {
    Januari: { pending: 10, disposisi: 20, selesai: 30 },
    Februari: { pending: 5, disposisi: 15, selesai: 25 },
    Maret: { pending: 8, disposisi: 22, selesai: 45 },
    April: { pending: 12, disposisi: 18, selesai: 35 },
    Mei: { pending: 7, disposisi: 25, selesai: 33 },
    Juni: { pending: 3, disposisi: 15, selesai: 37 },
    Juli: { pending: 9, disposisi: 30, selesai: 48 },
    Agustus: { pending: 11, disposisi: 21, selesai: 39 },
    September: { pending: 4, disposisi: 12, selesai: 26 },
    Oktober: { pending: 6, disposisi: 14, selesai: 21 },
    November: { pending: 2, disposisi: 8, selesai: 20 },
    Desember: { pending: 5, disposisi: 15, selesai: 31 },
};

// --- CHART INSTANCES ---

let monthlyDistributionChartInstance = null;
let yearlyTrendChartInstance = null;


// --- FUNCTIONS ---

function updateStatCards(data) {

    const totalSuratEl = document.getElementById('total-surat');
    const pendingSuratEl = document.getElementById('pending-surat');
    const disposisiSuratEl = document.getElementById('disposisi-surat');
    const selesaiSuratEl = document.getElementById('selesai-surat');
    
    if (totalSuratEl) totalSuratEl.textContent = data.total;
    if (pendingSuratEl) pendingSuratEl.textContent = data.pending;
    if (disposisiSuratEl) disposisiSuratEl.textContent = data.disposisi;
    if (selesaiSuratEl) selesaiSuratEl.textContent = data.selesai;
}

function populateMonthFilter() {
    const monthFilter = document.getElementById('month-filter');
    if (!monthFilter) return;

    const months = Object.keys(monthlyData);
    monthFilter.innerHTML = months.map(month => `<option value="${month}">${month}</option>`).join('');
    
    const currentMonthName = new Date().toLocaleString('id-ID', { month: 'long' });
    if (months.includes(currentMonthName)) {
        monthFilter.value = currentMonthName;
    }
}


function renderMonthlyDistributionChart(month) {
    const ctx = document.getElementById('monthly-distribution-chart')?.getContext('2d');
    if (!ctx) return;

    const data = monthlyData[month];
    if (!data) return;


    if (monthlyDistributionChartInstance) {
        monthlyDistributionChartInstance.destroy();
    }

    monthlyDistributionChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Pending', 'Disposisi', 'Selesai'],
            datasets: [{
                data: [data.pending, data.disposisi, data.selesai],
                backgroundColor: ['#ffc107', '#007bff', '#28a745'],
                borderColor: '#ffffff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                }
            }
        }
    });
}


function renderYearlyTrendChart() {
    const ctx = document.getElementById('yearly-trend-chart')?.getContext('2d');
    if (!ctx) return;
    
    if (yearlyTrendChartInstance) {
        yearlyTrendChartInstance.destroy();
    }

    const months = Object.keys(monthlyData);
    const totalSuratPerMonth = months.map(month => {
        const { pending, disposisi, selesai } = monthlyData[month];
        return pending + disposisi + selesai;
    });

    yearlyTrendChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: 'Jumlah Surat Masuk',
                data: totalSuratPerMonth,
                backgroundColor: '#2c5ae9',
                borderColor: '#1c3e91',
                borderWidth: 1,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


function updateCharts(selectedMonth) {
    renderMonthlyDistributionChart(selectedMonth);
}


// --- INITIALIZATION ---

export const init = () => {
    // 1. Update total statistics cards
    updateStatCards(totalData);

    // 2. Populate the month filter dropdown
    populateMonthFilter();
    
    // 3. Render initial charts
    const initialMonth = document.getElementById('month-filter').value;
    updateCharts(initialMonth);
    renderYearlyTrendChart();

    // 4. Add event listener for when the filter selection changes
    const monthFilterEl = document.getElementById('month-filter');
    if (monthFilterEl) {
        monthFilterEl.addEventListener('change', (e) => {
            updateCharts(e.target.value);
        });
    }
};
    