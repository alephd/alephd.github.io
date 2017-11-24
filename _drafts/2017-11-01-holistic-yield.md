---
title: Selling ad inventory optimally
layout: post
description: A series of post on holistic yield management
authors:
  - name: Nicolas Grislain
    address: mailto:nicolas.grislain@oath.com
affiliations:
  - name: AlephD
    address: http://www.alephd.com
bibliography:
>
  @inproceedings{kitts2017ad,
    title={Ad Serving with Multiple KPIs},
    author={Kitts, Brendan and Krishnan, Michael and Yadav, Ishadutta and Zeng, Yongbo and Badeau, Garrett and Potter, Andrew and Tolkachov, Sergey and Thornburg, Ethan and Janga, Satyanarayana Reddy},
    booktitle={Proceedings of the 23rd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining},
    pages={1853--1861},
    year={2017},
    organization={ACM}
  }
  @inproceedings{ostrovsky2011reserve,
    title={Reserve prices in internet advertising auctions: A field experiment},
    author={Ostrovsky, Michael and Schwarz, Michael},
    booktitle={Proceedings of the 12th ACM conference on Electronic commerce},
    pages={59--60},
    year={2011},
    organization={ACM}
  }
  @inproceedings{yuan2014empirical,
    title={An empirical study of reserve price optimisation in real-time bidding},
    author={Yuan, Shuai and Wang, Jun and Chen, Bowei and Mason, Peter and Seljan, Sam},
    booktitle={Proceedings of the 20th ACM SIGKDD international conference on Knowledge discovery and data mining},
    pages={1897--1906},
    year={2014},
    organization={ACM}
  }
  @inproceedings{chahuara2017real,
    title={Real-Time Optimization of Web Publisher RTB Revenues},
    author={Chahuara, Pedro and Grislain, Nicolas and Jauvion, Gregoire and Renders, Jean-Michel},
    booktitle={Proceedings of the 23rd ACM SIGKDD International Conference on Knowledge Discovery and Data Mining},
    pages={1743--1751},
    year={2017},
    organization={ACM}
  }
  @inproceedings{murali2015optimal,
    title={Optimal budget allocation strategies for real time bidding in display advertising},
    author={Murali, Pavankumar and Li, Ying and Mazzoleni, Pietro and Vaculin, Roman},
    booktitle={Winter Simulation Conference (WSC), 2015},
    pages={3146--3147},
    year={2015},
    organization={IEEE}
  }
  @inproceedings{lee2013real,
    title={Real time bid optimization with smooth budget delivery in online advertising},
    author={Lee, Kuang-Chih and Jalali, Ali and Dasdan, Ali},
    booktitle={Proceedings of the Seventh International Workshop on Data Mining for Online Advertising},
    pages={1},
    year={2013},
    organization={ACM}
  }
  @article{roels2009dynamic,
    title={Dynamic revenue management for online display advertising},
    author={Roels, Guillaume and Fridgeirsdottir, Kristin},
    journal={Journal of Revenue and Pricing Management},
    volume={8},
    number={5},
    pages={452--466},
    year={2009},
    publisher={Springer},
    url={http://files.pch.webnode.com/200000000-bae4dbbdea/rpm200910a.pdf}
  }
  @inproceedings{bharadwaj2012shale,
    title={SHALE: an efficient algorithm for allocation of guaranteed display advertising},
    author={Bharadwaj, Vijay and Chen, Peiji and Ma, Wenjing and Nagarajan, Chandrashekhar and Tomlin, John and Vassilvitskii, Sergei and Vee, Erik and Yang, Jian},
    booktitle={Proceedings of the 18th ACM SIGKDD international conference on Knowledge discovery and data mining},
    pages={1195--1203},
    year={2012},
    organization={ACM}
  }
  @inproceedings{ghosh2009bidding,
    title={Bidding for Representative Allocations for Display Advertising.},
    author={Ghosh, Arpita and McAfee, Randolph Preston and Papineni, Kishore and Vassilvitskii, Sergei},
    booktitle={WINE},
    volume={5929},
    pages={208--219},
    year={2009},
    organization={Springer}
  }
  @inproceedings{chen2014dynamic,
    title={A dynamic pricing model for unifying programmatic guarantee and real-time bidding in display advertising},
    author={Chen, Bowei and Yuan, Shuai and Wang, Jun},
    booktitle={Proceedings of the Eighth International Workshop on Data Mining for Online Advertising},
    pages={1--9},
    year={2014},
    organization={ACM}
  }
  @inproceedings{chen2016risk,
    title={Risk-aware dynamic reserve prices of programmatic guarantee in display advertising},
    author={Chen, Bowei},
    booktitle={Data Mining Workshops (ICDMW), 2016 IEEE 16th International Conference on},
    pages={511--518},
    year={2016},
    organization={IEEE}
  }
  @article{balseiro2014yield,
    title={Yield optimization of display advertising with ad exchange},
    author={Balseiro, Santiago R and Feldman, Jon and Mirrokni, Vahab and Muthukrishnan, S},
    journal={Management Science},
    volume={60},
    number={12},
    pages={2886--2907},
    year={2014},
    publisher={INFORMS},
    url={https://arxiv.org/pdf/1102.2551.pdf}
  }
  @inproceedings{bharadwaj2010pricing,
    title={Pricing guaranteed contracts in online display advertising},
    author={Bharadwaj, Vijay and Ma, Wenjing and Schwarz, Michael and Shanmugasundaram, Jayavel and Vee, Erik and Xie, Jack and Yang, Jian},
    booktitle={Proceedings of the 19th ACM international conference on Information and knowledge management},
    pages={399--408},
    year={2010},
    organization={ACM}
  }
  @inproceedings{wang2012selling,
    title={Selling futures online advertising slots via option contracts},
    author={Wang, Jun and Chen, Bowei},
    booktitle={Proceedings of the 21st International Conference on World Wide Web},
    pages={627--628},
    year={2012},
    organization={ACM}
  }
  @phdthesis{chen2015financial,
    title={Financial Methods for Online Advertising},
    author={Chen, Bowei},
    year={2015},
    school={UCL (University College London)}
  }
---
## Executive summary

This blog post is the first of a series of posts aiming at covering theoretical and technical considerations around the optimal ways for a digital publisher to both reserve inventory for *direct campaigns* and sell the remaining on the spot market, also called *real time bidding* market or *RTB*.
The posts will cover the following questions:
 - What does an optimal allocation of *direct* and *RTB* look like?
 - How to manage a large number of direct campaigns and handle inventory shortage gracefuly?
 - How to anticipate daily volume in a smart way?
 - How to deal with market uncertainty?

## What is holistic yield?

Web publishers use different channels to sell their ads.
We consider in this series of post two channels: real time bidding (*RTB*) and *direct*.
In *RTB*, the publisher sells ads through an ad exchange where buyers compete in auctions happening in real time.
In *direct*, the ads are sold through direct campaigns.

A direct campaign is a contract in which a publisher commits to deliver a specified number of ads to an advertiser while ensuring that some KPIs are met (for example the publisher may guarantee a minimum number of clicks to the advertiser).
Should the publisher not deliver the impressions as defined in the contract, it pays a penalty to the advertiser.

A natural way for a publisher to allocate impressions between the two channels is to derive a bidding strategy from direct campaigns and let those bids compete against RTB.
If direct wins an auction, the publisher chooses a direct campaign to sell the impression, otherwise the impression is sold in the RTB market.

This post presents an algorithm to build an optimal bidding strategy for the publisher to deliver its direct campaigns while maximizing its RTB revenue.
The optimal strategy gives a formula to determine the publisher bid as well as a way to choose the direct campaign being delivered if the publisher bidder wins the auction, depending on the impression characteristics.

The optimal strategy can be estimated on past auctions data. The algorithm scales with the size of the dataset and the number of campaigns.
This is a very important feature, as in practice a publisher may have thousands of active direct campaigns at the same time and would like to estimate an optimal strategy on millions of auctions.

## Related works

The problem of maximizing a web publisher advertising revenue is much studied in the literature.
Because of the complexity of the online advertising ecosystem, and because the publishers sell their ads through different channels, this problem leads to diverse approaches.

<span/><dt-cite key="ostrovsky2011reserve"></dt-cite>, <dt-cite key="yuan2014empirical"></dt-cite> and <dt-cite key="chahuara2017real"></dt-cite> consider a publisher selling its ads through *RTB* only, and define strategies for the publisher to set appropriate reserve prices in each auction to optimize its *RTB* revenue. In <dt-cite key="ostrovsky2011reserve"></dt-cite>, the reserve prices are set in a static way (i.e an optimal reserve price is estimated on a large set of auctions), whereas <dt-cite key="yuan2014empirical"></dt-cite> and <dt-cite key="chahuara2017real"></dt-cite> define methodologies to set dynamic reserve prices which are predicted in real time before an auction happens.

<span/><dt-cite key="murali2015optimal"></dt-cite> and <dt-cite key="lee2013real"></dt-cite> study the optimal delivery of a budget across time in the *RTB* market. This problem known as budget pacing has been much studied and presents strong similarities with the problem of delivering a direct campaign. In both articles, the bids are updated online to optimize the budget delivery.

<span/><dt-cite key="roels2009dynamic"></dt-cite> and <dt-cite key="bharadwaj2012shale"></dt-cite> focus on *direct* revenue maximization. They consider that the impressions can be sold in direct campaigns only, and define strategies to allocate optimally a set of impressions between all campaigns in order to maximize the publisher revenue (i.e minimize the penalty the publisher pays if some campaigns are not delivered as agreed in the contract). <dt-cite key="roels2009dynamic"></dt-cite> formulates this problem as a dynamic programming problem, and <dt-cite key="bharadwaj2012shale"></dt-cite> proposes an efficient algorithm to allocate near-optimally the impresions between the campaigns.

<span/><dt-cite key="ghosh2009bidding"></dt-cite>, <dt-cite key="chen2014dynamic"></dt-cite>, <dt-cite key="chen2016risk"></dt-cite> and <dt-cite key="balseiro2014yield"></dt-cite> study the joint optimization of the publisher revenue coming from *RTB* and *direct*. They consider a setting similar to our setting, in which the publisher bids in auctions to compete with *RTB* bidders.

In <dt-cite key="ghosh2009bidding"></dt-cite>, the quality of a direct campaign delivery is represented by a utility function, and the quality of each impression is linked directly to its price in the *RTB* market, whereas we characterize a campaign delivery by some KPIs. <dt-cite key="kitts2017ad"></dt-cite> decribes an approach to target KPIs by minimizing some penalty function related to the distance to the goals.

The model used in <dt-cite key="chen2014dynamic"></dt-cite> and <dt-cite key="chen2016risk"></dt-cite> is based on the modeling of the supply and the demand on an aggregated level, while we analyze data auction per auction without needing to model the supply and demand.

In <dt-cite key="balseiro2014yield"></dt-cite>, a campaign is defined by a fixed number of impressions which is supposed to be delivered exactly, and a per-impression quality. The algorithm aims to maximize a weighted sum of the *RTB* revenue and of the direct campaigns qualities. The main difference with our approach is that the campaigns are supposed to be completely delivered. In our approach, we enable under-delivery of a campaign if it brings a higher revenue to the publisher, which adds many variables to the problem. Also, the approach described in <dt-cite key="balseiro2014yield"></dt-cite> may be hard to scale due to the allocation plan used to allocate similar campaigns. We solve this issue using randomization.

Finally, <dt-cite key="wang2012selling"></dt-cite> and <dt-cite key="chen2015financial"></dt-cite> present stochastic models for supply and demand, and link the problem of *direct* revenue maximization with the problem of option pricing in finance.

## Various challenges related to holistic yield

We apply infimum smoothing to the objective function (actually supremum smoothing, i.e. supremum convolution with a negative parabola). The gradient descent.
Called Moreau enveloppe
Look at http://www.control.lth.se/media/Education/DoctorateProgram/2015/LargeScaleConvexOptimization/Lectures/cvx_fcn.pdf

<div id="solve-campaigns"></div>

## The optimisation problem statement

$$\max_{(a_n),(q_{n,k}),(v_{k,i})} \left(\sum_{n=1}^N r_n(a_n) + \sum_{k=1}^K \left( \pi_k - L_k(v_{k,1}-g_{k,1},\ldots,v_{k,p_k}-g_{k,p_k})\right) \right)$$

s.t

$$\forall k,i \text{ } v_{k,i}=\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}$$

$$\forall n \text{ } \sum_{k=1}^K q_{n,k}=1$$

$$\forall n,k \text{ } q_{n,k} \geq 0 $$

For the sake of simplicity the loss functions are chosen as the sum of piecewise-linear (ramp) functions:
The problem can then be simplified to:

$$\max_{(a_n),(q_{n,k}),(v_{k,i})} \left(\sum_{n=1}^N r_n(a_n) + \sum_{k=1}^K \left( \pi_k + \sum_{i=1}^{p_k}\lambda_{k,i}\min(v_{k,i}-g_{k,i},0) \right) \right.$$

$$- \sum_{k=1}^K \sum_{i=1}^{p_k} \chi_{\{0\}}\left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)$$

$$- \sum_{n=1}^N \chi_{\{0\}}\left(\sum_{k=1}^K q_{n,k}-1\right)$$

$$\left. - \sum_{n=1}^N\sum_{k=1}^K \chi_{\mathbb{R^+}}\left(q_{n,k}\right) \right)$$

