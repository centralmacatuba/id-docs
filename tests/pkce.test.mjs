import test from "node:test";
import assert from "node:assert/strict";
import { createHash, randomBytes } from "node:crypto";

function createCodeChallenge(verifier) {
  return createHash("sha256").update(verifier, "ascii").digest("base64url");
}

test("PKCE S256 corresponde ao vetor de teste RFC 7636", () => {
  const verifier = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";
  assert.equal(
    createCodeChallenge(verifier),
    "E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM",
  );
});

test("verificadores PKCE gerados têm entropia e formato base64url", () => {
  const verifier = randomBytes(32).toString("base64url");
  assert.match(verifier, /^[A-Za-z0-9_-]{43}$/);
  assert.ok(verifier.length >= 43 && verifier.length <= 128);
  assert.notEqual(createCodeChallenge(verifier), verifier);
});
