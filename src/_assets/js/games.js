(function () {
  var now = new Date()
  var rows = document.querySelectorAll('tr.vevent')
  var nextRow = null

  rows.forEach(function (row) {
    var dtEnd = row.querySelector('time.dt-end')
    var dtStart = row.querySelector('time.dt-start')
    var endText = dtEnd && dtEnd.textContent.trim()
    var endTime = endText ? new Date(endText) : null

    if (!endTime || isNaN(endTime.getTime())) {
      var startText = dtStart && dtStart.textContent.trim()
      endTime = startText ? new Date(startText) : null
    }

    if (!endTime || isNaN(endTime.getTime())) return

    if (endTime < now) {
      row.classList.add('past')
    } else if (!nextRow) {
      row.classList.add('next')
      nextRow = row
    }
  })

  if (!nextRow) return

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  function scrollToNext() {
    var subscribe = document.querySelector('.subscribe')
    var stickyHeight = subscribe ? subscribe.offsetHeight : 0
    var targetY = nextRow.getBoundingClientRect().top + window.pageYOffset - stickyHeight
    var startY = window.pageYOffset
    var distance = targetY - startY

    if (Math.abs(distance) < 2) return

    var duration = Math.min(1800, Math.max(600, Math.abs(distance) * 0.6))
    var startTime = null

    function step(ts) {
      if (!startTime) startTime = ts
      var progress = Math.min((ts - startTime) / duration, 1)
      window.scrollTo(0, startY + distance * easeInOut(progress))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }

  // Fonts use font-display:swap and can shift layout after window.load.
  // document.fonts.ready resolves only after all fonts are applied,
  // then one rAF ensures the browser has committed the final layout.
  window.addEventListener('load', function () {
    var fontsReady = document.fonts ? document.fonts.ready : Promise.resolve()
    fontsReady.then(function () {
      requestAnimationFrame(scrollToNext)
    })
  })
})()
