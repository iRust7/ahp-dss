/**
 * Main Script untuk AHP Decision Support System
 * Mengelola UI dan integrasi dengan AHP Calculator
 */

// Global variables
let ahpCalculator;
let criteria = ['Jarak', 'Biaya', 'Fasilitas', 'Posisi Geografis', 'Luas Gudang'];
let alternatives = ['Safe\'n Lock', 'Rungkut Industri', 'SPILL'];

// Enhanced UX variables
let currentProgress = 0;
let validationTimer = null;
let lastInteraction = Date.now();

// Data default berdasarkan studi kasus
const defaultData = {
    criteriaMatrix: [
        [1, 0.2, 0.33, 0.5, 0.25],
        [5, 1, 3, 2, 0.5],
        [3, 0.33, 1, 2, 0.33],
        [2, 0.5, 0.5, 1, 0.25],
        [4, 2, 3, 4, 1]
    ],
    alternativeMatrices: {
        'Jarak': [
            [1, 3, 5],
            [0.33, 1, 3],
            [0.2, 0.33, 1]
        ],
        'Biaya': [
            [1, 0.5, 0.33],
            [2, 1, 0.5],
            [3, 2, 1]
        ],
        'Fasilitas': [
            [1, 2, 3],
            [0.5, 1, 2],
            [0.33, 0.5, 1]
        ],
        'Posisi Geografis': [
            [1, 3, 2],
            [0.33, 1, 0.5],
            [0.5, 2, 1]
        ],
        'Luas Gudang': [
            [1, 0.5, 2],
            [2, 1, 3],
            [0.5, 0.33, 1]
        ]
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

/**
 * Initialize the application with enhanced features
 */
function initializeApp() {
    ahpCalculator = new AHPCalculator();
    ahpCalculator.setCriteria(criteria);
    ahpCalculator.setAlternatives(alternatives);
    
    renderCriteriaList();
    renderAlternativesList();
    renderEnhancedCriteriaMatrix();
    renderEnhancedAlternativeMatrices();
    initializeEnhancements();
    
    // Initialize progress tracking
    calculateMatrixCompleteness('criteria');
    calculateMatrixCompleteness('alternatives');
    
    // Show welcome message
    setTimeout(() => {
        showMessage('Selamat datang! Gunakan Ctrl+D untuk memuat data default atau mulai input manual.', 'info');
    }, 1000);
}

/**
 * Render criteria list
 */
function renderCriteriaList() {
    const container = document.getElementById('criteriaList');
    container.innerHTML = '';
      criteria.forEach((criterion, index) => {
        const item = document.createElement('div');
        item.className = 'luxury-list-item';
        item.innerHTML = `
            <input type="text" value="${criterion}" 
                   onchange="updateCriteria(${index}, this.value)"
                   class="flex-1 bg-transparent border-none outline-none font-medium text-white">
            <button onclick="removeCriteria(${index})" 
                    class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

/**
 * Render alternatives list
 */
function renderAlternativesList() {
    const container = document.getElementById('alternativesList');
    container.innerHTML = '';
      alternatives.forEach((alternative, index) => {
        const item = document.createElement('div');
        item.className = 'luxury-list-item';
        item.innerHTML = `
            <input type="text" value="${alternative}" 
                   onchange="updateAlternative(${index}, this.value)"
                   class="flex-1 bg-transparent border-none outline-none font-medium text-white">
            <button onclick="removeAlternative(${index})" 
                    class="remove-btn">
                <i class="fas fa-times"></i>
            </button>
        `;
        container.appendChild(item);
    });
}

/**
 * Add new criteria
 */
function addCriteria() {
    const input = document.getElementById('newCriteria');
    const newCriteria = input.value.trim();
      if (newCriteria && !criteria.includes(newCriteria)) {
        criteria.push(newCriteria);
        input.value = '';
        updateDataStructure();
        renderCriteriaList();
        renderEnhancedCriteriaMatrix();
        renderEnhancedAlternativeMatrices();
    }
}

/**
 * Add new alternative
 */
function addAlternative() {
    const input = document.getElementById('newAlternative');
    const newAlternative = input.value.trim();
      if (newAlternative && !alternatives.includes(newAlternative)) {
        alternatives.push(newAlternative);
        input.value = '';
        updateDataStructure();
        renderAlternativesList();
        renderEnhancedAlternativeMatrices();
    }
}

/**
 * Update criteria name
 */
function updateCriteria(index, newValue) {    if (newValue.trim()) {
        criteria[index] = newValue.trim();
        updateDataStructure();
        renderEnhancedAlternativeMatrices();
    }
}

/**
 * Update alternative name
 */
function updateAlternative(index, newValue) {
    if (newValue.trim()) {
        alternatives[index] = newValue.trim();
        updateDataStructure();
    }
}

/**
 * Remove criteria
 */
function removeCriteria(index) {    if (criteria.length > 2) {
        criteria.splice(index, 1);
        updateDataStructure();
        renderCriteriaList();
        renderEnhancedCriteriaMatrix();
        renderEnhancedAlternativeMatrices();
    } else {
        alert('Minimal 2 kriteria diperlukan!');
    }
}

/**
 * Remove alternative
 */
function removeAlternative(index) {    if (alternatives.length > 2) {
        alternatives.splice(index, 1);
        updateDataStructure();
        renderAlternativesList();
        renderEnhancedAlternativeMatrices();
    } else {
        alert('Minimal 2 alternatif diperlukan!');
    }
}

/**
 * Update data structure when criteria or alternatives change
 */
function updateDataStructure() {
    ahpCalculator.setCriteria(criteria);
    ahpCalculator.setAlternatives(alternatives);
}

/**
 * Render criteria comparison matrix
 */
function renderCriteriaMatrix() {
    const container = document.getElementById('criteriaMatrix');
    const n = criteria.length;
    
    let html = '<table class="luxury-table w-full">';
    
    // Header row
    html += '<thead><tr><th class="p-3">Kriteria</th>';
    criteria.forEach(criterion => {
        html += `<th class="p-3 text-sm">${criterion}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Matrix rows
    for (let i = 0; i < n; i++) {
        html += `<tr><td class="p-3 font-medium">${criteria[i]}</td>`;
        
        for (let j = 0; j < n; j++) {
            if (i === j) {
                html += `<td class="p-2 diagonal">1</td>`;
            } else if (i < j) {
                html += `<td class="p-2">
                    <input type="number" step="0.01" min="0.11" max="9" value="1"
                           onchange="updateCriteriaMatrix(${i}, ${j}, this.value)"
                           class="matrix-input">
                </td>`;
            } else {
                html += `<td class="p-2 calculated" id="criteria-${i}-${j}">1</td>`;
            }
        }
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
}

/**
 * Render alternative comparison matrices
 */
function renderAlternativeMatrices() {
    const container = document.getElementById('alternativeMatrices');
    container.innerHTML = '';
    
    criteria.forEach(criterion => {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'alternative-matrix-card';
        
        const n = alternatives.length;
        let html = `
            <h4 class="text-lg font-display font-bold text-white mb-4 flex items-center">
                <i class="fas fa-table text-green-600 mr-3"></i>
                Matriks Perbandingan: ${criterion}
            </h4>            <div class="overflow-x-auto">
                <table class="luxury-table w-full">
                    <thead>
                        <tr>
                            <th class="p-3">Alternatif</th>
        `;
        
        alternatives.forEach(alternative => {
            html += `<th class="p-3 text-sm">${alternative}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        for (let i = 0; i < n; i++) {
            html += `<tr><td class="p-3 font-medium">${alternatives[i]}</td>`;
            
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    html += `<td class="p-2 diagonal">1</td>`;
                } else if (i < j) {
                    html += `<td class="p-2">
                        <input type="number" step="0.01" min="0.11" max="9" value="1"
                               onchange="updateAlternativeMatrix('${criterion}', ${i}, ${j}, this.value)"
                               class="matrix-input">
                    </td>`;
                } else {
                    html += `<td class="p-2 calculated" id="alt-${criterion}-${i}-${j}">1</td>`;
                }
            }
            html += '</tr>';
        }
        
        html += '</tbody></table></div>';
        matrixDiv.innerHTML = html;
        container.appendChild(matrixDiv);
    });
}

/**
 * Enhanced input validation with real-time feedback
 */
function validateMatrixInput(input, i, j, matrixType = 'criteria') {
    const value = parseFloat(input.value);
    const isValid = !isNaN(value) && value > 0 && value <= 9;
    
    // Remove existing validation classes
    input.classList.remove('input-error', 'input-valid', 'pulse-error', 'pulse-success');
    
    if (input.value === '') {
        input.style.borderColor = '';
        return true; // Empty is okay, will default to 1
    }
    
    if (!isValid) {
        input.classList.add('input-error', 'pulse-error');
        showTooltipMessage(input, 'Nilai harus antara 0.1 dan 9', 'error');
        return false;
    } else {
        input.classList.add('input-valid', 'pulse-success');
        updateReciprocal(input, value, i, j, matrixType);
        clearTimeout(validationTimer);
        validationTimer = setTimeout(() => {
            validateCompleteMatrix(matrixType);
        }, 500);
        return true;
    }
}

/**
 * Update reciprocal cell with enhanced animation
 */
function updateReciprocal(input, value, i, j, matrixType) {
    const reciprocal = (1 / value).toFixed(3);
    const cellId = matrixType === 'criteria' ? `criteria-${j}-${i}` : `alt-${input.dataset.criterion}-${j}-${i}`;
    const reciprocalCell = document.getElementById(cellId);
    
    if (reciprocalCell) {
        reciprocalCell.style.transform = 'scale(1.1)';
        reciprocalCell.style.backgroundColor = '#fef3c7';
        reciprocalCell.textContent = reciprocal;
        
        setTimeout(() => {
            reciprocalCell.style.transform = 'scale(1)';
            reciprocalCell.style.backgroundColor = '';
        }, 300);
    }
}

/**
 * Show tooltip message near input
 */
function showTooltipMessage(element, message, type = 'info') {
    // Remove existing tooltips
    document.querySelectorAll('.input-tooltip').forEach(tooltip => tooltip.remove());
    
    const tooltip = document.createElement('div');
    tooltip.className = `input-tooltip message-${type} absolute z-10 px-2 py-1 text-xs rounded shadow-lg`;
    tooltip.textContent = message;
    tooltip.style.left = '100%';
    tooltip.style.top = '0';
    tooltip.style.marginLeft = '8px';
    tooltip.style.whiteSpace = 'nowrap';
    
    element.style.position = 'relative';
    element.parentElement.style.position = 'relative';
    element.parentElement.appendChild(tooltip);
    
    setTimeout(() => tooltip.remove(), 3000);
}

/**
 * Matrix completion helper with progress indicator
 */
function calculateMatrixCompleteness(matrixType = 'criteria') {
    const inputs = matrixType === 'criteria' 
        ? document.querySelectorAll('#criteriaMatrix input')
        : document.querySelectorAll('#alternativeMatrices input');
    
    let filled = 0;
    let total = inputs.length;
    
    inputs.forEach(input => {
        if (input.value && input.value !== '1' && parseFloat(input.value) > 0) {
            filled++;
        }
    });
    
    const percentage = total > 0 ? (filled / total) * 100 : 0;
    updateProgressIndicator(matrixType, percentage);
    
    return { filled, total, percentage };
}

/**
 * Update progress indicator
 */
function updateProgressIndicator(matrixType, percentage) {
    const indicatorId = matrixType === 'criteria' ? 'criteriaProgress' : 'alternativesProgress';
    let indicator = document.getElementById(indicatorId);
    
    if (!indicator) {
        // Create progress indicator if it doesn't exist
        const container = matrixType === 'criteria' 
            ? document.querySelector('#criteriaMatrix').parentElement.parentElement
            : document.querySelector('#alternativeMatrices');
        
        const progressDiv = document.createElement('div');
        progressDiv.innerHTML = `
            <div class="mt-4 mb-2">
                <div class="flex justify-between text-sm text-primary-light mb-1">
                    <span>Kelengkapan ${matrixType === 'criteria' ? 'Matriks Kriteria' : 'Matriks Alternatif'}</span>
                    <span id="${indicatorId}-text">0%</span>
                </div>
                <div class="progress-indicator">
                    <div id="${indicatorId}" class="progress-bar" style="width: 0%"></div>
                </div>
            </div>
        `;
        container.appendChild(progressDiv);
        indicator = document.getElementById(indicatorId);
    }
    
    if (indicator) {
        indicator.style.width = `${percentage}%`;
        const textElement = document.getElementById(`${indicatorId}-text`);
        if (textElement) {
            textElement.textContent = `${Math.round(percentage)}%`;
        }
    }
}

/**
 * Smart matrix suggestions
 */
function suggestMatrixValues(element, i, j) {
    if (element.value === '') {
        const suggestions = [1, 2, 3, 4, 5];
        const suggestionDiv = document.createElement('div');
        suggestionDiv.className = 'absolute suggestion-box border rounded shadow-lg p-2 z-20';
        suggestionDiv.style.top = '100%';
        suggestionDiv.style.left = '0';
        suggestionDiv.style.minWidth = '120px';
          suggestions.forEach(value => {
            const btn = document.createElement('button');
            btn.className = 'suggestion-item block w-full text-left';
            btn.textContent = `${value} - ${getScaleDescription(value)}`;
            btn.onclick = () => {
                element.value = value;
                element.dispatchEvent(new Event('change'));
                suggestionDiv.remove();
            };
            suggestionDiv.appendChild(btn);
        });
        
        element.parentElement.style.position = 'relative';
        element.parentElement.appendChild(suggestionDiv);
        
        // Remove on click outside
        setTimeout(() => {
            document.addEventListener('click', function handler(e) {
                if (!suggestionDiv.contains(e.target) && e.target !== element) {
                    suggestionDiv.remove();
                    document.removeEventListener('click', handler);
                }
            });
        }, 100);
    }
}

/**
 * Get description for scale value
 */
function getScaleDescription(value) {
    const descriptions = {
        1: 'Sama penting',
        2: 'Sedikit condong',
        3: 'Sedikit lebih penting',
        4: 'Lebih condong',
        5: 'Lebih penting',
        6: 'Sangat condong',
        7: 'Sangat penting',
        8: 'Amat sangat condong',
        9: 'Mutlak lebih penting'
    };
    return descriptions[value] || 'Nilai tengah';
}

/**
 * Enhanced criteria matrix rendering with improvements
 */
function renderEnhancedCriteriaMatrix() {
    const container = document.getElementById('criteriaMatrix');
    const n = criteria.length;
    
    let html = '<table class="luxury-table enhanced-table w-full">';
    
    // Header row
    html += '<thead><tr><th class="p-3">Kriteria</th>';
    criteria.forEach(criterion => {
        html += `<th class="p-3 text-sm">${criterion}</th>`;
    });
    html += '</tr></thead><tbody>';
    
    // Matrix rows with enhanced features
    for (let i = 0; i < n; i++) {
        html += `<tr><td class="p-3 font-medium">${criteria[i]}</td>`;
        
        for (let j = 0; j < n; j++) {
            if (i === j) {
                html += `<td class="p-2 diagonal">1</td>`;
            } else if (i < j) {
                html += `<td class="p-2 relative">                    <input type="number" 
                           step="0.1" 
                           min="0.1" 
                           max="9" 
                           value="1"
                           data-i="${i}" 
                           data-j="${j}"
                           placeholder="1-9"
                           onchange="handleMatrixChange(this, ${i}, ${j}, 'criteria')"
                           onfocus="suggestMatrixValues(this, ${i}, ${j})"
                           oninput="validateMatrixInput(this, ${i}, ${j}, 'criteria')"
                           class="matrix-input">
                </td>`;
            } else {
                html += `<td class="p-2 calculated" id="criteria-${i}-${j}">1</td>`;
            }
        }
        html += '</tr>';
    }
    
    html += '</tbody></table>';
    container.innerHTML = html;
    
    // Add matrix helper
    addMatrixHelper('criteria');
}

/**
 * Enhanced alternative matrix rendering
 */
function renderEnhancedAlternativeMatrices() {
    const container = document.getElementById('alternativeMatrices');
    container.innerHTML = '';
    
    criteria.forEach(criterion => {
        const matrixDiv = document.createElement('div');
        matrixDiv.className = 'alternative-matrix-card border-l-4 border-accent-green';
        
        const n = alternatives.length;
        let html = `
            <div class="flex items-center justify-between mb-4">
                <h4 class="text-lg font-display font-bold text-white flex items-center">
                    <i class="fas fa-table text-green-600 mr-3"></i>
                    Matriks Perbandingan: ${criterion}
                </h4>                <div class="flex space-x-2">
                    <button onclick="fillMatrixRandomly('${criterion}')" 
                            class="luxury-button-sm bg-accent-blue">
                        <i class="fas fa-dice mr-1"></i>
                        Random
                    </button>
                    <button onclick="resetMatrix('${criterion}')" 
                            class="luxury-button-sm bg-accent-gold">
                        <i class="fas fa-undo mr-1"></i>
                        Reset
                    </button>
                </div>            </div>
            <div class="overflow-x-auto">
                <table class="matrix-table enhanced-table w-full">
                    <thead>
                        <tr>
                            <th class="p-2">Alternatif</th>
        `;        
        alternatives.forEach(alternative => {
            html += `<th class="p-2 text-sm">${alternative}</th>`;
        });
        html += '</tr></thead><tbody>';        
        for (let i = 0; i < n; i++) {
            html += `<tr><td class="p-2 font-medium">${alternatives[i]}</td>`;
            
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    html += `<td class="p-2 diagonal">1</td>`;                } else if (i < j) {
                    html += `<td class="p-2 relative">                        <input type="number"
                               step="0.1" 
                               min="0.1" 
                               max="9" 
                               value="1"
                               data-criterion="${criterion}"
                               data-i="${i}" 
                               data-j="${j}"
                               placeholder="1-9"
                               onchange="handleMatrixChange(this, ${i}, ${j}, '${criterion}')"
                               onfocus="suggestMatrixValues(this, ${i}, ${j})"
                               oninput="validateMatrixInput(this, ${i}, ${j}, 'alternative')"
                               class="matrix-input">
                    </td>`;
                } else {
                    html += `<td class="p-2 calculated" id="alt-${criterion}-${i}-${j}">1</td>`;
                }
            }
            html += '</tr>';
        }
        
        html += '</tbody></table></div>';
        matrixDiv.innerHTML = html;
        container.appendChild(matrixDiv);
        
        // Add matrix helper for each alternative matrix
        addMatrixHelper(criterion);
    });
}

/**
 * Handle matrix input changes with enhanced features
 */
function handleMatrixChange(input, i, j, matrixType) {
    const value = parseFloat(input.value);
    
    if (validateMatrixInput(input, i, j, matrixType)) {
        if (matrixType === 'criteria') {
            updateCriteriaMatrix(i, j, value);
        } else {
            updateAlternativeMatrix(matrixType, i, j, value);
        }
        
        // Update completeness
        calculateMatrixCompleteness(matrixType === 'criteria' ? 'criteria' : 'alternatives');
        
        // Auto-save
        debouncedSave();
    }
}

/**
 * Add matrix helper tools
 */
function addMatrixHelper(matrixType) {
    const isAlternative = matrixType !== 'criteria';
    const containerId = isAlternative ? 'alternativeMatrices' : 'criteriaMatrix';
    const container = document.getElementById(containerId);
    
    if (isAlternative) {
        // Helper already added in renderEnhancedAlternativeMatrices
        return;
    }
      // Add helper tools for criteria matrix
    const helper = document.createElement('div');
    helper.className = 'mt-4 p-4 luxury-card';
    helper.innerHTML = `
        <div class="flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center space-x-4">
                <h5 class="font-semibold text-accent-blue mb-2">Tools Matrix:</h5>
                <button onclick="fillMatrixRandomly('criteria')" 
                        class="luxury-button-sm bg-accent-blue">
                    <i class="fas fa-dice mr-1"></i>
                    Random Fill
                </button>
                <button onclick="resetMatrix('criteria')" 
                        class="luxury-button-sm bg-accent-gold">
                    <i class="fas fa-undo mr-1"></i>
                    Reset
                </button>
                <button onclick="checkConsistencyPreview('criteria')" 
                        class="bg-purple-500 text-white px-3 py-1 rounded text-sm hover:bg-purple-600 transition-colors">
                    <i class="fas fa-check-circle mr-1"></i>
                    Preview Konsistensi
                </button>
            </div>
            <div id="matrix-status" class="text-sm text-primary-light"></div>
        </div>
    `;
    
    container.parentElement.appendChild(helper);
}

/**
 * Fill matrix with random valid values
 */
function fillMatrixRandomly(matrixType) {
    const isAlternative = matrixType !== 'criteria';
    const selector = isAlternative 
        ? `input[data-criterion="${matrixType}"]`
        : '#criteriaMatrix input';
    
    const inputs = document.querySelectorAll(selector);
    const values = [1, 2, 3, 4, 5, 0.5, 0.33, 0.25, 0.2];
    
    inputs.forEach(input => {
        const randomValue = values[Math.floor(Math.random() * values.length)];
        input.value = randomValue;
        input.dispatchEvent(new Event('change'));
    });
    
    showMessage(`Matrix ${matrixType} telah diisi dengan nilai random!`, 'success');
}

/**
 * Reset matrix to default values
 */
function resetMatrix(matrixType) {
    const isAlternative = matrixType !== 'criteria';
    const selector = isAlternative 
        ? `input[data-criterion="${matrixType}"]`
        : '#criteriaMatrix input';
    
    const inputs = document.querySelectorAll(selector);
    
    inputs.forEach(input => {
        input.value = 1;
        input.dispatchEvent(new Event('change'));
    });
    
    showMessage(`Matrix ${matrixType} telah direset!`, 'info');
}

/**
 * Preview consistency without full calculation
 */
function checkConsistencyPreview(matrixType) {
    try {
        const matrix = matrixType === 'criteria' 
            ? collectCriteriaMatrixData()
            : collectAlternativeMatrixData(matrixType);
        
        const completedMatrix = ahpCalculator.completeMatrix(matrix);
        const result = ahpCalculator.calculateEigenVector(completedMatrix);
        const consistency = ahpCalculator.calculateConsistency(completedMatrix, result.eigenValue);
        
        const status = consistency.cr <= 0.1 ? 'Konsisten' : 'Tidak Konsisten';
        const statusClass = consistency.cr <= 0.1 ? 'text-green-600' : 'text-red-600';
        
        showMessage(`Preview Konsistensi ${matrixType}: CR = ${consistency.cr.toFixed(4)} (${status})`, 
                   consistency.cr <= 0.1 ? 'success' : 'error');
        
        // Update status in UI
        const statusElement = document.getElementById('matrix-status');
        if (statusElement) {
            statusElement.innerHTML = `<span class="${statusClass}">CR: ${consistency.cr.toFixed(4)} - ${status}</span>`;
        }
        
    } catch (error) {
        showMessage('Error dalam preview konsistensi: ' + error.message, 'error');
    }
}

/**
 * Debounced save function for performance
 */
let saveTimeout;
function debouncedSave() {
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(() => {
        saveToLocalStorage();
    }, 1000);
}

/**
 * Mobile menu toggle functionality
 */
function initializeMobileMenu() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            const icon = mobileMenuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });
        
        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenuToggle.contains(e.target) && !mobileMenu.contains(e.target)) {
                mobileMenu.classList.add('hidden');
                const icon = mobileMenuToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    }
}

/**
 * Smooth scroll to section
 */
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
    
    // Close mobile menu after navigation
    const mobileMenu = document.getElementById('mobileMenu');
    if (mobileMenu) {
        mobileMenu.classList.add('hidden');
        const icon = document.querySelector('#mobileMenuToggle i');
        if (icon) {
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        }
    }
}

/**
 * Enhanced chart creation with loading states and responsiveness
 */
function createEnhancedCriteriaChart(criteriaData) {
    // Destroy existing chart if exists
    if (window.criteriaChart && typeof window.criteriaChart.destroy === 'function') {
        window.criteriaChart.destroy();
        window.criteriaChart = null;
    }
    
    const canvas = document.getElementById('criteriaChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
      window.criteriaChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: criteriaData.map(item => isMobile ? item.name.substring(0, 8) + '...' : item.name),
            datasets: [{
                data: criteriaData.map(item => item.percentage),
                backgroundColor: [
                    '#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6',
                    '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'
                ],
                borderWidth: isMobile ? 2 : 3,
                borderColor: '#fff',
                hoverBorderWidth: isMobile ? 3 : 4,
                hoverOffset: isMobile ? 4 : 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: isMobile ? 'bottom' : 'right',
                    labels: {
                        padding: isMobile ? 10 : 20,
                        usePointStyle: true,
                        font: {
                            size: isMobile ? 10 : 12,
                            family: 'Inter, sans-serif'
                        },
                        generateLabels: function(chart) {
                            const labels = Chart.defaults.plugins.legend.labels.generateLabels(chart);
                            return labels.map((label, index) => {
                                label.text = criteriaData[index].name + ` (${criteriaData[index].percentage}%)`;
                                return label;
                            });
                        }
                    }
                },
                title: {
                    display: !isMobile,
                    text: 'Distribusi Bobot Kriteria (%)',
                    font: {
                        size: isMobile ? 14 : 16,
                        weight: 'bold',
                        family: 'Inter, sans-serif'
                    },
                    padding: isMobile ? 10 : 20
                },
                tooltip: {
                    enabled: true,
                    callbacks: {
                        label: function(context) {
                            const label = criteriaData[context.dataIndex].name;
                            const value = context.parsed || 0;
                            const weight = criteriaData[context.dataIndex].weight;
                            return `${label}: ${value}% (${weight.toFixed(4)})`;
                        }
                    },
                    titleFont: {
                        size: isMobile ? 12 : 14
                    },
                    bodyFont: {
                        size: isMobile ? 11 : 13
                    }
                }
            },
            animation: {
                animateRotate: true,
                animateScale: true,
                duration: isMobile ? 1000 : 1500,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'point'
            }
        }
    });
}

/**
 * Enhanced scores chart with mobile optimization
 */
function createEnhancedScoresChart(alternativesData) {
    // Destroy existing chart if exists
    if (window.scoresChart && typeof window.scoresChart.destroy === 'function') {
        window.scoresChart.destroy();
        window.scoresChart = null;
    }
    
    const canvas = document.getElementById('scoresChart');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const isMobile = window.innerWidth < 768;
    
    window.scoresChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: alternativesData.map(item => 
                isMobile ? item.name.substring(0, 10) + '...' : item.name
            ),
            datasets: [{
                label: 'Skor (%)',
                data: alternativesData.map(item => item.percentage),
                backgroundColor: alternativesData.map((item, index) => {
                    const colors = ['#FCD34D', '#D1D5DB', '#FCA5A5', '#93C5FD', '#D8B4FE'];
                    return colors[index] || '#E5E7EB';
                }),
                borderColor: alternativesData.map((item, index) => {
                    const colors = ['#F59E0B', '#6B7280', '#EF4444', '#3B82F6', '#8B5CF6'];
                    return colors[index] || '#9CA3AF';
                }),
                borderWidth: isMobile ? 1 : 2,
                borderRadius: isMobile ? 4 : 8,
                borderSkipped: false,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    grid: {
                        color: '#F3F4F6'
                    },
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        },
                        font: {
                            family: 'Inter, sans-serif',
                            size: isMobile ? 10 : 12
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    },
                    ticks: {
                        font: {
                            family: 'Inter, sans-serif',
                            size: isMobile ? 10 : 12
                        },
                        maxRotation: isMobile ? 45 : 0
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                title: {
                    display: !isMobile,
                    text: 'Perbandingan Skor Alternatif',
                    font: {
                        size: isMobile ? 14 : 16,
                        weight: 'bold',
                        family: 'Inter, sans-serif'
                    },
                    padding: isMobile ? 10 : 20
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const item = alternativesData[context.dataIndex];
                            return [
                                `Skor: ${item.score}`,
                                `Persentase: ${context.parsed.y}%`,
                                `Ranking: #${item.rank}`
                            ];
                        }
                    },
                    titleFont: {
                        size: isMobile ? 12 : 14
                    },
                    bodyFont: {
                        size: isMobile ? 11 : 13
                    }
                }
            },
            animation: {
                duration: isMobile ? 1000 : 1500,
                easing: 'easeOutQuart'
            },
            interaction: {
                intersect: false,
                mode: 'index'
            }
        }
    });
}

/**
 * Real-time matrix validation
 */
function validateCompleteMatrix(matrixType) {
    const isAlternative = matrixType !== 'criteria';
    let allValid = true;
    let completedInputs = 0;
    let totalInputs = 0;
    
    if (isAlternative) {
        criteria.forEach(criterion => {
            const inputs = document.querySelectorAll(`input[data-criterion="${criterion}"]`);
            totalInputs += inputs.length;
            
            inputs.forEach(input => {
                const value = parseFloat(input.value);
                if (!isNaN(value) && value > 0 && value <= 9) {
                    completedInputs++;
                } else if (input.value !== '') {
                    allValid = false;
                }
            });
        });
    } else {
        const inputs = document.querySelectorAll('#criteriaMatrix input');
        totalInputs = inputs.length;
        
        inputs.forEach(input => {
            const value = parseFloat(input.value);
            if (!isNaN(value) && value > 0 && value <= 9) {
                completedInputs++;
            } else if (input.value !== '') {
                allValid = false;
            }
        });
    }
    
    const completeness = totalInputs > 0 ? (completedInputs / totalInputs) * 100 : 0;
    updateProgressIndicator(matrixType, completeness);
    
    // Update status
    const statusId = isAlternative ? 'alternatives-status' : 'criteria-status';
    let statusElement = document.getElementById(statusId);
    
    if (!statusElement) {
        statusElement = document.createElement('div');
        statusElement.id = statusId;
        statusElement.className = 'mt-2 text-sm';
        
        const container = isAlternative 
            ? document.getElementById('alternativeMatrices')
            : document.getElementById('criteriaMatrix').parentElement;
        container.appendChild(statusElement);
    }
    
    if (completeness === 100 && allValid) {
        statusElement.innerHTML = '<span class="text-green-600"><i class="fas fa-check-circle mr-1"></i>Matriks lengkap dan valid</span>';
    } else if (!allValid) {
        statusElement.innerHTML = '<span class="text-red-600"><i class="fas fa-exclamation-triangle mr-1"></i>Terdapat nilai tidak valid</span>';
    } else {
        statusElement.innerHTML = `<span class="text-yellow-600"><i class="fas fa-clock mr-1"></i>Kelengkapan: ${Math.round(completeness)}%</span>`;
    }
    
    return { allValid, completeness };
}

/**
 * Window resize handler for chart responsiveness
 */
let resizeTimeout;
function handleWindowResize() {
    // Debounce resize events to prevent multiple chart updates
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        try {
            if (window.criteriaChart && typeof window.criteriaChart.resize === 'function') {
                window.criteriaChart.resize();
            }
            if (window.scoresChart && typeof window.scoresChart.resize === 'function') {
                window.scoresChart.resize();
            }
        } catch (error) {
            console.warn('Chart resize error:', error);
        }
        
        // Update matrix input sizes on mobile
        const isMobile = window.innerWidth < 768;
        const matrixInputs = document.querySelectorAll('.matrix-table input');
        
        matrixInputs.forEach(input => {
            if (isMobile) {
                input.style.width = '40px';
                input.style.fontSize = '10px';
            } else {
                input.style.width = '80px';
                input.style.fontSize = '14px';
            }
        });
    }, 250);
}

