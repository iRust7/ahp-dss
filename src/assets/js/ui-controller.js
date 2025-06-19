/**
 * Main Script untuk AHP Decision Support System
 * Mengelola UI dan integrasi dengan AHP Calculator
 */

// Global variables
let ahpCalculator;
let criteria = ['Jarak', 'Biaya', 'Fasilitas', 'Posisi', 'Luas'];
let alternatives = ['Safe\'n lock', 'Rungkut Industri', 'Spill'];

// Enhanced UX variables
let currentProgress = 0;
let validationTimer = null;
let lastInteraction = Date.now();
let isProcessing = false;

// Data default berdasarkan perhitungan Excel - Kelompok 5 (DIPERBAIKI UNTUK KONSISTENSI)
const defaultData = {
    criteriaMatrix: [
        [1, 2, 0.5, 1, 3],          // JARAK (prioritas sedang)
        [0.5, 1, 0.33, 0.5, 2],     // BIAYA (prioritas rendah)
        [2, 3, 1, 2, 4],            // FASILITAS (prioritas tinggi)
        [1, 2, 0.5, 1, 3],          // POSISI (prioritas sedang)
        [0.33, 0.5, 0.25, 0.33, 1] // LUAS (prioritas rendah)
    ],
    alternativeMatrices: {
        'Jarak': [
            [1, 0.25, 0.2],       // Safe'n lock (terjauh)
            [4, 1, 2],            // Rungkut Industri (sedang)
            [5, 0.5, 1]           // Spill (terdekat)
        ],
        'Biaya': [
            [1, 0.5, 0.33],       // Safe'n lock (mahal)
            [2, 1, 0.5],          // Rungkut Industri (sedang)
            [3, 2, 1]             // Spill (murah)
        ],
        'Fasilitas': [
            [1, 0.33, 0.25],      // Safe'n lock (fasilitas terbatas)
            [3, 1, 0.5],          // Rungkut Industri (fasilitas sedang)
            [4, 2, 1]             // Spill (fasilitas lengkap)
        ],
        'Posisi': [
            [1, 0.5, 0.33],       // Safe'n lock (posisi kurang strategis)
            [2, 1, 0.5],          // Rungkut Industri (posisi sedang)
            [3, 2, 1]             // Spill (posisi strategis)
        ],
        'Luas': [
            [1, 0.33, 0.25],      // Safe'n lock (luas terbatas)
            [3, 1, 0.5],          // Rungkut Industri (luas sedang)
            [4, 2, 1]             // Spill (luas besar)
        ]
    }
};

// Data default 2 - Data asli dari Excel (TIDAK KONSISTEN tapi sesuai perhitungan original)
const defaultData2 = {
    criteriaMatrix: [
        [1, 3, 0.2, 0.2, 3],          // JARAK
        [0.33, 1, 0.14, 0.33, 0.33],  // BIAYA  
        [5, 7, 1, 5, 0.2],            // FASILITAS
        [5, 3, 0.2, 1, 0.2],          // POSISI
        [0.33, 3, 5, 5, 1]            // LUAS
    ],
    alternativeMatrices: {
        'Jarak': [
            [1, 0.2, 0.17],       // Safe'n lock
            [5, 1, 3],            // Rungkut Industri
            [6, 0.33, 1]          // Spill
        ],
        'Biaya': [
            [1, 0.33, 0.5],       // Safe'n lock 
            [3, 1, 2],            // Rungkut Industri
            [2, 0.5, 1]           // Spill
        ],
        'Fasilitas': [
            [1, 0.25, 0.2],       // Safe'n lock 
            [4, 1, 2],            // Rungkut Industri
            [5, 0.5, 1]           // Spill
        ],
        'Posisi': [
            [1, 0.5, 0.33],       // Safe'n lock 
            [2, 1, 1.5],          // Rungkut Industri
            [3, 0.67, 1]          // Spill
        ],
        'Luas': [
            [1, 0.33, 0.25],      // Safe'n lock 
            [3, 1, 2],            // Rungkut Industri
            [4, 0.5, 1]           // Spill
        ]
    }
};

/**
 * Initialize the application
 */
