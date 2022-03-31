import sh from 'shelljs'

let code = 0
let fail = false

// run each plugin's tests:
sh.ls('./plugins').forEach(function (dir) {
  console.log(dir + ':')
  code = sh.exec(`tape "./plugins/${dir}/tests/*.test.js" | tap-dancer --color always`).code
  if (code !== 0) {
    console.log(dir)
    fail = true
  }
})

// return proper exit-code:
if (fail) {
  sh.exit(1)
} else {
  sh.exit(0)
}
