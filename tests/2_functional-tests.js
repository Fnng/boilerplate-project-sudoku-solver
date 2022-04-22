const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', () => {
    let validpuzzle = '1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
    let validSolution = '135762984946381257728459613694517832812936745357824196473298561581673429269145378'
    suite("/api/solve",()=>{
        // Solve a puzzle with valid puzzle string: POST request to /api/solve
        test('Solve a puzzle with valid puzzle string: POST request to /api/solve',(done)=>{
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle:validpuzzle})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.solution,validSolution)
                    done();
                })
        })
        // Solve a puzzle with missing puzzle string: POST request to /api/solve
        test('Solve a puzzle with missing puzzle string: POST request to /api/solve',(done)=>{
            chai
                .request(server)
                .post('/api/solve')
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,'Required field missing')
                    done();
                })
        })
        // Solve a puzzle with invalid characters: POST request to /api/solve
        test('Solve a puzzle with invalid characters: POST request to /api/solve',(done)=>{
            let invalidpuzzle = '1D5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle:invalidpuzzle})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,'Invalid characters in puzzle')
                    done();
                })
        })
        // Solve a puzzle with incorrect length: POST request to /api/solve
        test('Solve a puzzle with incorrect length: POST request to /api/solve',(done)=>{
            
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle:'....'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,'Expected puzzle to be 81 characters long')
                    done();
                })
        })
        // Solve a puzzle that cannot be solved: POST request to /api/solve
        test('Solve a puzzle that cannot be solved: POST request to /api/solve',(done)=>{
            let nosolvepuzzle = '115..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            chai
                .request(server)
                .post('/api/solve')
                .send({puzzle:nosolvepuzzle})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,'Puzzle cannot be solved')
                    done();
                })
        })
        
    })
    suite("/api/check",()=>{
        // Check a puzzle placement with all fields: POST request to /api/check
        test('Check a puzzle placement with all fields: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'1',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    let unit = res.body
                    assert.equal(res.body.valid,true)
                    done();
                })
        })
        // Check a puzzle placement with single placement conflict: POST request to /api/check
        test('Check a puzzle with single placement conflict: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'3',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.valid,false)
                    assert.deepEqual(res.body.conflict,[ "column" ])
                    done();
                })
        })
        // Check a puzzle placement with multiple placement conflicts: POST request to /api/check
        test('Check a puzzle with multiple placement conflict: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'5',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.valid,false)
                    assert.deepEqual(res.body.conflict,[ "row", "region" ])
                    done();
                })
        })
        // Check a puzzle placement with all placement conflicts: POST request to /api/check
        test('Check a puzzle with all placement conflict: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'2',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.valid,false)
                    assert.deepEqual(res.body.conflict,[ "row", "column", "region" ])
                    done();
                })
        })
        // Check a puzzle placement with missing required fields: POST request to /api/check
        test('Check a puzzle placement with missing required fields: POST request to /api/check',(done)=>{
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,"Required field(s) missing")
                    done();
                })
        })
        // Check a puzzle placement with invalid characters: POST request to /api/check
        test('Check a puzzle placement with invalid characters: POST request to /api/check',(done)=>{
            let invalidpuzzle = '1D5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.'
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:invalidpuzzle,value:'2',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,"Invalid characters in puzzle" )
                    done();
                })
        })
        // Check a puzzle placement with incorrect length: POST request to /api/check
        test('Check a puzzle placement with incorrect length: POST request to /api/check',(done)=>{
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:'.....',value:'2',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,"Expected puzzle to be 81 characters long" )
                    done();
                })
        })
        // Check a puzzle placement with invalid placement coordinate: POST request to /api/check
        test('Check a puzzle placement with invalid placement coordinate: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'2',coordinate:'11'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,"Invalid coordinate" )
                    done();
                })
        })
        // Check a puzzle placement with invalid placement value: POST request to /api/check
        test('Check a puzzle placement with invalid placement value: POST request to /api/check',(done)=>{
            
            chai
                .request(server)
                .post('/api/check')
                .send({puzzle:validpuzzle,value:'d',coordinate:'A1'})
                .end((err,res)=>{
                    assert.equal(res.status,200)
                    assert.equal(res.body.error,"Invalid value" )
                    done();
                })
        })
            
    })
    

});