document.addEventListener('DOMContentLoaded', function() {
    try {
        console.log('Initializing AHP Calculator...');
        
        // Initialize page load Lottie animation
        const pageLoadAnimation = lottie.loadAnimation({
            container: document.getElementById('lottiePageLoadAnimation'),
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: 'src/assets/animation/animasi_pageload.json'
        });
        
        // Initialize calculation Lottie animation (but don't play yet)
        window.calcAnimation = lottie.loadAnimation({
            container: document.getElementById('lottieCalcAnimation'),
            renderer: 'svg',
            loop: true,
            autoplay: false,
            path: 'src/assets/animation/animasi_calc.json'
        });
        
        // Initialize AHP Calculator
        ahpCalculator = new AHPCalculator();
        
        // Set initial data
        ahpCalculator.setCriteria(criteria);
        ahpCalculator.setAlternatives(alternatives);
        
        // Reset processing flag
        isProcessing = false;
        
        // Setup UI
        setupUI();
        setupEventListeners();
        updateUIElements();
        updateProgress();
        
        console.log('Application initialized successfully');
        
        // Hide loader after 2 seconds
        setTimeout(() => {
            const lottieLoader = document.getElementById('lottieLoader');
            if (lottieLoader) {
                lottieLoader.classList.add('fadeOut');
                setTimeout(() => {
                    lottieLoader.style.display = 'none';
                    showMessage('Sistem AHP berhasil diinisialisasi', 'success');
                }, 300);
            }
        }, 2000);
        
    } catch (error) {
        console.error('Error initializing application:', error);
        showMessage('Error saat menginisialisasi aplikasi: ' + error.message, 'error');
    }
});

/**
 * Setup initial UI elements
 */
function setupUI() {
    updateCriteriaList();
    updateAlternativesList();
    createCriteriaMatrix();
    createAlternativeMatrices();
    updateStats();
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('hidden');
        });
    }
    
    // Window resize handler
    window.addEventListener('resize', function() {
        updateProgress();
    });
    
    // Scroll handlers
    window.addEventListener('scroll', handleScroll);
    
    // Auto-save functionality
    setInterval(autoSave, 30000); // Auto-save every 30 seconds
    
    // Enhanced interaction tracking
    document.addEventListener('click', () => {
        lastInteraction = Date.now();
    });
    
    document.addEventListener('input', (e) => {
        lastInteraction = Date.now();
        if (e.target.classList.contains('matrix-input')) {
            validateInput(e.target);
        }
    });
}

/**
 * Handle scroll events for navigation enhancement
 */
function handleScroll() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollTop / scrollHeight) * 100;
    
    // Show/hide scroll to top button
    const scrollTopBtn = document.querySelector('.luxury-scroll-top');
    if (scrollTopBtn) {
        if (scrollTop > 300) {
            scrollTopBtn.classList.add('show');
        } else {
            scrollTopBtn.classList.remove('show');
        }
    }
    
    // Update navigation dots
    updateNavigationDots(scrollPercentage);
}

/**
 * Update navigation dots based on scroll position
 */
function updateNavigationDots(scrollPercentage) {
    const sections = ['teamSection', 'criteriaSection', 'matrixSection', 'resultsSection'];
    const navEnhancement = document.querySelector('.luxury-nav-enhancement');
    
    if (!navEnhancement) return;
    
    if (scrollPercentage > 10) {
        navEnhancement.classList.add('show');
    } else {
        navEnhancement.classList.remove('show');
    }
    
    // Update active section based on scroll position
    sections.forEach((sectionId, index) => {
        const section = document.getElementById(sectionId);
        const navDot = document.querySelector(`[data-section="${sectionId}"]`);
        
        if (section && navDot) {
            const rect = section.getBoundingClientRect();
            if (rect.top <= 100 && rect.bottom >= 100) {
                navDot.classList.add('active');
            } else {
                navDot.classList.remove('active');
            }
        }
    });
}

/**
 * Scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

/**
 * Update criteria list in UI
 */
