import { module, test } from 'qunit';
import { setupTest } from 'ember-qunit';

module('Unit | Route | stocks', function(hooks) {
  setupTest(hooks);

  test('it exists', function(assert) {
    let route = this.owner.lookup('route:stocks');
    assert.ok(route);
  });
});
