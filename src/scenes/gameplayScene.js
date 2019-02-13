'use strict';
var GamePlayScene = function(game, stage)
{
  var self = this;

  self.resize = function(s)
  {
    stage = s;
    gg.stage = stage;
    gg.canvas = gg.stage.canvas;
    gg.ctx = gg.stage.context;

    if(hoverer) hoverer.detach(); hoverer = new PersistentHoverer({source:gg.canvas});
    if(clicker) clicker.detach(); clicker = new Clicker({source:gg.canvas});
    if(dragger) dragger.detach(); dragger = new Dragger({source:gg.canvas});
    gg.cam = {wx:0,wy:0,ww:gg.stage.width,wh:gg.stage.height};
  }

  var hoverer;
  var clicker;
  var dragger;

  self.ready = function()
  {
    self.resize(stage);

    gg.resources = [];
  };

  var t_mod_twelve_pi = 0;
  self.tick = function()
  {
    t_mod_twelve_pi += 0.01;
    if(t_mod_twelve_pi > twelvepi) t_mod_twelve_pi -= twelvepi;

/*
    var check = 1;
    hoverer.filter(thing);
    if(check) check = !clicker.filter(thing);
    if(check) check = !dragger.filter(thing);
*/

    var fs = 12;
    var x = 10;
    var y = fs;
    gg.ctx.fillStyle = black;
    gg.ctx.font = fs+"px Helvetica";
    for(var i = 0; i < gdata.objects.length; i++)
    {
      var o = gdata.objects[i];
      gg.ctx.fillText(o.name,x,y);
      clicker.quick_filter(x,y-fs,100,fs,function(){ purchase_object(o); });
      y += fs;
    }

    y += fs;
    clicker.quick_filter(x,y-fs,100,fs,function(){
      for(var i = 0; i < gdata.objects.length; i++)
      {
        var o = gdata.objects[i];
        o.held = 0;
        o.active = 0;
      }
      for(var i = 0; i < gdata.objects.length; i++)
      {
        var o = gdata.objects[i];
        tick_object(o);
      }
    });

    hoverer.flush();
    clicker.flush();
    dragger.flush();
  };

  self.draw = function()
  {
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.stage.width,gg.stage.height);

    var x = 10;
    var y = 10;
    var fs = 12;
    gg.ctx.fillStyle = black;
    gg.ctx.font = fs+"px Helvetica";
    for(var i = 0; i < gdata.objects.length; i++)
    {
      var o = gdata.objects[i];
      gg.ctx.fillText(o.name,x,y);
      gg.ctx.fillText(o.stock,x+100,y);
      y += fs;
    }

    y += fs;
    gg.ctx.fillText("tick",x,y);
  };

  self.cleanup = function()
  {
    if(hoverer) hoverer.detach(); hoverer = null;
    if(clicker) clicker.detach(); clicker = null;
    if(dragger) dragger.detach(); dragger = null;
  };

};