function updateCriteriaList() {
    const criteriaList = document.getElementById('criteriaList');
    if (!criteriaList) return;
    
    criteriaList.innerHTML = criteria.map((criterion, index) => `
        <div class="luxury-list-item">
            <input type="text" value="${criterion}" onchange="updateCriterion(${index}, this.value)" 
                   class="flex-1 bg-transparent border-none text-white font-semibold focus:bg-blue-100 focus:bg-opacity-10 rounded px-2 py-1">
            <button onclick="removeCriterion(${index})" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    updateStats();
}

/**
 * Update alternatives list in UI
 */
function updateAlternativesList() {
    const alternativesList = document.getElementById('alternativesList');
    if (!alternativesList) return;
    
    alternativesList.innerHTML = alternatives.map((alternative, index) => `
        <div class="luxury-list-item">
            <input type="text" value="${alternative}" onchange="updateAlternative(${index}, this.value)" 
                   class="flex-1 bg-transparent border-none text-white font-semibold focus:bg-blue-100 focus:bg-opacity-10 rounded px-2 py-1">
            <button onclick="removeAlternative(${index})" class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    updateStats();
}

/**
 * Add new criterion
 */
function addCriteria() {
    const newCriteriaInput = document.getElementById('newCriteria');
    const newCriteria = newCriteriaInput.value.trim();
    
    if (newCriteria && !criteria.includes(newCriteria)) {
        criteria.push(newCriteria);
        newCriteriaInput.value = '';
        
        ahpCalculator.setCriteria(criteria);
        updateCriteriaList();
        createCriteriaMatrix();
        createAlternativeMatrices();
        updateProgress();
        
        showMessage(`Kriteria "${newCriteria}" berhasil ditambahkan`, 'success');
    } else if (criteria.includes(newCriteria)) {
        showMessage('Kriteria sudah ada', 'warning');
    } else {
        showMessage('Masukkan nama kriteria yang valid', 'warning');
    }
}

/**
 * Add new alternative
 */
function addAlternative() {
    const newAlternativeInput = document.getElementById('newAlternative');
    const newAlternative = newAlternativeInput.value.trim();
    
    if (newAlternative && !alternatives.includes(newAlternative)) {
        alternatives.push(newAlternative);
        newAlternativeInput.value = '';
        
        ahpCalculator.setAlternatives(alternatives);
        updateAlternativesList();
        createAlternativeMatrices();
        updateProgress();
        
        showMessage(`Alternatif "${newAlternative}" berhasil ditambahkan`, 'success');
    } else if (alternatives.includes(newAlternative)) {
        showMessage('Alternatif sudah ada', 'warning');
    } else {
        showMessage('Masukkan nama alternatif yang valid', 'warning');
    }
}

/**
 * Update criterion name
 */
function updateCriterion(index, newValue) {
    if (newValue.trim() && !criteria.includes(newValue.trim())) {
        const oldValue = criteria[index];
        criteria[index] = newValue.trim();
        
        ahpCalculator.setCriteria(criteria);
        createCriteriaMatrix();
        createAlternativeMatrices();
        updateProgress();
        
        showMessage(`Kriteria "${oldValue}" diubah menjadi "${newValue.trim()}"`, 'success');
    } else {
        showMessage('Nama kriteria tidak valid atau sudah ada', 'warning');
        updateCriteriaList(); // Reset to original values
    }
}

/**
 * Update alternative name
 */
function updateAlternative(index, newValue) {
    if (newValue.trim() && !alternatives.includes(newValue.trim())) {
        const oldValue = alternatives[index];
        alternatives[index] = newValue.trim();
        
        ahpCalculator.setAlternatives(alternatives);
        createAlternativeMatrices();
        updateProgress();
        
        showMessage(`Alternatif "${oldValue}" diubah menjadi "${newValue.trim()}"`, 'success');
    } else {
        showMessage('Nama alternatif tidak valid atau sudah ada', 'warning');
        updateAlternativesList(); // Reset to original values
    }
}

/**
 * Remove criterion
 */
function removeCriterion(index) {
    if (criteria.length <= 2) {
        showMessage('Minimal 2 kriteria diperlukan', 'warning');
        return;
    }
    
    const removedCriterion = criteria[index];
    criteria.splice(index, 1);
    
    ahpCalculator.setCriteria(criteria);
    updateCriteriaList();
    createCriteriaMatrix();
    createAlternativeMatrices();
    updateProgress();
    
    showMessage(`Kriteria "${removedCriterion}" berhasil dihapus`, 'success');
}

/**
 * Remove alternative
 */
function removeAlternative(index) {
    if (alternatives.length <= 2) {
        showMessage('Minimal 2 alternatif diperlukan', 'warning');
        return;
    }
    
    const removedAlternative = alternatives[index];
    alternatives.splice(index, 1);
    
    ahpCalculator.setAlternatives(alternatives);
    updateAlternativesList();
    createAlternativeMatrices();
    updateProgress();
    
    showMessage(`Alternatif "${removedAlternative}" berhasil dihapus`, 'success');
}

/**
 * Create criteria comparison matrix
 */
function createCriteriaMatrix() {
    const matrixContainer = document.getElementById('criteriaMatrix');
    if (!matrixContainer) return;
    
    const n = criteria.length;
    
    let html = '<thead><tr><th class="luxury-table-header">Kriteria</th>';
    criteria.forEach(criterion => {
        html += `<th class="luxury-table-header">${criterion}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    for (let i = 0; i < n; i++) {
        html += '<tr>';
        html += `<th class="luxury-table-header">${criteria[i]}</th>`;
        
        for (let j = 0; j < n; j++) {
            if (i === j) {
                html += '<td class="diagonal"><strong>1</strong></td>';
            } else if (i < j) {
                html += `<td><input type="number" class="matrix-input" data-criterion="criteria" data-i="${i}" data-j="${j}" 
                        min="0.11" max="9" step="0.01" value="1" 
                        onchange="updateMatrixValue('criteria', ${i}, ${j}, this.value)"></td>`;
            } else {
                html += '<td class="calculated" id="criteria-calc-' + i + '-' + j + '">1</td>';
            }
        }
        html += '</tr>';
    }
    html += '</tbody>';
    
    matrixContainer.innerHTML = html;
    matrixContainer.className = 'luxury-table w-full';
}

/**
 * Create alternative comparison matrices
 */
function createAlternativeMatrices() {
    const container = document.getElementById('alternativeMatrices');
    if (!container) return;
    
    container.innerHTML = '';
    
    criteria.forEach((criterion, criterionIndex) => {
        const matrixCard = document.createElement('div');
        matrixCard.className = 'alternative-matrix-card border-l-4 border-accent-green';
        
        const n = alternatives.length;
        
        let html = `
            <h4 class="text-lg font-semibold text-white mb-4 flex items-center">
                <i class="fas fa-table text-accent-green mr-3"></i>
                Matriks Perbandingan Alternatif - ${criterion}
            </h4>
            <div class="overflow-x-auto">
                <table class="luxury-table w-full">
                    <thead>
                        <tr>
                            <th class="luxury-table-header">Alternatif</th>`;
        
        alternatives.forEach(alternative => {
            html += `<th class="luxury-table-header">${alternative}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        for (let i = 0; i < n; i++) {
            html += '<tr>';
            html += `<th class="luxury-table-header">${alternatives[i]}</th>`;
            
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    html += '<td class="diagonal"><strong>1</strong></td>';
                } else if (i < j) {
                    html += `<td><input type="number" class="matrix-input" data-criterion="${criterion}" data-i="${i}" data-j="${j}" 
                            min="0.11" max="9" step="0.01" value="1" 
                            onchange="updateMatrixValue('${criterion}', ${i}, ${j}, this.value)"></td>`;
                } else {
                    html += `<td class="calculated" id="${criterion}-calc-${i}-${j}">1</td>`;
                }
            }
            html += '</tr>';
        }
        html += '</tbody></table></div>';
        
        matrixCard.innerHTML = html;
        container.appendChild(matrixCard);
    });
}

