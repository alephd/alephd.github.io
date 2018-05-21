// Main app script
var require = d3.requireFrom(name => 'js/'+name+'.js');
require('d3', 'plot').then(d3 => {
  // Plot the payoff function
  payoff = new d3.Payoff('#payoff', '#payoff-value-control', '#payoff-floor-control', '#payoff-bid-control');
  payoff.plot();
  // Plot the expected payoff function
  expected_payoff = new d3.ExpectedPayoff('#expected-payoff', '#expected-payoff-value-control', '#expected-payoff-mu-control', '#expected-payoff-sigma-control', '#expected-payoff-bid-control');
  expected_payoff.plot();
  // Plot the particle filter representation
  particle_representation = new d3.ParticleRepresentation('#particle-representation', '#particle-representation-mu-control', '#particle-representation-sigma-control', '#particle-representation-noise-control', '#particle-representation-resampling-control', '#particle-representation-speed-control');
  particle_representation.plot();

});
