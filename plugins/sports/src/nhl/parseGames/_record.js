const dashSplit = /([–\-−]|&ndash;)/

const parseRecord = function (record = '') {
  let arr = record.split(dashSplit)
  let result = {
    wins: Number(arr[0]) || 0,
    losses: Number(arr[2]) || 0,
    ties: Number(arr[4]) || 0
  }
  result.games = result.wins + result.losses + result.ties
  return result
}

export default parseRecord
