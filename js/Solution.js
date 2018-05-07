var cell_id=1;//номер текущей ячейки
var row_col;//объект с со значениями i,j
var col=1; // текущая колонка
var row=0; // текущая строка
var direction='down';//up-вверх;down-вниз;right-вправо;left-влево;

var a_t = new Array(6);//массив тсутствия пылесоса в ячейках
for (var l = 0; l <6; l++) {
  a_t[l] = new Array(6); // инициализируем массив времени a_t[i][j] отсутствия пылесоса в ячейках
}

var MyTimer;
var tick=0;
var tick_inside=0;
var pause=false;

/* создаем таблицу с именоваными по ID ячейками: */
var content = "<table id='tableID'>"
for(i=1; i<=5; i++){
  //  content +='<tr><td id='+i+'>'+'id= '+i+'</td>'+'<td id='+(i+5)+'>'+'id= '+(i+5)+'</td>'+'<td id='+(i+10)+'>'+'id= '+(i+10)+'</td>'+'<td id='+(i+15)+'>'+'id= '+(i+15)+'</td>'+'<td id='+(i+20)+'>'+'id= '+(i+20)+'</td></tr>';
  content +='<tr><td id='+i+'>'+'</td>'+'<td id='+(i+5)+'>'+'</td>'+'<td id='+(i+10)+'>'+'</td>'+'<td id='+(i+15)+'>'+'</td>'+'<td id='+(i+20)+'>'+'</td></tr>';
}
content += "</table>"
$('#Matrix').append(content);

/* стилизуем ячейки: */
for(i=1; i<=25; i++){
$('#'+i).css("background-color", "white");
$('#'+i).css("width", "10vw");
$('#'+i).css("height", "12vh");
}

/* начальная ячейка с пылесосом: */
$("#1").css({
     "background-image": "url(images/K2.png)",
     "background-size": "cover"
});
/* функция деления нацело: */
function div(val, by){
    return (val - val % by) / by;
}

function get_cell_id(i,j) {//определяем id ячейки по i, j матрицы
cell_id=5*j-(5-i);
  return cell_id;
}

function get_i_j(id){//определяем i, j матрицы по id ячейки
var i=0;
var j=0;
if(id%5!=0){//если не 5-я строка
  i=(id)%5;
j=div(id,5)+1;
}else{//если 5-я строка
i=5;
j=div(id,5);
}
  var row_col={
    r:i,
    c:j
  };
  return row_col;
}

function absence_time(){//функция значения времени отсутствия пылесоса в ячейках
  if (a_t[row][col]==null){
    a_t[row][col]=-1; //ставим ноль в новой ячейке с учетом стартового цикла простоя
    $('#'+cell_id).html(0);
  }
  for (var col_n = 1; col_n < 6; col_n++) { //увеличиваем время в ненулевых ячейках на единицу
    for (var row_n = 1; row_n < 6; row_n++) {
      if (a_t[row_n][col_n]>=-1){
        a_t[row_n][col_n]++;
        var time_cell = get_cell_id(row_n,col_n);
        $('#'+time_cell).html(a_t[row_n][col_n]);
      }
    }
  }
 }

 function absence_timeAI(current_row,current_col){//функция значения времени отсутствия пылесоса в ячейках
     var myId=get_cell_id(current_row,current_col);
      $('#'+myId).html(0);
     a_t[current_row][current_col]=-1;

   for (var col_n = 1; col_n < 6; col_n++) { //увеличиваем время в ненулевых ячейках на единицу
     for (var row_n = 1; row_n < 6; row_n++) {
       if (a_t[row_n][col_n]>=-1){
         a_t[row_n][col_n]++;
         var time_cell = get_cell_id(row_n,col_n);
         $('#'+time_cell).html(a_t[row_n][col_n]);
       }
     }
   }
  }
function Erasing_old(){
  $('#'+cell_id).css({ // стираем предыдущее положение и мусор
      "background-image": "none",
      "background-color": "white"
  });
}
function Draw_new(){
  $('#'+cell_id).css({ // рисуем новое положение
       "background-image": "url(images/K2.png)",
       "background-size": "cover"
  });
}

function Erasing_old(){
  $('#'+cell_id).css({ // стираем предыдущее положение и мусор
      "background-image": "none",
      "background-color": "white"
  });
}

function getMaxOf_2d_Array(numArray) {

var max_arr=new Array(6);//массив максимумов по строкам
   for(var i=1;i<numArray.length;i++){//проходим по всем строкам
  max_arr[i]=0;
      for(var j=1;j<numArray[i].length;j++){//проходим по всем столбцам
        if(max_arr[i]<numArray[i][j])max_arr[i]=numArray[i][j];//условие максимума в строке
      }
  }

var max=0;//переменная максимума по масиву максимумов
for(var j=1;j<max_arr.length;j++){
  if(max<max_arr[j])max=max_arr[j];
}
  return max;
}

function getIndexOfK(arr, k) {// возвращает индексы в 2-м массиве
  for (var i = 0; i < arr.length; i++) {
    var index = arr[i].indexOf(k);
    if (index > -1) {
      return [i, index];
    }
  }
}

