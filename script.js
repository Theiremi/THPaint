$(resize_paint_box);
$(window).resize(resize_paint_box);
function resize_paint_box()
{
	$('#paint_box').css('height', $(window).outerHeight() - ($('#tools').outerHeight(true) + $('#settings').outerHeight(true) + $('#top_bar').outerHeight(true)));
}

let zoom = 1;
$('#paint_box').on('wheel', function(event){
	let sens_scroll = event.originalEvent.wheelDelta / 120;

	if(sens_scroll != -1)
	{
		if(zoom < 5) zoom += 0.2;
	}
	else
	{
		if(zoom > 0.2) zoom -= 0.2;
	}
	zoom = parseFloat(zoom.toFixed(1));
	console.log(zoom)

	calc_paint_zone();
});

$(calc_paint_zone);
$(window).resize(calc_paint_zone);
function calc_paint_zone()
{
	let parent_width = $('#paint_box').innerWidth() - 20;
	let parent_height = $('#paint_box').innerHeight() - 20;
	let ratioY = parent_height / file.height;
	let ratioX = parent_width / file.width;
	let file_width = file.width * ratioY;
	let file_height = file.height * ratioX;

	if(file_width <= parent_width)
	{
		$('#paint_zone').css('height', parent_height * zoom);
		$('#paint_zone').css('width', file_width * zoom);
	}
	else
	{
		$('#paint_zone').css('height', file_height * zoom);
		$('#paint_zone').css('width', parent_width * zoom);
	}
}

$('#paint_zone').on('mousedown.move_zone', function(event){
	if(event.button == 2)
	{
		$('#paint_zone').css('cursor', 'move');
		let offset_top = event.clientY - $('#paint_zone').offset().top;
		let offset_left = event.clientX - $('#paint_zone').offset().left;
		console.log(offset_top, offset_left)

		$('#paint_zone').on('mousemove.move_zone', function(event){

			let posX = event.clientX - offset_left;
			let posY = event.clientY - offset_top;
			console.log(posX, posY);

			$('#paint_zone').css('margin', '0');
			$('#paint_zone').css('margin-top', posY - ($('#tools').outerHeight(true) + $('#settings').outerHeight(true) + $('#top_bar').outerHeight(true)) - 10);
			$('#paint_zone').css('margin-left', posX - 10);
		});
	}
});
$('#paint_zone').on('mouseup.move_zone', function(event){
	if(event.button == 2)
	{
		$('#paint_zone').off('mousemove.move_zone');
		$('#paint_zone').css('cursor', '');
	}
});
$('#paint_zone').on('mouseleave.move_zone', function(){
	$('#paint_zone').off('mousemove.move_zone');
	$('#paint_zone').css('cursor', '');
});

$('#paint_zone').on('contextmenu', function(){
	return false;
})

window.onbeforeunload = function() {
    return "Are you sure you want to reload ? All unsaved changes will be lost";
}