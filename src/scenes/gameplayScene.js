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
    if(gg.cam) gg.cam = {wx:0,wy:0,ww:gg.stage.width,wh:gg.stage.height};
  }

  var hoverer;
  var clicker;
  var dragger;
  var cam;

  self.ready = function()
  {
    self.resize(stage);
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

    hoverer.flush();
    clicker.flush();
    dragger.flush();
  };

  self.draw = function()
  {
    gg.ctx.fillStyle = white;
    gg.ctx.fillRect(0,0,gg.stage.width,gg.stage.height);
  };

  self.cleanup = function()
  {
    if(hoverer) hoverer.detach(); hoverer = null;
    if(clicker) clicker.detach(); clicker = null;
    if(dragger) dragger.detach(); dragger = null;
  };

};

