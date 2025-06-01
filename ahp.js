// AHP Decision Support System - JavaScript Implementation
// Based on Analytical Hierarchy Process methodology

/**
 * AHPCalculator class for performing AHP calculations
 */
class AHPCalculator {
    constructor() {
        this.criteria = [];
        this.alternatives = [];
        this.criteriaMatrix = [];
        this.alternativeMatrices = {};
        this.criteriaWeights = [];
        this.alternativeWeights = {};
        this.finalScores = [];
        this.consistencyResults = {};
        this.results = {};
        
        // Random Index values for consistency check
        this.RI = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49];
    }

    /**
     * Set criteria array
     */
    setCriteria(criteria) {
        this.criteria = [...criteria];
        this.initializeMatrices();
    }

    /**
     * Set alternatives array
     */
    setAlternatives(alternatives) {
        this.alternatives = [...alternatives];
        this.initializeMatrices();
    }

    /**
     * Set criteria comparison matrix
     */
    setCriteriaMatrix(matrix) {
        this.criteriaMatrix = this.completeMatrix(matrix);
    }

    /**
     * Set alternative comparison matrix for a specific criterion
     */
    setAlternativeMatrix(criterion, matrix) {
        this.alternativeMatrices[criterion] = this.completeMatrix(matrix);
    }

    /**
     * Initialize empty matrices
     */
    initializeMatrices() {
        const n = this.criteria.length;
        const m = this.alternatives.length;
        
        // Initialize criteria matrix
        this.criteriaMatrix = Array(n).fill().map(() => Array(n).fill(1));
        
        // Initialize alternative matrices
        this.criteria.forEach(criterion => {
            this.alternativeMatrices[criterion] = Array(m).fill().map(() => Array(m).fill(1));
        });
    }

    /**
     * Complete matrix with reciprocal values
     */
    completeMatrix(matrix) {
        const n = matrix.length;
        const completedMatrix = Array(n).fill().map(() => Array(n).fill(1));
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    completedMatrix[i][j] = 1;
                } else if (i < j) {
                    completedMatrix[i][j] = parseFloat(matrix[i][j]) || 1;
                    completedMatrix[j][i] = 1 / completedMatrix[i][j];
                } else if (matrix[j] && matrix[j][i]) {
                    completedMatrix[i][j] = parseFloat(matrix[j][i]) || 1;
                    completedMatrix[j][i] = 1 / completedMatrix[i][j];
                }
            }
        }
        
        return completedMatrix;
    }

    /**
     * Validate input data
     */
    validateData() {
        const errors = [];
        
        if (this.criteria.length < 2) {
            errors.push('Minimal 2 kriteria diperlukan');
        }
        
        if (this.alternatives.length < 2) {
            errors.push('Minimal 2 alternatif diperlukan');
        }
        
        if (this.criteriaMatrix.length !== this.criteria.length) {
            errors.push('Matriks kriteria tidak sesuai dengan jumlah kriteria');
        }
        
        this.criteria.forEach(criterion => {
            if (!this.alternativeMatrices[criterion] || 
                this.alternativeMatrices[criterion].length !== this.alternatives.length) {
                errors.push(`Matriks alternatif untuk kriteria ${criterion} tidak lengkap`);
            }
        });
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }

    /**
     * Calculate eigenvalue and eigenvector using power method
     */
    calculateEigenVector(matrix) {
        const n = matrix.length;
        let vector = Array(n).fill(1);
        let prevVector;
        let eigenValue = 0;
        
        // Power method iteration
        for (let iter = 0; iter < 100; iter++) {
            prevVector = [...vector];
            
            // Matrix multiplication
            vector = Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    vector[i] += matrix[i][j] * prevVector[j];
                }
            }
            
            // Calculate eigenvalue
            eigenValue = Math.max(...vector);
            
            // Normalize vector
            vector = vector.map(v => v / eigenValue);
            
            // Check convergence
            let converged = true;
            for (let i = 0; i < n; i++) {
                if (Math.abs(vector[i] - prevVector[i]) > 0.0001) {
                    converged = false;
                    break;
                }
            }
            
            if (converged) break;
        }
        
        // Final normalization
        const sum = vector.reduce((a, b) => a + b, 0);
        vector = vector.map(v => v / sum);
        
        return {
            vector: vector,
            eigenValue: eigenValue
        };
    }

    /**
     * Calculate consistency metrics
     */
    calculateConsistency(matrix, eigenValue) {
        const n = matrix.length;
        const ci = (eigenValue - n) / (n - 1);
        const ri = this.RI[n - 1] || 1;
        const cr = ci / ri;
        
        return {
            lambdaMax: eigenValue,
            ci: ci,
            ri: ri,
            cr: cr,
            isConsistent: cr <= 0.1
        };
    }

    /**
     * Main calculation method
     */
    calculate() {
        try {
            // Calculate criteria weights
            const criteriaResult = this.calculateEigenVector(this.criteriaMatrix);
            this.criteriaWeights = criteriaResult.vector;
            
            // Calculate consistency for criteria
            const criteriaConsistency = this.calculateConsistency(
                this.criteriaMatrix, 
                criteriaResult.eigenValue
            );
            this.consistencyResults.criteria = criteriaConsistency;
            
            // Calculate alternative weights for each criterion
            this.alternativeWeights = {};
            this.criteria.forEach((criterion, index) => {
                const altResult = this.calculateEigenVector(this.alternativeMatrices[criterion]);
                this.alternativeWeights[criterion] = altResult.vector;
                
                // Calculate consistency for this alternative matrix
                const altConsistency = this.calculateConsistency(
                    this.alternativeMatrices[criterion],
                    altResult.eigenValue
                );
                this.consistencyResults[criterion] = altConsistency;
            });
            
            // Calculate final scores
            this.calculateFinalScores();
            
            this.results = {
                success: true,
                criteriaWeights: this.criteriaWeights,
                alternativeWeights: this.alternativeWeights,
                finalScores: this.finalScores,
                consistency: this.consistencyResults
            };
            
            return this.results;
            
        } catch (error) {
            console.error('Error in AHP calculation:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Calculate final scores by combining criteria and alternative weights
     */
    calculateFinalScores() {
        this.finalScores = this.alternatives.map((alternative, altIndex) => {
            let score = 0;
            
            this.criteria.forEach((criterion, critIndex) => {
                const criteriaWeight = this.criteriaWeights[critIndex];
                const alternativeWeight = this.alternativeWeights[criterion][altIndex];
                score += criteriaWeight * alternativeWeight;
            });
            
            return {
                name: alternative,
                score: score
            };
        });
        
        // Sort by score descending
        this.finalScores.sort((a, b) => b.score - a.score);
        
        // Add rank
        this.finalScores.forEach((item, index) => {
            item.rank = index + 1;
        });
    }

    /**
     * Get detailed results for display
     */
    getDetailedResults() {
        const totalCriteriaWeight = this.criteriaWeights.reduce((a, b) => a + b, 0);
        const maxAlternativeScore = Math.max(...this.finalScores.map(s => s.score));
        
        return {
            criteria: this.criteria.map((criterion, index) => ({
                name: criterion,
                weight: this.criteriaWeights[index],
                percentage: Math.round((this.criteriaWeights[index] / totalCriteriaWeight) * 100)
            })),
            alternatives: this.finalScores.map((item, index) => ({
                name: item.name,
                score: item.score.toFixed(4),
                percentage: Math.round((item.score / maxAlternativeScore) * 100),
                rank: item.rank
            })),
            consistency: this.consistencyResults
        };
    }
}
