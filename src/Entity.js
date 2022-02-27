import {Glyph} from './Glyph.js';

export class Entity extends Glyph{ 
  constructor(properties) {
    super();
    properties = properties || {};
    this.chr = properties['character'] || ' ';
    this.foreground = properties['foreground'] || 'white';
    this.background = properties['background'] || 'black';
    
    // Call the glyph's construtor with our set of properties
//    Game.Glyph.call(this, properties);
    // Instantiate any properties from the passed object
    this.name = properties['name'] || '';
    this.x = properties['x'] || 0;
    this.y = properties['y'] || 0;
   
    // Create an object which will keep track what mixins we have
    // attached to this entity based on the name property
    this.attachedMixins = {};
    // Setup the object's mixins
    var mixins = properties['mixins'] || [];
    for (var i = 0; i < mixins.length; i++) {
        // Copy over all properties from each mixin as long
        // as it's not the name or the init property. We
        // also make sure not to override a property that
        // already exists on the entity.
//        Object.getOwnPropertyNames(mixins[i].prototype).forEach((value) => {
//          console.log('qqq i: ', i, 'value: ', value);
//        })
        let sss = Object.getPrototypeOf(mixins[i])
        let sss2 = Object.getOwnPropertyNames(sss)
        let ttt = Object.getOwnPropertyNames(mixins[i])
        let xxx = mixins[i]
        let www = ttt.concat(sss2)
//        console.log('sss', Object.getPrototypeOf(mixins[i]))
//        console.log('ttt', Object.getOwnPropertyNames(mixins[i]))
        //console.log('www', Object.getOwnPropertyNames(mixins[i]).concat(Object.getPrototypeOf(mixins[i])));
//        console.log('xxx', xxx)
//        console.log('www', www);
        let jjj = {...xxx}
        for (let g of sss2) {
//          console.log('g', g)
//          console.log('sss[g]', sss[g])
          let h = sss[g]
          jjj = {...jjj, [g]: h}
        }
         
        //Object.assign(jjj, xxx, sss);
        


//        console.log('jjj', jjj)
        let rrr = []
        if (mixins[i].prototype) {
          rrr = Object.getOwnPropertyNames(mixins[i].prototype)
        }
//        console.log('rrr', rrr)

        // for data
        //for (var key in mixins[i]) {
        for (var key in jjj) {
//            console.log('ooo', 'key', key, 'i', i, 'this', this);
            if (key != 'init' && key != 'name' && key != 'constructor' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
//                console.log('ppp', 'key', key, 'i', i, 'this', this);
            }
        }


//        console.dir(this, {depth:null})
/*
        // for methods
        for (var key in Object.getPrototypeOf(mixins[i])) {
            console.log('ooo2', 'key', key, 'i', i, 'this', this);
            if (key != 'init' && key != 'name' && key != 'constructor' && !this.hasOwnProperty(key)) {
                this[key] = mixins[i][key];
                console.log('ppp2', 'key', key, 'i', i, 'this', this);
            }
        

        }
*/

        // Add the name of this mixin to our attached mixins
        this.attachedMixins[mixins[i].name] = true;
        // Finally call the init function if there is one
        if (mixins[i].init) {
            mixins[i].init.call(this, properties);
        }
    }
//    console.log('iii', properties)
  };
  // Make entities inherit all the functionality from glyphs
  //Game.Entity.extend(Game.Glyph);
  
  setName(name) {
      this.name = name;
  }
  setX(x) {
      this.x = x;
  }
  setY(y) {
      this.y = y;
  }
  setZ(z) {
      this.z = z;
  }
  getName() {
      return this.name;
  }
  getX() {
      return this.x;
  }
  getY  () {
      return this.y;
  }
  
  getZ() {
      //return this.z;
      return 0;
  }

  hasMixin(obj) {
    // Allow passing the mixin itself or the name as a string
    console.log('hasMixin(obj)', obj)
    if (typeof obj === 'object') {
        return this.attachedMixins[obj.name];
    } else {
        return this.attachedMixins[name];
    }
  }

/*
Game.Entity.prototype.getChar = function(){ 
  return this.chr; 
};

Game.Entity.prototype.getBackground = function(){
  return this.background;
};

Game.Entity.prototype.getForeground = function(){ 
  return this.foreground; 
};
*/
};
