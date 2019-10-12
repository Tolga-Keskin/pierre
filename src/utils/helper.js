/**
 * Capitalize Strings
 * @returns {string}
 */
String.prototype.capitalize = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

/**
 * Regex based replace all
 * @param search
 * @param replacement
 * @returns {string}
 */
String.prototype.replaceAll = function(search, replacement) {
  let target = this;
  return target.replace(new RegExp(search, 'g'), replacement);
};

String.prototype.escape = function() {
  let target = this;
  return this.replace(/<[^>]*>/g, '');
};

String.prototype.slugify = function() {
  let text = this;
  let trMap = {
    'çÇ':'c',
    'ğĞ':'g',
    'şŞ':'s',
    'üÜ':'u',
    'ıİ':'i',
    'öÖ':'o'
  };

  for(let key in trMap) {
    text = text.replace(new RegExp('['+key+']','g'), trMap[key]);
  }
  return  text.replace(/[^-a-zA-Z0-9\s]+/ig, '') // remove non-alphanumeric chars
    .replace(/\s/gi, "-") // convert spaces to dashes
    .replace(/[-]+/gi, "-") // trim repeated dashes
    .toLowerCase();
};

String.prototype.dateToString = function() {
  let dateString = this;
  let date = new Date(dateString);

  return date.toLocaleString();
};

String.prototype.dateToHumanize = function() {
  let dateString = this;
  let date = new Date().toLocaleString("en-us", {timeZone: Date.prototype.systemZone});
  let date2 = new Date(dateString).toLocaleString("en-US", {timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone});
  let delta = Math.round((+new Date(date) - new Date(date2)) / 1000);

  let minute = 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7,
    month = week * 4,
    year = month * 12;

  let fuzzy;

  if (delta < 30) {
    fuzzy = 'just then.';
  } else if (delta < minute) {
    fuzzy = delta + ' seconds ago.';
  } else if (delta < 2 * minute) {
    fuzzy = 'a minute ago.'
  } else if (delta < hour) {
    fuzzy = Math.floor(delta / minute) + ' minutes ago.';
  } else if (Math.floor(delta / hour) === 1) {
    fuzzy = '1 hour ago.'
  } else if (delta < day) {
    fuzzy = Math.floor(delta / hour) + ' hours ago.';
  } else if (delta < day * 2) {
    fuzzy = 'yesterday';
  } else if ((delta > (day * 2)) && delta < week ) {
    fuzzy = (Math.floor(delta / day)) + ' days ago';
  }  else if ((delta > week) && delta < month) {
    fuzzy = (Math.floor(delta / week)) + ' week' + (Math.floor(delta / week) !== 1 ? 's' : '') + ' ago';
  } else if ((delta > month) && (delta < year)) {
    fuzzy = (Math.floor(delta / month)) + ' month' + (Math.floor(delta / month) !== 1 ? 's' : '') + ' ago';
  } else if (delta > year) {
    fuzzy = (Math.floor(delta / year)) + ' year' + (Math.floor(delta / year) !== 1 ? 's' : '') + ' ago';
  }

  return fuzzy;
  // let date = new Date((given || "").replace(/-/g, "/").replace(/[TZ]/g, " ")),
  //   diff = (((new Date(current)).getTime() - date.getTime()) / 1000),
  //   day_diff = Math.floor(diff / 86400);
  //
  // if (isNaN(day_diff) || day_diff < 0 || day_diff >= 31) return;
  //
  // return day_diff === 0 && (
  //   diff < 60 && "just now" || diff < 120 && "1 minute ago" || diff < 3600 && Math.floor(diff / 60) + " minutes ago" || diff < 7200 && "1 hour ago" || diff < 86400 && Math.floor(diff / 3600) + " hours ago") || day_diff == 1 && "Yesterday" || day_diff < 7 && day_diff + " days ago" || day_diff < 31 && Math.ceil(day_diff / 7) + " weeks ago";
};

/**
 * Object sizer
 * @param obj
 * @returns {number}
 */
Object.size = function(obj) {
  let size = 0, key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};

