import spacy
nlp = spacy.load("pt_core_news_sm")
doc = nlp("Eu quero ir almoçar alguma coisa com a Patrícia")

for ent in doc.ents:
  print(ent.text, ent.start_char, ent.end_char, ent.label_)
