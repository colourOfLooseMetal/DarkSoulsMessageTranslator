import json

with open('./tensorsSplit/hpTensors-0-10000.json') as f:
    d1 = json.load(f)
with open('./tensorsSplit/hpTensors-10000-20000.json') as f:
    d2 = json.load(f)
with open('./tensorsSplit/hpTensors-20000-30000.json') as f:
    d3 = json.load(f)
with open('./tensorsSplit/hpTensors-30000-40000.json') as f:
    d4 = json.load(f)
with open('./tensorsSplit/hpTensors-40000-50000.json') as f:
    d5 = json.load(f)
with open('./tensorsSplit/hpTensors-50000-60000.json') as f:
    d6 = json.load(f)
with open('./tensorsSplit/hpTensors-60000-70000.json') as f:
    d7 = json.load(f)
with open('./tensorsSplit/hpTensors-70000-80000.json') as f:
    d8 = json.load(f)
with open('./tensorsSplit/hpTensors-80000-82956.json') as f:
    d9 = json.load(f)
data = d1+d2+d3+d4+d5+d6+d7+d8+d9
print(len(data))




with open('hpTensors.json', 'w') as outfile:
    json.dump(data, outfile)