var JoinPlugin = require('join-webpack-plugin');
var merge = require("merge");
var flatten = require('flat');


function flattenLowness(lowness, obj, opts) {
  var res = {};
  if(lowness) {
    Object.keys(obj).forEach(function(key) {
      if(obj[key] instanceof Array || obj[key] instanceof Object) {
        res[key] = flattenLowness(lowness-1, obj[key], opts);
      } else {
        res[key] = obj[key]
      }
    });
  } else {
    res = flatten(obj, opts);
  }
  return res;
}


function IntlPlugin(options) {

  options.join = function(common, addition) {
    return merge.recursive(
      common ? common : {},
      addition ? JSON.parse(addition) : {}
    );
  };

  var lowness = options.flattenLowness;
  lowness = undefined === lowness ? 1 : lowness;
  var depth = options.flattenDepth;
  var flattenOpts = depth ? {maxDepth: depth} : {};

  options.save = function(common) {
    if (this.locale) {
      commonWithLocale = {};
      commonWithLocale[this.locale] = common;
      common = commonWithLocale;
    }
    return JSON.stringify(
      flattenLowness(lowness, common, flattenOpts)
    );
  };

  options.group = options.group || "[name]"
  options.name = options.name || '[name].[hash].json'

  JoinPlugin.call(this,options);
}

IntlPlugin.prototype = Object.create(JoinPlugin.prototype);

IntlPlugin.prototype.loader = JoinPlugin.prototype.loader;
IntlPlugin.loader = JoinPlugin.loader;

module.exports = IntlPlugin;

