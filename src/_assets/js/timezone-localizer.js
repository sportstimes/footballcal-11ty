(function() {
  function getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  }

  function formatLocalDate(date) {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return `${days[date.getDay()]} ${getOrdinal(date.getDate())} ${months[date.getMonth()]}`;
  }

  function localize() {
    const now = new Date();
    const offsetMinutes = -now.getTimezoneOffset();
    const absOffset = Math.abs(offsetMinutes);
    const hours = Math.floor(absOffset / 60);
    const minutes = absOffset % 60;
    const offsetStr = (offsetMinutes >= 0 ? '+' : '-') +
      String(hours).padStart(2, '0') + ':' +
      String(minutes).padStart(2, '0');

    const infoElements = document.querySelectorAll('.timezone-info');
    infoElements.forEach(el => {
      el.textContent = `Based on your local timezone ${offsetStr}`;
      el.style.display = 'block';
    });

    let lastDate = null;
    const games = document.querySelectorAll('.h-event');
    games.forEach(game => {
      const startEl = game.querySelector('.dt-start');
      const endEl = game.querySelector('.dt-end');
      const daySpan = game.querySelector('.day') || game.querySelector('.date');
      const timeSpan = game.querySelector('.starttime');
      const endTimeSpan = game.querySelector('.endtime');

      const startAttr = startEl ? startEl.getAttribute('datetime') : null;
      if (!startAttr) return;

      const startDate = new Date(startAttr);
      if (isNaN(startDate.getTime())) return;

      // Update day
      if (daySpan) {
        const dateKey = startDate.toDateString();
        const isTimeline = game.tagName === 'TR';
        if (isTimeline && dateKey === lastDate) {
          daySpan.textContent = '';
        } else {
          daySpan.textContent = formatLocalDate(startDate);
          lastDate = dateKey;
        }
      }

      // Update time
      if (timeSpan) {
        const isTimeline = game.tagName === 'TR';
        if (isTimeline) {
          // 24h format for timeline: H:mm
          const hours = startDate.getHours();
          const mins = String(startDate.getMinutes()).padStart(2, '0');
          timeSpan.textContent = `${hours}:${mins}`;
        } else {
          // 12h format for detail: h:mma
          let hours = startDate.getHours();
          const ampm = hours >= 12 ? 'pm' : 'am';
          hours = hours % 12;
          hours = hours || 12;
          const mins = String(startDate.getMinutes()).padStart(2, '0');
          timeSpan.textContent = `${hours}:${mins}${ampm}`;
        }
      }

      // Update end time
      if (endTimeSpan && endEl) {
        const endAttr = endEl.getAttribute('datetime');
        if (endAttr) {
          const endDate = new Date(endAttr);
          if (!isNaN(endDate.getTime())) {
            let hours = endDate.getHours();
            const ampm = hours >= 12 ? 'pm' : 'am';
            hours = hours % 12;
            hours = hours || 12;
            const mins = String(endDate.getMinutes()).padStart(2, '0');
            endTimeSpan.textContent = `–${hours}:${mins}${ampm}`;
          }
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', localize);
  } else {
    localize();
  }
})();
