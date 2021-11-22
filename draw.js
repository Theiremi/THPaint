function clean_functions()
{
	$('#paint_zone').off('mousedown.tool');
	$('#paint_zone').off('mouseup.tool');
	$('#paint_zone').off('mousemove.tool');
	$('#settings > *').css('display', 'none');
}

function select()
{
	clean_functions();
	$('#set_fill_color').css('display', 'flex');
	$('#set_line_color').css('display', 'flex');
	$('#set_text_color').css('display', 'flex');
}

function line()
{
	clean_functions();
	let x1 = 0;
	let y1 = 0;

	$('#set_line_color').css('display', 'flex');
	$('#set_line_thickness').css('display', 'flex');
	$('#paint_zone').on('mousedown.tool', function(event){
		if(event.button != 0) return;
		x1 = souris(event, 'x');
		y1 = souris(event, 'y');

		$('#paint_zone').append('<line id="temp_render_line" />');
		$('#temp_render_line').attr('x1', x1);
		$('#temp_render_line').attr('y1', y1);
		$('#temp_render_line').attr('stroke', selected_line_color());
		$('#temp_render_line').attr('stroke-width', selected_thickness());
		$('#temp_render_line').attr('stroke-linecap', selected_line_style());
		$('#paint_zone').on('mousemove.tool', function(event){
			$('#temp_render_line').attr('x2', souris(event, 'x'));
			$('#temp_render_line').attr('y2', souris(event, 'y'));
			document.getElementById('paint_zone').innerHTML += "";
		});
	});
	$('#paint_zone').on('mouseup.tool', function(event)
	{
		$('#paint_zone').off('mousemove.tool');
		save_history();
		file.parts.push({
			"type": "line",
			"x1": x1,
			"y1": y1,
			"x2": souris(event, 'x'),
			"y2": souris(event, 'y'),
			"color": selected_line_color(),
			"thickness": selected_thickness(),
			"style": selected_line_style()
		});
		render_file();
	});
}

function curve()
{
	clean_functions();
	$('#set_line_color').css('display', 'flex');
	$('#set_line_thickness').css('display', 'flex');
	$('#paint_zone').on('mousedown.tool', function(event){
		if(event.button != 0) return;
		let x = [];
		let y = [];
		x[0] = souris(event, 'x');
		y[0] = souris(event, 'y');

		$('#paint_zone').append('<polyline id="temp_render_curve" />');
		$('#temp_render_curve').attr('stroke', selected_line_color());
		$('#temp_render_curve').attr('stroke-width', selected_thickness());
		$('#temp_render_curve').attr('stroke-linecap', "round");
		$('#temp_render_curve').attr('stroke-linejoin', 'round');
		$('#temp_render_curve').attr('fill', 'none');
		$('#paint_zone').on('mousemove.tool', function(event){
			x.push(souris(event, 'x'));
			y.push(souris(event, 'y'));
			let d = '';
			for(let i in x)
			{
				d += ' ' + x[i] + ',' + y[i];
			}
			$('#temp_render_curve').attr('points', d);
			document.getElementById('paint_zone').innerHTML += "";
		});
		$('#paint_zone').on('mouseup.tool', function(event)
		{
			$('#paint_zone').off('mousemove.tool');
			$('#paint_zone').off('mouseup.tool');
			save_history();
			file.parts.push({
				"type": "curve",
				"x": x,
				"y": y,
				"color": selected_line_color(),
				"thickness": selected_thickness(),
				"style": 'round'
			});
			render_file();
		});
	});
	
}

