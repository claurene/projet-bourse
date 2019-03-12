import EmberRouter from '@ember/routing/router';
import config from './config/environment';

const Router = EmberRouter.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('stocks', {path: '/stocks'});
  this.route('stocks', {path: '/stocks/:symbol'});
  this.route('wallet');
  this.route('gains');
  this.route('chart');
});

export default Router;
