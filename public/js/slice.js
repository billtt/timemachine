function removeSlice(id) {
	if (confirm("Sure to delete?")) {
		$.getJSON("remove", {id:id}, function(data) {
			location.reload();
		});
	}
}

function onContentChange() {
  var inpType = $('#inpType');
  var content = $("#inpContent").val();
  for (var type in _types) {
    _types[type].forEach(function(kw) {
      if (content.indexOf(kw)>=0) {
        inpType.val(type);
        return;
      }
    });
  }
}

function tick() {
  var now = new Date();
  var str = sprintf('<span style="font-size:36px;">%04d</span>&middot;%02d&middot;%02d ' +
    '<span style="font-size:36px;">%02d</span>:%02d:%02d',
    now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes(),
    now.getSeconds());
  $('#now').html(str);
}

function initDatePicker() {
    $('.input-group.date').datepicker({
        format: "yyyy.mm.dd",
        todayBtn: "linked",
        autoclose: true,
        orientation: "top auto",
        todayHighlight: true
    });
}

$(function(){

  $("#inpContent").keyup(onContentChange);
  initDatePicker();

  setInterval(tick, 1000);
  tick();
});
