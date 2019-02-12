'use strict';
var DOUBLETIME = 0;
var gg = {};
var ENUM;

ENUM = 0;
var QUALITY_H = ENUM; ENUM++;
var QUALITY_M = ENUM; ENUM++;
var QUALITY_L = ENUM; ENUM++;

var Game = function(init)
{
  var default_init =
  {
    width:640,
    height:320,
    container:"stage_container"
  }

  var self = this;
  gg.game = self;
  doMapInitDefaults(init,init,default_init);

  var stage = new Stage({width:init.width,height:init.height,container:init.container});
  self.manual_quality = 0;
  self.quality = QUALITY_H;
  self.highest_dpr = stage.dpr;
  var scenes = [
    new NullScene(self, stage),
    new LoadingScene(self, stage),
    new GamePlayScene(self, stage),
  ];
  var cur_scene     =  0;
  var old_cur_scene = -1;

  self.resize = function(args)
  {
    stage.detach();
    document.getElementById(stage.container).removeChild(stage.canvas);
    if(args.stage) stage = args.stage;
    else //must have width+height in args
    {
      var sargs = {};
      sargs.width = args.width;
      sargs.height = args.height;
      sargs.container = stage.container;
      stage = new Stage(sargs);
    }
    for(var i = 0; i < scenes.length; i++)
      scenes[i].resize(stage);
  }

  var prev_t;
  var consecutive_slow = 0;
  self.begin = function()
  {
    self.nextScene();
    prev_t = performance.now();
    tick(prev_t);
  };

  self.set_quality = function(q) //QUALITY_H = highest_dpr, QUALITY_M = 1, QUALITY_L = 0.5
  {
    var sargs = {};
    sargs.width = stage.width;
    sargs.height = stage.height;
    sargs.container = stage.container;
    switch(q)
    {
      case 0: sargs.dpr = self.highest_dpr; break;
      case 1: sargs.dpr = 1; break;
      case 2: sargs.dpr = 0.5; break;
    }
    self.quality = q;
    var s = new Stage(sargs);
    if(q > 0) s.context.imageSmoothingEnabled = false;
    self.resize({stage:s});
  }

  var tick = function(cur_t)
  {
    requestAnimationFrame(tick);
    if(!self.manual_quality && cur_t-prev_t > 50 && stage.dpr >= 1) //very slow
    {
      consecutive_slow++;
      if(consecutive_slow > 5)
      {
        consecutive_slow = 0;
        if(stage.dpr > 1) self.set_quality(1);
        else if(stage.dpr == 1) self.set_quality(2);
      }
    }
    else consecutive_slow = 0;
    if(old_cur_scene == cur_scene && (DOUBLETIME || cur_t-prev_t > 17)) scenes[cur_scene].tick(2);
    else scenes[cur_scene].tick(1);
    if(old_cur_scene == cur_scene) //still in same scene- draw
      scenes[cur_scene].draw();
    old_cur_scene = cur_scene;
    prev_t = cur_t;
  };

  self.nextScene = function()
  {
    self.setScene(cur_scene+1);
  };

  self.setScene = function(i)
  {
    scenes[cur_scene].cleanup();
    cur_scene = i;
    scenes[cur_scene].ready();
  }
};

