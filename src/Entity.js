import { Glyph } from "./Glyph.js";

export class Entity extends Glyph {
  constructor(properties) {
    super();
    properties = properties || {};
    this.chr = properties["character"] || " ";
    this.foreground = properties["foreground"] || "white";
    this.background = properties["background"] || "black";
    this.name = properties["name"] || "";
    this.x = properties["x"] || 0;
    this.y = properties["y"] || 0;
    this.attachedMixins = {};
    const mixins = properties["mixins"] || [];
    for (let i = 0; i < mixins.length; i++) {
      const protoObj = Object.getPrototypeOf(mixins[i]);
      const protoNames = Object.getOwnPropertyNames(protoObj);
      let expandedMixin = { ...mixins[i] };
      for (let key of protoNames) {
        const val = protoObj[key];
        expandedMixin = { ...expandedMixin, [key]: val };
      }
      for (let key in expandedMixin) {
        if (
          key != "init" &&
          key != "name" &&
          key != "constructor" &&
          !this.hasOwnProperty(key)
        ) {
          this[key] = mixins[i][key];
        }
      }
      // Add the name of this mixin to our attached mixins
      this.attachedMixins[mixins[i].name] = true;
      // Finally call the init function if there is one
      if (mixins[i].init) {
        mixins[i].init.call(this, properties);
      }
    }
  }

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
  getY() {
    return this.y;
  }

  getZ() {
    //return this.z;
    return 0;
  }

  hasMixin(obj) {
    // Allow passing the mixin itself or the name as a string
    console.log("hasMixin(obj)", obj);
    if (typeof obj === "object") {
      return this.attachedMixins[obj.name];
    } else {
      return this.attachedMixins[name];
    }
  }
}
