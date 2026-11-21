const issuer = new URL(process.env.CM_ID_ISSUER ?? "https://id.centralmacatuba.qzz.io");
const resources = [
  {
    name: "OpenID Connect Discovery",
    path: "/.well-known/openid-configuration",
    required: ["issuer", "authorization_endpoint", "token_endpoint", "jwks_uri"],
  },
  {
    name: "OAuth Authorization Server Metadata",
    path: "/.well-known/oauth-authorization-server",
    required: ["issuer", "authorization_endpoint", "token_endpoint"],
  },
];

if (issuer.protocol !== "https:") {
  throw new Error("O issuer deve utilizar HTTPS.");
}

let failed = false;

for (const resource of resources) {
  const url = new URL(resource.path, issuer);
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(12_000) });
    if (!response.ok) throw new Error("HTTP " + response.status);

    const metadata = await response.json();
    for (const field of resource.required) {
      if (typeof metadata[field] !== "string" || metadata[field].length === 0) {
        throw new Error("Campo obrigatório ausente ou inválido: " + field);
      }
    }

    if (metadata.issuer !== issuer.href.replace(/\/$/, "")) {
      throw new Error("Issuer inesperado: " + metadata.issuer);
    }

    for (const field of ["authorization_endpoint", "token_endpoint", "jwks_uri", "userinfo_endpoint", "revocation_endpoint", "introspection_endpoint"]) {
      if (metadata[field] && new URL(metadata[field]).protocol !== "https:") {
        throw new Error(field + " não utiliza HTTPS.");
      }
    }

    if (!Array.isArray(metadata.response_types_supported) || !metadata.response_types_supported.includes("code")) {
      throw new Error("Os metadados não anunciam o response type code.");
    }

    if (!Array.isArray(metadata.code_challenge_methods_supported) || !metadata.code_challenge_methods_supported.includes("S256")) {
      throw new Error("Os metadados não anunciam PKCE S256.");
    }

    process.stdout.write("OK — " + resource.name + ": " + url.href + "\n");
  } catch (error) {
    failed = true;
    process.stderr.write("FALHA — " + resource.name + ": " + error.message + "\n");
  }
}

if (failed) process.exitCode = 1;
