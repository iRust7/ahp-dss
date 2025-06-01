// AHP Decision Support System - JavaScript Implementation
// Based on Analytical Hierarchy Process methodology

class AHPSystem {
    constructor() {
        this.criteria = ['Jarak', 'Biaya', 'Fasilitas', 'Posisi', 'Luas'];
        this.alternatives = ['Safe\'n Lock', 'Rungkut Industri', 'Spill'];
        this.criteriaMatrix = [];
        this.alternativeMatrices = {};
        this.criteriaWeights = [];
        this.alternativeWeights = {};
        this.finalScores = [];
        this.consistencyResults = {};
        
        // Random Index values for consistency check
        this.RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
        
        this.init();
    }

    init() {
        this.renderCriteriaList();
        this.renderAlternativesList();
        this.renderCriteriaMatrix();
        this.renderAlternativeMatrices();
    }

    // Render criteria management
    renderCriteriaList() {
        const container = document.getElementById('criteriaList');
        container.innerHTML = '';
        
        this.criteria.forEach((criterion, index) => {
            const item = document.createElement('div');
            item.className = 'criteria-item';
            item.innerHTML = `
                <input type="text" value="${criterion}" 
                       onchange="ahp.updateCriteria(${index}, this.value)"
                       class="flex-1">
                <i class="fas fa-times delete-btn" onclick="ahp.removeCriteria(${index})"></i>
            `;
            container.appendChild(item);
        });
    }

    // Render alternatives management
    renderAlternativesList() {
        const container = document.getElementById('alternativesList');
        container.innerHTML = '';
        
        this.alternatives.forEach((alternative, index) => {
            const item = document.createElement('div');
            item.className = 'alternative-item';
            item.innerHTML = `
                <input type="text" value="${alternative}" 
                       onchange="ahp.updateAlternative(${index}, this.value)"
                       class="flex-1">
                <i class="fas fa-times delete-btn" onclick="ahp.removeAlternative(${index})"></i>
            `;
            container.appendChild(item);
        });
    }

    // Add new criteria
    addCriteria(name) {
        if (name && name.trim() !== '') {
            this.criteria.push(name.trim());
            this.renderCriteriaList();
            this.renderCriteriaMatrix();
            this.renderAlternativeMatrices();
        }
    }

    // Add new alternative
    addAlternative(name) {
        if (name && name.trim() !== '') {
            this.alternatives.push(name.trim());
            this.renderAlternativesList();
            this.renderAlternativeMatrices();
        }
    }

    // Update criteria
    updateCriteria(index, newName) {
        if (newName && newName.trim() !== '') {
            this.criteria[index] = newName.trim();
            this.renderCriteriaMatrix();
            this.renderAlternativeMatrices();
        }
    }

    // Update alternative
    updateAlternative(index, newName) {
        if (newName && newName.trim() !== '') {
            this.alternatives[index] = newName.trim();
            this.renderAlternativeMatrices();
        }
    }

    // Remove criteria
    removeCriteria(index) {
        if (this.criteria.length > 2) {
            this.criteria.splice(index, 1);
            this.renderCriteriaList();
            this.renderCriteriaMatrix();
            this.renderAlternativeMatrices();
        }
    }

    // Remove alternative
    removeAlternative(index) {
        if (this.alternatives.length > 2) {
            this.alternatives.splice(index, 1);
            this.renderAlternativesList();
            this.renderAlternativeMatrices();
        }
    }

    // Render criteria comparison matrix
    renderCriteriaMatrix() {
        const table = document.getElementById('criteriaMatrix');
        table.className = 'matrix-table';
        table.innerHTML = '';

        // Header row
        const headerRow = table.insertRow();
        headerRow.insertCell().innerHTML = '<strong>Kriteria</strong>';
        this.criteria.forEach(criterion => {
            const cell = headerRow.insertCell();
            cell.innerHTML = `<strong>${criterion}</strong>`;
        });

        // Data rows
        this.criteria.forEach((rowCriterion, i) => {
            const row = table.insertRow();
            const headerCell = row.insertCell();
            headerCell.innerHTML = `<strong>${rowCriterion}</strong>`;
            
            this.criteria.forEach((colCriterion, j) => {
                const cell = row.insertCell();
                
                if (i === j) {
                    // Diagonal (always 1)
                    cell.innerHTML = '<span class="diagonal-cell">1</span>';
                    cell.className = 'diagonal-cell';
                } else if (i < j) {
                    // Upper triangle (user input)
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0.111';
                    input.max = '9';
                    input.step = '0.001';
                    input.value = '1';
                    input.onchange = () => this.updateCriteriaMatrix(i, j, input.value);
                    cell.appendChild(input);
                } else {
                    // Lower triangle (auto-calculated)
                    cell.innerHTML = '<span class="auto-cell">1</span>';
                    cell.className = 'auto-cell';
                }
            });
        });

        // Initialize matrix if needed
        if (this.criteriaMatrix.length !== this.criteria.length) {
            this.initializeCriteriaMatrix();
        }
    }

