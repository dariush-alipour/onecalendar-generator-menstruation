'use strict';

var i18next = require('i18next');
var locales = require('../locales/index.js');

var Generator = function Generator(dependencies) {
  var config = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  i18next.init({
    lng: config.locale || 'en',
    fallbackLng: 'en',
    initImmediate: false,
    resources: locales
  });
  var trl = function trl(key) {
    i18next.store.data = locales;
    i18next.changeLanguage(config.locale || 'en');
    return i18next.t(key);
  };
  var id = 'coripo.coripo.generator.menstruation';
  var name = trl('menstruation-generator.name');
  var description = trl('menstruation-generator.description');
  var inputs = [{
    title: trl('menstruation-generator.field-group.basic.title'),
    fields: [{
      id: 'start',
      label: trl('menstruation-generator.field-group.basic.field.start.label'),
      type: 'date'
    }, {
      id: 'periodLength',
      label: trl('menstruation-generator.field-group.basic.field.period-length.label'),
      type: 'number'
    }, {
      id: 'cycleLength',
      label: trl('menstruation-generator.field-group.basic.field.cycle-length.label'),
      type: 'number'
    }]
  }];
  var helper = {
    getAdapter: dependencies.getAdapter,
    primaryAdapterId: dependencies.primaryAdapterId
  };

  var generate = function generate(cfg) {
    var event = new dependencies.Event({
      dna: cfg,
      id: cfg.id,
      generatorId: id,
      title: trl('menstruation-generator.event.period-days.title'),
      color: '#ee10f6',
      since: new dependencies.OneDate(cfg.start, helper),
      till: new dependencies.OneDate(cfg.start, helper).offsetDay(cfg.periodLength - 1),
      overlap: { internal: 'trim', external: 'trim-forever' },
      repeats: [{ times: -1, cycle: 'day', step: cfg.cycleLength }],
      sequels: [{
        title: trl('menstruation-generator.event.peak-ovulation.title'),
        color: '#00aeef',
        since: { scale: 'day', offset: 10 },
        till: { scale: 'day', offset: 14 }
      }, {
        title: trl('menstruation-generator.event.pre-period.title'),
        color: '#f36',
        since: { scale: 'day', offset: -2 },
        till: { scale: 'day', offset: -1 }
      }, {
        title: trl('menstruation-generator.event.post-period.title'),
        color: '#7e70ff',
        since: { scale: 'day', offset: cfg.periodLength },
        till: { scale: 'day', offset: cfg.periodLength + 1 }
      }]
    });
    return event;
  };

  return { id: id, name: name, description: description, inputs: inputs, generate: generate };
};

module.exports = Generator;
//# sourceMappingURL=menstruation.generator.js.map