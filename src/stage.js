'use strict';
var Stage = function(init)
{
  var default_init =
  {
    width:640,
    height:320,
    dpr:1,
    container:"stage_container",
    smoothing:true,
  }

  var self = this;
  doMapInitDefaults(self,init,default_init);

  self.width  = init.width;
  self.height = init.height;
  self.dpr = init.dpr;
  if(!self.dpr) self.dpr = window.devicePixelRatio
  if(!self.dpr) self.dpr = 1;
  self.canvas = document.createElement('canvas');
  self.canvas.width  = self.width *self.dpr;
  self.canvas.height = self.height*self.dpr;
  self.canvas.style.width = self.width+"px";
  self.canvas.style.height = self.height+"px";
  self.context = self.canvas.getContext('2d',{alpha:false});
  if(self.dpr != 1) self.context.scale(self.dpr, self.dpr);
  self.context.imageSmoothingEnabled = init.smoothing;

  var pd = function(evt){ evt.preventDefault(); };
  self.canvas.addEventListener('mousedown',pd,false);
  self.canvas.addEventListener('touchstart',pd,false);
  document.getElementById(self.container).appendChild(self.canvas);

  self.detach = function()
  {
    self.canvas.removeEventListener('mousedown',pd);
    self.canvas.removeEventListener('touchstart',pd);
  }
};

