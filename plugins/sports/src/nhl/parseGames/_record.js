const dashSplit = /([–\-−]|&ndash;)/

const parseRecord = function (record = '') {
  const arr = record.split(dashSplit)
  const result = {
    wins: Number(arr[0]) || 0,
    losses: Number(arr[2]) || 0,
    ties: Number(arr[4]) || 0
  }
  result.games = result.wins + result.losses + result.ties
  return result
}

export default parseRecord
