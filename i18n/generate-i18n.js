"use strict";

// Makes the script crash on unhandled rejections instead of silently
// ignoring them. In the future, promise rejections that are not handled will
// terminate the Node.js process with a non-zero exit code.
process.on("unhandledRejection", (err) => {
  throw err;
});

const fs = require("fs-extra");
const http = require("http");
const https = require("https");

var client;
var hostname;

const devHostName = "localhost";
const prodHostName = "api.luminoso.tech";

if (process.env.NODE_ENV === "development") {
  client = http;
  hostname = devHostName;
} else {
  client = https;
  hostname = prodHostName;
}

console.log("Fetching translation keys...");

client.get(
  {
    hostname,
    port: process.env.NODE_ENV === "development" ? 5000 : null,
    path: "/sdk/i18n/translations/keys",
    headers: {
      "X-Luminoso-Sdk-Token": `Bearer ${process.env.SDK_KEY}`,
    },
  },
  (res) => {
    var data = "";

    res.on("data", (chunk) => {
      data = data + chunk;
    });

    res.on("end", () => {
      console.log(" Got translation keys,  parsing & generating index.ts...");

      const parsedData = JSON.parse(data);

      var imports = "";
      var keysMap = "";
      var resources = "";

      for (let i = 0; i < parsedData.languageKeys.length; i++) {
        const key = parsedData.languageKeys[i];

        const keyNewLine = i === parsedData.languageKeys.length - 1 ? "" : "\n";
        const resourceNewLine = i === parsedData.languageKeys.length - 1 ? "" : "\n \xa0";

        imports = imports.concat(`import ${key} from "./${key}";${keyNewLine}`);
        resources = resources.concat(`${key},${resourceNewLine}`);
      }

      for (let i = 0; i < parsedData.localizedKeys.length; i++) {
        const key = parsedData.localizedKeys[i];
        const newLine = i === parsedData.localizedKeys.length - 1 ? "" : "\n \xa0";

        keysMap = keysMap.concat(`${key}: string;${newLine}`);
      }

      // eslint-disable-next-line no-loop-func
      const buffer = fs.readFileSync("./node_modules/@luminoso/react-sdk/scripts/i18n-templates/index-template.txt");
      var fileText = buffer.toString();

      fileText = fileText.replace(/{{imports}}/g, imports);
      fileText = fileText.replace(/{{keysMap}}/g, keysMap);
      fileText = fileText.replace(/{{resources}}/g, resources);

      fs.writeFile(`./src/i18n/index.ts`, fileText, (err) => {
        if (err) return console.error(err);
      });
    });

    res.on("error", (e) => {
      console.error("Exception: ", e);
    });
  }
);

console.log("Fetching translations...");

client.get(
  {
    hostname,
    port: process.env.NODE_ENV === "development" ? 5000 : null,
    path: "/sdk/i18n/translations",
    headers: {
      "X-Luminoso-Sdk-Token": `Bearer ${process.env.SDK_KEY}`,
    },
  },
  (res) => {
    var data = "";

    res.on("data", (chunk) => {
      data = data + chunk;
    });

    res.on("end", () => {
      console.log(" Got translations, parsing & generating i18n files...");

      const parsedData = JSON.parse(data);

      for (const language of parsedData.languages) {
        var translationsMap = "";

        for (let i = 0; i < language.phrases.length; i++) {
          const phrase = language.phrases[i];
          const newLine = i === language.phrases.length - 1 ? "" : "\n \xa0 \xa0";
          translationsMap = translationsMap.concat(`${phrase.localizedKey}: "${phrase.value}",${newLine}`);
        }

        // eslint-disable-next-line no-loop-func
        const buffer = fs.readFileSync(
          "./node_modules/@luminoso/react-sdk/scripts/i18n-templates/language-template.txt"
        );
        var languageTemplate = buffer.toString();

        languageTemplate = languageTemplate.replace(/{{key}}/g, language.key);
        languageTemplate = languageTemplate.replace(/{{dataMap}}/g, translationsMap);

        fs.writeFile(`./src/i18n/${language.key}.ts`, languageTemplate, (err) => {
          if (err) return console.error(err);
        });
      }
    });

    res.on("error", (e) => {
      console.error("Exception: ", e);
    });
  }
);
