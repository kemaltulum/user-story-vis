import sys, json, re
import nltk

def tokenize_tag_words(text):
    tokens = nltk.word_tokenize(text)
    tags = nltk.pos_tag(tokens)
    return list(map(lambda tag: [tag[0], tag[1]], tags))


user_stories = sys.argv[1: len(sys.argv)]

parsed_stories = []

# As a user, I want to click on the address, so that it takes me to a new tab with Google Maps.

for story in user_stories:
    story = story.strip()
    if not story.endswith('.'):
        story += '.'
    actor = re.search(r'(A|a)s\s*?an?\s*([^,]*)?,', story)
    action = re.search(r'[I|i]\s+?(want to|can|would like to)\s*([^,\.]*?)\s*(,|\.|so that)', story)
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

    element = "actor"

    if element in parsed_story:
        parsed_story["tokens"][element] = tokenize_tag_words(parsed_story[element])
    
    element = "action"

    if element in parsed_story:
        parsed_story["tokens"][element] = tokenize_tag_words(parsed_story[element])
    
    element = "benefit"

    if element in parsed_story:
        parsed_story["tokens"][element] = tokenize_tag_words(parsed_story[element])
    
    parsed_stories.append(parsed_story)

print(str(json.dumps(parsed_stories)))
sys.stdout.flush()
