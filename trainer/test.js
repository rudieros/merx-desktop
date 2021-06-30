const { dockStart } = require('@nlpjs/basic');
const { NlpManager, Language } = require('node-nlp');
const fs = require('fs');

(async () => {
  const nlp = new NlpManager({ languages: ['pt'], forceNER: true, ner: { threshold: 1, builtins: [] } });
  nlp.addLanguage('pt');

  const one = Date.now();
  await nlp.load();
  const two = Date.now();
  console.log(`Lodaded model in ${(two - one) / 1000} seconds`);

  const response = await nlp.process(
    'pt',
    'Olá boa tarde, gostaria de marcar uma consulta pra amanhã, meu nome é Caio Simões'
  );

  console.log(JSON.stringify(response, null, 2));
  console.log(`Processed phrase in ${(Date.now() - two) / 1000} seconds`);
})();