/**
 * Add section IDs for navigation
 */
function addSectionIds() {
    // Add IDs to main sections for navigation
    const sections = [
        { selector: '.grid.grid-cols-1.lg\\:grid-cols-2', id: 'criteriaSection' },
        { selector: '#criteriaMatrix', id: 'matrixSection' },
        { selector: '#resultsSection', id: 'resultsSection' }
    ];
    
    sections.forEach(({ selector, id }) => {
        const element = document.querySelector(selector);
        if (element && !element.id) {
            element.id = id;
        }
    });
}

/**
 * Initialize all enhanced features
 */
function initializeEnhancements() {
    // Initialize mobile navigation
    initializeMobileMenu();
    
    // Add section IDs for navigation
    addSectionIds();
    
    // Add window resize handler
    window.addEventListener('resize', handleWindowResize);
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'd') {
            e.preventDefault();
            loadDefaultData();
        }
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            processAHP();
        }
    });
    
    // Initialize auto-save timer
    setInterval(() => {
        if (Date.now() - lastInteraction > 30000) { // 30 seconds of inactivity
            debouncedSave();
        }
    }, 10000);
    
    // Show enhanced welcome message
    showMessage('✨ Sistem Enhanced AHP siap digunakan! Tekan Ctrl+D untuk data default atau Ctrl+Enter untuk kalkulasi.', 'info');
}

