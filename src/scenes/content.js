
var ENUM;

ENUM = 0;
var TYPE_NULL = ENUM; ENUM++;
var TYPE_NATURAL = ENUM; ENUM++;
var TYPE_RESOURCE = ENUM; ENUM++;
var TYPE_CONSTRUCTION = ENUM; ENUM++;
var TYPE_COUNT = ENUM; ENUM++;

var gdata =
{
  objects:
  [
    {
      name:"person",
      type:TYPE_RESOURCE,
      stock:1,
      draws:[
        { group:"food", qty:1 },
      ],
      claims:[
        { group:"home", qty:1 },
      ],
    },
    {
      name:"money",
      type:TYPE_RESOURCE,
    },
    {
      name:"home",
      type:TYPE_CONSTRUCTION,
      costs:[
        { group:"money", qty:10 },
      ],
    },
    {
      name:"food",
      type:TYPE_RESOURCE,
    },
    {
      name:"farm",
      type:TYPE_CONSTRUCTION,
      costs:[
        { group:"money", qty:10 },
      ],
      holds:[
        { group:"person", qty:1 },
      ],
      produces:[
        { name:"food", qty:1 },
      ],
    },
    {
      name:"water",
      type:TYPE_RESOURCE,
    },
    {
      name:"lake",
      type:TYPE_NATURAL,
      holds:[
        { group:"person", qty:1 },
      ],
      produces:[
        { name:"water", qty:10 },
      ]
    },
    {
      name:"wood",
      type:TYPE_RESOURCE,
    },
    {
      name:"tree",
      type:TYPE_NATURAL,
      harvest:1,
      holds:[
        { group:"person", qty:1 },
      ],
      produces:[
        { name:"wood", qty:10 },
      ]
    },
    {
      name:"livestock",
      type:TYPE_CONSTRUCTION,
      costs:[
        { group:"money", qty:10 },
      ],
      holds:[
        { group:"person", qty:1 },
      ],
      produces:[
        { name:"milk", qty:1 },
      ],
    },
  ],
  groups:[
    //automate filling
  ],
};

{
  var o;
  var oo;
  var t;
  for(var i = 0; i < gdata.objects.length; i++)
  {
    o = gdata.objects[i];
    if(!o.hasOwnProperty('group')) o.group = o.name;
    if(!o.hasOwnProperty('stock')) o.stock = 0; //state
    if(!o.hasOwnProperty('active')) o.active = 0; //state
    if(!o.hasOwnProperty('claimed')) o.claimed = 0; //state
    if(!o.hasOwnProperty('held')) o.held = 0; //state
    if(!o.hasOwnProperty('harvest')) o.harvest = 0;
    if(!o.hasOwnProperty('claims')) o.claims = [];
    if(!o.hasOwnProperty('costs')) o.costs = [];
    if(!o.hasOwnProperty('holds')) o.holds = [];
    if(!o.hasOwnProperty('draws')) o.draws = [];
    if(!o.hasOwnProperty('produces')) o.produces = [];
    o.id = i;
    o.group_id = gdata.groups.length;
    for(var j = 0; j < i; j++) { oo = gdata.objects[j]; if(o.group == oo.group) { o.group_id = oo.group_id; break; } }
    if(!gdata.groups[o.group_id]) gdata.groups[o.group_id] = [];
    gdata.groups[o.group_id].push(o);
  }
  for(var i = 0; i < gdata.objects.length; i++)
  {
    o = gdata.objects[i];
    for(var j = 0; j < o.claims.length;   j++) { t = o.claims[j];   for(var k = 0; k < gdata.objects.length; k++) { oo = gdata.objects[k]; if(t.group == oo.group) { t.group_id = oo.group_id; break; } } }
    for(var j = 0; j < o.costs.length;    j++) { t = o.costs[j];    for(var k = 0; k < gdata.objects.length; k++) { oo = gdata.objects[k]; if(t.group == oo.group) { t.group_id = oo.group_id; break; } } }
    for(var j = 0; j < o.holds.length;    j++) { t = o.holds[j];    for(var k = 0; k < gdata.objects.length; k++) { oo = gdata.objects[k]; if(t.group == oo.group) { t.group_id = oo.group_id; break; } } }
    for(var j = 0; j < o.draws.length;    j++) { t = o.draws[j];    for(var k = 0; k < gdata.objects.length; k++) { oo = gdata.objects[k]; if(t.group == oo.group) { t.group_id = oo.group_id; break; } } }
    for(var j = 0; j < o.produces.length; j++) { t = o.produces[j]; for(var k = 0; k < gdata.objects.length; k++) { oo = gdata.objects[k]; if(t.name  == oo.name)  { t.id       = oo.id;       break; } } }
  }
}

var purchase_object = function(o)
{
  for(var i = 0; i < o.claims.length; i++)
  {
    var cgid = o.claims[i].group_id;
    var amt = o.claims[i].qty;
    for(var j = 0; amt && j < gdata.groups[cgid].length; j++)
    {
      while(amt && gdata.groups[cgid][j].claimed < gdata.groups[cgid][j].stock)
      {
        gdata.groups[cgid][j].claimed++;
        amt--;
      }
    }
    if(amt != 0) return 0;
  }
  for(var i = 0; i < o.costs.length; i++)
  {
    var cgid = o.costs[i].group_id;
    var amt = o.costs[i].qty;
    for(var j = 0; amt && j < gdata.groups[cgid].length; j++)
    {
      while(amt && gdata.groups[cgid][j].stock)
      {
        gdata.groups[cgid][j].stock--;
        amt--;
      }
    }
    if(amt != 0) return 0;
  }
  o.stock++;
  return 1;
}

var tick_object = function(o)
{
  for(var i = 0; i < o.stock && tick_object_stock(o); i++)
    ;
}

var tick_object_stock = function(o)
{
  for(var i = 0; i < o.holds.length; i++)
  {
    var hgid = o.holds[i].group_id;
    var amt = o.holds[i].qty;
    for(var j = 0; amt && j < gdata.groups[hgid].length; j++)
    {
      while(amt && gdata.groups[hgid][j].held < gdata.groups[hgid][j].active)
      {
        gdata.groups[hgid][j].held++;
        amt--;
      }
    }
    if(amt != 0) return 0;
  }
  for(var i = 0; i < o.draws.length; i++)
  {
    var dgid = o.draws[i].group_id;
    var amt = o.draws[i].qty;
    for(var j = 0; amt && j < gdata.groups[dgid].length; j++)
    {
      while(amt && gdata.groups[dgid][j].stock)
      {
        gdata.groups[dgid][j].stock--;
        amt--;
      }
    }
    if(amt != 0) return 0;
  }
  for(var i = 0; i < o.produces.length; i++)
  {
    var pid = o.produces[i].id;
    var p = gdata.objects[pid];
    var amt = o.produces[i].qty;
    for(var j = 0; j < amt && purchase_object(p); j++)
      ;
  }
  o.active++;
  return 1;
}

