function Phone(canvas, phone, options) {
	// Default options
	this.defaults = {
		height : 492,
		width : 275,
		dialable : false,
		phones : {
			iphone : {
				height : 492,
				width : 275,
				bgimg : '../images/iphone.png',
				bgheight : 302,
				bgwidth : 221,
				bgxoff : 27,
				bgyoff : 84,
				header : {
					height : 20,
					width : 222,
					bgcolor : "#000",
					xoffset : 22,
					yoffset : 84
				},
				keys : {
					width : 74,
					height : 52,
					strokewidth : .4,
					xoffset : 26,
					yoffset : 140,
					bgcolor : '#404040',
					fcolor : '#FFF'
				},
				keydown : {
					width : 76,
					height : 52,
					downtime : 400,
					bgcolor : '#404040',
					fcolor : '#FFF'
				}
			},
			android : {
				height : 492,
				width : 275,
				bgimg : '../images/android.png',
				bgheight : 300,
				bgwidth : 210,
				bgxoff : 32,
				bgyoff : 61,
				header : {
					height : 20,
					width : 212,
					bgcolor : "#000",
					xoffset : 30,
					yoffset : 94
				},
				keys : {
					width : 70,
					height : 50,
					strokewidth : .4,
					xoffset : 32,
					yoffset : 140,
					bgcolor : '#404040',
					fcolor : '#FFF'
				},
				keydown : {
					width : 76,
					height : 52,
					downtime : 400,
					bgcolor : '#404040',
					fcolor : '#FFF'
				}
			}
		},
		demos : {
			android_dtv : {
				phonetype : 'android',
				digits : '5555555555',
				textmsg : {
					width : 187,
					height : 131,
					xoffset : 45,
					yoffset : 135,
					imguri : '/images/demos/dtv_message_android.png'
				},
				webimg : {
					width : 210,
					height : 300,
					xoffset : 32,
					yoffset : 61,
					imguri : '/images/demos/dtv_web_android.png'
				}
			},
			iphone_dtv : {
				phonetype : 'iphone',
				digits : '5555555555',
				textmsg : {
					width : 176,
					height : 184,
					xoffset : 48,
					yoffset : 135,
					imguri : '/images/demos/dtv_message_iphone.png'
				},
				webimg : {
					width : 221,
					height : 302,
					xoffset : 27,
					yoffset : 84,
					imguri : '/images/demos/dtv_web_iphone.png'
				}
			}
		}
	};

	// Private variable
	var keyValues = new Array(new Array(['1', '', '']), new Array(['2', 'ABC', '']), new Array(['3', 'DEF', '']), new Array(['4', 'GHI', '']), new Array(['5', 'JKL', '']), new Array(['6', 'MNO', '']), new Array(['7', 'PQRS', '']), new Array(['8', 'TUV', '']), new Array(['9', 'WXYZ', '']), new Array(['*', '', '']), new Array(['0', '', '']), new Array(['#', '', '']));
	var phoneKeys = [];
	var dialedDigits = "";
	var timers = [];
	var v_isRunning = false;
	var m_demo = null;

	// Check if canvas isn't supported, --abort
	if(!( ctx = canvas.getContext('2d')))
		return;

	// Get options
	options = jQuery.extend(true, {}, this.defaults, options);

	// Draw Phone
	function drawPhone(sphone) {
		ctx.clearRect(0, 0, sphone.height, sphone.width);
		var img = new Image();
		img.src = phone.bgimg;
		img.onload = function() {
			ctx.drawImage(img, 0, 0, sphone.width, sphone.height);
			ctx.fillStyle = '#000';
			ctx.fillRect(sphone.bgxoff, sphone.bgyoff, sphone.bgwidth, sphone.bgheight);
			drawKeyPad(sphone.keys);
		}
	}

	function drawKeyPad(opts) {
		var x_off = opts.xoffset;
		var y_off = opts.yoffset;
		var key_count = 0;

		for(var r = 0; r < keyValues.length; r++) {
			var aElem = {
				v : keyValues[r][0][0],
				a : keyValues[r][0][1],
				x : x_off,
				y : y_off,
				w : opts.width,
				h : opts.height
			};
			phoneKeys.push(aElem);

			// Draw Key
			drawKey(aElem);

			// Set new key offset
			x_off = x_off + opts.width;

			// Increment key count
			key_count = key_count + 1;

			// Check if we should be at next row
			if(key_count == 3) {
				y_off = y_off + opts.height;
				x_off = opts.xoffset;
				key_count = 0;
			}
		}
		ctx.save();
	}

	// Draw Key
	function drawKey(key) {
		ctx.lineWidth = .2;
		var gradient = ctx.createLinearGradient(key.x, key.y, key.x, key.y + key.h);
		gradient.addColorStop(0, phone.keys.bgcolor);
		gradient.addColorStop(.5, phone.keys.bgcolor);
		ctx.fillStyle = phone.keys.bgcolor;
		ctx.fillRect(key.x, key.y, key.w, key.h);

		// Write Number Text
		if(key.v == '*') {
			ctx.font = "bold 32pt Arial";
		} else {
			ctx.font = "bold 16pt Arial";
		}
		ctx.strokeStyle = "#000";
		ctx.strokeRect(key.x, key.y, key.w, key.h);
		ctx.fillStyle = phone.keys.fcolor;
		ctx.textAlign = "center";
		if(key.v == '*') {
			ctx.fillText(key.v, key.x + 35, key.h + key.y - 4);
		} else {
			ctx.fillText(key.v, key.x + 35, key.h + key.y - 20);
		}

		// Write ALPHA Text
		ctx.font = "8pt Calibri";
		ctx.strokeRect(key.x, key.y, key.w, key.h);
		ctx.fillStyle = phone.keys.fcolor;
		ctx.textAlign = "center";
		ctx.fillText(key.a, key.x + 35, key.h + key.y - 6);
		timers.pop();
	}

	function drawKeyDown(key, letter) {
		ctx.clearRect(key.x, key.y, key.w, key.h);
		ctx.lineWidth = .2;
		ctx.fillStyle = phone.keydown.bgcolor;
		ctx.fillRect(key.x, key.y, key.w, key.h);

		// Write Number Text
		if(key.v == '*') {
			ctx.font = "bold 32pt Arial";
		} else {
			ctx.font = "bold 20pt Arial";
		}
		ctx.strokeRect(key.x, key.y, key.w, key.h);
		ctx.fillStyle = phone.keydown.fcolor;
		ctx.textAlign = "center";
		if(key.v == '*') {
			ctx.fillText(key.v, key.x + 35, key.h + key.y - 4);
		} else {
			ctx.fillText(letter, key.x + 35, key.h + key.y - 16);
		}

		// Write Value to header
		ctx.clearRect(phone.header.xoffset, phone.header.yoffset, phone.header.width, key.h);
		ctx.lineWidth = .0;
		ctx.fillStyle = '#000';
		ctx.fillRect(phone.header.xoffset, phone.header.yoffset, phone.header.width, key.h);
		dialedDigits = dialedDigits + key.v;
		var fontsize = 20;
		var fontoffset = 90;
		if(dialedDigits.length < 10) {
			ctx.font = "bold 20pt Arial";
		} else {
			ctx.font = "bold 17pt Arial";
			fontsize = 17;
			fontoffset = 85;
		}
		ctx.fillStyle = "#FFF";
		ctx.textAlign = "center";
		ctx.fillText(dialedDigits, 118 + Math.floor((dialedDigits.length) * 2), key.h + fontoffset - fontsize);
		timers.pop();
	}

	function showMessage(imgpath, xoff, yoff, w, h) {

		ctx.clearRect(phone.bgxoff, phone.bgyoff, phone.bgwidth, phone.bgheight);
		ctx.fillStyle = '#000';
		ctx.fillRect(phone.bgxoff, phone.bgyoff, phone.bgwidth, phone.bgheight);

		var img = new Image();
		img.src = imgpath;
		img.onload = function() {
			ctx.drawImage(img, xoff, yoff, w, h);
		}
	}

	function clearMessage(imgpath, xoff, yoff, w, h) {
		var img = new Image();
		img.src = imgpath;
		img.onload = function() {
			ctx.drawImage(img, xoff, yoff, w, h);
		}
	}

	function showWeb(imgpath, xoff, yoff, w, h) {
		
		
		
		var img = new Image();
		img.src = imgpath;
		img.onload = function() {
			ctx.drawImage(img, xoff, yoff, w, h);
		}
	}

	function clearDemo(xoff, yoff, w, h) {
		ctx.clearRect(xoff, yoff, w, h);
		ctx.fillStyle = '#000';
		ctx.fillRect(xoff, yoff, w, h);
		reset();
		myZphone.stop();
		if(!jQuery.browser.msie) {
		jQuery('#' + canvas.id).click(function(e) {
			jQuery(this).css('cursor', 'pointer');
		});
		jQuery('#' + canvas.id).click(function(e) {
			myZphone.runDemos();
		});
		}
	}

	// Get Number from letter
	function getNumberFromLetter(letter) {
		if(letter.toUpperCase() == "A" || letter.toUpperCase() == "B" || letter.toUpperCase() == "C") {
			return 2;
		} else if(letter.toUpperCase() == "D" || letter.toUpperCase() == "E" || letter.toUpperCase() == "F") {
			return 3;
		} else if(letter.toUpperCase() == "G" || letter.toUpperCase() == "H" || letter.toUpperCase() == "I") {
			return 4;
		} else if(letter.toUpperCase() == "J" || letter.toUpperCase() == "K" || letter.toUpperCase() == "L") {
			return 5;
		} else if(letter.toUpperCase() == "M" || letter.toUpperCase() == "N" || letter.toUpperCase() == "O") {
			return 6;
		} else if(letter.toUpperCase() == "P" || letter.toUpperCase() == "Q" || letter.toUpperCase() == "R" || letter.toUpperCase() == "S") {
			return 7;
		} else if(letter.toUpperCase() == "T" || letter.toUpperCase() == "U" || letter.toUpperCase() == "V") {
			return 8;
		} else if(letter.toUpperCase() == "W" || letter.toUpperCase() == "X" || letter.toUpperCase() == "Y" || letter.toUpperCase() == "Z") {
			return 9;
		} else if(letter.toUpperCase() == "*") {
			return '*';
		} else if(letter.toUpperCase() == "#") {
			return '*';
		} else {
			return letter;
		}
	};

	// Sleep Function
	function sleep(ms) {
		var dt = new Date();
		dt.setTime(dt.getTime() + ms);
		while(new Date().getTime() < dt.getTime());
	}

	// Reset Digits
	function reset() {
		dialedDigits = "";
		drawKeyPad(phone.keys);
	}

	// Clear Digits
	function clear() {
		dialedDigits = "";
	}

	return {
		// Public methods
		dial : function(number,phonetype) {
			if (phonetype == null){
				var arr_demos = [];
				jQuery.each(options.demos, function(index, value) {
					arr_demos.push(value);
				});
				m_demo = arr_demos[Math.floor(Math.random() * arr_demos.length)];
				phonetype = m_demo.phonetype;
			}

			// Load Phone
			phone = options.phones[phonetype];
			// Draw Phone
			drawPhone(phone);
			reset();
			var numbers = number.split('');
			for(var num = 0, nlen = numbers.length; num < nlen; num++) {
				for(var i = 0, len = phoneKeys.length; i < len; i++) {
					var cnum = getNumberFromLetter(numbers[num]);
					if(phoneKeys[i].v == cnum) {
						timers.push(setTimeout(drawKeyDown, Math.floor(num * phone.keydown.downtime) + 1, phoneKeys[i], numbers[num]));
						timers.push(setTimeout(drawKey, Math.floor((num + 1) * phone.keydown.downtime) + 1, phoneKeys[i]));
						break;
					}
				}
			}
		},
		// Public methods
		stop : function() {
			for(var timer = 0, ntimer = timers.length; timer < ntimer; timer++) {
				clearTimeout(timers[timer]);
			}
			//reset();
		},
		runDemos : function() {
			if(m_demo == null) {

				var arr_demos = [];
				jQuery.each(options.demos, function(index, value) {
					arr_demos.push(value);
				});
				m_demo = arr_demos[Math.floor(Math.random() * arr_demos.length)];
				phone = options.phones[m_demo.phonetype];

				// Draw Phone
				drawPhone(options.phones[m_demo.phonetype]);
			}

			jQuery("#" + canvas.id).unbind();
			reset();

			if(!jQuery.browser.msie) {
				// Dial the digits
				var numbers = m_demo.digits.split('');
				for(var num = 0, nlen = numbers.length; num < nlen; num++) {
					for(var i = 0, len = phoneKeys.length; i < len; i++) {
						var cnum = getNumberFromLetter(numbers[num]);
						if(phoneKeys[i].v == cnum) {
							timers.push(setTimeout(drawKeyDown, Math.floor(num * phone.keydown.downtime) + 1, phoneKeys[i], numbers[num]));
							timers.push(setTimeout(drawKey, Math.floor((num + 1) * phone.keydown.downtime) + 1, phoneKeys[i]));
							break;
						}
					}
				}

				// Display Text
				timers.push(setTimeout(showMessage, Math.floor(numbers.length * phone.keydown.downtime) + 1500, m_demo.textmsg.imguri, m_demo.textmsg.xoffset, m_demo.textmsg.yoffset, m_demo.textmsg.width, m_demo.textmsg.height));

				// Display Web
				timers.push(setTimeout(showWeb, Math.floor(numbers.length * phone.keydown.downtime) + 4000, m_demo.webimg.imguri, m_demo.webimg.xoffset, m_demo.webimg.yoffset, m_demo.webimg.width, m_demo.webimg.height));

				// Display Web
				timers.push(setTimeout(clearDemo, Math.floor(numbers.length * phone.keydown.downtime) + 7000, m_demo.webimg.xoffset, m_demo.webimg.yoffset, m_demo.webimg.width, m_demo.webimg.height));
			} else {

				var numbers = m_demo.digits.split('');
				for(var num = 0, nlen = numbers.length; num < nlen; num++) {
					for(var i = 0, len = phoneKeys.length; i < len; i++) {
						var cnum = getNumberFromLetter(numbers[num]);
						if(phoneKeys[i].v == cnum) {

							setTimeout(
							// the double infamous closure pattern
							( function(obj, letter) {
								// the infamous closure
								return function() {
									drawKeyDown(obj, letter);
								};
							}(phoneKeys[i], numbers[num])), Math.floor(num * phone.keydown.downtime) + 1);

							setTimeout(
							// the double infamous closure pattern
							( function(obj) {
								// the infamous closure
								return function() {
									drawKey(obj);
								};
							}(phoneKeys[i])), Math.floor((num + 1) * phone.keydown.downtime) + 1);

						}
					}
				}

				setTimeout(
				// the double infamous closure pattern
				( function(img, xoff, yoff, msgw, msgh) {
					// the infamous closure
					return function() {
						showMessage(img, xoff, yoff, msgw, msgh);
					};
				}(m_demo.textmsg.imguri, m_demo.textmsg.xoffset, m_demo.textmsg.yoffset, m_demo.textmsg.width, m_demo.textmsg.height)), Math.floor(numbers.length * phone.keydown.downtime) + 1500);

				setTimeout(
				// the double infamous closure pattern
				( function(img, xoff, yoff, msgw, msgh) {
					// the infamous closure
					return function() {
						showWeb(img, xoff, yoff, msgw, msgh);
					};
				}(m_demo.webimg.imguri, m_demo.webimg.xoffset, m_demo.webimg.yoffset, m_demo.webimg.width, m_demo.webimg.height)), Math.floor(numbers.length * phone.keydown.downtime) + 4000);

				setTimeout(
				// The double infamous closure pattern
				( function(xoff, yoff, msgw, msgh) {
					// the infamous closure
					return function() {
						clearDemo(xoff, yoff, msgw, msgh);
					};
				}(m_demo.webimg.xoffset, m_demo.webimg.yoffset, m_demo.webimg.width, m_demo.webimg.height)), Math.floor(numbers.length * phone.keydown.downtime) + 7000);

			}

		}
	};
}
