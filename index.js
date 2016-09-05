const glob = require('glob');
const shell = require('shelljs');
const path = require('path');
const program = require('commander');

program
  .option('-p, --path <path>', 'Specify path to start from')
  .parse(process.argv);

function isNotDependencyDirectory(file) {
  return file.indexOf('node_modules') < 0 && file.indexOf('bower_components') < 0; 
}

function executeShrinkwrap(file) {
  console.log('Calling shrinkwrap on', file);
  shell.cd(path.dirname(file));
  shell.exec('npm install');
  shell.exec('npm shrinkwrap --dev'); 
}

glob(
  path.resolve(program.path || '', './**/package.json'), 
  { ignore: ['**/node_modules/**', '**/bower_components/**'] }, 
  (error, files) => files.forEach(executeShrinkwrap)
);
