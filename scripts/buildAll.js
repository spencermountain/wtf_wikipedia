const sh = require('shelljs')

// run each plugin's tests:
sh.cd('./plugins')
sh.ls().forEach(function (dir) {
  sh.cd(dir)
  console.log('\n\n\n===' + dir + '===')
  let code = sh.exec(`npm run build`).code
  sh.cd('../')
  if (code !== 0) {
    sh.exit(1)
  }
})