/**
 * Update matrix value
 */
function updateMatrixValue(criterion, i, j, value) {
    try {
        const numValue = parseFloat(value);
        if (isNaN(numValue) || numValue <= 0) {
            showMessage('Nilai harus berupa angka positif', 'error');
            return;
        }
        
        if (numValue < 0.11 || numValue > 9) {
            showMessage('Nilai harus antara 0.11 dan 9', 'warning');
        }
        
        // Update reciprocal value
        const reciprocal = (1 / numValue).toFixed(4);
        const calcId = criterion === 'criteria' ? 
            `criteria-calc-${j}-${i}` : 
            `${criterion}-calc-${j}-${i}`;
        
        const calcCell = document.getElementById(calcId);
        if (calcCell) {
            calcCell.textContent = reciprocal;
        }
        
        updateProgress();
        
        // Debounced validation
        if (validationTimer) {
            clearTimeout(validationTimer);
        }
        validationTimer = setTimeout(() => {
            validateMatrix(criterion);
        }, 1000);
        
    } catch (error) {
        console.error('Error updating matrix value:', error);
        showMessage('Error saat mengupdate nilai matrix', 'error');
    }
}

/**
 * Validate matrix input
 */
function validateInput(input) {
    const value = parseFloat(input.value);
    
    input.classList.remove('input-error', 'input-valid', 'pulse-error', 'pulse-success');
    
    if (isNaN(value) || value <= 0) {
        input.classList.add('input-error', 'pulse-error');
        return false;
    } else if (value < 0.11 || value > 9) {
        input.classList.add('input-error');
        return false;
    } else {
        input.classList.add('input-valid', 'pulse-success');
        return true;
    }
}

/**
 * Validate matrix consistency
 */
function validateMatrix(criterion) {
    try {
        // Get matrix values
        const matrix = [];
        const n = criterion === 'criteria' ? criteria.length : alternatives.length;
        
        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    matrix[i][j] = 1;
                } else {
                    const input = document.querySelector(`input[data-criterion="${criterion}"][data-i="${i}"][data-j="${j}"]`);
                    const calcCell = document.getElementById(`${criterion}-calc-${i}-${j}`);
                    
                    if (input) {
                        matrix[i][j] = parseFloat(input.value) || 1;
                    } else if (calcCell) {
                        matrix[i][j] = parseFloat(calcCell.textContent) || 1;
                    } else {
                        matrix[i][j] = 1;
                    }
                }
            }
        }
        
        // Basic consistency check (simplified)
        let isConsistent = true;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (Math.abs(matrix[i][j] * matrix[j][i] - 1) > 0.01) {
                    isConsistent = false;
                    break;
                }
            }
            if (!isConsistent) break;
        }
        
        return isConsistent;
        
    } catch (error) {
        console.error('Error validating matrix:', error);
        return false;
    }
}

/**
 * Load default data
 */
