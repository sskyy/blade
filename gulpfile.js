var gulp = require('gulp'),
    concat = require('gulp-concat'),
    fs = require('fs')

var files = [
    './src/head.js',
    './src/blade/sandbox.js',
    './src/blade/config.js',
    './src/blade/util.js',
    './src/blade/dom.js',
    './src/blade/binding.js',
    './src/blade/dom_generators.js',
].concat( fs.readdirSync('./src/blade/bindings').reduce(function( a, b){
        return (b=='.' || b=='..') ? a : a.concat('./src/blade/bindings/'+b)
    },[]))
    .concat( './src/foot.js')


gulp.task('debug',function(){
    console.log( files )
})

gulp.task('build',function(){
    gulp.src( files)
        .pipe( concat('blade.sketchplugin') )
        .pipe( gulp.dest('./dist'))
})

gulp.task('watch', function() {
    gulp.watch(files, function() {
        gulp.run('build');
    });
});

gulp.task('default',['build','watch'])