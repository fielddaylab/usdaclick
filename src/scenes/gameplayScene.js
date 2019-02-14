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
    gg.fs = 12;
    gg.x_off = 10;
    gg.y_off = gg.fs;
    gg.stock_x   = 100;
    gg.active_x  = 140;
    gg.claimed_x = 180;
    gg.held_x    = 220;

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

    var x = gg.x_off;
    var y = gg.y_off;
    gg.ctx.fillStyle = black;
    gg.ctx.font = gg.fs+"px Helvetica";
    y += gg.fs;
    for(var i = 0; i < gdata.objects.length; i++)
    {
      var o = gdata.objects[i];
      gg.ctx.fillText(o.name,x,y);
      clicker.quick_filter(x,y-gg.fs,gg.stock_x,gg.fs,function(){ purchase_object(o); });
      y += gg.fs;
    }

    y += gg.fs;
    clicker.quick_filter(x,y-gg.fs,gg.stock_x,gg.fs,function(){
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

    var x = gg.x_off;
    var y = gg.y_off;
    gg.ctx.fillStyle = black;
    gg.ctx.font = gg.fs+"px Helvetica";
    gg.ctx.fillText("name",x,y);
    gg.ctx.fillText("stock",x+gg.stock_x,y);
    gg.ctx.fillText("active",x+gg.active_x,y);
    gg.ctx.fillText("claimed",x+gg.claimed_x,y);
    gg.ctx.fillText("held",x+gg.held_x,y);
    y += gg.fs;
    for(var i = 0; i < gdata.objects.length; i++)
    {
      var o = gdata.objects[i];
      gg.ctx.fillText(o.name,x,y);
      gg.ctx.fillText(o.stock,x+gg.stock_x,y);
      gg.ctx.fillText(o.active+"/"+o.stock,x+gg.active_x,y);
      gg.ctx.fillText(o.claimed+"/"+o.stock,x+gg.claimed_x,y);
      gg.ctx.fillText(o.held+"/"+o.stock,x+gg.held_x,y);
      y += gg.fs;
    }

    y += gg.fs;
    gg.ctx.fillText("tick",x,y);
  };

  self.cleanup = function()
  {
    if(hoverer) hoverer.detach(); hoverer = null;
    if(clicker) clicker.detach(); clicker = null;
    if(dragger) dragger.detach(); dragger = null;
  };

};

