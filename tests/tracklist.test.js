var test = require('tape')
var wtf = require('./lib')

test('track-listing', t => {
  var str = `
{{Track listing
| headline        = Side one

| all_writing     = [[Lennon–McCartney]], except where noted

| title1          = [[Back in the U.S.S.R.]]
| length1         = 2:43

| title2          = [[Dear Prudence]]
| length2         = 3:56

| title3          = [[Glass Onion]]
| length3         = 2:17

| title4          = [[Ob-La-Di, Ob-La-Da]]
| length4         = 3:08

| title5          = [[Wild Honey Pie]]
| length5         = 0:52

| title6          = [[The Continuing Story of Bungalow Bill]]
| length6         = 3:13

| title7          = [[While My Guitar Gently Weeps]]
| note7           = [[George Harrison]]
| length7         = 4:45

| title8          = [[Happiness Is a Warm Gun]]
| length8         = 2:43
}}`
  var doc = wtf(str)
  var track = doc.templates(0)
  t.equal(track.headline, 'Side one', 'track-headline')
  t.equal(track.title4, 'Ob-La-Di, Ob-La-Da', 'title4')
  t.end()
})

test('track-listing', t => {
  var str = `
{{Tracklist
| collapsed       =
| headline        = Track list
| extra_column    = Artist(s)
| total_length    = 23:14
| all_lyrics      = [[Ramajogayya Sastry]], except where noted
| music_credits   =
| title1          = Rama Rama
| extra1          = [[Sooraj Santhosh]], [[Ranina Reddy]]
| length1         = 4:20
| title2          = Jatha Kalise
| extra2          = Sagar, [[Suchitra]]
| length2         = 3:44
| title3          = Charuseela
| note3           = Co-written by [[Devi Sri Prasad]]
| extra3          = Yazin Nizar, Devi Sri Prasad (Rap)
| length3         = 4:15
| title4          = Srimanthuda
| extra4          = [[M. L. R. Karthikeyan]]
| length4         = 2:03
| title5          = Jaago
| extra5          = [[Raghu Dixit]], [[Rita (Indian singer)|Rita]]
| length5         = 4:11
| title6          = Dhimmathirigae
| extra6          = Simha, [[Geetha Madhuri]]
| length6         = 4:41
}}`
  var doc = wtf(str)
  var track = doc.templates('tracklist')[0]
  t.equal(track.total_length, '23:14', 'track-total_length')
  t.end()
})