function loadDefaultData() {
    try {
        // Set criteria matrix
        const criteriaInputs = document.querySelectorAll('input[data-criterion="criteria"]');
        criteriaInputs.forEach(input => {
            const i = parseInt(input.dataset.i);
            const j = parseInt(input.dataset.j);
            if (defaultData.criteriaMatrix[i] && defaultData.criteriaMatrix[i][j] !== undefined) {
                input.value = defaultData.criteriaMatrix[i][j];
                updateMatrixValue('criteria', i, j, input.value);
            }
        });
        
        // Set alternative matrices
        criteria.forEach(criterion => {
            if (defaultData.alternativeMatrices[criterion]) {
                const altInputs = document.querySelectorAll(`input[data-criterion="${criterion}"]`);
                altInputs.forEach(input => {
                    const i = parseInt(input.dataset.i);
                    const j = parseInt(input.dataset.j);
                    if (defaultData.alternativeMatrices[criterion][i] && 
                        defaultData.alternativeMatrices[criterion][i][j] !== undefined) {
                        input.value = defaultData.alternativeMatrices[criterion][i][j];
                        updateMatrixValue(criterion, i, j, input.value);
                    }
                });
            }
        });
        
        showMessage('Data default berhasil dimuat', 'success');
        updateProgress();
        
    } catch (error) {
        console.error('Error loading default data:', error);
        showMessage('Error saat memuat data default', 'error');
    }
}

/**
 * Load default data 2 - Data asli dari Excel (tidak konsisten)
 */
function loadDefaultData2() {
    try {
        // Set criteria matrix
        const criteriaInputs = document.querySelectorAll('input[data-criterion="criteria"]');
        criteriaInputs.forEach(input => {
            const i = parseInt(input.dataset.i);
            const j = parseInt(input.dataset.j);
            if (defaultData2.criteriaMatrix[i] && defaultData2.criteriaMatrix[i][j] !== undefined) {
                input.value = defaultData2.criteriaMatrix[i][j];
                updateMatrixValue('criteria', i, j, input.value);
            }
        });
        
        // Set alternative matrices
        criteria.forEach(criterion => {
            if (defaultData2.alternativeMatrices[criterion]) {
                const altInputs = document.querySelectorAll(`input[data-criterion="${criterion}"]`);
                altInputs.forEach(input => {
                    const i = parseInt(input.dataset.i);
                    const j = parseInt(input.dataset.j);
                    if (defaultData2.alternativeMatrices[criterion][i] && 
                        defaultData2.alternativeMatrices[criterion][i][j] !== undefined) {
                        input.value = defaultData2.alternativeMatrices[criterion][i][j];
                        updateMatrixValue(criterion, i, j, input.value);
                    }
                });
            }
        });
        
        showMessage('Data default 2 (data asli Excel) berhasil dimuat - Perhatikan: Data ini tidak konsisten!', 'warning');
        updateProgress();
        
    } catch (error) {
        console.error('Error loading default data 2:', error);
        showMessage('Error saat memuat data default 2', 'error');
    }
}

/**
 * Update UI elements with current data
 */
function updateUIElements() {
    updateStats();
    updateProgress();
}

/**
 * Update statistics display
 */
function updateStats() {
    // Update criteria count
    const criteriaCountEl = document.getElementById('totalCriteria');
    if (criteriaCountEl) {
        criteriaCountEl.textContent = criteria.length;
    }
    
    // Update alternatives count
    const alternativesCountEl = document.getElementById('totalAlternatives');
    if (alternativesCountEl) {
        alternativesCountEl.textContent = alternatives.length;
    }
    
    // Update total comparisons
    const totalComparisons = (criteria.length * (criteria.length - 1)) / 2 + 
                            criteria.length * (alternatives.length * (alternatives.length - 1)) / 2;
    const comparisonsEl = document.getElementById('totalComparisons');
    if (comparisonsEl) {
        comparisonsEl.textContent = totalComparisons;
    }
    
    // Update consistency ratio (placeholder)
    const consistencyEl = document.getElementById('consistencyRatio');
    if (consistencyEl) {
        consistencyEl.textContent = '0.08';
    }
}

/**
 * Update progress indicator
 */
