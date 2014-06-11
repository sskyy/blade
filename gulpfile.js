var gulp = require('gulp'),
    concat = require('gulp-concat'),
    fs = require('fs'),
    exec = require('child_process').exec,
    path = require('path')

var srcBindingPath = './src/blade/bindings',
    distbindingPath = './dist/blade/bindings'

var files = [
    './src/head.js',
    './src/blade/sandbox.js',
    './src/blade/config.js',
    './src/blade/util.js',
    './src/blade/dom.js',
    './src/blade/binding.js',
    './src/blade/dom_generators.js'
].concat( fs.readdirSync( srcBindingPath ).reduce(function( a, b){
        var filePath = path.join(srcBindingPath, b)
        if( fs.statSync(filePath).isFile() && /\.js$/.test(b)) {
            return a.concat( filePath )
        }
        return a
    },[]))
    .concat( './src/foot.js')

var libFiles = fs.readdirSync( srcBindingPath).reduce(function( a,b){
    var filePath = path.join(srcBindingPath, b)
    if( b!=='.' && b!=='..' && fs.statSync(filePath).isDirectory() && !/^\./.test(b) ){
        return a.concat( filePath+"/*" )
    }
    return a
},[])


gulp.task('debug',function(){
    console.log( files )
})

gulp.task('build',function(){
    gulp.src( files)
        .pipe( concat('blade.sketchplugin') )
        .pipe( gulp.dest('./dist'))
})



gulp.task('copyLib',function(cb){
    exec('rm -rf ./dist/blade',function(err){
        exec('mkdir ./dist/blade',function(err){
            exec('cp -r ./src/blade/lib ./dist/blade/lib',function(err){
                exec('mkdir ./dist/blade/bindings',function(err) {
                    fs.readdirSync(srcBindingPath).forEach(function (e) {
                        var filePath = path.join(srcBindingPath, e)
                        if (fs.statSync(filePath).isDirectory()) {
                            exec('cp -r ' + filePath + ' ' + path.join(distbindingPath, e), function (err) {
                            })
                        }
                    })
                    cb()
                })
                err && cb(err)
            })
            err && cb(err)
        })
        err && cb(err)
    })
})

gulp.task('watch', function() {
    gulp.watch(files, function() {
        gulp.run('build');
    });
    gulp.watch( libFiles,function(){
        gulp.run('copyLib')
    })
});


gulp.task('default',['build','watch'])