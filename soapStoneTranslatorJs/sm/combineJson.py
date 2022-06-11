import json

with open('tensor0-20.json') as f:
    d1 = json.load(f)
with open('tensor20-40.json') as f:
    d2 = json.load(f)
with open('tensors40-50.json') as f:
    d3 = json.load(f)
with open('tensors50-end.json') as f:
    d4 = json.load(f)
data = d1+d2+d3+d4
print(len(data))




with open('tensors.json', 'w') as outfile:
    json.dump(data, outfile)