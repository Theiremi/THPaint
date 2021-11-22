$(function(){
	$('#tools .tool').click(function(){
		$('#tools .tool').css('background-color', '');
		$(this).css('background-color', 'rgb(100, 100, 100)');
	});
});