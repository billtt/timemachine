/**
 * Created by billtt on 02/01/2017.
 */

function onSelectedRange(e) {
    var start = new Date(e.startDate);
    start = start.getFullYear() + '-' + (start.getMonth()+1) + '-' + start.getDate();
    var end = new Date(e.endDate);
    end = end.getFullYear() + '-' + (end.getMonth()+1) + '-' + end.getDate();
    window.location.href = 'travel?start=' + start + '&end=' + end;
}

function onYearTitleClick() {
    $('.months-container')[0].style.setProperty('display', 'block', 'important');
}

$(function() {
    $('#ycalendar').calendar({
        enableRangeSelection: true,
        roundRangeLimits: false,
        selectRange: onSelectedRange,
        dataSource: [{
            id: 0,
            name: 'Selected Date',
            startDate: new Date(startDate),
            endDate: new Date(endDate)
        }],
        renderEnd: function() {
            $('th.year-title').click(onYearTitleClick);
        }
    });
    $('#ycalendar').data('calendar').setYear(new Date(startDate).getFullYear());
});
