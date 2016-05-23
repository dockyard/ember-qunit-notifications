var path = require('path');
var resolve = require('resolve');
var MergeTrees = require('broccoli-merge-trees');
var Funnel = require('broccoli-funnel');

module.exports = {
  name: 'ember-qunit-notifications',

  /*
    Include qunit-notifications and passed/failed images.

    @override
  */
  included: function included(app, parentAddon) {
    app = app.app || app;

    var target = (parentAddon || app);
    this._super.included.call(this, target);

    if (app.tests) {
      var testSupportPath = target.options.outputPaths.testSupport.js;
      testSupportPath = testSupportPath.testSupport || testSupportPath;
      testSupportPath = path.dirname(testSupportPath) || 'assets';

      var imgAssets = [
        'vendor/ember-qunit-notifications/passed.png',
        'vendor/ember-qunit-notifications/failed.png'
      ];

      imgAssets.forEach(function(img) {
        app.import(img, {
          type: 'test',
          destDir: 'assets'
        });
      });

      app.import('vendor/qunit-notifications/index.js', {
        type: 'test'
      });
    }
  },

  /*
    Merge qunit-notifications into the vendor tree.

    @override
  */
  treeForVendor: function treeForVendor(tree) {
    var notificationsPath = path.dirname(resolve.sync('qunit-notifications'));
    var notificationsTree = new Funnel(notificationsPath, {
      include: [ 'index.js' ],
      destDir: 'qunit-notifications',
      annotation: 'qunit-notifications'
    });

    var trees = [
      tree,
      notificationsTree
    ];

    return new MergeTrees(trees, {
      annotation: 'ember-qunit-notifications: treeForVendor'
    });
  }
};
