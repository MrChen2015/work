gulp = require("gulp")
less = require("gulp-less")
coffee = require("gulp-coffee") # 编译coffee
gutil = require("gulp-util")
plumber = require("gulp-plumber")
changed = require("gulp-changed")
handleError = (err) ->
  gutil.beep() # 发出滴声提示
  gutil.log err.toString() # 输出错误信息

# 各种资源的路径
coffee_src = "assets/**/*.coffee"
coffee_dest = "assets"# 生成 js

less_src = "assets/css/*.less"
less_dest = "assets/css"

gulp.task "less", ->
  gulp.src less_src
  .pipe plumber(errorHandler: handleError)
# 只编译修改过的文件
  .pipe changed(less_dest,
    extension: '.css'
  )
# 编译less
  .pipe less()
# 输出到文件
  .pipe gulp.dest(less_dest)

gulp.task "coffee", ->
  gulp.src coffee_src
  .pipe plumber(errorHandler: handleError)
  .pipe coffee() # 编译 coffee
  .pipe gulp.dest(coffee_dest)

gulp.task "default", ->
  gulp.watch [less_src], ["less","coffee"] # 监视文件，修改时自动编译
