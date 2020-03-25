var test = require('tape')
var wtf = require('./_lib')
var tidy = str => {
  str = str.replace(/\s[\s]+/g, ' ')
  str = str.replace(/\n/g, '')
  str = str.replace(/ >/g, '>')
  return str
}

test('basic-html', t => {
  var have = wtf('that cat is [[a]] cool dude').html()
  var want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">that cat is <a class="link" href="./a">a</a> cool dude</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), 'link')

  //1 tick
  have = wtf(`i 'think' so`).html()
  want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">i 'think' so</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), 'link-blank')

  //2 ticks
  have = wtf(`i ''think'' so`).html()
  want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">i <i>think</i> so</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), 'italic')

  //3 ticks
  have = wtf(`i '''think''' so`).html()
  want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">i <b>think</b> so</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), '3-ticks')

  //4 ticks
  have = wtf(`i ''''think'''' so`).html()
  want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">i <b>'think'</b> so</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), '4 ticks')

  //5 ticks
  have = wtf(`i '''''think''''' so`).html()
  want = `
<div class="section">
  <div class="text">
    <p class="paragraph">
      <span class="sentence">i <b><i>think</i></b> so</span>
    </p>
  </div>
</div>
`
  t.equal(tidy(have), tidy(want), '5-ticks')

  //-------------------
  t.end()
})
