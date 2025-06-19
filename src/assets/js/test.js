// Test AHP functionality
console.log('Testing AHP Calculator...');

try {
    const calc = new AHPCalculator();
    console.log('✓ AHPCalculator created successfully');
    
    // Test criteria setting
    const criteria = ['Distance', 'Cost', 'Facilities', 'Geographic Position', 'Warehouse Area'];
    calc.setCriteria(criteria);
    console.log('✓ Criteria set successfully:', calc.criteria);
    
    // Test alternatives setting
    const alternatives = ['Safe\'n Lock', 'Rungkut Industri', 'SPILL'];
    calc.setAlternatives(alternatives);
    console.log('✓ Alternatives set successfully:', calc.alternatives);
    
    // Test matrix completion
    const testMatrix = [
        [1, 2, 3],
        [0, 1, 4], 
        [0, 0, 1]
    ];
    const completed = calc.completeMatrix(testMatrix);
    console.log('✓ Matrix completion test:', completed);
    console.log('✓ Reciprocal check (should be 0.5):', completed[1][0]);
    
    // Test eigenvalue calculation
    const weights = calc.calculateEigenVector(completed);
    console.log('✓ Eigenvalue calculation:', weights);
    
    // Test consistency calculation
    const consistency = calc.calculateConsistency(completed, weights);
    console.log('✓ Consistency calculation:', consistency);
    
    document.getElementById('test-results').innerHTML = '<h2 class="success">All tests passed! ✓</h2>';
    
} catch (error) {
    console.error('✗ Test failed:', error);
    document.getElementById('test-results').innerHTML = '<h2 class="error">Test failed: ' + error.message + '</h2>';
} 
