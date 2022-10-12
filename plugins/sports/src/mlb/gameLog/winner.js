
//amazingly, it's not clear who won the game, without the css styling.
//try to pull-it out based on the team's record
function addWinner (games) {
  let wins = 0
  games.forEach((g) => {
    if (g.record.wins > wins) {
      g.win = true
      wins = g.record.wins
    } else {
      g.win = false
    }
    //improve the result format, now that we know who won..
    let res = g.result
    if (g.win) {
      g.result = {
        us: res.winner,
        them: res.loser,
      }
    } else {
      g.result = {
        us: res.loser,
        them: res.winner,
      }
    }
  })
  return games
}
export default addWinner
