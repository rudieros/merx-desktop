const { dockStart } = require('@nlpjs/basic');
const { NlpManager, Language } = require('node-nlp');
const fs = require('fs');

const fileExtension = '.txt';
const utteranceFiles = fs.readdirSync(`${__dirname}/utterances`);
const customEntityFiles = fs.readdirSync(`${__dirname}/custom_entities`);

let utteranceIntentMap = utteranceFiles.reduce((acc, curr) => {
  const intent = curr.replace(fileExtension, '');
  const utterances = fs
    .readFileSync(`${__dirname}/utterances/${curr}`)
    .toString();
  return {
    ...acc,
    [intent]: utterances.split('\n').filter((s) => !!s),
  };
}, {});

const entityMap = customEntityFiles.reduce((acc, curr) => {
  const entity = curr.replace(fileExtension, '');
  const utterances = fs
    .readFileSync(`${__dirname}/custom_entities/${curr}`)
    .toString();
  return {
    ...acc,
    [entity]: utterances.split('\n').filter((s) => !!s),
  };
}, {});

(async () => {
  const nlp = new NlpManager({ languages: ['pt'], forceNER: true });
  nlp.addLanguage('pt');

  await nlp.load();

  const response = await nlp.process(
    'pt',
    'gostaria de marcar uma consulta para depois de amanhã de manhã as 10h com a Patricia'
  );
  console.log(JSON.stringify(response, null, 2));
})();