function updateProgress() {
    try {
        // Calculate completion percentage
        let totalInputs = 0;
        let filledInputs = 0;
        
        // Count criteria matrix inputs
        const criteriaInputs = document.querySelectorAll('input[data-criterion="criteria"]');
        totalInputs += criteriaInputs.length;
        criteriaInputs.forEach(input => {
            if (input.value && parseFloat(input.value) > 0) {
                filledInputs++;
            }
        });
        
        // Count alternative matrix inputs
        criteria.forEach(criterion => {
            const altInputs = document.querySelectorAll(`input[data-criterion="${criterion}"]`);
            totalInputs += altInputs.length;
            altInputs.forEach(input => {
                if (input.value && parseFloat(input.value) > 0) {
                    filledInputs++;
                }
            });
        });
        
        const percentage = totalInputs > 0 ? Math.round((filledInputs / totalInputs) * 100) : 0;
        currentProgress = percentage;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        const progressPercentage = document.getElementById('progressPercentage');
        
        if (progressFill) {
            progressFill.style.width = percentage + '%';
        }
        
        if (progressPercentage) {
            progressPercentage.textContent = percentage + '%';
        }
        
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

/**
 * Auto-save functionality
 */
function autoSave() {
    try {
        const saveData = {
            criteria: criteria,
            alternatives: alternatives,
            timestamp: new Date().toISOString(),
            progress: currentProgress
        };
        
        localStorage.setItem('ahp_autosave', JSON.stringify(saveData));
        console.log('Auto-save completed at', new Date().toLocaleTimeString());
        
    } catch (error) {
        console.error('Error during auto-save:', error);
    }
}

/**
 * Process AHP calculation
 */
function processAHP() {
    if (isProcessing) {
        showMessage('Perhitungan sedang dalam proses, harap tunggu...', 'warning');
        return;
    }
    
    try {
        isProcessing = true;
        
        // Show Lottie calculation animation
        const lottieCalcLoader = document.getElementById('lottieCalcLoader');
        if (lottieCalcLoader) {
            lottieCalcLoader.classList.remove('hidden');
            lottieCalcLoader.classList.add('fadeIn');
            window.calcAnimation.play();
        }
        
        // Delay the actual calculation to show the animation
        setTimeout(() => {
            try {
                // Collect all matrix data
                const matricesData = collectMatrixData();
                
                if (!matricesData) {
                    isProcessing = false;
                    hideCalcLoader();
                    return;
                }
                
                // Set data to calculator
                ahpCalculator.setCriteriaMatrix(matricesData.criteriaMatrix);
                
                Object.keys(matricesData.alternativeMatrices).forEach(criterion => {
                    ahpCalculator.setAlternativeMatrix(criterion, matricesData.alternativeMatrices[criterion]);
                });
                
                // Validate data
                const validation = ahpCalculator.validateData();
                if (!validation.isValid) {
                    showMessage('Validasi gagal: ' + validation.errors.join(', '), 'error');
                    isProcessing = false;
                    hideCalcLoader();
                    return;
                }
                
                // Perform calculation
                const results = ahpCalculator.calculate();
                
                if (results.success) {
                    displayResults(results);
                    
                    // Hide the loader and show success message
                    setTimeout(() => {
                        hideCalcLoader();
                        showMessage('Perhitungan AHP berhasil diselesaikan!', 'success');
                        
                        // Show results section
                        const resultsSection = document.getElementById('resultsSection');
                        if (resultsSection) {
                            resultsSection.classList.remove('hidden');
                            
                            // Scroll to results
                            setTimeout(() => {
                                resultsSection.scrollIntoView({ 
                                    behavior: 'smooth',
                                    block: 'start'
                                });
                            }, 500);
                        }
                    }, 500);
                } else {
                    hideCalcLoader();
                    throw new Error(results.error || 'Perhitungan gagal');
                }
            } catch (error) {
                hideCalcLoader();
                console.error('Error in AHP processing:', error);
                showMessage('Error saat memproses AHP: ' + error.message, 'error');
            } finally {
                isProcessing = false;
            }
        }, 2000); // 2 second delay to show the animation
        
    } catch (error) {
        hideCalcLoader();
        console.error('Error in AHP processing:', error);
        showMessage('Error saat memproses AHP: ' + error.message, 'error');
        isProcessing = false;
    }
}

/**
 * Hide calculation loader
 */
function hideCalcLoader() {
    const lottieCalcLoader = document.getElementById('lottieCalcLoader');
    if (lottieCalcLoader) {
        lottieCalcLoader.classList.add('fadeOut');
        setTimeout(() => {
            lottieCalcLoader.classList.remove('fadeOut');
            lottieCalcLoader.classList.add('hidden');
            window.calcAnimation.stop();
        }, 300);
    }
}

/**
 * Collect matrix data from UI
 */
function collectMatrixData() {
    try {
        const data = {
            criteriaMatrix: [],
            alternativeMatrices: {}
        };
        
        // Collect criteria matrix
        const n = criteria.length;
        for (let i = 0; i < n; i++) {
            data.criteriaMatrix[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    data.criteriaMatrix[i][j] = 1;
                } else if (i < j) {
                    const input = document.querySelector(`input[data-criterion="criteria"][data-i="${i}"][data-j="${j}"]`);
                    data.criteriaMatrix[i][j] = input ? parseFloat(input.value) || 1 : 1;
                } else {
                    data.criteriaMatrix[i][j] = 1 / data.criteriaMatrix[j][i];
                }
            }
        }
        
        // Collect alternative matrices
        const m = alternatives.length;
        criteria.forEach(criterion => {
            data.alternativeMatrices[criterion] = [];
            for (let i = 0; i < m; i++) {
                data.alternativeMatrices[criterion][i] = [];
                for (let j = 0; j < m; j++) {
                    if (i === j) {
                        data.alternativeMatrices[criterion][i][j] = 1;
                    } else if (i < j) {
                        const input = document.querySelector(`input[data-criterion="${criterion}"][data-i="${i}"][data-j="${j}"]`);
                        data.alternativeMatrices[criterion][i][j] = input ? parseFloat(input.value) || 1 : 1;
                    } else {
                        data.alternativeMatrices[criterion][i][j] = 1 / data.alternativeMatrices[criterion][j][i];
                    }
                }
            }
        });
        
        return data;
        
    } catch (error) {
        console.error('Error collecting matrix data:', error);
        showMessage('Error saat mengumpulkan data matrix', 'error');
        return null;
    }
}

/**
 * Display calculation results
 */
function displayResults(results) {
    try {
        displayCriteriaWeights(results);
        displayAlternativeScores(results);
        displayConsistencyResults(results);
        createCharts(results);
        
    } catch (error) {
        console.error('Error displaying results:', error);
        showMessage('Error saat menampilkan hasil', 'error');
    }
}

/**
 * Display criteria weights
 */
function displayCriteriaWeights(results) {
    const container = document.getElementById('criteriaWeights');
    if (!container) return;
    
    const detailedResults = ahpCalculator.getDetailedResults();
    
    let html = `
        <thead>
            <tr>
                <th class="luxury-table-header">Kriteria</th>
                <th class="luxury-table-header">Bobot</th>
                <th class="luxury-table-header">Persentase</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    detailedResults.criteria.forEach((item, index) => {
        html += `
            <tr>
                <td class="font-semibold text-white">${item.name}</td>
                <td class="text-center">${item.weight.toFixed(4)}</td>
                <td class="text-center">
                    <span class="luxury-importance-badge">${item.percentage}%</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody>';
    container.innerHTML = html;
    container.className = 'luxury-table w-full';
}

/**
 * Display alternative scores
 */
function displayAlternativeScores(results) {
    const container = document.getElementById('finalScores');
    if (!container) return;
    
    const detailedResults = ahpCalculator.getDetailedResults();
    
    let html = `
        <thead>
            <tr>
                <th class="luxury-table-header">Rank</th>
                <th class="luxury-table-header">Alternatif</th>
                <th class="luxury-table-header">Skor</th>
                <th class="luxury-table-header">Persentase</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    detailedResults.alternatives.forEach((item, index) => {
        html += `
            <tr>
                <td class="text-center">
                    <span class="rank-badge rank-${item.rank}">${item.rank}</span>
                </td>
                <td class="font-semibold text-white">${item.name}</td>
                <td class="text-center">${item.score}</td>
                <td class="text-center">${item.percentage}%</td>
            </tr>
        `;
    });
    
    html += '</tbody>';
    container.innerHTML = html;
    container.className = 'luxury-table w-full';
}

/**
 * Display consistency results
 */
function displayConsistencyResults(results) {
    const container = document.getElementById('consistencyResults');
    if (!container) return;
    
    let html = '';
    
    // Criteria consistency
    const criteriaConsistency = results.consistency.criteria;
    const criteriaStatus = criteriaConsistency.isConsistent ? 'good' : 'warning';
    const criteriaIcon = criteriaConsistency.isConsistent ? 'check-circle' : 'exclamation-triangle';
    const criteriaColor = criteriaConsistency.isConsistent ? 'text-green-400' : 'text-yellow-400';
    
    html += `
        <div class="consistency-${criteriaStatus} p-4 rounded-lg">
            <h4 class="font-semibold mb-2 flex items-center ${criteriaColor}">
                <i class="fas fa-${criteriaIcon} mr-2"></i>
                Konsistensi Kriteria
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="text-gray-400">λ max:</span>
                    <span class="text-white font-semibold">${criteriaConsistency.lambdaMax.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-400">CI:</span>
                    <span class="text-white font-semibold">${criteriaConsistency.ci.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-400">RI:</span>
                    <span class="text-white font-semibold">${criteriaConsistency.ri.toFixed(4)}</span>
                </div>
                <div>
                    <span class="text-gray-400">CR:</span>
                    <span class="text-white font-semibold">${criteriaConsistency.cr.toFixed(4)}</span>
                </div>
            </div>
            <p class="mt-2 text-sm">
                ${criteriaConsistency.isConsistent ? 
                    'Matriks kriteria konsisten (CR ≤ 0.1)' : 
                    'Matriks kriteria kurang konsisten (CR > 0.1)'}
            </p>
        </div>
    `;
    
    // Alternative consistency
    criteria.forEach(criterion => {
        const altConsistency = results.consistency[criterion];
        if (altConsistency) {
            const altStatus = altConsistency.isConsistent ? 'good' : 'warning';
            const altIcon = altConsistency.isConsistent ? 'check-circle' : 'exclamation-triangle';
            const altColor = altConsistency.isConsistent ? 'text-green-400' : 'text-yellow-400';
            
            html += `
                <div class="consistency-${altStatus} p-4 rounded-lg">
                    <h4 class="font-semibold mb-2 flex items-center ${altColor}">
                        <i class="fas fa-${altIcon} mr-2"></i>
                        Konsistensi Alternatif - ${criterion}
                    </h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="text-gray-400">λ max:</span>
                            <span class="text-white font-semibold">${altConsistency.lambdaMax.toFixed(4)}</span>
                        </div>
                        <div>
                            <span class="text-gray-400">CI:</span>
                            <span class="text-white font-semibold">${altConsistency.ci.toFixed(4)}</span>
                        </div>
                        <div>
                            <span class="text-gray-400">RI:</span>
                            <span class="text-white font-semibold">${altConsistency.ri.toFixed(4)}</span>
                        </div>
                        <div>
                            <span class="text-gray-400">CR:</span>
                            <span class="text-white font-semibold">${altConsistency.cr.toFixed(4)}</span>
                        </div>
                    </div>
                    <p class="mt-2 text-sm">
                        ${altConsistency.isConsistent ? 
                            'Matriks alternatif konsisten (CR ≤ 0.1)' : 
                            'Matriks alternatif kurang konsisten (CR > 0.1)'}
                    </p>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

/**
 * Create charts for visualization
 */
function createCharts(results) {
    createCriteriaChart(results);
    createScoresChart(results);
}

/**
 * Create criteria weights chart
 */
function createCriteriaChart(results) {
    const canvas = document.getElementById('criteriaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const detailedResults = ahpCalculator.getDetailedResults();
    
    // Destroy existing chart if exists
    if (window.criteriaChartInstance) {
        window.criteriaChartInstance.destroy();
    }
    
    window.criteriaChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: detailedResults.criteria.map(item => item.name),
            datasets: [{
                data: detailedResults.criteria.map(item => item.percentage),
                backgroundColor: [
                    '#3b82f6', // Blue
                    '#10b981', // Green
                    '#8b5cf6', // Purple
                    '#f59e0b', // Gold
                    '#ef4444'  // Red
                ],
                borderColor: '#1f2937',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#e5e7eb',
                        padding: 20,
                        font: {
                            size: 12
                        }
                    }
                },
                title: {
                    display: true,
                    text: 'Distribusi Bobot Kriteria',
                    color: '#e5e7eb',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            }
        }
    });
}

/**
 * Create alternative scores chart
 */
function createScoresChart(results) {
    const canvas = document.getElementById('scoresChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const detailedResults = ahpCalculator.getDetailedResults();
    
    // Destroy existing chart if exists
    if (window.scoresChartInstance) {
        window.scoresChartInstance.destroy();
    }
    
    window.scoresChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: detailedResults.alternatives.map(item => item.name),
            datasets: [{
                label: 'Skor Final',
                data: detailedResults.alternatives.map(item => parseFloat(item.score)),
                backgroundColor: [
                    '#fbbf24', // Gold for rank 1
                    '#d1d5db', // Silver for rank 2
                    '#fb7185'  // Bronze for rank 3
                ],
                borderColor: '#1f2937',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: 'Skor Final Alternatif',
                    color: '#e5e7eb',
                    font: {
                        size: 16,
                        weight: 'bold'
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#e5e7eb'
                    }
                },
                x: {
                    grid: {
                        color: '#374151'
                    },
                    ticks: {
                        color: '#e5e7eb'
                    }
                }
            }
        }
    });
}

