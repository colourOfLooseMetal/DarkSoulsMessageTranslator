import tensorflow_hub as hub
import tensorflow as tf
import numpy as np
import sys
import json
embed = hub.load("./universal-sentence-encoder_4")
# embeddings = embed([
#     "The quick brown fox jumps over the lazy dog.",#
#     "I am a sentence for which I would like to get its embedding"])
#
# print(embeddings)

# Creatures = [
#     'enemy', 'monster', 'mob enemy', 'tough enemy', 'critical foe', 'Hollow', 'pilgrim', 'prisoner', 'monstrosity', 'skeleton', 'ghost', 'beast', 'lizard', 'bug', 'grub', 'crab', 'dwarf', 'giant', 'demon', 'dragon', 'knight', 'sellword', 'warrior', 'herald', 'bandit', 'assassin', 'sorcerer', 'pyromancer', 'cleric', 'deprived', 'sniper', 'duo', 'trio', 'you', 'you bastard', 'good fellow', 'saint', 'wretch', 'charmer', 'poor soul', 'oddball', 'nimble one', 'laggard', 'moneybags', 'beggar', 'miscreant', 'liar', 'fatty', 'beanpole', 'youth', 'elder', 'old codger', 'old dear', 'merchant', 'artisan', 'master', 'sage', 'champion', 'Lord of Cinder', 'king', 'queen', 'prince', 'princess', 'angel', 'god', 'friend', 'ally', 'spouse', 'covenantor', 'Phantom', 'Dark Spirit']
# Objects = [
#     'bonfire', 'ember', 'fog wall', 'lever', 'contraption', 'key', 'trap', 'torch', 'door', 'treasure', 'chest', 'something', 'quite something', 'rubbish', 'filth', 'weapon', 'shield', 'projectile', 'armor', 'item', 'ring', 'ore', 'coal', 'transposing kiln', 'scroll', 'umbral ash', 'throne', 'rite', 'coffin', 'cinder', 'ash', 'moon', 'eye', 'brew', 'soup', 'message', 'bloodstain', 'illusion'
# ]
# Techniques = [
#     'close-ranged battle', 'ranged battle', 'eliminating one at a Time', 'luring it out', 'beating to a pulp', 'ambush', 'pincer attack', 'hitting them in one swoop', 'duel-wielding', 'stealth', 'mimicry', 'fleeing', 'charging', 'jumping off', 'dashing through', 'circling around', 'trapping inside', 'rescue', 'Skill', 'sorcery', 'pyromancy', 'miracles', 'pure luck', 'prudence', 'brief respite', 'play dead'
# ]
# Actions = [
#     'jog', 'dash', 'rolling', 'backstepping', 'jumping', 'attacking', 'jump attack', 'dash attack', 'counter attack', 'stabbing in the back', 'guard stun & stab', 'plunging attack', 'shield breaking', 'blocking', 'parrying', 'locking-on', 'no lock-on', 'two-handing', 'gesture', 'control', 'destroy'
# ]
# Geography = [
#     'boulder', 'lava', 'poison gas', 'enemy horde', 'forest', 'swamp', 'cave', 'shortcut', 'detour', 'hidden path', 'secret passage', 'dead end', 'labyrinth', 'hole', 'bright spot', 'dark spot', 'open area', 'tight spot', 'safe zone', 'danger zone', 'sniper spot', 'hiding place', 'illusory wall', 'ladder', 'lift', 'gorgeous view', 'looking away', 'overconfidence', 'slip-up', 'oversight', 'fatigue', 'bad luck', 'inattention', 'loss of stamina', 'chance encounter', 'planned encounter'
# ]
# Orientation = [
#     'front', 'back', 'left', 'right', 'up', 'down', 'below', 'above', 'behind'
# ]
# BodyParts = [
#     'head', 'neck', 'stomach', 'back', 'armor', 'finger', 'leg', 'rear', 'tail', 'wings', 'anywhere', 'tongue', 'right arm', 'left arm', 'thumb', 'indexfinger', 'longfinger', 'ringfinger', 'smallfinger', 'right leg', 'left leg', 'right side', 'left side', 'pincer', 'wheel', 'core', 'mount'
# ]
# Attribute = [
#     'regular', 'strike', 'thrust', 'slash', 'magic', 'crystal', 'fire', 'chaos', 'lightning', 'blessing', 'dark', 'critical hits', 'bleeding', 'poison', 'toxic', 'frost', 'curse', 'equipment breakage'
# ]
# Concepts = [
#     'chance', 'quagmire', 'hint', 'secret', 'sleeptalk', 'happiness', 'misfortune', 'life', 'death', 'demise', 'joy', 'fury', 'agony', 'sadness', 'tears', 'loyalty', 'betrayal', 'hope', 'despair', 'fear', 'losing sanity', 'victory', 'defeat', 'sacrifice', 'light', 'dark', 'bravery', 'confidence', 'vigor', 'revenge', 'resignation', 'overwhelming', 'regret', 'pointless', 'man', 'woman', 'friendship', 'love', 'recklessness', 'composure', 'guts', 'comfort', 'silence', 'deep', 'dregs',]
# Musings = [
#     'good luck', 'fine work', 'I did it!', 'I\'ve failed...', 'here!', 'not here!', 'I can\'t take this...', 'lonely...', 'don\'t you dare!', 'do it!', 'look carefully', 'listen carefully', 'think carefully', 'this place again?', 'now the real fight begins', 'you don\'t deserve this', 'keep moving', 'pull back', 'give it up', 'don\'t give up', 'help me...', 'impossible...', 'bloody expensive...', 'let me out of here...', 'stay calm', 'like a dream...', 'seems familiar...', 'are you ready?', 'it\'ll happen to you too', 'praise the Sun!', 'may the flames guide thee',]


