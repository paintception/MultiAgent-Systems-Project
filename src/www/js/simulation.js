Simulation = function(settings) {
	/* INITIALIZATION */

	this.settings = settings;
	this.isPaused_ = true;
	this.renderTimeoutId = null;

	console.log('simulation: creating grid');
	this.grid = new Grid(this);

	var self = this;


	/* PUBLIC METHODS */

	this.setPaused = function(setPaused) {
		var prevPaused = this.isPaused_;
		if (!setPaused && this.isPaused_) {
			console.log("simulation: unpausing");
			this.isPaused_ = false;

			var self = this;
			var cb = function() {
				renderStep();
				if (!self.isPaused)
					console.log("setting timeout for " + self.settings.fps);
					self.renderTimeoutId = setTimeout(cb, 1000 / self.settings.fps);
			};
			cb();
		} else if (setPaused && !this.isPaused_) {
			console.log("simulation: pausing");
			this.isPaused_ = true;
			clearTimeout(this.renderTimeoutId);
		}
	};

	this.isPaused = function() {
		return this.isPaused_;
	};

	this.singleStep = function() {
		console.log("simulation: single step");
		this.setPaused(true);
		renderStep();
	}

	this.getSettings = function() {
		return this.settings;
	};


	/* PRIVATE METHODS */

	var renderStep = function() {
		// console.log("grid: updating...");
		// renderStart = new Date().getTime();

		var stepStart = new Date().getTime();
		$.getJSON('http://localhost:8001/sim/step', function (data) {
			var stepTime = new Date().getTime() - stepStart;
			$('#sim-info').html("<b>Sim calc time</b>: " + stepTime + " msec");

			$('#time-info').html("<b>Simulation time</b>: " + data.day + ":" + data.step + " (timestamp: " + data.ts + ")");
		});

		updateParamsAndGrid(self.grid);

		// renderTime = new Date().getTime() - renderStart;
		// console.log("grid: update took " + renderTime + "msec"); //TODO: fix this timer by wrapping it up inside inner callback
	};

	var updateParamsAndGrid = function(grid) {
		$.getJSON('http://localhost:8001/sim/parameters', function (data) {
			grid.setParameters(data);
			repr = "<table>" + Object.keys(data).map(function(x){
				return "<tr><td>" + x + ":</td><td>" + data[x] + "</td></tr>";
			}).join('') + "</table>";
			$('#param-info').html("<b>Simulation parameters</b>: " + repr);

			$.getJSON('http://localhost:8001/sim/grid', function (data) {
				grid.setGridData(data.width, data.height, data.grid);

				duration = timeIt(function() {
					grid.draw(settings.maxCellSize);
				}, "grid.draw");

				$('#render-info').html("<b>Grid render time</b>: " + duration + " msec");
			});
		}).error(function(err) {
			console.log("getJSON error, server down? -- ", err); //TODO: use this for a connectivity indicator?
		});
	};

	updateParamsAndGrid(this.grid);
};