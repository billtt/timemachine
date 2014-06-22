function removeSlice(id) {
	if (confirm("Sure to delete?")) {
		$.getJSON("remove", {id:id}, function(data) {
			location.reload();
		});
	}
}

function showTypeBox() {
  $("#typeBox").css("display", "block");
  return false;
}

function hideTypeBox() {
  $("#typeBox").css("display", "none");
}

function initTypeBox() {
  var pos = $("#inpType").position();
  $("#typeBox").css("left", pos.left);
  $("#typeBox").css("top", pos.top + $("#inpType").height() + 10);
  $("#inpType").click(showTypeBox);
  $(document).click(hideTypeBox);
  $("#typeBox li").click(function() {
    $("#inpType").val($(this).text());
    hideTypeBox();
    return false;
  });
}

function onContentChange() {
  var inpType = $('#inpType');
  var content = $("#inpContent").val();
  for (var type in _types) {
    if (_types[type] != undefined) {
      _types[type].forEach(function(kw) {
        if (content.indexOf(kw)>=0) {
          inpType.val(type);
          return;
        }
      });
    }
  }
}

function tick() {
  var now = new Date();
  var str = sprintf('<span style="font-size:36px;">%04d</span>&middot;%02d&middot;%02d ' +
    '<span style="font-size:36px;">%02d</span>:%02d:%02d',
    now.getFullYear(), now.getMonth()+1, now.getDate(), now.getHours(), now.getMinutes(),
    now.getSeconds());
  $('#divNow').html(str);
}

$(function(){
  $("#inpDate").datepicker({
    showButtonPanel: true
  });
  $("#inpDate").datepicker('option', {dateFormat: 'yy.mm.dd'});

  initTypeBox();

  $("#inpContent").keyup(onContentChange);

  setInterval(tick, 1000);
  tick();
});
