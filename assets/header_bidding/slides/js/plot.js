// A random number generation lib
define('plot', ['d3', 'jstat', 'particle_filter'], function (d3, jstat, pf) {
  let colors = d3.schemeCategory10,
  blue =  d3.color(colors[0]),
  orange = d3.color(colors[1]),
  green = d3.color(colors[2]),
  red = d3.color(colors[3]),
  gray = d3.color(colors[7]);

  class Chart {
    constructor(div) {
      this.div = d3.select(div);
      // this.width = parseInt(window.getComputedStyle(this.div.node()).width, 10);
      // this.height = parseInt(window.getComputedStyle(this.div.node()).height, 10);
      this.width = 800;
      this.height = 600;
      this.margin = {'left':20, 'right':20, 'bottom':20, 'top':20};
      this.svg = this.div.append('svg').attr('width', this.width).attr('height', this.height);
    }
    setView(left, right, bottom, top) {
      this.view = {
        'left':left,
        'right':right,
        'bottom':bottom,
        'top':top,
        'width':right-left,
        'height':top-bottom,
        'g':this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`)
      };
    }
    setAxis(x=10, y=10) {
      let width = this.width-this.margin.left-this.margin.right,
      height = this.height-this.margin.bottom-this.margin.top,
      g = this.svg.append('g').attr('transform', `translate(${this.margin.left},${this.margin.top})`);
      this.scale = {
        'x':d3.scaleLinear().domain([this.view.left, this.view.right]).range([0, width]),
        'y':d3.scaleLinear().domain([this.view.bottom, this.view.top]).range([height, 0])
      };
      this.axis = {
        'width':width, 'height':height, 'g':g,
        'ticks':{'x':x, 'y':y},
        'x':g.append('g').attr('transform', `translate(0,${this.scale.y(0)})`).call(d3.axisBottom(this.scale.x).ticks(x)),
        'y':g.append('g').attr('transform', `translate(${this.scale.x(0)},0)`).call(d3.axisLeft(this.scale.y).ticks(y))
      };
    }
    plot() {
      this.setView(0, 1, 0, 1);
      this.setAxis();
      this.view.g.append('path')
      .style('stroke', 'orange').style('stroke-width', 3).style('fill', 'none')
      .datum(d3.zip(d3.range(0,1,1/1000), d3.range(0,1,1/1000).map(n => n*n)))
      .attr('d', d3.line().x(d => this.scale.x(d[0])).y(d => this.scale.y(d[1])));
    }
  }
  /*
   * Payoff chart
   */
  class Payoff extends Chart {
    constructor(div, value_control, floor_control, bid_control) {
      super(div);
      this.value_control = d3.select(value_control);
      this.floor_control = d3.select(floor_control);
      this.bid_control = d3.select(bid_control);
    }
    setControls() {
      this.value = parseFloat(this.value_control.select('input').property('value'));
      this.value_control.select('input').on('input', () => {
        this.value = parseFloat(this.value_control.select('input').property('value'));
        this.update();
      });
      this.floor = parseFloat(this.floor_control.select('input').property('value'));
      this.floor_control.select('input').on('input', () => {
        this.floor = parseFloat(this.floor_control.select('input').property('value'));
        this.update();
      });
      this.bid = parseFloat(this.bid_control.select('input').property('value'));
      this.bid_control.select('input').on('input', () => {
        this.bid = parseFloat(this.bid_control.select('input').property('value'));
        this.update();
      });
    }
    update() {
      // Make sure the bid value is valid
      this.bid = Math.max(0, Math.min(50, this.bid));
      this.payoff = this.bid > this.floor ? this.value-this.bid : 0;
      this.curve.datum(d3.zip(this.bids, this.bids.map(b => b > this.floor ? this.value-b : 0)))
      .attr('d', d3.line().x(d => this.scale.x(d[0])).y(d => this.scale.y(d[1])));
      this.bid_marker.attr('transform', `translate(${this.scale.x(this.bid)}, ${this.scale.y(this.payoff)})`);
      this.value_control.select('p').text(`Value = ${d3.format("$d")(this.value)}`);
      this.floor_control.select('p').text(`Next = ${d3.format("$d")(this.floor)}`);
      this.bid_control.select('p').text(`Bid = ${d3.format("$d")(this.bid)}`);
    }
    plot() {
      this.setView(0, 50, -20, 50);
      this.setAxis();
      this.setControls();
      this.bids = d3.range(0, 50, 50/1000);
      this.payoff = this.bid > this.floor ? this.value-this.bid : 0;
      // Plot the line
      this.curve = this.view.g.append('path')
      .style('stroke', blue).style('stroke-width', 3).style('fill', 'none')
      .datum(d3.zip(this.bids, this.bids.map(b => b > this.floor ? this.value-b : 0)))
      .attr('d', d3.line().x(d => this.scale.x(d[0])).y(d => this.scale.y(d[1])));
      this.bid_marker = this.view.g.append('path')
      .attr("d", d3.symbol().type(d3.symbolCircle).size(192))
      .attr('transform', `translate(${this.scale.x(this.bid)}, ${this.scale.y(this.payoff)})`)
      .style("fill", blue);
      this.bid_marker.call(d3.drag().on('drag', () => {
        // this.bid = this.scale.x.invert(d3.event.x-this.margin.left);
        this.bid = this.scale.x.invert(d3.mouse(this.view.g.node())[0]);
        this.bid_control.select('input').property('value', this.bid);
        this.update();
      }));
    }
  }
  /*
   * Expected payoff chart
   */
  class ExpectedPayoff extends Chart {
    constructor(div, value_control, mu_control, sigma_control, bid_control) {
      super(div);
      this.value_control = d3.select(value_control);
      this.mu_control = d3.select(mu_control);
      this.sigma_control = d3.select(sigma_control);
      this.bid_control = d3.select(bid_control);
      this.sample_size = 1000;
      this.noise = d3.range(this.sample_size).map(d3.randomNormal(0, 1));
    }
    setControls() {
      this.value = parseFloat(this.value_control.select('input').property('value'));
      this.value_control.select('input').on('input', () => {
        this.value = parseFloat(this.value_control.select('input').property('value'));
        this.update();
      });
      this.mu = parseFloat(this.mu_control.property('value'));
      this.mu_control.on('input', () => {
        this.mu = parseFloat(this.mu_control.property('value'));
        this.update();
      });
      this.sigma = parseFloat(this.sigma_control.property('value'));
      this.sigma_control.on('input', () => {
        this.sigma = parseFloat(this.sigma_control.property('value'));
        this.update();
      });
      this.bid = parseFloat(this.bid_control.select('input').property('value'));
      this.bid_control.select('input').on('input', () => {
        this.bid = parseFloat(this.bid_control.select('input').property('value'));
        this.update();
      });
      this.sample = this.noise.map(e => this.mu*Math.exp(this.sigma*e));
    }
    update() {
      // Make sure the bid value is valid
      this.bid = Math.max(0, Math.min(50, this.bid));
      this.payoff = this.expected_payoff(this.bid, this.value);
      this.sample = this.noise.map(e => this.mu*Math.exp(this.sigma*e));
      this.curve.datum(d3.zip(this.bids, this.bids.map(b => this.expected_payoff(b, this.value))))
      .attr('d', d3.line().x(d => this.scale.x(d[0])).y(d => this.scale.y(d[1])));
      this.bid_marker.attr('transform', `translate(${this.scale.x(this.bid)}, ${this.scale.y(this.payoff)})`);
      this.value_control.select('p').text(`Value = ${d3.format("$d")(this.value)}`);
      this.bid_control.select('p').text(`Bid = ${d3.format("$d")(this.bid)}`);
    }
    expected_payoff(bid, value) {
      return d3.mean(this.sample.map(f => bid > f ? value-bid : 0));
    }
    plot() {
      this.setView(0, 50, -20, 50);
      this.setAxis();
      this.setControls();
      this.bids = d3.range(0, 50, 50/1000);
      this.payoff = this.expected_payoff(this.bid, this.value);
      // Plot the line
      this.curve = this.view.g.append('path')
      .style('stroke', blue).style('stroke-width', 3).style('fill', 'none')
      .datum(d3.zip(this.bids, this.bids.map(b => this.expected_payoff(b, this.value))))
      .attr('d', d3.line().x(d => this.scale.x(d[0])).y(d => this.scale.y(d[1])));
      this.bid_marker = this.view.g.append('path')
      .attr('d', d3.symbol().type(d3.symbolCircle).size(192))
      .attr('transform', `translate(${this.scale.x(this.bid)}, ${this.scale.y(this.payoff)})`)
      .style("fill", blue);
      this.bid_marker.call(d3.drag().on('drag', () => {
        this.bid = this.scale.x.invert(d3.mouse(this.view.g.node())[0]);
        this.bid_control.select('input').property('value', this.bid);
        this.update();
      }));
    }
  }
  /*
   * Expected payoff chart
   */
  class ParticleRepresentation extends Chart {
    constructor(div, mu_control, sigma_control, noise_control, resampling_control, speed_control) {
      super(div);
      this.mu_control = d3.select(mu_control);
      this.sigma_control = d3.select(sigma_control);
      this.noise_control = d3.select(noise_control);
      this.resampling_control = d3.select(resampling_control);
      this.speed_control = d3.select(speed_control);
      this.particle_filter = new pf.ParticleFilter(1000);
      this.model = new pf.Model(1, 1);
    }
    setControls() {
      this.mu = parseFloat(this.mu_control.property('value'));
      this.mu_control.on('input', () => {
        this.mu = parseFloat(this.mu_control.property('value'));
        this.update();
      });
      this.sigma = parseFloat(this.sigma_control.property('value'));
      this.sigma_control.on('input', () => {
        this.sigma = parseFloat(this.sigma_control.property('value'));
        this.update();
      });
      this.noise = parseFloat(this.noise_control.property('value'));
      this.noise_control.on('input', () => {
        this.noise = parseFloat(this.noise_control.property('value'));
        this.update();
      });
      this.resampling = parseFloat(this.resampling_control.property('value'));
      this.resampling_control.on('input', () => {
        this.resampling = parseFloat(this.resampling_control.property('value'));
        this.update();
      });
      this.speed = parseFloat(this.speed_control.select('input').property('value'));
      this.speed_control.select('input').on('input', () => {
        this.speed = parseFloat(this.speed_control.select('input').property('value'));
        this.update();
      });
    }
    update() {
      // Update the model
      this.model.mu = this.mu;
      this.model.sigma = this.sigma;
      this.model.update();
      // Update the particle filter
      this.particle_filter.noise = this.noise;
      this.particle_filter.min_degeneracy = this.resampling*this.particle_filter.n;
      // Update the graph
      this.particles.selectAll("circle")
      .attr('cx', d => this.scale.x(d.mu))
      .attr('cy', d => this.scale.y(d.sigma))
      .attr('r', d => 2*Math.sqrt(this.particle_filter.n*d.weight));
      this.mu_sigma.attr('cx', d => this.scale.x(d.mu))
      .attr('cy', d => this.scale.y(d.sigma));
    }
    step() {
      let action = this.particle_filter.action(this.model.value);
      let experiment = this.model.experiment(action);
      this.particle_filter.update(action, experiment);
      this.update();
      d3.timeout(() => this.step(), 1000/this.speed);
    }
    plot() {
      this.setView(0, 5, 0, 5);
      this.setAxis();
      this.setControls();
      // Build the graph
      this.particles = this.view.g.append('g');
      this.particles.selectAll("circle")
      .data(this.particle_filter.particles)
      .enter()
      .append("circle")
      .attr('cx', d => this.scale.x(d.mu))
      .attr('cy', d => this.scale.y(d.sigma))
      .attr('r', d => 2*Math.sqrt(this.particle_filter.n*d.weight))
      .style('fill', orange);
      // Plot underlying mu and sigma
      this.mu_sigma = this.view.g.append("circle")
      .datum(this.model)
      .attr('cx', d => this.scale.x(d.mu))
      .attr('cy', d => this.scale.y(d.sigma))
      .attr('r', 10)
      .style('fill', red);
      this.mu_sigma.call(d3.drag().on('drag', () => {
        this.mu = this.scale.x.invert(d3.mouse(this.view.g.node())[0]);
        this.sigma = this.scale.y.invert(d3.mouse(this.view.g.node())[1]);
        this.mu_control.property('value', this.mu);
        this.sigma_control.property('value', this.sigma);
        this.update();
      }));
      // Start steps
      this.step();
    }
  }
  /*
   * Performance chart
   */
  class Performance extends Chart {
    constructor(div, mu_control, sigma_control, noise_control, resampling_control, J_control, discount_control, speed_control) {
      super(div);
      this.mu_control = d3.select(mu_control);
      this.sigma_control = d3.select(sigma_control);

      this.noise_control = d3.select(noise_control);
      this.resampling_control = d3.select(resampling_control);
      this.speed_control = d3.select(speed_control);
      this.particle_filter = new pf.ParticleFilter(1000);

      this.J_control = d3.select(J_control);
      this.discount_control = d3.select(discount_control);
      this.discount = 1;
      this.J = 100;
      this.ucb = new pf.UCB(this.J, this.discount, 1, 50);
      this.ref_J = 100;
      this.reference = new pf.UCB(this.ref_J, this.discount, 1, 50);

      this.model = new pf.Model(1, 1);
      // Revenue measurement
      this.revenue_length = 5000;
      this.revenue_smoothing = 0.995;
      this.revenue_particle_filter = [0];
      this.revenue_ucb = [0];
      this.revenue_reference = [0];
    }
    setControls() {
      this.mu = parseFloat(this.mu_control.property('value'));
      this.mu_control.on('input', () => {
        this.mu = parseFloat(this.mu_control.property('value'));
        this.update();
      });
      this.sigma = parseFloat(this.sigma_control.property('value'));
      this.sigma_control.on('input', () => {
        this.sigma = parseFloat(this.sigma_control.property('value'));
        this.update();
      });
      this.noise = parseFloat(this.noise_control.property('value'));
      this.noise_control.on('input', () => {
        this.noise = parseFloat(this.noise_control.property('value'));
        this.update();
      });
      this.resampling = parseFloat(this.resampling_control.property('value'));
      this.resampling_control.on('input', () => {
        this.resampling = parseFloat(this.resampling_control.property('value'));
        this.update();
      });
      this.J = parseFloat(this.J_control.select('input').property('value'));
      this.J_control.select('input').on('input', () => {
        this.J = parseFloat(this.J_control.select('input').property('value'));
        this.update();
      });
      this.discount = parseFloat(this.discount_control.select('input').property('value'));
      this.discount_control.select('input').on('input', () => {
        this.discount = parseFloat(this.discount_control.select('input').property('value'));
        this.update();
      });
      this.speed = parseFloat(this.speed_control.select('input').property('value'));
      this.speed_control.select('input').on('input', () => {
        this.speed = parseFloat(this.speed_control.select('input').property('value'));
        this.update();
      });
    }
    update() {
      // Update the model
      this.model.mu = this.mu;
      this.model.sigma = this.sigma;
      this.model.update();
      // Update the particle filter
      this.particle_filter.noise = this.noise;
      this.particle_filter.min_degeneracy = this.resampling*this.particle_filter.n;
      // Update UCB
      this.ucb.discount = this.discount;
      // Update the particle filter graph
      this.curve_particle_filter.datum(this.revenue_particle_filter)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Update the ucb graph
      this.curve_ucb.datum(this.revenue_ucb)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Update the reference graph
      this.curve_reference.datum(this.revenue_reference)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Update labels
      this.J_control.select('p').text(`J = ${d3.format("d")(this.J)}`);
      this.discount_control.select('p').text(`discount = ${d3.format(".3f")(this.discount)}`);
    }
    step() {
      // Particle filter
      let action_particle_filter = this.particle_filter.action(this.model.value);
      // console.log(`PF: ${action_particle_filter}`)
      let experiment_particle_filter = this.model.experiment(action_particle_filter);
      this.particle_filter.update(action_particle_filter, experiment_particle_filter);
      this.revenue_particle_filter.push((1-this.revenue_smoothing)*experiment_particle_filter.paid + this.revenue_smoothing*this.revenue_particle_filter[this.revenue_particle_filter.length-1]);
      while (this.revenue_particle_filter.length > this.revenue_length) {
        this.revenue_particle_filter.shift();
      }
      // UCB
      let action_ucb = this.ucb.action(this.model.value)
      // console.log(`UCB: ${action_ucb}`)
      let experiment_ucb = this.model.experiment(action_ucb);
      this.ucb.update(action_ucb, experiment_ucb, this.model.value, this.J);
      this.revenue_ucb.push((1-this.revenue_smoothing)*experiment_ucb.paid + this.revenue_smoothing*this.revenue_ucb[this.revenue_ucb.length-1]);
      while (this.revenue_ucb.length > this.revenue_length) {
        this.revenue_ucb.shift();
      }
      // reference
      let action_reference = this.reference.action(this.model.value)
      let experiment_reference = this.model.experiment(action_reference);
      this.reference.update(action_reference, experiment_reference, this.model.value, this.ref_J);
      this.revenue_reference.push((1-this.revenue_smoothing)*experiment_reference.paid + this.revenue_smoothing*this.revenue_reference[this.revenue_reference.length-1]);
      while (this.revenue_reference.length > this.revenue_length) {
        this.revenue_reference.shift();
      }
      this.update();
      d3.timeout(() => this.step(), 1000/this.speed);
    }
    plot() {
      this.setView(0, this.revenue_length, 0, 40);
      this.setAxis();
      this.setControls();
      // Build the graph
      this.curve_particle_filter = this.view.g.append('path')
      .style('stroke', red).style('stroke-width', 2).style('fill', 'none')
      .datum(this.revenue_particle_filter)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Build the graph for ucb
      this.curve_ucb = this.view.g.append('path')
      .style('stroke', orange).style('stroke-width', 2).style('fill', 'none')
      .datum(this.revenue_ucb)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Build the graph for reference
      this.curve_reference = this.view.g.append('path')
      .style('stroke', blue).style('stroke-width', 2).style('fill', 'none')
      .datum(this.revenue_reference)
      .attr('d', d3.line().x((d, i) => this.scale.x(i)).y(d => this.scale.y(d)));
      // Start steps
      this.step();
    }
  }
  // DEBUG
  dt = d3;
  jst = jstat;
  return {
    'Chart':Chart,
    'Payoff':Payoff,
    'ExpectedPayoff':ExpectedPayoff,
    'ParticleRepresentation':ParticleRepresentation,
    'Performance':Performance
  };
});
