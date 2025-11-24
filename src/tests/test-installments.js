// Comprehensive test for the new installment system
// This file tests all functionality to ensure the implementation works correctly

// Test data for flat installment calculations
const FLAT_TESTS = [
    {
        name: 'Laptop 12x',
        totalAmount: 12000000,
        installmentCount: 12,
        expectedInstallmentAmount: 1000000,
        description: 'Laptop dengan cicilan 12x flat'
    },
    {
        name: 'Motorcycle 24x',
        totalAmount: 48000000,
        installmentCount: 24,
        expectedInstallmentAmount: 2000000,
        description: 'Motorcycle dengan cicilan 24x flat'
    },
    {
        name: 'Education Loan 36x',
        totalAmount: 36000000,
        installmentCount: 36,
        expectedInstallmentAmount: 1000000,
        description: 'Pinjaman pendidikan dengan cicilan 36x flat'
    },
    {
        name: 'Small Amount 1x',
        totalAmount: 500000,
        installmentCount: 1,
        expectedInstallmentAmount: 500000,
        description: 'Pembayaran sekali, tidak ada cicilan'
    }
];

// Payment schedule tests
const PAYMENT_SCHEDULE_TESTS = [
    {
        loanDate: '2025-01-15',
        installmentCount: 6,
        expectedFirstDueDate: '2025-02-15',
        description: '6 cicilan mulai 15 Febru 2025'
    },
    {
        loanDate: '2025-06-01',
        installmentCount: 12,
        expectedFirstDueDate: '2025-07-01',
        description: '12 cicilan mulai 1 Juli 2025'
    },
    {
        loanDate: '2025-01-01',
        installmentCount: 3,
        expectedFirstDueDate: '2025-02-01',
        description: '3 cicilan mulai 1 Febru 2025, bulanan singkat'
    }
];

// Test the core calculation utilities
const calculateInstallmentAmount = require('../../src/utils/installmentCalculations.js').calculateInstallmentAmount;
const generatePaymentSchedule = require('../../src/utils/installmentCalculations.js').generatePaymentSchedule;
const calculateDaysUntilDue = require('../../src/utils/installmentCalculations.js').calculateDaysUntilDue;

// Test helper function
function runCalculationTests() {
    console.log('🧮 Running installment calculation tests...');

    let passedTests = 0;
    let failedTests = 0;

    FLAT_TESTS.forEach((test, index) => {
        const installmentAmount = calculateInstallmentAmount(test.totalAmount, test.installmentCount);

        // Check if installment amount is calculated correctly (flat method)
        const expectedAmount = Math.round(test.totalAmount / test.installmentCount);
        const difference = Math.abs(installmentAmount - expectedAmount);

        if (difference === 0) {
            console.log(`✅ Test ${index + 1}: ${test.name}`);
            console.log(`   Expected installment: ${formatCurrency(expectedAmount)}`);
            console.log(`   Calculated installment: ${formatCurrency(installmentAmount)}`);
            console.log(`   Result: ${installmentAmount === expectedAmount ? 'PASS' : 'FAIL'}`);
            passedTests++;
        } else {
            console.log(`❌ Test ${index + 1}: ${test.name}`);
            console.log(`   Expected installment: ${formatCurrency(expectedAmount)}`);
            console.log(`   Calculated installment: ${formatCurrency(installmentAmount)}`);
            console.log(`   Difference: ${formatCurrency(difference)}`);
            console.log(`   Result: FAIL`);
            failedTests++;
        }

        console.log(''); // Empty line for readability
    });

    console.log(`\n📊 Calculation Test Results:`);
    console.log(`Passed: ${passedTests}/${FLAT_TESTS.length}`);
    console.log(`Failed: ${failedTests}/${FLAT_TESTS.length}`);

    if (failedTests === 0) {
        console.log('🎉 All calculation tests PASSED!');
    } else {
        console.log('⚠️  Some calculation tests FAILED!');
    }

    return { passedTests, failedTests };
}