    // Initialize criteria matrix
    initializeCriteriaMatrix() {
        this.criteriaMatrix = [];
        for (let i = 0; i < this.criteria.length; i++) {
            this.criteriaMatrix[i] = [];
            for (let j = 0; j < this.criteria.length; j++) {
                if (i === j) {
                    this.criteriaMatrix[i][j] = 1;
                } else {
                    this.criteriaMatrix[i][j] = 1;
                }
            }
        }
    }

    // Update criteria matrix and sync reciprocal values
    updateCriteriaMatrix(i, j, value) {
        const numValue = parseFloat(value) || 1;
        this.criteriaMatrix[i][j] = numValue;
        this.criteriaMatrix[j][i] = 1 / numValue;

        // Update the reciprocal cell display
        const table = document.getElementById('criteriaMatrix');
        const reciprocalCell = table.rows[j + 1].cells[i + 1];
        reciprocalCell.innerHTML = `<span class="auto-cell">${(1/numValue).toFixed(3)}</span>`;
    }

    // Render alternative comparison matrices
    renderAlternativeMatrices() {
        const container = document.getElementById('alternativeMatrices');
        container.innerHTML = '';

        this.criteria.forEach((criterion, criterionIndex) => {
            const section = document.createElement('div');
            section.className = 'bg-white rounded-xl shadow-lg p-6';
            
            section.innerHTML = `
                <h3 class="text-xl font-bold text-gray-800 mb-4 flex items-center">
                    <i class="fas fa-balance-scale text-green-600 mr-3"></i>
                    Perbandingan Alternatif untuk Kriteria: ${criterion}
                </h3>
                <div class="overflow-x-auto">
                    <table id="altMatrix_${criterionIndex}" class="matrix-table w-full"></table>
                </div>
            `;
            
            container.appendChild(section);
            this.renderSingleAlternativeMatrix(criterionIndex);
        });
    }

    // Render single alternative matrix
    renderSingleAlternativeMatrix(criterionIndex) {
        const table = document.getElementById(`altMatrix_${criterionIndex}`);
        table.innerHTML = '';

        // Header row
        const headerRow = table.insertRow();
        headerRow.insertCell().innerHTML = '<strong>Alternatif</strong>';
        this.alternatives.forEach(alternative => {
            const cell = headerRow.insertCell();
            cell.innerHTML = `<strong>${alternative}</strong>`;
        });

        // Data rows
        this.alternatives.forEach((rowAlternative, i) => {
            const row = table.insertRow();
            const headerCell = row.insertCell();
            headerCell.innerHTML = `<strong>${rowAlternative}</strong>`;
            
            this.alternatives.forEach((colAlternative, j) => {
                const cell = row.insertCell();
                
                if (i === j) {
                    // Diagonal (always 1)
                    cell.innerHTML = '<span class="diagonal-cell">1</span>';
                    cell.className = 'diagonal-cell';
                } else if (i < j) {
                    // Upper triangle (user input)
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0.111';
                    input.max = '9';
                    input.step = '0.001';
                    input.value = '1';
                    input.onchange = () => this.updateAlternativeMatrix(criterionIndex, i, j, input.value);
                    cell.appendChild(input);
                } else {
                    // Lower triangle (auto-calculated)
                    cell.innerHTML = '<span class="auto-cell">1</span>';
                    cell.className = 'auto-cell';
                }
            });
        });

        // Initialize matrix if needed
        if (!this.alternativeMatrices[criterionIndex]) {
            this.initializeAlternativeMatrix(criterionIndex);
        }
    }

    // Initialize alternative matrix
    initializeAlternativeMatrix(criterionIndex) {
        this.alternativeMatrices[criterionIndex] = [];
        for (let i = 0; i < this.alternatives.length; i++) {
            this.alternativeMatrices[criterionIndex][i] = [];
            for (let j = 0; j < this.alternatives.length; j++) {
                if (i === j) {
                    this.alternativeMatrices[criterionIndex][i][j] = 1;
                } else {
                    this.alternativeMatrices[criterionIndex][i][j] = 1;
                }
            }
        }
    }

