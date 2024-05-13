console.log("script Start !");

/*
 * header and footer append Event
 * Need to delete after converting to PHP 
 * line : 3 ~ 22
 * */
window.addEventListener("DOMContentLoaded", function() {
  const allElements = document.getElementsByTagName("*");
  Array.prototype.forEach.call(allElements, function(el) {
    const includePath = el.dataset.includePath;
    if (includePath) {
      fetch(includePath)
        .then(response => {
          return response.text()
        })
        .then(data => {
          el.outerHTML = data;
        });
    }
  });
});

/*
 * layer Script
 * @param defaultConfig : Default Option
 * @param defaultConfig.target : target Class Name
 * @param defaultConfig.showType : bottom(default) || center || tooltip
 * @param defaultConfig.callBack : function(){ callback Event }
 * */
const layer = (() => {
  const _defaultConfig = {
    target: '.js-layer',
    showType: 'bottom',
    _isStatus: false,
    _currentTarget: undefined,
    _currentTargetInner : undefined,
    speed : 300,
    callBack: undefined,
  };
  let currentConfig = undefined;

  const _open = (config) => {
    currentConfig = Object.assign(_defaultConfig, config);
    currentConfig._currentTarget = document.querySelector(currentConfig.target);
    currentConfig._currentTargetInner = currentConfig._currentTarget.querySelector('.layer-sec');
    currentConfig._currentTarget.classList.add("active");
    
    if(currentConfig.showType === "center"){
      currentConfig._currentTargetInner.classList.add("center");
    }

    setTimeout(function(){
      currentConfig._currentTargetInner.classList.add("active");
      

      if(currentConfig.callBack){
        currentConfig.callBack();
      }
    }, currentConfig.speed);
  }

  const open = (config) => {
    if(currentConfig && currentConfig._isStatus){
      close(_open(config));
    }else{
      _open(config)
    }
  }

  const close = (callBack) => {
    currentConfig._currentTargetInner.classList.remove("active");

    setTimeout(function(){
      currentConfig._currentTarget.classList.remove("active")
      currentConfig = undefined;

      if(callBack){
        callBack();
      }
    }, currentConfig.speed);

    if(currentConfig.showType === "center"){
      setTimeout(function(){
        currentConfig._currentTargetInner.classList.remove("center");  
      }, currentConfig.speed)
    }
  }

  return {
    open : open,
    close : close
  }
})();

/*
 * sign Script
 * 
 * */
const sign = () => {
  const canvas = document.getElementById("draw-canvas");
  const canvasDiv = document.getElementById("canvas-div");
  const canvasClear = document.getElementById("js_sign_clear");
  const ctx = canvas.getContext("2d");
  const cw = (canvas.width = canvasDiv.offsetWidth), cx = cw / 2;
  const ch = (canvas.height = canvasDiv.offsetHeight), cy = ch / 2;
  ctx.strokeStyle = "#000";
  let dibujando = false;
  let m = { x: 0, y: 0 };

  const eventsRy = [{event:"mousedown",func:"onStart"}, 
                  {event:"touchstart",func:"onStart"},
                  {event:"mousemove",func:"onMove"},
                  {event:"touchmove",func:"onMove"},
                  {event:"mouseup",func:"onEnd"},
                  {event:"touchend",func:"onEnd"},
                  {event:"mouseout",func:"onEnd"}
                ];

  function onStart(evt) {
    m = oMousePos(canvas, evt);
    ctx.beginPath();
    dibujando = true;
  }

  function onMove(evt) {
    if (dibujando) {
      ctx.moveTo(m.x, m.y);
      m = oMousePos(canvas, evt);
      ctx.lineTo(m.x, m.y);
      ctx.stroke();
    }
  }

  function onEnd(evt) {
    dibujando = false;
  }

  window.onStart = onStart;
  window.onMove = onMove;
  window.onEnd = onEnd;
  
  function oMousePos(canvas, evt) {
    const ClientRect = canvas.getBoundingClientRect();
    const e = evt.touches ? evt.touches[0] : evt;

    return {
      x: Math.round(e.clientX - ClientRect.left),
      y: Math.round(e.clientY - ClientRect.top)
    };
  }

  for (let i = 0; i < eventsRy.length; i++) {
    (function(i) {
      const e = eventsRy[i].event;
      const f = eventsRy[i].func;
      canvas.addEventListener(e, function(evt) {
        evt.preventDefault();
        window[f](evt);
        return;
      },false);
    })(i);
  }

  canvasClear.addEventListener('click', () =>{
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  })
}