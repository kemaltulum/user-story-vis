import sys
import json
import re
import spacy
from spacy.symbols import nsubj, dobj, pobj, NOUN, VERB

nlp = spacy.load("en_core_web_sm")


def get_verbs_and_nouns(doc):
    verbs = []
    nouns = []
    for token in doc:
        if token.pos == VERB:
            verbs.append(token)
        elif token.pos == NOUN:
            nouns.append(token)
    return verbs, nouns


def get_object(token):
    if token.dep == pobj or token.dep == dobj:
        return token
    else:
        for child in token.children:
            obj = get_object(child)
            if(obj):
                return obj
    return None


def get_object_with_chunk(token, doc):
    obj = get_object(token)
    if not obj:
        return None
    else:
        obj_ = {}
        obj_["text"] = obj.text
        for chunk in doc.noun_chunks:
            if obj.text != chunk.text and obj.text in chunk.text:
                obj_["chunk"] = chunk.text
                break
        return obj_


def tokenize_tag_words(text):
    global nlp
    doc = nlp(text)
    # Do not include I want to phrase
    res = {}
    try:
        verbs, nouns = get_verbs_and_nouns(doc[3:])
        main_verb = verbs[0]

        # Add verb
        res["main_verb"] = main_verb.text

        # Create and add main object
        obj_ = get_object_with_chunk(main_verb, doc)
        res["main_object"] = obj_

        num_verbs = len(verbs)
        if num_verbs > 1 and "and" in text:
            # There might be another action
            sec_verbs = []
            for i in range(1, num_verbs):
                sec_verbs.append(
                    {"verb": verbs[i].text, "object": get_object_with_chunk(verbs[i], doc)})
            res["sec-verbs"] = sec_verbs
    except Exception as error:
        #print(error.args)
        pass
    finally:
        return res


def lower_first_word(sentence):
    words = sentence.split(' ')
    words[0] = words[0].lower()
    return " ".join(words)


user_stories = sys.argv[1: len(sys.argv)]

parsed_stories = []

# As a user, I want to click on the address, so that it takes me to a new tab with Google Maps.

for story in user_stories:
    story = story.strip()
    if not story.endswith('.'):
        story += '.'
    actor = re.search(r'(A|a)s\s*?an?\s*([^,]*)?,', story)
    action = re.search(
        r'[I|i]\s+?(want to|can|would like to)\s*([^,\.]*?)\s*(,|\.|so that)', story)
    benefit = re.search(r'so that\s*(.*)\.$', story)

    parsed_story = {}
    if actor:
        parsed_story["actor"] = actor.group(2)
    if action:
        parsed_story["action"] = action.group(2)
    if benefit:
        parsed_story["benefit"] = benefit.group(1)

    if parsed_story == {}:
        continue

    parsed_story["tokens"] = {}

    element = "action"

    if element in parsed_story:
        action = "I want to " + lower_first_word(parsed_story[element])
        parsed_story["tokens"][element] = tokenize_tag_words(action)

    element = "benefit"

    if element in parsed_story:
        benefit = lower_first_word(parsed_story[element])
        parsed_story["tokens"][element] = tokenize_tag_words(benefit)

    parsed_stories.append(parsed_story)

print(str(json.dumps(parsed_stories)))
sys.stdout.flush()
