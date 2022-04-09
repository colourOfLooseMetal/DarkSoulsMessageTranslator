import json

with open('696-3smHashes.json') as f:
    hashTables = json.load(f)

i=0
l = 0
for table in hashTables:
    for key in table:
        l += len(table[key])
        i += 1
l = l/i
print(l)