Where $\chi_{S}$ is the characteristic function of the set $S$ ($\chi_S(x)=0$ when $x \in S$ and $\chi_S(x)=+\infty$ when $x \notin S$ )

We relax indefinite and non-differentiable functions, using Moreau enveloppes, as follow:

$$\max_{(a_n),(q_{n,k}),(v_{k,i})} \left(\sum_{n=1}^N r_n(a_n) + \sum_{k=1}^K \left( \pi_k + \sum_{i=1}^{p_k}\max_y\left(\lambda_{k,i}\min(y,0) - \frac{\beta_\lambda}{2}\left(v_{k,i}-g_{k,i} - y\right)^2 \right) \right) \right.$$

$$+ \sum_{k=1}^K \sum_{i=1}^{p_k} \max_y\left(-\chi_{\{0\}}\left(y\right) - \frac{\beta_v}{2}\left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}-y\right)^2 \right)$$

$$+ \sum_{n=1}^N \max_y\left(-\chi_{\{0\}}\left(y\right)-\frac{\beta_1}{2}\left(\sum_{k=1}^K q_{n,k}-1 - y\right)^2\right)$$

$$\left. + \sum_{n=1}^N\sum_{k=1}^K \max_y\left(-\chi_{\mathbb{R^+}}\left(y\right) - \frac{\beta_0}{2}\left(q_{n,k}-y\right)^2\right) \right)$$

