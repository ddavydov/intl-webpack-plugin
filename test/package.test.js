var fs = require("fs");
var path = require("path");
var expect = require("expect");
var webpack = require("webpack");

var packageDir = path.join(__dirname, "package");
var distDir = path.join(__dirname, "dist");

describe('Test package', function() {
  it('package', function(done) {
    var options = require('./package/webpack.config.js')
    options.context = packageDir;
    options.output.path = distDir;
    options.output.publicPath = './test/dist/';

    webpack(options, function(err, stats) {
      if(err) return done(err);
      if(stats.hasErrors()) return done(new Error(stats.toString()));

      var bundle = require(path.join(distDir,'main.js'));

      var result = bundle(distDir);
      expect(result).toMatch(/^result ok/);

      done();
    });
  });
});