/**
 * Export results to JSON
 */
function exportResults() {
    try {
        const detailedResults = ahpCalculator.getDetailedResults();
        const exportData = {
            metadata: {
                title: 'AHP Decision Support System - Results',
                timestamp: new Date().toISOString(),
                criteria: criteria,
                alternatives: alternatives
            },
            results: detailedResults,
            rawResults: ahpCalculator.results
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ahp-results-${new Date().toISOString().split('T')[0]}.json`;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showMessage('Hasil berhasil diekspor ke file JSON', 'success');
        
    } catch (error) {
        console.error('Error exporting results:', error);
        showMessage('Error saat mengekspor hasil', 'error');
    }
}

/**
 * Print results
 */
function printResults() {
    try {
        window.print();
        showMessage('Dialog print dibuka', 'info');
        
    } catch (error) {
        console.error('Error printing results:', error);
        showMessage('Error saat mencetak hasil', 'error');
    }
}

/**
 * Show floating message
 */
function showMessage(message, type = 'info') {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'floating-message fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 max-w-sm';
    
    switch (type) {
        case 'success':
            messageDiv.className += ' bg-green-100 border border-green-400 text-green-700';
            break;
        case 'error':
            messageDiv.className += ' bg-red-100 border border-red-400 text-red-700';
            break;
        case 'warning':
            messageDiv.className += ' bg-yellow-100 border border-yellow-400 text-yellow-700';
            break;
        default:
            messageDiv.className += ' bg-blue-100 border border-blue-400 text-blue-700';
    }
    
    messageDiv.innerHTML = `
        <div class="flex items-center">
            <div class="flex-1">${message}</div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-red-400 hover:text-red-300 luxury-button-sm">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(messageDiv);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.remove();
        }
    }, 5000);
    
    // Update last interaction time
    lastInteraction = Date.now();
}