    // Update alternative matrix and sync reciprocal values
    updateAlternativeMatrix(criterionIndex, i, j, value) {
        const numValue = parseFloat(value) || 1;
        
        if (!this.alternativeMatrices[criterionIndex]) {
            this.initializeAlternativeMatrix(criterionIndex);
        }
        
        this.alternativeMatrices[criterionIndex][i][j] = numValue;
        this.alternativeMatrices[criterionIndex][j][i] = 1 / numValue;

        // Update the reciprocal cell display
        const table = document.getElementById(`altMatrix_${criterionIndex}`);
        const reciprocalCell = table.rows[j + 1].cells[i + 1];
        reciprocalCell.innerHTML = `<span class="auto-cell">${(1/numValue).toFixed(3)}</span>`;
    }

    // Calculate eigenvalues and eigenvectors using power method
    calculateEigenVector(matrix) {
        const n = matrix.length;
        let eigenVector = new Array(n).fill(1);
        let prevEigenVector = new Array(n).fill(0);
        
        // Power method iterations
        for (let iter = 0; iter < 100; iter++) {
            // Matrix multiplication
            const newVector = new Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    newVector[i] += matrix[i][j] * eigenVector[j];
                }
            }
            
            // Normalize
            const sum = newVector.reduce((a, b) => a + b, 0);
            for (let i = 0; i < n; i++) {
                newVector[i] /= sum;
            }
            
            // Check convergence
            let convergence = true;
            for (let i = 0; i < n; i++) {
                if (Math.abs(newVector[i] - eigenVector[i]) > 0.0001) {
                    convergence = false;
                    break;
                }
            }
            
            eigenVector = newVector.slice();
            
