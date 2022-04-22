const chai = require('chai');
const assert = chai.assert;

const solver = require('../controllers/sudoku-solver.js');
let Solver = new solver();
let validpuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
let validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
suite('UnitTests', () => {
    
   suite('Basic',()=>{
       // Logic handles a valid puzzle string of 81 characters
    test('Logic handles a valid puzzle string of 81 characters',()=>{
        assert.isUndefined(Solver.validate(validpuzzle))
    })
    // Logic handles a puzzle string with invalid characters (not 1-9 or .)
    test('Logic handles a puzzle string with invalid characters (not 1-9 or .)',()=>{
        let invalidChar= "D.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37."
        assert.equal(Solver.validate(invalidChar).error,"Invalid characters in puzzle")
    })
    // Logic handles a puzzle string that is not 81 characters in length
    test('Logic handles a puzzle string that is not 81 characters in length',()=>{
        let invalidlength= "....."
        assert.equal(Solver.validate(invalidlength).error,"Expected puzzle to be 81 characters long")
    })
    // Logic handles a valid row placement
    test('Logic handles a valid row placement',()=>{
        assert.isTrue(Solver.checkRowPlacement(validpuzzle,0,1,3))
    })
    // Logic handles an invalid row placement
    test('Logic handles an invalid row placement',()=>{
        assert.isFalse(Solver.checkRowPlacement(validpuzzle,0,1,5))
    })
    // Logic handles a valid column placement
    test('Logic handles a valid column placement',()=>{
        assert.isTrue(Solver.checkColPlacement(validpuzzle,0,0,1))
    })
    // Logic handles an invalid column placement
    test('Logic handles an invalid row placement',()=>{
        assert.isFalse(Solver.checkColPlacement(validpuzzle,0,0,8))
    })
    // Logic handles a valid region (3x3 grid) placement
    test('Logic handles a valid region (3x3 grid) placement',()=>{
        assert.isTrue(Solver.checkRegionPlacement(validpuzzle,0,0,1))
    })
    // Logic handles an invalid region (3x3 grid) placement
    test('Logic handles an invalid region (3x3 grid) placement',()=>{
        assert.isFalse(Solver.checkRegionPlacement(validpuzzle,0,0,2))
    })
    // Valid puzzle strings pass the solver
    test('Valid puzzle strings pass the solver',()=>{
        assert.equal(Solver.solve(validpuzzle.split(""),0).join(''),validSolution)
    })
    // Invalid puzzle strings fail the solver
    test('Invalid puzzle strings fail the solver',()=>{
        let invalidpuzzle = '145..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
        assert.isFalse(Solver.solve(invalidpuzzle.split(""),0))
    })
    // Solver returns the expected solution for an incomplete puzzle
    test('Solver returns the expected solution for an incomplete puzzle',()=>{
        let incompuzzle = "................................................................................."
        let expected ="123456789456789123789123456214365897365897214897214365531642978642978531978531642"
        assert.equal(Solver.solve(incompuzzle.split(""),0).join(''),expected)
    })

   })
    


});
