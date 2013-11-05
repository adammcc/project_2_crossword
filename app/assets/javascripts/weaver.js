
 
//********************************************WEAVER***************************************************
//*****************************************************************************************************
//*****************************************************************************************************
//*****************************************************************************************************



  var board = [];
  var wordlist = word_list;
  var board_width = 14;
  var board_board = 14;
  var Horizontal = [];
  var Vertical = [];
  var clues = [];

   
  // MG - builds the empty board.
  function ClearBoard(){
     board = [];
     for(x = 0; x < board_width; x++){
         board.push([]);
       for(y = 0; y <board_width; y++){
         board[x].push(' ');    
       }
      }
  }

  function MatchedLetters(Word){
    var Locations = []; 
     for(x = 0; x < board_width;  x++){
       for(y = 0; y < board_width; y++){
         var c = board[x][y].toUpperCase();
         if (Word.indexOf(c) > -1){
             Locations.push(new Array(c,x,y));  //'M',1,2
         }
       } 
     }
    return Locations;
  }

  // MG - Sets a blank crossword cell before word so words don't ajoin on same row or column.  
  function BlankPrior(x,y,dx,dy,word){
    dx = dx * -1; dy = dy * -1;
    x = x + dx;
    y = y + dy;
    if(board[x]) {
    if (board[x][y] == " ") { 
        return true; 
       } else {
        return false;
       }  
    }  
    return true; 
  }

  // MG - Sets a blank crossword cell after word so words don't ajoin on same row or column.  
  function BlankAfter(x,y,dx,dy,word){
    dx = dx * (word.length + 1); dy = dy * (word.length + 1);
    x = x + dx;
    y = y + dy;
    if(board[x]) {
       if (board[x][y] == " ") { 
        return true; 
       } else {
        return false;
       }  
    }  
    return true; 
  }


  function ScorePath(x,y,dx,dy,word){
    var score = 0;
    var size = word.length;
    var blank = 0;

     px = x - dx;
     py = y - dy;
      if(board[px]) {
      if (board[px][py] != " ") {
        return -1;
      }
      }


    for(var i = 0; i < size; i++) {
     if (((x<board_width) && (y<board_board) && (x>-1) && (y>-1))) {
       if (board[x][y] != " ") {
           if(board[x][y] == word[i]) { 
            score+=1; 
           } else {
            return -1;
           }
       } else blank += 1;

       if (board[x][y] != word[i]) {
         if (dx == 1) {
             var subscore = 0; 
             if(board[x][y-1]) {
                if(board[x][y - 1] == " ")  subscore+=1
                } else subscore += 1;
             if(board[x][y + 1]) {
                if(board[x][y + 1]==" ") subscore+=1
                } else  subscore += 1;
             if (subscore==2) {
                score += 1
             } else {
                return -1;
             }
           }
         if(dy == 1){
             var subscore = 0; 
             if(board[x-1]) {
                if(board[x - 1][y] == " ") subscore += 1
              } else  subscore+=1;
             if(board[x + 1]) {
                if(board[x + 1][y] == " ") subscore += 1
              } else  subscore+=1;
             if (subscore == 2) {
                  score+=1
              } else {
                return -1;
              }
           }
          }

     } else return -1;
      x = x + dx;
      y = y + dy;
    }
     
      if(board[x]) {
        if (board[x][y] != " ") {
          return -1;
        }
      }

   //this looks wrong********************
    if (blank == word.length) score=0;
    return score;
  }
  //*************************************

  function CrossablePlaces(word){
    var Places = [];
    var StartingPoints = MatchedLetters(word);
    var dx = 0;
    var dy = 0;
    var bestscore = 0;
    var bestdx = 0;
    var bestx= 0;
    var bestdy = 0;
    var besty = 0;
   
    for(x = 0; x < board_width; x++) {
       for(y = 0; y < board_width; y++) {
          Hscore = ScorePath(x,y,1,0,word);
          Vscore = ScorePath(x,y,0,1,word); 
         // document.write(word+" ("+x+","+y+") H="+Hscore+"  V="+Vscore+" <br>");
          if(Hscore> bestscore) { 
              bestscore = Hscore;
              bestx = x;
              besty = y;
              bestdx = 1;
              bestdy =0 ;
          }
          if(Vscore> bestscore) { 
              bestscore = Vscore;
              bestx = x;
              besty = y;
              bestdx = 0;
              bestdy = 1;
          }
       }  
    }
    if(bestscore > 0){
       // document.write(word+" - "+bestscore+"("+bestx+","+besty+")-("+bestdx+","+bestdy+")<br>");
        Places.push(new Array(bestscore,bestx,besty,bestdx,bestdy));
     }
    return Places;
  } 
   
  function PlaceWord(x,y,dx,dy,word){
    // console.log(word);
    // console.log("x="+x);
    // console.log("y="+y);
    // console.log("dx="+dx);
    // console.log("dy="+dy);
    if (x != null && y != null && dx != null && dy != null && word != null) {
      clues.push(new oyCrosswordClue(word.length, "", word, "", dy, x, y));
    }
    // console.log(clues.length);
    var size = word.length;
    for(var i = 0; i < size; i++) {
      if(board[x]) {
          board[x][y] = word[i];
      }
      x = x + dx;
      y = y + dy;
    }

    if (dx == 1) {
      Horizontal.push(new Array(x,y,word));
    }
    if(dy == 1) {
      Vertical.push(new Array(x,y,word));
    }
    return true;
  }

  function PathIsClear(x,y,dx,dy,word){
    var size = word.length;
    for(var i = 0; i < size; i++) {
       if(board[x]) {
          if (board[x][y] != " ") { 
            return false; 
          }
            if (ScorePath(x,y,dx,dy,word) < 0) {
              return false;
            }
     } else return false;
      x = x + dx;
      y = y + dy;
    }
    return true;
  }

  function PlaceAtRandom(word) {  
    var trynum = 0; 
    var keeptrying = true;
    while(keeptrying) {
        var x = Math.floor(Math.random() * board_width);
        var y = Math.floor(Math.random() * board_width);
        var HorV = Math.floor(Math.random() * 20);
        if(HorV % 2 == 0) { 
            dx = 0;
            dy = 1;
        } else { 
            dx = 1;
            dy = 0;
        }
        keeptrying = ((trynum<board_width*board_board) && (!PathIsClear(x,y,dx,dy,word)));
        trynum++;
    } //  document.write(word+":random("+(trynum+1)+")<br>");
    if (PathIsClear(x,y,dx,dy,word)) { 
      PlaceWord(x,y,dx,dy,word);
    }
  }

  function PlaceAtBestCrossing(places,word){
    var x = places[0][1];  
    var y = places[0][2];
    var dx = places[0][3];
    var dy = places[0][4];
    PlaceWord(x,y,dx,dy,word);
  }

  //1. Loops 


  function BuildCrossword(){
    ClearBoard();
    // unconnected = 0;
    xwordlist = wordlist; 
    console.log(xwordlist.sort());
    var Retry = [];
    var Retry2 = [];
    while(xwordlist.length > 0) {
      var word = xwordlist.pop(); 
      var places = CrossablePlaces(word);
        if (places.length > 0) {   
       // document.write(word+":best("+places.length+" results)<br>");
         PlaceAtBestCrossing(places,word);  //so Mia could cross both Mike and Ann..
       } else {
         if (Retry.indexOf(word) == -1) {
          Retry.push(word); xwordlist.push(word);
         } else if (Retry2.indexOf(word)==-1) {
          Retry2.push(word); xwordlist.push(word);
         } else {
           PlaceAtRandom(word); 
        }
       }
    }  
  }


  function ScreenDumpCrossword() {
     // document.write("!<pre>");  
     for(x = 0; x < board_width; x++) {
       for(y = 0; y < board_width; y++) {
         var c = board[x][y];       
         // document.write(c);
       }
        // document.write(x+"\r\n");
      }
      // document.write("</pre>");
   
   // document.write('Down:<br>');
   for(var i = 0; i < Vertical.length; i++) {
    // document.write((i+1)+'. ('+Vertical[i]+')<br>');
   }
   // document.write('Across:<br>');
   for(var i = 0; i < Horizontal.length; i++) {
    // document.write((i+1)+'. ('+Horizontal[i]+')<br>');
   }
  }

  function CrosswordTable() {
         // document.write('<table border=1 cellspacing=0 cellpadding=2>');  
     for(x = 0; x < board_width; x++) {
         // document.write("<tr>");  
       for(y = 0; y < board_width; y++) {
         var c = board[x][y]; 
         if( c == " ") {
          // document.write('<td style="background:#000">'); 
         } else {  
          // document.write("<td>");        
         }
         // document.write(c);
         // document.write("</td>");  
       }
         // document.write("</tr>");  
      }
         // document.write("</table>");
       // document.write('Down:<br>');
     for(var i = 0; i < Vertical.length; i++) { 
      // document.write((i+1)+'. ('+Vertical[i]+')<br>'); 
     }
      // document.write('Across:<br>');
     for(var i = 0; i < Horizontal.length; i++) {
      // document.write((i+1)+'. ('+Horizontal[i]+')<br>'); 

     }
  }


  // console.log(oygCrosswordPuzzle);
  // console.log(clues.length);

  //**********************************************************
 
  BuildCrossword();
  CrosswordTable();
 

    // console.log(clues)

    var oygCrosswordPuzzle = new oyCrosswordPuzzle (
          "5748185539682739085",
          "./oy-cword-1.0",
          "/a/a",
          "",
          "",
          clues,
          14,
          14
    );

  //*****************************************************************************************************
  //*****************************************************************************************************
  //****************************************END-WEAVER***************************************************
  oygCrosswordPuzzle.canTalkToServer = false;