// Test payment schedule generation
function runPaymentScheduleTests() {
    console.log('\n📅 Running payment schedule tests...');

    let passedTests = 0;
    let failedTests = 0;

    PAYMENT_SCHEDULE_TESTS.forEach((test, index) => {
        const schedule = generatePaymentSchedule({
            id: `test-${index}`,
            totalAmount: test.expectedTotalAmount || 1000000, // Default total for test
            installmentCount: test.installmentCount,
            installmentAmount: test.expectedTotalAmount ? Math.round(test.expectedTotalAmount / test.installmentCount) : 500000,
            loanDate: test.loanDate,
            description: test.description
        });

        // Basic validation
        if (!schedule || !Array.isArray(schedule) || schedule.length === 0) {
            console.log(`❌ Test ${index + 1}: ${test.description}`);
            console.log('   Error: Invalid schedule generated');
            failedTests++;
            return;
        }

        // Check correct number of installments
        if (schedule.length !== test.installmentCount) {
            console.log(`❌ Test ${index + 1}: ${test.description}`);
            console.log(`   Expected: ${test.installmentCount} installments`);
            console.log(`   Generated: ${schedule.length} installments`);
            failedTests++;
            return;
        }

        // Check all installments have required fields
        const validSchedule = schedule.every(installment =>
            installment.id &&
            installment.installmentNumber &&
            installment.dueDate &&
            installment.amount > 0 &&
            ['paid', 'unpaid', 'overdue'].includes(installment.status)
        );

        if (!validSchedule) {
            console.log(`❌ Test ${index + 1}: ${test.description}`);
            console.log('   Error: Invalid installment structure');
            failedTests++;
            return;
        }

        // Check first installment due date
        const firstDueDate = new Date(schedule[0].dueDate);
        const expectedFirstDueDate = new Date(test.expectedFirstDueDate);
        const dueDateDiff = Math.abs(firstDueDate - expectedFirstDueDate);
        const daysDiff = dueDateDiff / (1000 * 60 * 60 * 24); // Convert to days

        if (daysDiff > 1) { // Allow 1 day tolerance
            console.log(`❌ Test ${index + 1}: ${test.description}`);
            console.log(`   Expected first due date: ${test.expectedFirstDueDate}`);
            console.log(`   Generated first due date: ${schedule[0].dueDate}`);
            console.log(`   Days difference: ${daysDiff.toFixed(2)}`);
            failedTests++;
            return;
        }

        console.log(`✅ Test ${index + 1}: ${test.description}`);
        console.log(`   Generated ${schedule.length} installments with correct structure`);
        console.log(`   First due date correct: ${schedule[0].dueDate}`);
        passedTests++;
    });

    console.log(`\n📊 Payment Schedule Test Results:`);
    console.log(`Passed: ${passedTests}/${PAYMENT_SCHEDULE_TESTS.length}`);
    console.log(`Failed: ${failedTests}/${PAYMENT_SCHEDULE_TESTS.length}`);

    if (failedTests === 0) {
        console.log('🎉 All payment schedule tests PASSED!');
    } else {
        console.log('⚠️  Some payment schedule tests FAILED!');
    }

    return { passedTests, failedTests };
}

