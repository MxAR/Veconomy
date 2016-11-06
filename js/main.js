// 2016 HPI Code Night || Veconomy Main JS

function cutHex(h) {
  	return (h.charAt(0) == "#") ? h.substring(1, 7) : h
}

function hexToRgb(h) {
	var r = parseInt((cutHex(h)).substring(0, 2), 16);
	var g = parseInt((cutHex(h)).substring(2, 4), 16);
	var b = parseInt((cutHex(h)).substring(4, 6), 16);
	return [r,g,b];
}

function rgbToHsv (r,g,b) {
	var computedH = 0;
	var computedS = 0;
	var computedV = 0;

	//remove spaces from input RGB values, convert to int
	var r = parseInt( (''+r).replace(/\s/g,''),10 ); 
	var g = parseInt( (''+g).replace(/\s/g,''),10 ); 
	var b = parseInt( (''+b).replace(/\s/g,''),10 ); 

	if ( r==null || g==null || b==null ||
		isNaN(r) || isNaN(g)|| isNaN(b) ) {
		console.log ('Please enter numeric RGB values!');
		return;
	}
 	if (r<0 || g<0 || b<0 || r>255 || g>255 || b>255) {
		console.log ('RGB values must be in the range 0 to 255.');
    	return;
	}
	r=r/255; g=g/255; b=b/255;
	var minRGB = Math.min(r,Math.min(g,b));
	var maxRGB = Math.max(r,Math.max(g,b));

 	// Black-gray-white
 	if (minRGB==maxRGB) {
  		computedV = minRGB;
  		return [0,0,computedV];
	}

	// Colors other than black-gray-white:
	var d = (r==minRGB) ? g-b : ((b==minRGB) ? r-g : b-r);
	var h = (r==minRGB) ? 3 : ((b==minRGB) ? 1 : 5);
	computedH = 60*(h - d/(maxRGB - minRGB));
	computedS = (maxRGB - minRGB)/maxRGB;
	computedV = maxRGB;
	return [computedH,computedS,computedV];
}

function lum(hex, lum) {

	// validate hex string
	hex = String(hex).replace(/[^0-9a-f]/gi, '');
	if (hex.length < 6) {
		hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
	}
	lum = lum || 0;

	// convert to decimal and change luminosity
	var newHex = "#", c, i;
	for (i = 0; i < 3; i++) {
		c = parseInt(hex.substr(i * 2, 2), 16);
		c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
		newHex += ("00" + c).substr(c.length);
	}

	return newHex;
}

function hsvCut (hsv) {
	hsv = hsv * 100;
	hsv = Math.round(hsv);
	return hsv + '%';
}

var colorOne = '#FFFFFF';
var colorTwo = '#000000';

function hexSearch() {
	var hex = $('#hexSearch').val().replace(/\#/g, '');
	if (hex.length == 0 || hex.length == 3 || hex.length == 6) {

		var re = /[0-9A-Fa-f]{6}/g;
		var re2 = /[0-9A-Fa-f]{3}/g;

		if(re.test(hex) || re2.test(hex) || hex.length == 0) {
		    $(".notification").css('display', 'none');
			if(hex.length == 3) {
				hex = hex.split('');
				hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
			}
		} else {
		    $('#notificationText').html('The thing you typed into the input is not a hex code, please check and write a valid hex code. Note: You dont have to write a hex to get results.');
			$(".notification").css('display', 'block');
			return;
		}
	} else {
		$('#notificationText').html('The thing you typed into the input is not a hex code, please check and write a valid hex code. Note: You dont have to write a hex to get results.');
		$(".notification").css('display', 'block');
		return;
	}

	// var color0 = '#7822c8';
	// var color1 = '#fafffd';

	// colorOne = color0;
	// colorTwo = color1;

	// // Color For Loop
	// for (var i = 0; i < 2; i++) {
	// 	// Background & Text Color Changes
	// 	var color = i == 0 ? color0 : color1;
	// 	$('#color' + i + '10').css('background-color', color);
	// 	$('.textColor' + i + '10').css('color', color);
	// 	// HEX Output
	// 	$('#hex' + i).html(color);
	// 	// RGB Output
	// 	var rgb = hexToRgb(color);
	// 	$('#rgb' + i).html('rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
	// 	// HSV Output
	// 	var hsv = rgbToHsv(rgb[0],rgb[1],rgb[2]);
	// 	$('#hsv' + i).html('hsv(' + Math.round(hsv[0]) + ', ' + hsvCut(hsv[1]) + ', ' + hsvCut(hsv[2]) + ')');
		
	// 	// Tone For Loop
	// 	for (var j = 0; j < 21; j++) {
	// 		var shade = (lum(color, ((j * -0.1) + 1))).toUpperCase();
	// 		if (j !== 10) {
	// 			$('.color' + i + j).css('background-color', shade);
	// 			$('#textColor' + i + j).html(shade);
	// 		}
	// 	}
	// }

	$.ajax({
		type: "GET",
		url: "http://localhost:5000/api/color",
		data: {IC: hex},
		success: function(response){

			var color0 = '#' + response[0].toUpperCase();
			var color1 = '#' + response[1].toUpperCase();

			colorOne = color0;
			colorTwo = color1;

			// Color For Loop
			for (var i = 0; i < 2; i++) {
				// Background & Text Color Changes
				var color = i == 0 ? color0 : color1;
				$('#color' + i + '10').css('background-color', color);
				$('.textColor' + i + '10').css('color', color);
				// HEX Output
				$('#hex' + i).html(color);
				// RGB Output
				var rgb = hexToRgb(color);
				$('#rgb' + i).html('rgb(' + rgb[0] + ', ' + rgb[1] + ', ' + rgb[2] + ')');
				// HSV Output
				var hsv = rgbToHsv(rgb[0],rgb[1],rgb[2]);
				$('#hsv' + i).html('hsv(' + Math.round(hsv[0]) + ', ' + hsvCut(hsv[1]) + ', ' + hsvCut(hsv[2]) + ')');
				
				// Tone For Loop
				for (var j = 0; j < 21; j++) {
					var shade = (lum(color, ((j * -0.1) + 1))).toUpperCase();
					if (j !== 10) {
						$('.color' + i + j).css('background-color', shade);
						$('#textColor' + i + j).html(shade);
					}
				}
			}

		},
		dataType: 'json'
	});

}

function search (colorCode) {
	var color = colorCode.split('');
	var i = color[0] == '0' ? colorOne : colorTwo;
	var j = color.length > 2 ? color[1] + color[2] : color[1];
	var shade = (lum(i, ((j * -0.1) + 1))).toUpperCase();
	$('#hexSearch').val(shade);
	hexSearch();
}

hexSearch();


