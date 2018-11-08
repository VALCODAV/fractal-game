var variables = {
	ctx: null,
	figure: null,
	figurePoints: [],
	dots: [],
	center: null,
	distance: null,
	animation: false
	// tops: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i']
}

var init = function () {
	let canvas = document.getElementById("canvas")
	if (canvas.getContext) {
		let ctx = canvas.getContext("2d")
		variables.ctx = ctx
	}

	variables.figure = $('#figure').val()
	variables.distance = $('#distance').val()

	$('#figure').on('change', function(e) {
		variables.figure = $('#figure').val()
		variables.figurePoints = []
		variables.dots = []
		$('#counter').text(variables.dots.length)
		clear()
		drawing()
	})

	$('#distance').on('change', function () {
		variables.distance = $('#distance').val()
		variables.figurePoints = []
		variables.dots = []
		$('#counter').text(variables.dots.length)
		clear()
		drawing()
	})

	$('#next').on('click', function () {
		iteration()
	})

	$('#start_iterations').on('click', function () {
		if ($('#animation').is(':checked')) {
			animationIteration()
		} else {
			noAnimationIteration()
		}
	})

	$('#stop_iterations').on('click', function () {
		variables.animation = false;
		$('#start_iterations').show()
		$('#stop_iterations').hide()
	})

	$('#clear').on('click', function () {
		variables.dots = []
		$('#counter').text(variables.dots.length)
		clear()
		drawing()
	})
}

var animationIteration = function () {
	let iterations = parseInt($('#iterations').val())
	if (!iterations) {
		alert('Укажите колличество итераций')
		return;
	}

	variables.animation = true
	$('#start_iterations').hide()
	$('#stop_iterations').show()

	let counter = iterations
	let start = function () {
		setTimeout(() => {
			iteration()
			--counter
			$('#counter').text(variables.dots.length)
			if (counter && variables.animation) {
				start()
			} else {
				variables.animation = false;
				$('#start_iterations').show()
				$('#stop_iterations').hide()
			}
		}, 3)
	}

	start()
}

var noAnimationIteration = function () {
	let iterations = parseInt($('#iterations').val())
	if (!iterations) {
		alert('Укажите колличество итераций')
	}

	for (let i = 0; i < iterations; i++) {
		let corner = getCorner()
		let dot = getNextDot(corner)
		variables.dots.push(dot)
	}

	$('#counter').text(variables.dots.length)

	clear()
	drawing()
}

var calculateFigure = function () {
	let ctx = variables.ctx
	let figure = variables.figure
	let center = {
		x: $('#canvas').width() / 2,
		y: $('#canvas').height() / 2
	}

	let radius = center.y - 20
	let offset = figure % 2 ? 0 : Math.PI / figure
	for (let i = 0; i < figure; i++) {
		let round = (360 / figure * i) + 180
		let rad = round * Math.PI / 180
		let sin = Math.sin(rad + offset)
		let cos = Math.cos(rad + offset)

		let x = center.x + radius * sin
	 	let y = center.y + radius * cos
		variables.figurePoints.push([x, y])
	}
}

var drawFigure = function () {
	let ctx = variables.ctx
	if (!variables.figurePoints.length) {
		calculateFigure()
	}

	ctx.beginPath()
	ctx.arc($('#canvas').width() / 2, $('#canvas').height() / 2, $('#canvas').height() / 2 - 20, 0, 2 * Math.PI, true)
	ctx.stroke()

	let points = variables.figurePoints;
	for (let i = 0; i < points.length; i++) {
	 	ctx.beginPath()
		ctx.arc(points[i][0], points[i][1], 4, 0, 2 * Math.PI, true)
		ctx.fillStyle = 'red'
		ctx.fill()
 	}
}

var getNextDot = function(corner) {
	if (!variables.dots.length) {
		return randomFirstDot()
	}

	let previus = variables.dots[variables.dots.length - 1]
	let vertex = variables.figurePoints[corner - 1]

	let x = previus[0] + (-(previus[0] - vertex[0]) * variables.distance)
	let y = previus[1] + (-(previus[1] - vertex[1]) * variables.distance)

	return [
		Math.floor(x),
		Math.floor(y)
	]
}

var drawFractal = function () {
	let dots = variables.dots
	for (let i = 0; i < dots.length; i++) {
		drawPixel(dots[i])
	}
}

var drawPixel = function (dot) {
	let ctx = variables.ctx
    ctx.beginPath()
	ctx.arc(dot[0], dot[1], 1, 0, 2 * Math.PI, true)
	ctx.fillStyle = 'green'
	ctx.fill()
}

var randomFirstDot = function () {
	let x = Math.floor(Math.random() * $('#canvas').width()) + 1
	let y = Math.floor(Math.random() * $('#canvas').height()) + 1

	return [x, y]
}

var getCorner = function() {
	var corner = Math.floor(Math.random() * variables.figure) + 1
	return corner
}

var clear = function () {
	variables.ctx.clearRect(0, 0, $('#canvas').width(), $('#canvas').height())
}

var drawing = function () {
	drawFractal()
	drawFigure()
}

var iteration = function () {
	let corner = getCorner()
	let dot = getNextDot(corner)
	variables.dots.push(dot)
	clear()
	drawing()
}

$('document').ready(() => {
	init()
	drawing()
});