// Test days until due calculation
function runDaysUntilDueTests() {
    console.log('\n📅 Running days until due tests...');

    let passedTests = 0;
    let failedTests = 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    const testCases = [
        {
            description: 'Payment due today',
            paymentDate: today.toISOString().split('T')[0],
            expectedDays: 0
        },
        {
            description: 'Payment due tomorrow',
            paymentDate: new Date(today.getTime() + (24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            expectedDays: 1
        },
        {
            description: 'Payment due in 7 days',
            paymentDate: new Date(today.getTime() + (7 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            expectedDays: 7
        },
        {
            description: 'Payment overdue by 3 days',
            paymentDate: new Date(today.getTime() - (3 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            expectedDays: -3
        },
        {
            description: 'Payment overdue by 30 days',
            paymentDate: new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
            expectedDays: -30
        }
    ];

    testCases.forEach((test, index) => {
        const daysUntilDue = calculateDaysUntilDue({
            dueDate: test.paymentDate,
            paidDate: null
        });

        if (daysUntilDue === test.expectedDays) {
            console.log(`✅ Test ${index + 1}: ${test.description}`);
            console.log(`   Expected: ${test.expectedDays} days`);
            console.log(`   Calculated: ${daysUntilDue} days`);
            console.log(`   Result: PASS`);
            passedTests++;
        } else {
            console.log(`❌ Test ${index + 1}: ${test.description}`);
            console.log(`   Expected: ${test.expectedDays} days`);
            console.log(`   Calculated: ${daysUntilDue} days`);
            console.log(`   Result: FAIL`);
            failedTests++;
        }
    });

    console.log(`\n📊 Days Until Due Test Results:`);
    console.log(`Passed: ${passedTests}/${testCases.length}`);
    console.log(`Failed: ${failedTests}/${testCases.length}`);

    if (failedTests === 0) {
        console.log('🎉 All days until due tests PASSED!');
    } else {
        console.log('⚠️  Some days until due tests FAILED!');
    }

    return { passedTests, failedTests };
}

// Test the React components (simulated)
function testComponentRendering() {
    console.log('\n🎨 Testing React component rendering...');

    // This would require a full React testing setup
    // For now, we'll verify that components can be imported and instantiated
    try {
        // Test if components can be imported
        const InstallmentCard = require('./src/components/installments/InstallmentCard.jsx');
        const AddInstallmentModal = require('./src/components/installments/AddInstallmentModal.jsx');
        const InstallmentDetails = require('./src/components/installments/InstallmentDetails.jsx');
        const InstallmentManager = require('./src/components/installments/InstallmentManager.jsx');

        // Test if components have the expected exports
        if (typeof InstallmentCard.default !== 'function' &&
            typeof AddInstallmentModal.default !== 'function' &&
            typeof InstallmentDetails.default !== 'function' &&
            typeof InstallmentManager.default !== 'function') {
            console.log('✅ All components exported as expected');
            console.log('✅ Components can be imported');
            return true;
        } else {
            console.log('❌ Component import/export issues detected');
            console.log('InstallmentCard:', typeof InstallmentCard.default);
            console.log('AddInstallmentModal:', typeof AddInstallmentModal.default);
            console.log('InstallmentDetails:', typeof InstallmentDetails.default);
            console.log('InstallmentManager:', typeof InstallmentManager.default);
            return false;
        }
    } catch (error) {
        console.log('❌ Error importing components:', error.message);
        return false;
    }
}

// Test data persistence
function testDataPersistence() {
    console.log('\n💾 Testing data persistence...');

    try {
        // Test localStorage availability
        const testKey = 'test-installments-' + Date.now();
        const testData = {
            name: 'Test Installment',
            totalAmount: 12000000,
            installmentCount: 12,
            loanDate: '2025-01-15',
            createdAt: new Date().toISOString(),
            payments: []
        };

        localStorage.setItem(testKey, JSON.stringify(testData));

        const retrievedData = JSON.parse(localStorage.getItem(testKey));

        if (JSON.stringify(testData) === JSON.stringify(retrievedData)) {
            console.log('✅ localStorage read/write test PASSED');
            return true;
        } else {
            console.log('❌ localStorage read/write test FAILED');
            console.log('Original:', testData);
            console.log('Retrieved:', retrievedData);
            return false;
        }
    } catch (error) {
        console.log('❌ localStorage test ERROR:', error.message);
        return false;
    }
}

// Format currency for display
function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
}

// Main test runner
function runAllTests() {
    console.log('🚀 Starting comprehensive installment system tests...\n');

    const results = {
        calculations: runCalculationTests(),
        paymentSchedule: runPaymentScheduleTests(),
        daysUntilDue: runDaysUntilDueTests(),
        components: testComponentRendering(),
        persistence: testDataPersistence()
    };

    console.log('\n📋 COMPREHENSIVE TEST RESULTS:');
    console.log('=====================================');

    // Summary
    const totalTests = Object.values(results).reduce((sum, result) => sum.passedTests + sum.failedTests, 0);
    const totalPassed = Object.values(results).reduce((sum, result) => sum.passedTests, 0);
    const totalFailed = Object.values(results).reduce((sum, result) => sum.failedTests, 0);

    console.log(`📊 SUMMARY:`);
    console.log(`Total Tests: ${totalTests}`);
    console.log(`Total Passed: ${totalPassed}`);
    console.log(`Total Failed: ${totalFailed}`);
    console.log(`Success Rate: ${((totalPassed / totalTests) * 100).toFixed(1)}%`);

    console.log('\n📊 DETAILED RESULTS:');
    console.log('Calculations:');
    console.log(`  - Passed: ${results.calculations.passedTests}/${FLAT_TESTS.length}`);
    console.log(`  - Failed: ${results.calculations.failedTests}/${FLAT_TESTS.length}`);

    console.log('Payment Schedule:');
    console.log(`  - Passed: ${results.paymentSchedule.passedTests}/${PAYMENT_SCHEDULE_TESTS.length}`);
    console.log(`  - Failed: ${results.paymentSchedule.failedTests}/${PAYMENT_SCHEDULE_TESTS.length}`);

    console.log('Days Until Due:');
    console.log(`  - Passed: ${results.daysUntilDue.passedTests}/${Object.keys(results.daysUntilDue).length}`);
    console.log(`  - Failed: ${results.daysUntilDue.failedTests}/${Object.keys(results.daysUntilDue).length}`);

    console.log('Components:');
    console.log(`  - Status: ${results.components ? 'PASSED' : 'FAILED'}`);

    console.log('Data Persistence:');
    console.log(`  - Status: ${results.persistence ? 'PASSED' : 'FAILED'}`);

    // Final verdict
    const allTestsPassed = totalFailed === 0 && results.components && results.persistence;

    if (allTestsPassed) {
        console.log('\n🎉 ALL TESTS PASSED! 🎉');
        console.log('✅ Installment system is working correctly');
        console.log('✅ Ready for integration');
    } else {
        console.log('\n⚠️  SOME TESTS FAILED! ⚠️');
        console.log('❌ Issues need to be resolved before integration');

        if (!results.components) {
            console.log('🔧 Component import/export issues detected');
        }

        if (!results.persistence) {
            console.log('💾 Data persistence issues detected');
        }

        const criticalFailures = [
            !results.calculations || results.calculations.failedTests > 0,
            !results.paymentSchedule || results.paymentSchedule.failedTests > 0,
            !results.daysUntilDue || results.daysUntilDue.failedTests > 0
        ];

        if (criticalFailures.some(failure => failure)) {
            console.log('🔥 CRITICAL FAILURES IN CORE FUNCTIONALITY');
        }
    }

    return {
        success: allTestsPassed,
        results
    };
}

// Export function for testing in browser
if (typeof window !== 'undefined') {
    window.testInstallmentSystem = {
        runAllTests,
        formatCurrency
    };
}

// Run tests if this file is executed directly
if (typeof module !== 'undefined' && module.require.main === module) {
    // Check if we're running in Node.js
    runAllTests();
}