function rect()
{
	clean_functions();
	let x = 0;
	let y = 0;
	
	$('#set_line_color').css('display', 'flex');
	$('#set_fill_color').css('display', 'flex');
	$('#set_fill_type').css('display', 'flex');
	$('#set_corner_radius').css('display', 'flex');
	$('#set_line_thickness').css('display', 'flex');
	$('#paint_zone').on('mousedown.tool', function(event){
		if(event.button != 0) return;
		x = souris(event, 'x');
		y = souris(event, 'y');

		$('#paint_zone').append('<rect id="temp_render_rect" />');
		$('#temp_render_rect').attr('x', x);
		$('#temp_render_rect').attr('y', y);

		if(selected_fill_type() == 'full')
		{
			$('#temp_render_rect').attr('fill', selected_fill_color());
			$('#temp_render_rect').attr('stroke', selected_line_color());
			$('#temp_render_rect').attr('stroke-width', selected_thickness());
		}
		else if(selected_fill_type() == 'border')
		{
			$('#temp_render_rect').attr('fill', 'none');
			$('#temp_render_rect').attr('stroke', selected_line_color());
			$('#temp_render_rect').attr('stroke-width', selected_thickness());
		}
		else if(selected_fill_type() == 'filled')
		{
			$('#temp_render_rect').attr('fill', selected_fill_color());
		}

		$('#temp_render_rect').attr('rx', selected_corner_radius());
		$('#paint_zone').on('mousemove.tool', function(event){
			if(souris(event, 'x') - x >= 0)
			{
				$('#temp_render_rect').attr('x', x);
				$('#temp_render_rect').attr('width', souris(event, 'x') - x);
			}
			else
			{
				$('#temp_render_rect').attr('x', souris(event, 'x'));
				$('#temp_render_rect').attr('width', x - souris(event, 'x'));
			}

			if(souris(event, 'y') - y >= 0)
			{
				$('#temp_render_rect').attr('y', y);
				$('#temp_render_rect').attr('height', souris(event, 'y') - y);
			}
			else
			{
				$('#temp_render_rect').attr('y', souris(event, 'y'));
				$('#temp_render_rect').attr('height', y - souris(event, 'y'));
			}

			
			document.getElementById('paint_zone').innerHTML += "";
		});
	});
	$('#paint_zone').on('mouseup.tool', function(event)
	{
		$('#paint_zone').off('mousemove.tool');
		save_history();

		let x1, x2, y1, y2 = 0;
		if(souris(event, 'x') - x >= 0)
		{
			x1 = x
			x2 = souris(event, 'x') - x;
		}
		else
		{
			x1 = souris(event, 'x');
			x2 = x - souris(event, 'x');
		}

		if(souris(event, 'y') - y >= 0)
		{
			y1 = y;
			y2 = souris(event, 'y') - y;
		}
		else
		{
			y1 = souris(event, 'y');
			y2 = y - souris(event, 'y');
		}
		file.parts.push({
			"type": "rect",
			"x": x1,
			"y": y1,
			"width": x2,
			"height": y2,
			"rx": selected_corner_radius(),
			"line_color": selected_line_color(),
			"fill_color": selected_fill_color(),
			"thickness": selected_thickness(),
			"fill_type": selected_fill_type()
		});
		render_file();
	});
}



function souris(event, axis)
{
	let pos = 0;
	switch(axis)
	{
		case 'x':
			pos = event.clientX - $('#paint_zone').offset().left;
			return pos * file.width / $('#paint_zone').innerWidth();
			break;

		case 'y':
			pos = event.clientY - $('#paint_zone').offset().top + window.scrollY;
			return pos * file.height / $('#paint_zone').innerHeight();
			break;
	}


}

function selected_line_color()
{
	return $('input[name="line_color"]').val();
}

function selected_fill_color()
{
	return $('input[name="fill_color"]').val();
}

function selected_text_color()
{
	return $('input[name="text_color"]').val();
}

function selected_thickness()
{
	return $('input[name="thickness"]').val();
}

function selected_line_style()
{
	return $('select[name="line_style"]').val();
}

function selected_corner_radius()
{
	return $('input[name="corner_radius"]').val();
}

function selected_fill_type()
{
	return $('input[name="fill_type"]:checked').val();
}

function render_file()
{
	document.getElementById('paint_zone').innerHTML = "";
	$('#paint_zone').attr('viewBox', '0 0 ' + file.width + ' ' + file.height);
	for(entry of file.parts)
	{
		//console.log(entry.type);
		switch(entry.type)
		{
			case "line":
				$('#paint_zone').append('<line x1="' + entry.x1 +
					'" y1="' + entry.y1 +
					'" x2="' + entry.x2 +
					'" y2="' + entry.y2 +
					'" stroke="' + entry.color +
					'" stroke-width="' + entry.thickness +
					'" stroke-linecap="' + entry.style + '" />');
				break;

			case "curve":
				let d = '';
				for(let i in entry.x)
				{
					d += ' ' + entry.x[i] + ',' + entry.y[i];
				}
				$('#paint_zone').append('<polyline points="' + d +
					'" stroke="' + entry.color +
					'" stroke-width="' + entry.thickness +
					'" stroke-linecap="' + entry.style + '" fill="none" stroke-linejoin="round" />')
				break;

			case "rect":
				let style = '';
				if(entry.fill_type == 'full')
				{
					style += ' fill="' + entry.fill_color + '"';
					style += ' stroke="' + entry.line_color + '"';
					style += ' stroke-width="' + entry.thickness + '"';
				}
				else if(entry.fill_type == 'border')
				{
					style += ' fill="none"';
					style += ' stroke="' + entry.line_color + '"';
					style += ' stroke-width="' + entry.thickness + '"';
				}
				else if(entry.fill_type == 'filled')
				{
					style += ' fill="' + entry.fill_color + '"';
				}

				$('#paint_zone').append('<rect x="' + entry.x +
					'" y="' + entry.y +
					'" width="' + entry.width +
					'" height="' + entry.height +
					'" rx="' + entry.rx + 
					'"' + style + ' />');
				break;
		}
	}
	document.getElementById('paint_zone').innerHTML += "";

	$('#size_data').html(JSON.stringify(file).length + 'O');
}