/**
 * Process AHP calculation and display results
 */
function processAHP() {
    try {
        // Collect matrix data
        const criteriaMatrix = collectCriteriaMatrixData();
        const alternativeMatrices = {};
        
        criteria.forEach(criterion => {
            alternativeMatrices[criterion] = collectAlternativeMatrixData(criterion);
        });
        
        // Set data in calculator
        ahpCalculator.setCriteriaMatrix(criteriaMatrix);
        criteria.forEach(criterion => {
            ahpCalculator.setAlternativeMatrix(criterion, alternativeMatrices[criterion]);
        });
        
        // Validate data
        const validation = ahpCalculator.validateData();
        if (!validation.isValid) {
            showMessage('Error: ' + validation.errors.join(', '), 'error');
            return;
        }
        
        // Calculate
        const results = ahpCalculator.calculate();
        if (!results.success) {
            showMessage('Error dalam perhitungan: ' + results.error, 'error');
            return;
        }
        
        // Display results
        displayResults(results);
        
        // Show results section
        document.getElementById('resultsSection').classList.remove('hidden');
        
        // Scroll to results
        setTimeout(() => {
            scrollToSection('resultsSection');
        }, 500);
        
        showMessage('✅ Perhitungan AHP berhasil! Lihat hasil di bawah.', 'success');
        
    } catch (error) {
        console.error('Error in processAHP:', error);
        showMessage('Error: ' + error.message, 'error');
    }
}

