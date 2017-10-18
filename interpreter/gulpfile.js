const gulp = require('gulp');
const ts = require('gulp-typescript');
const webpack = require('webpack-stream');

gulp.task('compileSourceCode', function(){
    const tsProject = ts.createProject('tsconfig.json');
    const result = tsProject.src().pipe(ts(tsProject));
    return result.js.pipe(gulp.dest('dist/js'));
});

gulp.task('packTestSourceCode', ['compileSourceCode'], function() {
    gulp.src('dist/js/test/scripts.js')
        .pipe(webpack({
            output: {
                filename: 'test-bundle.js'
            }
        }))
        .pipe(gulp.dest('dist/'));
});

gulp.task('packInterpreter', ['compileSourceCode'], function() {
    gulp.src('dist/js/src/interpreter.js')
        .pipe(webpack({
            output: {
                filename: 'bundle.js'
            }
        }))
        .pipe(gulp.dest('dist/'));
});