function Moving_start(){ //алгоритм начальной уборки

    if((row<5)&&(direction=="down")){//двигаемся вниз
      get_cell_id(row,col);
      Erasing_old();
      row++;
      get_cell_id(row,col);
      Draw_new();
      absence_time();//генерация времени осутствия пылесоса в ячейках:
      return;
    }

    if((row==5)&&(direction=="down")){//двигаемся вправо в нижней точке row=5
      get_cell_id(row,col);
      Erasing_old();
      col++;
      get_cell_id(row,col);
      Draw_new();
      direction="up";
      absence_time();
      return;
    }

    if((row>1)&&(direction=="up")){//двигаемся вверх
      get_cell_id(row,col);
      Erasing_old();
      row--;
      get_cell_id(row,col);
      Draw_new();
      absence_time();
      return;
    }

    if((row==1)&&(direction=="up")){//двигаемся вправо в верхней точке row=1
      get_cell_id(row,col);
      Erasing_old();
      col++;
      get_cell_id(row,col);
      direction="down";
      Draw_new();
      absence_time();
      return;
    }
}

function getMaxOf_nearest(i,j) {
  // var max=max_nearest;//переменная максимума по масcиву ближайших ячеек
  var max_nearest=0;
   var nearest_arr=[];//массив ближайших к текущей ячейке квадратов

   if (i-1==0&&j-1==0){nearest_arr=[a_t[i+1][j], a_t[i][j+1]];}//левый верхний угол
   if (i-1==0&&j+1==6){nearest_arr=[a_t[i+1][j], a_t[i][j-1]];}//правый верхний угол
   if (i+1==6&&j+1==6){nearest_arr=[a_t[i-1][j], a_t[i][j-1]];}//правый нижний угол
   if (i+1==6&&j-1==0){nearest_arr=[a_t[i-1][j], a_t[i][j+1]];}//левый нижний угол
   if (i-1==0&&i+1!==6&&j-1!==0&&j+1!==6){nearest_arr=[a_t[i+1][j], a_t[i][j-1], a_t[i][j+1]];}//верхняя сторона
   if (j+1==6&&i-1!==0&&i+1!==6&&j-1!==0){nearest_arr=[a_t[i-1][j], a_t[i+1][j], a_t[i][j-1]];}//правая сторона
   if (i+1==6&&i-1!==0&&j+1!==6&&j-1!==0){nearest_arr=[a_t[i-1][j], a_t[i][j+1], a_t[i][j-1]];}//нижняя сторона
   if (j-1==0&&i-1!==0&&i+1!==6&&j+1!==6){nearest_arr=[a_t[i-1][j], a_t[i+1][j], a_t[i][j+1]];}//левая сторона
   if (j-1!==0&&i-1!==0&&j+1!==6&&i+1!==6){nearest_arr=[a_t[i-1][j], a_t[i+1][j], a_t[i][j-1], a_t[i][j+1]];}//ячейка в средине массива

   max_nearest=Math.max.apply(Math,nearest_arr);
    return max_nearest;
}

function AI_Moving2(){//алгоритм передвижения пылесоса с выбором ближайшего квадрата после стартовой уборки
  Erasing_old();// убираем пылесос
  // var time=getMaxOf_2d_Array(a_t); //находим максимальный элемент массива
  var row_col_new= get_i_j(cell_id);
   var time=getMaxOf_nearest(row_col_new.r,row_col_new.c);
    var myrow_col=[];
    myrow_col=getIndexOfK(a_t,time); // находим индексы максимального элемента
  get_cell_id(myrow_col[0],myrow_col[1]); //считываем id найденной ячейки
  Draw_new(); //переходим туда
  absence_timeAI(myrow_col[0],myrow_col[1]); //ставим ноль и обновляем временную матрицу
  get_cell_id(myrow_col[0],myrow_col[1]);
}

function AE_Moving(){ //алгоритм уборки
if( !((col==5)&&(row==5)) ){
  Moving_start();//алгоритм начальной уборки
}else{
    AI_Moving2();//алгоритм умной уборки по ближайшему максимальному значению
}
}

$(function(){//главная функция уборки
    $('.button').click(function(){
        tick_inside = 0;

        MyTimer = setInterval(function() {

          if (tick>98||tick_inside+tick>98){
            clearInterval(MyTimer);
          }

        /* запускаем генерацию мусора: */
        var start_garbage = 1 + Math.floor(Math.random() * 2); // если выпадет 1 из 2-х
        if (start_garbage ==1) {
          var number = 1 + Math.floor(Math.random() * 25);    // запускаем 1 из 25
          $('#'+number).css("background-color", "#A9A9A9");
        }
        /* перемещение пылесоса: */
        AE_Moving();
        tick_inside++;
        if (pause==true){
            $(".num").val(tick_inside+tick);
        }else{
            $(".num").val(tick_inside);
        }
      },  500);   // 0.5 секунды на перемещение
    });
});
function stopCount() {
    clearTimeout(MyTimer);
}
$(function(){//функция остановки уборки
    $('.button_stop').click(function(){
      pause = true;
      tick=tick_inside+tick;
    clearInterval(MyTimer);
  })
  })