/**
 * Global chart state management
 */
let chartState = {
    criteriaChartInitialized: false,
    scoresChartInitialized: false,
    lastCriteriaData: null,
    lastScoresData: null
};

/**
 * Reset chart state
 */
function resetChartState() {
    chartState.criteriaChartInitialized = false;
    chartState.scoresChartInitialized = false;
    chartState.lastCriteriaData = null;
    chartState.lastScoresData = null;
}

/**
 * Safe chart creation with state management
 */
function safeCreateEnhancedCriteriaChart(criteriaData) {
    // Prevent duplicate chart creation
    if (chartState.criteriaChartInitialized && 
        JSON.stringify(criteriaData) === JSON.stringify(chartState.lastCriteriaData)) {
        return;
    }
    
    chartState.lastCriteriaData = criteriaData;
    createEnhancedCriteriaChart(criteriaData);
    chartState.criteriaChartInitialized = true;
}

/**
 * Safe scores chart creation with state management
 */
function safeCreateEnhancedScoresChart(alternativesData) {
    // Prevent duplicate chart creation
    if (chartState.scoresChartInitialized && 
        JSON.stringify(alternativesData) === JSON.stringify(chartState.lastScoresData)) {
        return;
    }
    
    chartState.lastScoresData = alternativesData;
    createEnhancedScoresChart(alternativesData);
    chartState.scoresChartInitialized = true;
}

