import json


enemies = [
    'enemy', 'weak foe', 'strong foe', 'monster', 'dragon', 'boss', 'sentry', 'group', 'pack', 'decoy', 'undead', 'soldier', 'knight', 'cavalier', 'archer', 'sniper', 'mage', 'ordnance', 'monarch', 'lord', 'demi-human', 'outsider', 'giant', 'horse', 'dog', 'wolf', 'rat', 'beast', 'bird', 'raptor', 'snake', 'crab', 'prawn', 'octopus', 'bug', 'scarab', 'slug', 'wraith', 'skeleton', 'monstrosity', 'ill-omened creature'
]
people = [
    'Tarnished', 'warrior', 'swordfighter', 'knight', 'samurai', 'sorcerer', 'cleric', 'sage', 'merchant', 'teacher', 'master', 'friend', 'lover', 'old dear', 'old codger', 'angel', 'fat coinpurse', 'pauper', 'good sort', 'wicked sort', 'plump sort', 'skinny sort', 'lovable sort', 'pathetic sort', 'strange sort', 'numble sort', 'laggardly sort', 'invisible sort', 'unfathomable sort', 'giant sort', 'sinner', 'thief', 'liar', 'dastard', 'traitor', 'pair', 'trio', 'noble', 'aristocrat', 'hero', 'champion', 'monarch', 'lord', 'god'
]
things = [
    'item', 'necessary item', 'precious item', 'something', 'something incredible', 'treasure chest', 'corpse', 'coffin', 'trap', 'armament', 'shield', 'bow', 'projectile weapon', 'armor', 'talisman', 'skill', 'sorcery', 'incantation', 'mao', 'material', 'flower', 'grass', 'tree', 'fruit', 'seed', 'mushroom', 'tear', 'crystal', 'butterfly', 'bug', 'dung', 'grace', 'door', 'key', 'ladder', 'lever', 'lift', 'spiritspring', 'sending gate', 'stone astrolabe', 'Birdseye Telescope', 'message', 'bloodstain', 'Erdtree', 'Elden Ring'
]
battleTactics = [
    'close-quarters battle', 'ranged battle', 'horseback battle', 'luring out', 'defeating one-by-one', 'taking on all at once', 'rushing in', 'stealth', 'mimicry', 'confusion', 'pursuit', 'fleeing', 'summoning', 'circling around', 'jumping off', 'dashing through', 'brief respite'
]
actions = [
    'attacking', 'jump attack', 'running attack', 'critical hit', 'two-handing', 'blocking', 'parrying', 'guard counter', 'sorcery', 'incantation', 'skill', 'summoning', 'throwing', 'healing', 'running', 'rolling', 'backstepping', 'jumping', 'crouching', 'target lock', 'item crafting', 'gesturing'
]
situations = [
    'morning', 'noon', 'evening', 'night', 'clear sky', 'overcast', 'rain', 'storm', 'mist', 'snow', 'patrolling', 'procession', 'crowd', 'surprise attack', 'ambush', 'pincer attack', 'beating to a pulp', 'battle', 'reinforcements', 'ritual', 'explosion', 'high spot', 'defensible spot', 'climbable spot', 'bright spot', 'dark spot', 'open area', 'cramped area', 'hiding place', 'sniping spot', 'recon spot', 'safety', 'danger', 'gorgeous view', 'detour', 'hidden path', 'secret passage', 'shortcut', 'dead end', 'looking away', 'unnoticed', 'out of stamina'
]
places = [
    'high road', 'checkpoint', 'bridge', 'castle', 'fort', 'city', 'ruins', 'church', 'tower', 'camp site', 'house', 'cemetery', 'underground tomb', 'tunnel', 'cave', 'evergaol', 'great tree', 'cellar', 'surface', 'underground', 'forest', 'river', 'lake', 'bog', 'mountain', 'valley', 'cliff', 'waterside', 'nest', 'hole'
]
directions = [
    'east', 'west', 'south', 'north', 'ahead', 'behind', 'left', 'right', 'center', 'up', 'down', 'edge'
]
bodyParts = [
    'head', 'stomach', 'back', 'arms', 'legs', 'rump', 'tail', 'core', 'fingers'
]
affinities = [
    'physical', 'standard', 'striking', 'slashing', 'piercing', 'fire', 'lightning', 'magic', 'holy', 'poison', 'toxic', 'scarlet rot', 'blood loss', 'frost', 'sleep', 'madness', 'death'
]
concepts = [
    'life', 'Death', 'light', 'dark', 'stars', 'fire', 'Order', 'chaos', 'joy', 'wrath', 'suffering', 'sadness', 'comfort', 'bliss', 'misfortune', 'good fortune', 'bad luck', 'hope', 'despair', 'victory', 'defeat', 'research', 'faith', 'abundance', 'rot', 'loyalty', 'injustice', 'secret', 'opportunity', 'pickle', 'clue', 'friendship', 'love', 'bravery', 'vigor', 'fortitude', 'confidence', 'distracted', 'unguarded', 'introspection', 'regret', 'resignation', 'futility', 'on the brink', 'betrayal', 'revenge', 'destruction', 'recklessness', 'calmness', 'vigilance', 'tranquility', 'sound', 'tears', 'sleep', 'depths', 'dregs', 'fear', 'sacrifice', 'ruin'
]
phrases = [
'good luck', 'look carefully', 'listen carefully', 'think carefully', 'well done', 'I did it!', 'I\'ve failed...', 'here!', 'not here!', 'don\'t you dare!', 'do it!', 'I can\'t take this...', 'don\'t think', 'so lonely...', 'here again...', 'just getting started', 'stay calm', 'keep moving', 'turn back', 'give up', 'don\'t give up', 'help me...', 'I don\'t believe it...', 'too high up', 'I want to go home...', 'it\'s like a dream...', 'seems familiar...', 'beautiful...', 'you don\'t have the right', 'are you ready?'
]

conjunctions = [
    ' and then ', ' or ', ' but ', ' therefore ', ' in short ', ' except ', ' by the way ', ' so to speak ', ' all the more ', ', '
]

templates = [
'**** ahead', 'Likely ****', 'If only I had a ****...', '****, O ****', 'Ahh, ****...', 'No **** ahead', 'First off, ****', 'Didn\'t expect ****...', 'Behold, ****!', '****', '**** required ahead', 'Seek ****', 'Visions of ****...', 'Offer ****', '****!', 'Be wary of ****', 'Still no ****...', 'Could this be a ****?', 'Praise the ****', '****?', 'Try ****', 'Why is it always ****?', 'Time for ****', 'Let there be ****', '****...'
]


words = enemies + people + things + battleTactics + actions + situations + places + directions + bodyParts + affinities + concepts + phrases
# print(len(words))

sentences = []
for template in templates:
    for word in words:
        sent = template.replace("****", word)
        sentences.append(sent)

print(len(sentences))

#so many :/
# twoSentences = []
# twoSentences.append(sentences[:])
# for conj in conjunctions:
#     for sent1 in sentences:
#         for sent2 in sentences:
#             dubSent = sent1+conj+sent2
#             twoSentences.append(dubSent)
# print(len(twoSentences))

# with open('erDubSentences.json', 'w') as outfile:
#     json.dump(twoSentences, outfile)

with open('erSentences.json', 'w') as outfile:
    json.dump(sentences, outfile)

