import got from 'got'
const ns = 10 //templates

// known templates we don't need custom stuff for
// const doNothing = {
//   about: true,
//   main: true,
//   'main list': true,
//   see: true,
//   for: true,
//   'further information': true,
//   listen: true,
// }

let url =
  'https://wiki.openstreetmap.org/w/api.php?action=query&list=allpages&aplimit=500&apnamespace=' + ns + '&format=json'

function doit (from) {
  let myUrl = url + '&apfrom=' + encodeURIComponent(from)

  got(myUrl).then((res) => {
    let data = JSON.parse(res.body)
    let arr = data.query.allpages
    arr.forEach((o) => {
      console.log(o.title)
    })

    let cursor = data.continue.apcontinue
    if (cursor) {
      doit(cursor)
    }
  })
}

doit('')
