
var privateMappings = {};

function removeSlice(id) {
	if (confirm("Sure to delete?")) {
		$.getJSON("remove", {id:id}, function(data) {
			location.reload();
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

function isPrivateMode() {
	return (localStorage.getItem('privateMode') || 'false') == 'true';
}

function togglePrivateMode() {
	var privateMode = !isPrivateMode();
	localStorage.setItem('privateMode', privateMode);
	updatePrivateModeView();
}

function encryptSlices() {
	$('.slice_content').each(function() {
		var id = $(this).attr('sliceId');
		var content = $(this).text();
		if (!privateMappings[id]) {
			privateMappings[id] = content;
		}
		$(this).text(simpleEncrypt(content));
	});
}

function decryptSlices() {
	$('.slice_content').each(function() {
		var id = $(this).attr('sliceId');
		$(this).text(privateMappings[id]);
	});
}

function onKeyPress(e) {
	var tag = e.target.tagName.toLowerCase();
	var key = e.which;
	if ( tag != 'input' && tag != 'textarea') {
		if (key === 81 || key === 113) { // Q or q
			togglePrivateMode();
		}
	}
}

function updatePrivateModeView() {
	if (isPrivateMode()) {
		encryptSlices();
		$('#btPrivateToggle').addClass('fa-eye-slash');
		$('#btPrivateToggle').removeClass('fa-eye');
	} else {
		decryptSlices();
		$('#btPrivateToggle').addClass('fa-eye');
		$('#btPrivateToggle').removeClass('fa-eye-slash');
	}
}

function onSliceEnter() {
	if (isPrivateMode()) {
	}
}

function onSliceOut() {
	if (isPrivateMode()) {
	}
}

$(function(){
	initDatePicker();

	setInterval(tick, 1000);
	tick();

	$('#btPrivateToggle').click(togglePrivateMode);
	$('.slice_content').mouseenter(onSliceEnter).mouseleave(onSliceOut);
	updatePrivateModeView();
	$('.slice_items').removeClass('hidden');
	$(document).keypress(onKeyPress);
});