It simplifies to:

$$\max_{(a_n),(q_{n,k}),(v_{k,i})}\mathcal{M} = \max_{(a_n),(q_{n,k}),(v_{k,i})} \left(\sum_{n=1}^N r_n(a_n) + \sum_{k=1}^K \left( \pi_k \right.\right.$$

$$\left. + \sum_{i=1}^{p_k} \left( \lambda_{k,i}\left(v_{k,i}-g_{k,i}+\frac{\lambda_{k,i}}{2\beta_\lambda}\right)\mathbb{1}_{v_{k,i} \lt g_{k,i}-\frac{\lambda_{k,i}}{\beta_\lambda}} - \frac{\beta_\lambda}{2}\left(v_{k,i}-g_{k,i}\right)^2\mathbb{1}_{g_{k,i}-\frac{\lambda_{k,i}}{\beta_\lambda} \leq v_{k,i} \lt g_{k,i}} \right) \right) $$

$$- \frac{\beta_v}{2}\sum_{k=1}^K \sum_{i=1}^{p_k} \left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)^2$$

$$\left. - \frac{\beta_1}{2}\sum_{n=1}^N \left(\sum_{k=1}^K q_{n,k}-1\right)^2 - \frac{\beta_0}{2}\sum_{n=1}^N\sum_{k=1}^K q_{n,k}^2 \mathbb{1}_{q_{n,k}<0}\right) $$

