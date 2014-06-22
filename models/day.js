/**
 * Created with IntelliJ IDEA.
 * User: billtt
 * Date: 13-10-9
 * Time: 下午3:40
 * To change this template use File | Settings | File Templates.
 */

function Day(day, period) {
  this.day = day;
  this.period = period ? period : 'day';
}

module.exports = Day;

Day.prototype.yearSelected = function yearSelected(year) {
  return year == this.day.getFullYear();
};

Day.prototype.monthSelected = function monthSelected(month) {
  return this.period != 'year' && month == this.day.getMonth()+1;
};

Day.prototype.daySelected = function daySelected(day) {
  return this.period == 'day' && day == this.day.getDate();
};

Day.prototype.maxDayOfMonth = function maxDayOfMonth() {
  var date = new Date(this.day.getFullYear(), this.day.getMonth() + 1, 0);
  return date.getDate();
};

var sprintf = require("sprintf-js").sprintf;

Day.prototype.dateText = function dateText() {
  return sprintf('%04d.%02d.%02d', this.day.getFullYear(), this.day.getMonth()+1, this.day.getDate());
};

Day.prototype.timeText = function timeText() {
  return sprintf('%02d:%02d', this.day.getHours(), this.day.getMinutes());
}