CONJUNCTIONS = [
    'and then', 'therefore', 'in short', 'or', 'only', 'by the way', 'so to speak', 'all the more', ', ']

TEMPLATES = [
    '**** ahead', 'No **** ahead', '**** required ahead', 'be wary of ****', 'try ****', 'Could this be a ****?', 'If only I had a ****...', 'visions of ****...', 'Time for ****', '****', '****!', '****?', '****...', 'Huh. It\'s a ****...', 'praise the ****!', 'Let there be ****', 'Ahh, ****...'
]
WORDS = [
'enemy', 'monster', 'mob enemy', 'tough enemy', 'critical foe', 'Hollow', 'pilgrim', 'prisoner', 'monstrosity', 'skeleton', 'ghost', 'beast', 'lizard', 'bug', 'grub', 'crab', 'dwarf', 'giant', 'demon', 'dragon', 'knight', 'sellword', 'warrior', 'herald', 'bandit', 'assassin', 'sorcerer', 'pyromancer', 'cleric', 'deprived', 'sniper', 'duo', 'trio', 'you', 'you bastard', 'good fellow', 'saint', 'wretch', 'charmer', 'poor soul', 'oddball', 'nimble one', 'laggard', 'moneybags', 'beggar', 'miscreant', 'liar', 'fatty', 'beanpole', 'youth', 'elder', 'old codger', 'old dear', 'merchant', 'artisan', 'master', 'sage', 'champion', 'Lord of Cinder', 'king', 'queen', 'prince', 'princess', 'angel', 'god', 'friend', 'ally', 'spouse', 'covenantor', 'Phantom', 'Dark Spirit',
'bonfire', 'ember', 'fog wall', 'lever', 'contraption', 'key', 'trap', 'torch', 'door', 'treasure', 'chest', 'something', 'quite something', 'rubbish', 'filth', 'weapon', 'shield', 'projectile', 'armor', 'item', 'ring', 'ore', 'coal', 'transposing kiln', 'scroll', 'umbral ash', 'throne', 'rite', 'coffin', 'cinder', 'ash', 'moon', 'eye', 'brew', 'soup', 'message', 'bloodstain', 'illusion',
'close-ranged battle', 'ranged battle', 'eliminating one at a Time', 'luring it out', 'beating to a pulp', 'ambush', 'pincer attack', 'hitting them in one swoop', 'duel-wielding', 'stealth', 'mimicry', 'fleeing', 'charging', 'jumping off', 'dashing through', 'circling around', 'trapping inside', 'rescue', 'Skill', 'sorcery', 'pyromancy', 'miracles', 'pure luck', 'prudence', 'brief respite', 'play dead',
'jog', 'dash', 'rolling', 'backstepping', 'jumping', 'attacking', 'jump attack', 'dash attack', 'counter attack', 'stabbing in the back', 'guard stun & stab', 'plunging attack', 'shield breaking', 'blocking', 'parrying', 'locking-on', 'no lock-on', 'two-handing', 'gesture', 'control', 'destroy',
'boulder', 'lava', 'poison gas', 'enemy horde', 'forest', 'swamp', 'cave', 'shortcut', 'detour', 'hidden path', 'secret passage', 'dead end', 'labyrinth', 'hole', 'bright spot', 'dark spot', 'open area', 'tight spot', 'safe zone', 'danger zone', 'sniper spot', 'hiding place', 'illusory wall', 'ladder', 'lift', 'gorgeous view', 'looking away', 'overconfidence', 'slip-up', 'oversight', 'fatigue', 'bad luck', 'inattention', 'loss of stamina', 'chance encounter', 'planned encounter',
'front', 'back', 'left', 'right', 'up', 'down', 'below', 'above', 'behind',
    'head', 'neck', 'stomach', 'back', 'armor', 'finger', 'leg', 'rear', 'tail', 'wings', 'anywhere', 'tongue',
    'right arm', 'left arm', 'thumb', 'indexfinger', 'longfinger', 'ringfinger', 'smallfinger', 'right leg', 'left leg',
    'right side', 'left side', 'pincer', 'wheel', 'core', 'mount',
    'regular', 'strike', 'thrust', 'slash', 'magic', 'crystal', 'fire', 'chaos', 'lightning', 'blessing', 'dark',
    'critical hits', 'bleeding', 'poison', 'toxic', 'frost', 'curse', 'equipment breakage',
'chance', 'quagmire', 'hint', 'secret', 'sleeptalk', 'happiness', 'misfortune', 'life', 'death', 'demise', 'joy', 'fury', 'agony', 'sadness', 'tears', 'loyalty', 'betrayal', 'hope', 'despair', 'fear', 'losing sanity', 'victory', 'defeat', 'sacrifice', 'light', 'dark', 'bravery', 'confidence', 'vigor', 'revenge', 'resignation', 'overwhelming', 'regret', 'pointless', 'man', 'woman', 'friendship', 'love', 'recklessness', 'composure', 'guts', 'comfort', 'silence', 'deep', 'dregs',
'good luck', 'fine work', 'I did it!', 'I\'ve failed...', 'here!', 'not here!', 'I can\'t take this...', 'lonely...', 'don\'t you dare!', 'do it!', 'look carefully', 'listen carefully', 'think carefully', 'this place again?', 'now the real fight begins', 'you don\'t deserve this', 'keep moving', 'pull back', 'give it up', 'don\'t give up', 'help me...', 'impossible...', 'bloody expensive...', 'let me out of here...', 'stay calm', 'like a dream...', 'seems familiar...', 'are you ready?', 'it\'ll happen to you too', 'praise the Sun!', 'may the flames guide thee'
]



