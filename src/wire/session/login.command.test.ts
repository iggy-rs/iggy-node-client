
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { LOGIN } from './login.command.js';

describe("Login Command", () => {

  // @warn use ascii char to keep char.length === byteLength
  const login = 'iggyYolo';
  const password = 'unitTestSeCret';

  it("serialize credentials into a buffer", () => {
    assert.deepEqual(
      LOGIN.serialize(login, password).length,
      2 + login.length + password.length
    );
  });

  it("throw on empty login", () => {
    assert.throws(
      () => LOGIN.serialize("", password)
    );
  });

  it("throw on empty password", () => {
    assert.throws(
      () => LOGIN.serialize(login, "")
    );
  });

  it("throw on login > 255 bytes", () => {
    assert.throws(
      () => LOGIN.serialize("YoLo".repeat(65), password)
    );
  });

  it("throw on login > 255 bytes - utf8 version", () => {
    assert.throws(
      () => LOGIN.serialize("¥Ø£Ø".repeat(33), password)
    );
  });

  it("throw on password > 255 bytes - utf8 version", () => {
    assert.throws(
      () => LOGIN.serialize(login, "¥Ø£Ø".repeat(33))
    );
  });

});
