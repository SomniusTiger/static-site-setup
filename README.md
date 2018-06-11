# Static Site Setup
A good place to start for people looking to code static sites.

## To Use
This setup makes use of [gulp](https://gulpjs.com) as its main build tool, with tasks for building development assets and production ones.

All HTML, SCSS, and JS files are minified. Sourcemaps are generated for the main CSS & JS files when built for development, and when building for production all HTML/SCSS/JS files are linted as well.

HTML is minified, which means all HTML under the `src/markup/` folder will be built at the root directory. To add new pages, add files/folders under the `src/markup/` folder and also add any new folders to the `.gitignore`, so you ignore generated markup. For example, if you add a folder called `recipes/` with a `index.html` file inside in `src/markup/`, that minified HTML file will be built at `/recipes/index.html`.

To build development assets, run `gulp`.
To watch files and build development assets on save, run `gulp watch`.
To build for production, run `gulp production`.

To lint your HTML/SCSS/JS files, run `gulp lint`. If there are no errors or warnings, you’re good to go!

Happy building! 😎💻