/**
 * Display calculation results with enhanced charts
 */
function displayResults(results) {
    try {
        const detailedResults = ahpCalculator.getDetailedResults();
        
        // Display criteria weights
        displayCriteriaWeights(detailedResults.criteria);
        
        // Display alternative scores
        displayAlternativeScores(detailedResults.alternatives);
        
        // Display consistency results
        displayConsistencyResults(detailedResults.consistency);
        
        // Create enhanced charts
        safeCreateEnhancedCriteriaChart(detailedResults.criteria);
        safeCreateEnhancedScoresChart(detailedResults.alternatives);
        
    } catch (error) {
        console.error('Error displaying results:', error);
        showMessage('Error menampilkan hasil: ' + error.message, 'error');
    }
}

/**
 * Display criteria weights table
 */
function displayCriteriaWeights(criteriaData) {
    const table = document.getElementById('criteriaWeights');
      let html = `
        <thead>
            <tr>
                <th class="p-3 text-left">Kriteria</th>
                <th class="p-3 text-center">Bobot</th>
                <th class="p-3 text-center">Persentase</th>
                <th class="p-3 text-center">Ranking</th>
            </tr>
        </thead>
        <tbody>
    `;
    
    // Sort by weight for ranking
    const sortedCriteria = [...criteriaData].sort((a, b) => b.weight - a.weight);
      sortedCriteria.forEach((item, index) => {
        const rankClass = index === 0 ? 'rank-1' : index === 1 ? 'rank-2' : index === 2 ? 'rank-3' : '';
        html += `
            <tr>
                <td class="p-3 font-medium">${item.name}</td>
                <td class="p-3 text-center">${item.weight.toFixed(4)}</td>
                <td class="p-3 text-center">${item.percentage}%</td>
                <td class="p-3 text-center">
                    <span class="rank-badge high-contrast ${rankClass}">${index + 1}</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

/**
 * Display alternative scores table
 */
function displayAlternativeScores(alternativesData) {
    const table = document.getElementById('finalScores');
      let html = `
        <thead>
            <tr>
                <th class="p-3 text-left">Alternatif</th>
                <th class="p-3 text-center">Skor</th>
                <th class="p-3 text-center">Persentase</th>
                <th class="p-3 text-center">Ranking</th>
            </tr>
        </thead>
        <tbody>
    `;
      alternativesData.forEach((item) => {
        const rankClass = item.rank === 1 ? 'rank-1' : item.rank === 2 ? 'rank-2' : item.rank === 3 ? 'rank-3' : '';
        html += `
            <tr>
                <td class="p-3 font-medium">${item.name}</td>
                <td class="p-3 text-center">${item.score}</td>
                <td class="p-3 text-center">${item.percentage}%</td>
                <td class="p-3 text-center">
                    <span class="rank-badge high-contrast ${rankClass}">${item.rank}</span>
                </td>
            </tr>
        `;
    });
    
    html += '</tbody>';
    table.innerHTML = html;
}

/**
 * Display consistency results
 */
function displayConsistencyResults(consistencyData) {
    const container = document.getElementById('consistencyResults');
    
    let html = '';
    
    // Criteria consistency
    const criteriaConsistency = consistencyData.criteria;
    const criteriaStatus = criteriaConsistency.cr <= 0.1;
    
    html += `
        <div class="p-4 rounded-lg border ${criteriaStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
            <h4 class="font-semibold ${criteriaStatus ? 'text-green-800' : 'text-red-800'} mb-2">
                <i class="fas ${criteriaStatus ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i>
                Konsistensi Matriks Kriteria
            </h4>
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                    <span class="font-medium">Lambda Max:</span>
                    <div>${criteriaConsistency.lambdaMax.toFixed(4)}</div>
                </div>
                <div>
                    <span class="font-medium">CI:</span>
                    <div>${criteriaConsistency.ci.toFixed(4)}</div>
                </div>
                <div>
                    <span class="font-medium">RI:</span>
                    <div>${criteriaConsistency.ri.toFixed(2)}</div>
                </div>
                <div>
                    <span class="font-medium">CR:</span>
                    <div class="font-bold ${criteriaStatus ? 'text-green-600' : 'text-red-600'}">
                        ${criteriaConsistency.cr.toFixed(4)} ${criteriaStatus ? '✓' : '✗'}
                    </div>
                </div>
            </div>
            <div class="mt-2 text-sm ${criteriaStatus ? 'text-green-700' : 'text-red-700'}">
                ${criteriaStatus ? 'Matriks konsisten (CR ≤ 0.1)' : 'Matriks tidak konsisten (CR > 0.1) - Perlu revisi input'}
            </div>
        </div>
    `;
    
    // Alternative consistencies
    criteria.forEach(criterion => {
        if (consistencyData[criterion]) {
            const altConsistency = consistencyData[criterion];
            const altStatus = altConsistency.cr <= 0.1;
            
            html += `
                <div class="p-4 rounded-lg border ${altStatus ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}">
                    <h4 class="font-semibold ${altStatus ? 'text-green-800' : 'text-red-800'} mb-2">
                        <i class="fas ${altStatus ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-2"></i>
                        Konsistensi Matriks: ${criterion}
                    </h4>
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <span class="font-medium">Lambda Max:</span>
                            <div>${altConsistency.lambdaMax.toFixed(4)}</div>
                        </div>
                        <div>
                            <span class="font-medium">CI:</span>
                            <div>${altConsistency.ci.toFixed(4)}</div>
                        </div>
                        <div>
                            <span class="font-medium">RI:</span>
                            <div>${altConsistency.ri.toFixed(2)}</div>
                        </div>
                        <div>
                            <span class="font-medium">CR:</span>
                            <div class="font-bold ${altStatus ? 'text-green-600' : 'text-red-600'}">
                                ${altConsistency.cr.toFixed(4)} ${altStatus ? '✓' : '✗'}
                            </div>
                        </div>
                    </div>
                </div>
            `;
        }
    });
    
    container.innerHTML = html;
}

/**
 * Collect criteria matrix data from UI
 */
function collectCriteriaMatrixData() {
    const n = criteria.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(1));
    
    // Collect upper triangle values
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i < j) {
                const input = document.querySelector(`#criteriaMatrix input[data-i="${i}"][data-j="${j}"]`);
                if (input && input.value) {
                    matrix[i][j] = parseFloat(input.value) || 1;
                }
            }
        }
    }
    
    return matrix;
}

