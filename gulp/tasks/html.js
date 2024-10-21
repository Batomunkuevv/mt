import fileinclude from "gulp-file-include";
import formatHTML from "gulp-format-html";

export const html = () => {
  return app.gulp.src(app.path.src.html)

    .pipe(app.plugins.plumber(
      app.plugins.notify.onError({
        title: 'HTML',
        message: 'Error: <%= error.message %>'
      })
    ))

    .pipe(fileinclude())
    .pipe(formatHTML())
    .pipe(app.plugins.replace(/@img\//g, 'images/'))
    
    .pipe(app.gulp.dest(app.path.build.html))
    .pipe(app.plugins.browserSync.stream())
}