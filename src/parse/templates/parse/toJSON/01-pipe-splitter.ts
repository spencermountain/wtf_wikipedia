const count = (str: string, find: string) => str.split(find).length - 1

// Is there an opener after the last closer, given whether there was before this piece?
// The first answer ignores the piece's last character, the second doesn't.
const hasOpener = (piece: string, open: string, close: string, before: boolean) => {
  const after = piece.slice(piece.lastIndexOf(close) + 1)
  const kept = before && !piece.includes(close)
  return [kept || after.slice(0, -1).includes(open), kept || after.includes(open)]
}

//turn {{name|one|two|three}} into [name, one, two, three]
const pipeSplitter = function (tmpl) {
  //start with a naive '|' split
  const pieces = tmpl.split(/\n?\|/)
  //we've split by '|', which is pretty lame
  //look for broken-up links and fix them :/
  let arr = []
  let parts = []
  // keep running totals, since re-reading a growing field is quadratic
  let curly = 0
  let square = 0
  let openCurly = false
  let openSquare = false
  pieces.forEach((piece, i) => {
    parts.push(piece)
    curly += count(piece, '{{') - count(piece, '}}')
    square += count(piece, '[[') - count(piece, ']]')
    const [curlyNow, curlyNext] = hasOpener(piece, '{{', '}', openCurly)
    const [squareNow, squareNext] = hasOpener(piece, '[[', ']', openSquare)
    openCurly = curlyNext
    openSquare = squareNext
    //has equal number of opening and closing tags. handle nested case '[[[[' ']]'
    if (i + 1 < pieces.length && (curly !== 0 || square !== 0 || curlyNow || squareNow)) {
      return
    }
    arr.push(parts.join('|').trim())
    parts = []
    curly = 0
    square = 0
    openCurly = false
    openSquare = false
  })

  //remove empty fields, only at the end:
  for (let i = arr.length - 1; i >= 0; i -= 1) {
    if (arr[i] === '') {
      arr.pop()
    } else {
      break
    }
  }
  return arr
}
export default pipeSplitter