            if (convergence) break;
        }
        
        return eigenVector;
    }

    // Calculate consistency ratio
    calculateConsistencyRatio(matrix, eigenVector) {
        const n = matrix.length;
        
        // Calculate lambda max
        let lambdaMax = 0;
        for (let i = 0; i < n; i++) {
            let sum = 0;
            for (let j = 0; j < n; j++) {
                sum += matrix[i][j] * eigenVector[j];
            }
            lambdaMax += sum / eigenVector[i];
        }
        lambdaMax /= n;
        
        // Calculate CI (Consistency Index)
        const CI = (lambdaMax - n) / (n - 1);
        
        // Calculate CR (Consistency Ratio)
        const RI = this.RI[n - 1];
        const CR = RI === 0 ? 0 : CI / RI;
        
        return {
            lambdaMax,
            CI,
            CR,
            isConsistent: CR < 0.1
        };
    }

    // Load default data from Excel
    loadDefaultData() {
        // Default criteria matrix based on Excel data
        const defaultCriteriaMatrix = [
            [1, 3, 0.2, 0.2, 1],
            [1/3, 1, 0.14, 0.33, 0.33],
            [5, 7, 1, 5, 0.2],
            [5, 3, 0.2, 1, 0.2],
            [1, 3, 5, 5, 1]
        ];

        // Default alternative matrices for each criterion
        const defaultAlternativeMatrices = {
            0: [ // Jarak
                [1, 0.05, 0.15],
                [20, 1, 3],
                [6.67, 1/3, 1]
            ],
            1: [ // Biaya
                [1, 0.83, 1.25],
                [1.2, 1, 1.5],
                [0.8, 2/3, 1]
            ],
            2: [ // Fasilitas
                [1, 0.38, 1.28],
                [2.63, 1, 3.38],
                [0.78, 0.3, 1]
            ],
            3: [ // Posisi
                [1, 0.5, 5],
                [2, 1, 10],
                [0.2, 0.1, 1]
            ],
            4: [ // Luas
                [1, 0.41, 0.65],
                [2.44, 1, 1.59],
                [1.54, 0.63, 1]
            ]
        };

        // Update matrices
        this.criteriaMatrix = defaultCriteriaMatrix.map(row => row.slice());
        this.alternativeMatrices = {};
        Object.keys(defaultAlternativeMatrices).forEach(key => {
            this.alternativeMatrices[key] = defaultAlternativeMatrices[key].map(row => row.slice());
        });

        // Update UI
        this.updateCriteriaMatrixDisplay();
        this.updateAlternativeMatricesDisplay();
    }

    // Update criteria matrix display
    updateCriteriaMatrixDisplay() {
        const table = document.getElementById('criteriaMatrix');
        for (let i = 0; i < this.criteria.length; i++) {
            for (let j = 0; j < this.criteria.length; j++) {
                if (i < j) {
                    const input = table.rows[i + 1].cells[j + 1].querySelector('input');
                    if (input) {
                        input.value = this.criteriaMatrix[i][j].toFixed(3);
                    }
                } else if (i > j) {
                    const cell = table.rows[i + 1].cells[j + 1];
                    cell.innerHTML = `<span class="auto-cell">${this.criteriaMatrix[i][j].toFixed(3)}</span>`;
                }
            }
        }
    }

    // Update alternative matrices display
    updateAlternativeMatricesDisplay() {
        this.criteria.forEach((criterion, criterionIndex) => {
            const table = document.getElementById(`altMatrix_${criterionIndex}`);
            if (table && this.alternativeMatrices[criterionIndex]) {
                for (let i = 0; i < this.alternatives.length; i++) {
                    for (let j = 0; j < this.alternatives.length; j++) {
                        if (i < j) {
                            const input = table.rows[i + 1].cells[j + 1].querySelector('input');
                            if (input) {
                                input.value = this.alternativeMatrices[criterionIndex][i][j].toFixed(3);
                            }
                        } else if (i > j) {
                            const cell = table.rows[i + 1].cells[j + 1];
                            cell.innerHTML = `<span class="auto-cell">${this.alternativeMatrices[criterionIndex][i][j].toFixed(3)}</span>`;
                        }
                    }
                }
            }
        });
    }

    // Process AHP calculation
    processAHP() {
        try {
            // Calculate criteria weights
            this.criteriaWeights = this.calculateEigenVector(this.criteriaMatrix);
            const criteriaConsistency = this.calculateConsistencyRatio(this.criteriaMatrix, this.criteriaWeights);
            this.consistencyResults.criteria = criteriaConsistency;

            // Calculate alternative weights for each criterion
            this.alternativeWeights = {};
            this.consistencyResults.alternatives = {};
            
            this.criteria.forEach((criterion, index) => {
                if (this.alternativeMatrices[index]) {
                    this.alternativeWeights[index] = this.calculateEigenVector(this.alternativeMatrices[index]);
                    this.consistencyResults.alternatives[index] = this.calculateConsistencyRatio(
                        this.alternativeMatrices[index], 
                        this.alternativeWeights[index]
                    );
                }
            });

            // Calculate final scores
            this.calculateFinalScores();

            // Display results
            this.displayResults();
            
        } catch (error) {
            alert('Error dalam perhitungan AHP: ' + error.message);
            console.error('AHP Calculation Error:', error);
        }
    }

    // Calculate final scores
    calculateFinalScores() {
        this.finalScores = [];
        
        for (let altIndex = 0; altIndex < this.alternatives.length; altIndex++) {
            let score = 0;
            
            for (let critIndex = 0; critIndex < this.criteria.length; critIndex++) {
                if (this.alternativeWeights[critIndex]) {
                    score += this.criteriaWeights[critIndex] * this.alternativeWeights[critIndex][altIndex];
                }
            }
            
            this.finalScores.push({
                alternative: this.alternatives[altIndex],
                score: score,
                rank: 0
            });
        }

        // Sort by score and assign ranks
        this.finalScores.sort((a, b) => b.score - a.score);
        this.finalScores.forEach((item, index) => {
            item.rank = index + 1;
        });
    }

    // Display results
    displayResults() {
        document.getElementById('resultsSection').classList.remove('hidden');
        
        this.displayCriteriaWeights();
        this.displayFinalScores();
        this.displayConsistencyResults();
        this.createCharts();
    }

    // Display criteria weights
    displayCriteriaWeights() {
        const table = document.getElementById('criteriaWeights');
        table.className = 'results-table';
        table.innerHTML = '';

        // Header
        const headerRow = table.insertRow();
        headerRow.innerHTML = '<th>Kriteria</th><th>Bobot</th><th>Persentase</th>';

        // Data rows
        this.criteria.forEach((criterion, index) => {
            const row = table.insertRow();
            const weight = this.criteriaWeights[index];
            const percentage = (weight * 100).toFixed(2);
            
            row.innerHTML = `
                <td><strong>${criterion}</strong></td>
                <td>${weight.toFixed(4)}</td>
                <td>
                    <div class="flex items-center space-x-2">
                        <span>${percentage}%</span>
                        <div class="score-bar flex-1">
                            <div class="score-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </td>
            `;
        });
    }

    // Display final scores
    displayFinalScores() {
        const table = document.getElementById('finalScores');
        table.className = 'results-table';
        table.innerHTML = '';

        // Header
        const headerRow = table.insertRow();
        headerRow.innerHTML = '<th>Rank</th><th>Alternatif</th><th>Skor</th><th>Persentase</th>';

        // Data rows
        this.finalScores.forEach((item) => {
            const row = table.insertRow();
            const percentage = (item.score * 100).toFixed(2);
            
            row.innerHTML = `
                <td><span class="rank-badge rank-${item.rank}">${item.rank}</span></td>
                <td><strong>${item.alternative}</strong></td>
                <td>${item.score.toFixed(4)}</td>
                <td>
                    <div class="flex items-center space-x-2">
                        <span>${percentage}%</span>
                        <div class="score-bar flex-1">
                            <div class="score-fill" style="width: ${percentage}%"></div>
                        </div>
                    </div>
                </td>
            `;
        });
    }

    // Display consistency results
    displayConsistencyResults() {
        const container = document.getElementById('consistencyResults');
        container.innerHTML = '';

        // Criteria consistency
        const criteriaDiv = document.createElement('div');
        const criteriaConsistency = this.consistencyResults.criteria;
        const criteriaClass = criteriaConsistency.CR < 0.1 ? 'consistency-good' : 
                             criteriaConsistency.CR < 0.2 ? 'consistency-warning' : 'consistency-bad';
        
        criteriaDiv.className = criteriaClass;
        criteriaDiv.innerHTML = `
            <h4 class="font-semibold mb-2">Konsistensi Kriteria</h4>
            <p>Consistency Ratio: ${(criteriaConsistency.CR * 100).toFixed(2)}%</p>
            <p>Status: ${criteriaConsistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}</p>
        `;
        container.appendChild(criteriaDiv);

        // Alternative consistency
        this.criteria.forEach((criterion, index) => {
            if (this.consistencyResults.alternatives[index]) {
                const altDiv = document.createElement('div');
                const altConsistency = this.consistencyResults.alternatives[index];
                const altClass = altConsistency.CR < 0.1 ? 'consistency-good' : 
                                altConsistency.CR < 0.2 ? 'consistency-warning' : 'consistency-bad';
                
                altDiv.className = altClass + ' mt-4';
                altDiv.innerHTML = `
                    <h4 class="font-semibold mb-2">Konsistensi ${criterion}</h4>
                    <p>Consistency Ratio: ${(altConsistency.CR * 100).toFixed(2)}%</p>
                    <p>Status: ${altConsistency.isConsistent ? 'Konsisten' : 'Tidak Konsisten'}</p>
                `;
                container.appendChild(altDiv);
            }
        });
    }

    // Create charts
    createCharts() {
        // Criteria weights chart
        const criteriaCtx = document.getElementById('criteriaChart').getContext('2d');
        new Chart(criteriaCtx, {
            type: 'doughnut',
            data: {
                labels: this.criteria,
                datasets: [{
                    data: this.criteriaWeights,
                    backgroundColor: [
                        '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'
                    ]
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Distribusi Bobot Kriteria'
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });

        // Final scores chart
        const scoresCtx = document.getElementById('scoresChart').getContext('2d');
        new Chart(scoresCtx, {
            type: 'bar',
            data: {
                labels: this.finalScores.map(item => item.alternative),
                datasets: [{
                    label: 'Skor AHP',
                    data: this.finalScores.map(item => item.score),
                    backgroundColor: '#3B82F6',
                    borderColor: '#1D4ED8',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Skor Akhir Alternatif'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        max: Math.max(...this.finalScores.map(item => item.score)) * 1.1
                    }
                }
            }
        });
    }
}

// Global instance and functions
let ahp;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    ahp = new AHPSystem();
});

// Global functions for HTML onclick handlers
function addCriteria() {
    const input = document.getElementById('newCriteria');
    ahp.addCriteria(input.value);
    input.value = '';
}

function addAlternative() {
    const input = document.getElementById('newAlternative');
    ahp.addAlternative(input.value);
    input.value = '';
}

function loadDefaultData() {
    ahp.loadDefaultData();
}

function processAHP() {
    ahp.processAHP();
}

// Enter key support for inputs
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        if (e.target.id === 'newCriteria') {
            addCriteria();
        } else if (e.target.id === 'newAlternative') {
            addAlternative();
        }
    }
});
