define('particle_filter', ['d3', 'jstat'], function (d3, jstat) {
  const mu_lim = [0,5];
  const sigma_lim = [0,5];
  const particle_noise = 0.01;
  const min_weight = 0.00001;

  function mod(x, m) {return ((x%m)+m)%m;};

  class Particle {
    constructor(weight = 1, mu = jstat.uniform.sample(0,5), sigma = jstat.uniform.sample(0,5), noise = particle_noise) {
      this.weight = weight;
      this.mu = mu;
      this.sigma = sigma;
      this.noise = noise;
    }
    // Obs is won or lost
    likelihood(action, obs) {
      if (obs) return jstat.lognormal.cdf(action, this.mu, this.sigma);
      else return 1-jstat.lognormal.cdf(action, this.mu, this.sigma);
    }
    // update
    update(action, obs) {
      this.mu += jstat.normal.sample(0,this.noise/Math.sqrt(this.noise+this.weight));
      if (this.mu<mu_lim[0]) {this.mu = 2*mu_lim[0]-this.mu;}
      if (this.mu>mu_lim[1]) {this.mu = 2*mu_lim[1]-this.mu;}
      this.sigma += jstat.normal.sample(0,this.noise/Math.sqrt(this.noise+this.weight));
      if (this.sigma<sigma_lim[0]) {this.sigma = 2*sigma_lim[0]-this.sigma;}
      if (this.sigma>sigma_lim[1]) {this.sigma = 2*sigma_lim[1]-this.sigma;}
      this.weight *= this.likelihood(action, obs);
      this.weight = this.weight || min_weight;
      // this.noise *= jstat.lognormal.sample(0,0.01);
    }
  }

  class ParticleFilter {
    constructor(n = 1000, noise = null) {
      this.n = n;
      this.min_degeneracy = this.n/10;
      this.particles = d3.range(this.n).map(i => new Particle());
      this.noise = noise;
    }
    degeneracy() {
      return 1/this.particles.reduce((a,c) => a+c.weight*c.weight, 0);
    }
    normalize() {
      // Renormalize weights
      let sum_weights = this.particles.reduce((a,c) => a+c.weight, 0);
      this.particles.forEach(p => {
        p.weight /= sum_weights;
      });
    }
    sample(n) {
      let unif_sample = d3.range(n).map(i => jstat.uniform.sample(0,1)).sort((a,b) => (a-b));
      let sampled_particles = [];
      let i = 0;
      let sum_weights = 0;
      this.particles.forEach(p => {
        sum_weights += p.weight;
        while (i<n && unif_sample[i]<sum_weights) {
          i++;
          sampled_particles.push(new Particle(1, p.mu, p.sigma, p.noise));
        }
      });
      return sampled_particles;
    }
    resample() {
      let sampled_particles = this.sample(this.n);
      for (let i=0; i<this.n; i++) {
        this.particles[i].weight = sampled_particles[i].weight;
        this.particles[i].mu = sampled_particles[i].mu;
        this.particles[i].sigma = sampled_particles[i].sigma;
        this.particles[i].noise = sampled_particles[i].noise;
      }
    }
    action(value) {
      let unif_sample = d3.range(10).map(i => jstat.uniform.sample(0,50)).sort((a,b) => (a-b));
      let sample = this.sample(1)[0];
      let max_action = 0;
      let max_payoff = 0;
      unif_sample.forEach(a => {
        let payoff = (value-a)*jstat.lognormal.cdf(a, sample.mu, sample.sigma);
        if (payoff>max_payoff) {
          max_payoff = payoff;
          max_action = a;
        }
      });
      return max_action;
    }
    update(action, obs) {
      // Update
      this.particles.forEach(p => {
        p.update(action, obs);
        if (this.noise !== null) {
          p.noise = this.noise;
        }
      });
      // Reormalize
      this.normalize();
      // Resample if needed
      if (this.degeneracy()<this.min_degeneracy) {
        this.resample();
        this.normalize();
      }
    }
  }
  // Result of an auction
  class Experiment {
    constructor(won, paid) {
      this.won = won;
      this.paid = paid;
    }
  }
  // Model generating experiment
  class Model {
    constructor(mu, sigma, value) {
      this.mu = mu;
      this.sigma = sigma;
      this.value = value;
    }
    experiment(action) {
      let floor = jstat.lognormal.sample(this.mu, this.sigma);
      return new Experiment(action > floor ? this.value-action : 0, action > floor);
    }
  }
  return {
    'Particle':Particle,
    'ParticleFilter':ParticleFilter,
    'Experiment':Experiment,
    'Model':Model
  };
});
