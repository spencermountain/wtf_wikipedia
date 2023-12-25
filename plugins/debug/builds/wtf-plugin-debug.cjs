/* wtf-plugin-debug 0.0.1  MIT */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.wtfDebug = factory());
})(this, (function () { 'use strict';

  const plugin = function (models) {
    // look for unprocessed table wikitext
    models.Doc.prototype.hasBadTable = function () {
      let txt = this.text();
      if (/class="wikitable"/.test(txt)) {
        return 'unparsed-wikitable'
      }
      if (/style="/.test(txt)) {
        return 'unparsed-style'
      }
      if (/width="/.test(txt)) {
        return 'unparsed-width'
      }
      if (/^! "/.test(txt)) {
        return 'unparsed-table-header'
      }
      if (/^\|-"/.test(txt)) {
        return 'unparsed-table-row'
      }
      if (/colspan/.test(txt)) {
        return 'unparsed-colspan'
      }
      return false
    };

    models.Doc.prototype.hasNoText = function () {
      if (this.isDisambiguation() || this.isRedirect()) {
        return false
      }
      let txt = this.text();
      if (txt.length < 200) {
        return 'no-text'
      }
      return false
    };

    models.Doc.prototype.isLongStub = function () {
      let txt = this.text();
      if (this.isStub() && txt.length > 2000) {
        return 'long-stub'
      }
      if (this.isRedirect() && txt.length > 2000) {
        return 'long-redirect'
      }
      if (this.isDisambiguation() && txt.length > 2000) {
        return 'long-disambig'
      }
      return false
    };

    models.Doc.prototype.hasIPAPunct = function () {
      if (this.isDisambiguation() || this.isRedirect()) {
        return false
      }
      let str = this.sentences()[0].text();
      if (/[{|}]/.test(str)) {
        return 'has-punct'
      }
      if (/[ (],[ )(]/.test(str)) {
        return 'dangling-comma'
      }
      if (/ ;/.test(str)) {
        return 'dangling-semicolon'
      }
      if (/\(/.test(str) && !/\)/.test(str)) {
        return 'unclosed-paren'
      }
      if (!/\(/.test(str) && /\)/.test(str)) {
        return 'unopened-paren'
      }
      return false
    };

    models.Doc.prototype.isBad = function () {
      return this.hasBadTable() || this.hasNoText() || this.hasIPAPunct() || this.isLongStub()
    };
  };

  return plugin;

}));
