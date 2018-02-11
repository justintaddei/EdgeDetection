const gulp = require('gulp');
const bundle = require('lernetz-typescript-gulp-task');

gulp.task('bundle', bundle({
  bundle: 'app', dest: 'build', src: './src/app.ts'
}));

gulp.task('default', ['bundle'], () => {
  return gulp.watch('src/**/*.ts', ['bundle']);
});