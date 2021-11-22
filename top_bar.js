$(function(){
	//-----AFFICHAGE DU MENU-----//
	$('#top_bar > div:first-child > p').click(function(){
		show_menu(this);

		$('#top_bar > div:first-child > p').mouseenter(function(){
			show_menu(this);
		})
	});

	$('body').click(function(){
		if(!$('#top_bar > div:first-child > p:hover').length)
		{
			$('.deroulant').css('display', 'none');
			$('#top_bar > div:first-child > p').css('border-bottom', '');
			$('#top_bar > div:first-child > p').css('margin-bottom', '');
			$('#top_bar > div:first-child > p').off('mouseenter');
		}
	});

	//-----GESTION DES RACCOURCIS CLAVIER---//
	let keys = {};
	$(window).on("keyup keydown", function(event){
		event.type === 'keydown' ? keys[event.which] = true : delete keys[event.which];

		if(keys[17] && keys[90] && Object.keys(keys).length === 2)//Annuler
		{
			undo();
		}
		if(keys[17] && keys[16] && keys[90] && Object.keys(keys).length === 3)//Refaire
		{
			redo();
		}
	});
});

function show_menu(btn)
{
	$('.deroulant').css('display', 'none');
	$('#top_bar > div:first-child > p').css('border-bottom', '');
	$('#top_bar > div:first-child > p').css('margin-bottom', '');
	$(btn).css('border-bottom', '2px solid rgb(255, 100, 100)');
	$(btn).css('margin-bottom', '0');
	$(btn).next('.deroulant').css('display', 'flex');
	$(btn).next('.deroulant').css('top', $(btn).offset().top + $(btn).outerHeight());
	$(btn).next('.deroulant').css('left', $(btn).offset().left);
}

$('#btn_undo').click(function(){ undo() });
$('#btn_redo').click(function(){ redo() });