const glob = require("glob");
const gulp = require("gulp");
const rename = require("gulp-rename");
const through2 = require("through2");
const yaml = require("js-yaml");

const entryPath = "./src";
const outputFileName = "swagger";
const outputPath = "./";

gulp.task("compile", cb => {
  return gulp
    .src(`${entryPath}/index.yaml`)
    .pipe(
      through2.obj((file, enc, cb) => {
        if (!file.isBuffer())
          throw new Error(
            `[FAILED]. '${entryPath}/index.yaml' can not load target file.`
          );
        const root = yaml.load(file.contents);
        // read resolve package
        const resolve = require("json-refs").resolveRefs;
        const options = {
          filter: ["relative", "remote"],
          loaderOptions: {
            processContent: (res, callback) => {
              callback(null, yaml.load(res.text));
            }
          }
        };

        // get all api
        const apiYamls = glob.sync(`${entryPath}/*_api.yaml`);
        let paths = {};
        gulp.src(apiYamls).pipe(
          through2.obj((file, enc, cb) => {
            const api = yaml.load(file.contents);
            paths = Object.assign(paths, api);
            cb(null);
          })
        );

        // get all schemas
        const schemaYamls = glob.sync(`${entryPath}/schemas/*.yaml`);
        let schemas = {};
        gulp.src(schemaYamls).pipe(
          through2.obj((file, enc, cb) => {
            const schema = yaml.load(file.contents);
            schemas = Object.assign(schemas, schema);
            cb(null);
          })
        );

        setTimeout(function () {
          root.paths = paths;
          root.components.schemas = schemas;

          resolve(root, options)
          .then(results => {
            file.contents = Buffer.from(yaml.dump(results.resolved));

            // remove cache
            delete require.cache[require.resolve("json-refs")];
            cb(null, file);
          })
          .catch(e => {
            throw new Error(e);
          });
        }, 2000);
      })
    )
    .pipe(
      rename({
        basename: outputFileName,
        extname: ".yaml"
      })
    )
    .pipe(gulp.dest(outputPath));
});

gulp.task("watch", cb => {
  gulp.watch([entryPath + "/**/*.yaml"], gulp.task("build"));
});

gulp.task("default", gulp.series("compile", gulp.parallel("watch")));

gulp.task("build", gulp.series("compile"));
