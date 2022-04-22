class SudokuSolver {

  validate(puzzleString) {
    if (puzzleString.length!=81){
      return {error:"Expected puzzle to be 81 characters long"}
    }
    if (!/[1-9.]{81}/.test(puzzleString)){
      return {error:"Invalid characters in puzzle" }
    }
    
  }

  checkRowPlacement(puzzleString, row, column, value) {
    let neighbours = puzzleString.slice(row*9,row*9+column)+puzzleString.slice(row*9+column+1,row*9+9);
    
    if (neighbours.indexOf(value)==-1){
      return true
    } else{
      return false
    }
  }

  checkColPlacement(puzzleString, row, column, value) {
    let neighbours;
     for (let i =0; i<9;i++){
       if (i!= row){
        neighbours += puzzleString[column+(9*i)]

       }
       
     }
     if (neighbours.indexOf(value)==-1){
       return true
     } else{
       return false
     }
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let neighbours='';
    let TLcorner =Math.floor(row/3)*27+Math.floor(column/3)*3;
     for (let i =TLcorner; i<=TLcorner+18;i+=9){
       for ( let j = i ; j< i + 3 ; j++){
         if (j!= row*9+column){
          neighbours += puzzleString[j];

         }
       }
     }
     if (neighbours.indexOf(value)==-1){
      return true
    } else{
      return false
    }
  }
  solve(puzzleString,position){
    
    if (position>80){
      return puzzleString
    }
    if (puzzleString[position]!='.'){
      let colCheck = this.checkColPlacement(puzzleString,Math.floor(position/9),position%9,puzzleString[position]);
      let rowCheck = this.checkRowPlacement(puzzleString,Math.floor(position/9),position%9,puzzleString[position]);
      let regionCheck = this.checkRegionPlacement(puzzleString,Math.floor(position/9),position%9,puzzleString[position]);
      if(colCheck &&rowCheck && regionCheck ){

        return this.solve(puzzleString,position+1)
      } else{
        return false
      }
    } else{
      for ( let j = 1; j<10;j++){
        let colCheck = this.checkColPlacement(puzzleString,Math.floor(position/9),position%9,j);
        let rowCheck = this.checkRowPlacement(puzzleString,Math.floor(position/9),position%9,j);
        let regionCheck = this.checkRegionPlacement(puzzleString,Math.floor(position/9),position%9,j);
        if(colCheck &&rowCheck && regionCheck ){
          puzzleString[position]=j.toString()
          let result = this.solve(puzzleString,position+1)
          if (!! result){
            return this.solve(puzzleString,position+1)
          } else {
            puzzleString[position]='.';
          }
          
        } 
      }
      // no more valid guesses on branch
      return false
    }
  }


  


}

module.exports = SudokuSolver;