/**
 * Collect alternative matrix data from UI
 */
function collectAlternativeMatrixData(criterion) {
    const n = alternatives.length;
    const matrix = Array(n).fill().map(() => Array(n).fill(1));
    
    // Collect upper triangle values
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i < j) {
                const input = document.querySelector(`input[data-criterion="${criterion}"][data-i="${i}"][data-j="${j}"]`);
                if (input && input.value) {
                    matrix[i][j] = parseFloat(input.value) || 1;
                }
            }
        }
    }
    
    return matrix;
}

/**
 * Load default data with enhanced feedback
 */
function loadDefaultData() {
    try {
        // Set criteria matrix
        const criteriaInputs = document.querySelectorAll('#criteriaMatrix input');
        let inputIndex = 0;
        
        for (let i = 0; i < criteria.length; i++) {
            for (let j = 0; j < criteria.length; j++) {
                if (i < j) {
                    const input = criteriaInputs[inputIndex];
                    if (input) {
                        input.value = defaultData.criteriaMatrix[i][j];
                        input.dispatchEvent(new Event('change'));
                    }
                    inputIndex++;
                }
            }
        }
        
        // Set alternative matrices
        criteria.forEach(criterion => {
            if (defaultData.alternativeMatrices[criterion]) {
                const inputs = document.querySelectorAll(`input[data-criterion="${criterion}"]`);
                let inputIndex = 0;
                
                for (let i = 0; i < alternatives.length; i++) {
                    for (let j = 0; j < alternatives.length; j++) {
                        if (i < j) {
                            const input = inputs[inputIndex];
                            if (input) {
                                input.value = defaultData.alternativeMatrices[criterion][i][j];
                                input.dispatchEvent(new Event('change'));
                            }
                            inputIndex++;
                        }
                    }
                }
            }
        });
        
        // Update progress indicators
        calculateMatrixCompleteness('criteria');
        calculateMatrixCompleteness('alternatives');
        
        showMessage('✅ Data default berhasil dimuat! Siap untuk perhitungan AHP.', 'success');
        
        // Auto-save
        debouncedSave();
        
    } catch (error) {
        console.error('Error loading default data:', error);
        showMessage('Error memuat data default: ' + error.message, 'error');
    }
}

