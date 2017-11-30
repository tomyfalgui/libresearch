export function secondsToHms(ms) {
  let seconds = (ms / 1000).toFixed(0)
  let d = +seconds
  let h = Math.floor(d / 3600)
  let m = Math.floor((d % 3600) / 60)
  let s = Math.floor((d % 3600) % 60)

  let hDisplay = h > 0 ? h + (h == 1 ? ' hour, ' : ' hours, ') : ''
  let mDisplay = m > 0 ? m + (m == 1 ? ' minute, ' : ' minutes, ') : ''
  let sDisplay = s > 0 ? s + (s == 1 ? ' second' : ' seconds') : ''
  return hDisplay + mDisplay + sDisplay
}

export function getYoutubeLikeToDisplay(millisec) {
  var seconds = (millisec / 1000).toFixed(0)
  var minutes = Math.floor(seconds / 60)
  var hours = ''
  if (minutes > 59) {
    hours = Math.floor(minutes / 60)
    hours = hours >= 10 ? hours : '0' + hours
    minutes = minutes - hours * 60
    minutes = minutes >= 10 ? minutes : '0' + minutes
  }

  seconds = Math.floor(seconds % 60)
  seconds = seconds >= 10 ? seconds : '0' + seconds
  if (hours != '') {
    return hours + ':' + minutes + ':' + seconds
  }
  return minutes + ':' + seconds
}