sentences = []
for template in TEMPLATES:
    for word in WORDS:
        sent = template.replace("****", word)
        sentences.append(sent)
print("sentencesSize",sys.getsizeof(sentences))
print(len(sentences))
# twoSentences = []
# twoSentences.append(sentences[:])
# for conj in CONJUNCTIONS:
#     for sent1 in sentences:
#         for sent2 in sentences:
#             dubSent = sent1+conj+sent2
#             twoSentences.append(dubSent)
# print(len(twoSentences))


soapStoneMessages = embed(sentences)
test_text = "excellent sword"
test_embed = embed([test_text])

scores = []
for i, ssMessage in enumerate(soapStoneMessages):
    scores.append(np.inner(test_embed, ssMessage))
Z = [x for _,x in sorted(zip(scores,sentences))]
# scores.sort()
# scores.reverse()
res = Z[-100:]
# print(scores)
print(res)
# print(soapStoneMessages[0:10])
# with open('dsStatements.json', 'w') as outfile:
#     json.dump(sentences, outfile)
tensorsToList = []
for tensor in soapStoneMessages:
    tensorsToList.append(tensor.numpy().tolist())
with open('dsTensors.json', 'w') as outfile:
    json.dump(tensorsToList, outfile)

# greets = ["What's up?", 'It is a pleasure to meet you.', 'How do you do?', 'Top of the morning to you!', 'Hi', 'How are you doing?', 'Hello', 'Greetings!', 'Hi, How is it going?', 'Hi, nice to meet you.', 'Nice to meet you.']
#
# greet_matrix = embed(greets)
# test_text = "Hey, how are you?"
# test_embed = embed([test_text])
# np.inner(test_embed, greet_matrix)
# sim_matrix = np.inner(test_embed, greet_matrix)
# if sim_matrix.max() > 0.8:
#     print("it is a greetings")
# else:
#     print("it is not a greetings")


# print(greet_matrix)
# print(test_embed)
# for i, greeting in enumerate(greet_matrix):
#     print(greets[i], np.inner(test_embed, greeting))

