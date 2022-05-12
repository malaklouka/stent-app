(function() {
  const env = "dev";
  const graphDomain = env == "prod" ? "stent.io" : (env == "staging" || env == "dev") ? "staging.stent.io" : "dev.stent.io:5000";
  const apiDomain = env == "prod" ? "stent.io" : (env == "staging" || env == "dev") ? "staging.stent.io" : "dev.stent.io:5010";
  const authDomain = (env == "prod") ? "stent.io" : (env == "staging" || env == "dev") ? "staging.stent.io" : "dev.stent.io:5050";
  const protocol = (env == "prod" || env =="staging" || env == "dev" )  ? "https://" : "http://";
  const useFaker = false;

  let locale = "en-US";
  if (window.navigator && window.navigator.languages && window.navigator.languages.length > 0) {
    locale = window.navigator.languages[0];
  }

  window["stent"] = {
    version: {
      release: "<release>",
      build: "<build>"
    },
    locale: locale,
    log: env == "prod" ? false : true,
    authentication: {
      client: "Eg3icS4Vj1r6zr4rDFenOh4BOV6YBEzlCstKbDIAKisAMCL1GGZBRuJ5+0E27nzH",
      supportBearer: protocol + "auth." + authDomain + "/zendesk/chat/auth",
      loginUrl: protocol + "auth." + authDomain + "/login"
    },
    api: {
      graphQL: protocol + "graph." + graphDomain + "/graphql",
      rest: protocol + "graph." + graphDomain + "/rest/v1",
      api: (useFaker && env === "dev") ? "http://localhost:9002/graphql" : protocol + "api." + apiDomain,
      auth: protocol + "auth." + authDomain
    },
    tenant: {
      key: "",
      name: "",
      timezone: ""
    },
    identity: {
      lastName: "",
      firstName: "",
      email: "",
      id: ""
    },
    env: (env == "prod" || env == "staging") ? "prod" : "dev",
    breakpoints: {
      sentimentAnalysis: 0.5
    }
  };
})();