/**
 * Export results to JSON
 */
function exportResults() {
    try {
        const detailedResults = ahpCalculator.getDetailedResults();
        const exportData = {
            timestamp: new Date().toISOString(),
            criteria: criteria,
            alternatives: alternatives,
            results: detailedResults
        };
        
        const dataStr = JSON.stringify(exportData, null, 2);
        const dataBlob = new Blob([dataStr], {type: 'application/json'});
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        link.download = `ahp-results-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        
        showMessage('✅ Hasil berhasil diekspor ke file JSON!', 'success');
        
    } catch (error) {
        console.error('Error exporting results:', error);
        showMessage('Error mengekspor hasil: ' + error.message, 'error');
    }
}

/**
 * Print results
 */
function printResults() {
    try {
        const resultsSection = document.getElementById('resultsSection');
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Laporan AHP - ${new Date().toLocaleDateString()}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    table { border-collapse: collapse; width: 100%; margin: 20px 0; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .rank-badge { padding: 4px 8px; border-radius: 12px; font-weight: bold; }
                    .rank-1 { background-color: #fbbf24; color: #92400e; }
                    .rank-2 { background-color: #d1d5db; color: #374151; }
                    .rank-3 { background-color: #fca5a5; color: #dc2626; }
                    @media print { body { margin: 0; } }
                </style>
            </head>
            <body>
                <h1>Laporan Hasil AHP Decision Support System</h1>
                <p><strong>Tanggal:</strong> ${new Date().toLocaleDateString()}</p>
                <p><strong>Waktu:</strong> ${new Date().toLocaleTimeString()}</p>
                ${resultsSection.innerHTML}
                <div style="margin-top: 40px; text-align: center; color: #666;">
                    <p>Generated by AHP Decision Support System</p>
                </div>
            </body>
            </html>
        `);
        
        printWindow.document.close();
        printWindow.focus();
        
        setTimeout(() => {
            printWindow.print();
            printWindow.close();
        }, 500);
        
        showMessage('✅ Laporan siap dicetak!', 'success');
        
    } catch (error) {
        console.error('Error printing results:', error);
        showMessage('Error mencetak laporan: ' + error.message, 'error');
    }
}

/**
 * Save to localStorage
 */
function saveToLocalStorage() {
    try {
        const data = {
            criteria: criteria,
            alternatives: alternatives,
            criteriaMatrix: collectCriteriaMatrixData(),
            alternativeMatrices: {}
        };
        
        criteria.forEach(criterion => {
            data.alternativeMatrices[criterion] = collectAlternativeMatrixData(criterion);
        });
        
        localStorage.setItem('ahp-data', JSON.stringify(data));
        console.log('Data saved to localStorage');
        
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

/**
 * Enhanced message display with better styling
 */
function showMessage(message, type = 'info') {
    // Remove existing messages
    document.querySelectorAll('.floating-message').forEach(msg => msg.remove());
    
    const messageDiv = document.createElement('div');
    messageDiv.className = `floating-message fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg max-w-md`;
    
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
            <div class="flex-1">${message}</div>            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-red-400 hover:text-red-300 luxury-button-sm">
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