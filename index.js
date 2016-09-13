const glob = require('glob');
const shell = require('shelljs');
const path = require('path');
const program = require('commander');

program
  .option('-p, --path <path>', 'Specify path to start from')
  .option('--dev', 'Include devDependencies')
  .parse(process.argv);

function isNotDependencyDirectory(file) {
  return file.indexOf('node_modules') < 0 && file.indexOf('bower_components') < 0; 
}

function executeShrinkwrap(file) {
  shell.cd(path.dirname(file));
  shell.exec('npm install');

  let shrinkwrapCommand = 'npm shrinkwrap';
  if(program.dev) {
    shrinkwrapCommand += ' --dev';
  }
  console.log(`Calling ${shrinkwrapCommand} on`, file);
  shell.exec(shrinkwrapCommand); 
}

glob(
  path.resolve(program.path || '', './**/package.json'), 
  { ignore: ['**/node_modules/**', '**/bower_components/**'] }, 
  (error, files) => files.forEach(executeShrinkwrap)
);
