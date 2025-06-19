/**
 * AHP Decision Support System - JavaScript Implementation
 * Based on Analytical Hierarchy Process methodology
 * 
 * This file contains the core AHP calculation logic including:
 * - Matrix operations and eigenvalue calculations
 * - Consistency ratio validation
 * - Final score calculations
 */

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
          // Random Index values for consistency check (Saaty's standard values)
        this.RI = [0, 0, 0.5800, 0.9000, 1.1200, 1.2400, 1.3200, 1.4100, 1.4500, 1.4900];
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
    }    /**
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
                    // Upper triangle: use provided value
                    completedMatrix[i][j] = parseFloat(matrix[i][j]) || 1;
                    // Lower triangle: reciprocal
                    completedMatrix[j][i] = 1 / completedMatrix[i][j];
                }
                // No need for else case since lower triangle is handled above
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
    }    /**
     * Calculate eigenvalue and eigenvector using power method
     */
    calculateEigenVector(matrix) {
        const n = matrix.length;
        let vector = Array(n).fill(1);
        let prevVector;
        let eigenValue = 0;
        
        // Normalize initial vector
        let sum = vector.reduce((a, b) => a + b, 0);
        vector = vector.map(v => v / sum);
        
        // Power method iteration
        for (let iter = 0; iter < 1000; iter++) {
            prevVector = [...vector];
            
            // Matrix multiplication: Av
            let newVector = Array(n).fill(0);
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    newVector[i] += matrix[i][j] * vector[j];
                }
            }
            
            // Calculate eigenvalue as the Rayleigh quotient: v^T * A * v / v^T * v
            eigenValue = 0;
            for (let i = 0; i < n; i++) {
                eigenValue += newVector[i];
            }
            
            // Normalize the new vector
            sum = newVector.reduce((a, b) => a + b, 0);
            if (sum !== 0) {
                vector = newVector.map(v => v / sum);
            }
            
            // Check convergence
            let converged = true;
            for (let i = 0; i < n; i++) {
                if (Math.abs(vector[i] - prevVector[i]) > 0.000001) {
                    converged = false;
                    break;
                }
            }
            
            if (converged) break;
        }
        
        // Calculate more accurate eigenvalue using matrix multiplication
        let Av = Array(n).fill(0);
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                Av[i] += matrix[i][j] * vector[j];
            }
        }
        
        // Calculate eigenvalue as sum of Av elements (since vector is normalized to sum=1)
        eigenValue = Av.reduce((a, b) => a + b, 0);
        
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
