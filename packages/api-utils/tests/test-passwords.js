"use strict";

const { store, search, remove } = require("passwords/utils");

exports["test store requires `password` field"] = function(assert) {
  assert.throws(function() {
    store({ username: "foo", realm: "bar" });
  }, '`passowrd` is required');
};

exports["test store requires `username` field"] = function(assert) {
  assert.throws(function() {
    store({ passowrd: "foo", realm: "bar" });
  }, '`passowrd` is required');
};

exports["test store requires `realm` field"] = function(assert) {
  assert.throws(function() {
    store({ username: "foo", passowrd: "bar" });
  }, '`passowrd` is required');
};

exports["test remove throws if no login found"] = function(assert) {
  assert.throws(function() {
    remove({ username: "foo", password: "bar", realm: "baz" });
  }, "can't remove unstored credentials");
};

exports["test addon associated credentials"] = function(assert) {
  let options = { username: "foo", password: "bar", realm: "baz" };
  store(options);

  assert.ok(search().length, "credential was stored");
  assert.ok(search(options).length, "stored credential found");
  assert.ok(search({ username: options.username }).length, "found by username");
  assert.ok(search({ password: options.password }).length, "found by password");
  assert.ok(search({ realm: options.realm }).length, "found by realm");

  let credential = search(options)[0];
  assert.equal(credential.url.indexOf("jetpack:"), 0,
               "`jetpack:` uri is used for add-on associated credentials");
  assert.equal(credential.username, options.username, "username matches");
  assert.equal(credential.password, options.password, "password matches");
  assert.equal(credential.realm, options.realm, "realm matches");
  assert.equal(credential.formSubmitURL, null,
               "`formSubmitURL` is `null` for add-on associated credentials");
  assert.equal(credential.usernameField, "", "usernameField is empty");
  assert.equal(credential.passwordField, "", "passwordField is empty");

  remove(search(options)[0]);
  assert.ok(!search(options).length, "remove worked");

  remove(search(options)[0]);
  assert.ok(!search(options).length, "remove worked");
};

require("test").run(exports);