The first order conditions for $a_n$ and $q_{n,k}$ can be written:

$$r_n'(a_n) + \beta_vf_n(a_n)\sum_{k=1}^K q_{n,k} \sum_{i=1}^{p_k} \theta_{n,k,i}\left(v_{k,i} - \sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right) = 0$$

$$\beta_v F_n(a_n) \sum_{i=1}^{p_k} \theta_{n,k,i}\left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)
- \beta_1 \left(\sum_{k=1}^K q_{n,k}-1\right) - \beta_0 q_{n,k} \mathbb{1}_{q_{n,k}<0} = 0$$

The components of the gradient of $\mathcal{M}$ can be written :

$$\frac{\partial \mathcal{M}}{\partial a_n} = r_n'(a_n) + \beta_vf_n(a_n)\sum_{k=1}^K q_{n,k} \sum_{i=1}^{p_k} \theta_{n,k,i}\left(v_{k,i} - \sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)$$

$$\frac{\partial \mathcal{M}}{\partial q_{n,k}} = \beta_v F_n(a_n) \sum_{i=1}^{p_k} \theta_{n,k,i}\left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)
- \beta_1 \left(\sum_{k=1}^K q_{n,k}-1\right) - \beta_0 q_{n,k} \mathbb{1}_{q_{n,k}<0}$$

$$\frac{\partial \mathcal{M}}{\partial v_{k,i}} = \lambda_{k,i}\mathbb{1}_{v_{k,i} \lt g_{k,i} - \frac{\lambda_{k,i}}{\beta_\lambda}} - \beta_\lambda\left(v_{k,i}-g_{k,i}\right)\mathbb{1}_{g_{k,i}-\frac{\lambda_{k,i}}{\beta_\lambda} \leq v_{k,i} \lt g_{k,i}}
-\beta_v \left(v_{k,i}-\sum_{n=1}^N F_n(a_n)q_{n,k}\theta_{n,k,i}\right)$$

<script src="/assets/holistic_yield/globals.js"></script>
<script src="/assets/holistic_yield/solve_campaigns.js"></script>
