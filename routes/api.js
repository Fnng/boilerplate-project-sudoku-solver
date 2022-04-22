'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      // check if fields missing
      if (!req.body.coordinate || !req.body.value|| !req.body.puzzle){
        res.json({ error: "Required field(s) missing" })
        return
      }
      // check if value is valid
      if ( !/[1-9]{1}/.test(req.body.value) || req.body.value.length!=1 ){
        res.json({ error: "Invalid value" })
        return
      }
      // check if coordinate is valid
    
 
      if (req.body.coordinate.length!=2 ||
        !/[1-9]{1}/.test(req.body.coordinate[1])||
        !/[a-i]{1}/.test(req.body.coordinate[0].toLowerCase()) ){
        res.json({ error: "Invalid coordinate" })
        return
      }
      //check puzzle string
      if (!!solver.validate(req.body.puzzle) ){
        res.json(solver.validate(req.body.puzzle))
        return
      }
      let row = req.body.coordinate[0].toLowerCase().charCodeAt(0)-'a'.charCodeAt(0)
      let column =parseInt(req.body.coordinate[1])-1
      let rowCheck = solver.checkRowPlacement(req.body.puzzle,row,column , parseInt(req.body.value));
      let colCheck = solver.checkColPlacement(req.body.puzzle,row,column , parseInt(req.body.value));
      let regionCheck = solver.checkRegionPlacement(req.body.puzzle,row,column , parseInt(req.body.value));
      let response = {valid:false,conflict:[]}
      if ( req.body.puzzle[row*9+column]==req.body.value){
        let puzz = req.body.puzzle.slice(0,row*9+column)+'.' +req.body.puzzle.slice(row*9+column+1)
        rowCheck = solver.checkRowPlacement(puzz,row,column , parseInt(req.body.value));
        colCheck = solver.checkColPlacement(puzz,row,column , parseInt(req.body.value));
        regionCheck = solver.checkRegionPlacement(puzz,row,column , parseInt(req.body.value));
      }
     
      if (rowCheck&&colCheck&&regionCheck){
        res.json({valid: true })
        return
      }
      if(!rowCheck){
        response.conflict.push('row')
      }
      if(!colCheck){
        response.conflict.push('column')
      }
      if(!regionCheck){
        response.conflict.push('region')
      }
      res.json(response)

    });
    
  app.route('/api/solve')
    .post((req, res) => {
      if (!req.body.puzzle){
        res.json({error:"Required field missing"})
        return
      }
      //check puzzle string for length and invalid characters
      if (!!solver.validate(req.body.puzzle) ){
        res.json(solver.validate(req.body.puzzle))
        return
      }
      
      
      let result = solver.solve(req.body.puzzle.split(""),0)
      
   
      
      if (!result){
        res.json({error:"Puzzle cannot be solved"})
      }
      else{
        res.json({solution: result.join('')})
      }
    });
};
