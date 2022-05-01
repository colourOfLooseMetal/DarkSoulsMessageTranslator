import json
import numpy as np

numberOfHashtables = 300
hashtableLength = 5
inputArrayDims = 512
projections = []
hashTables = []
for i in range(numberOfHashtables):
    hashTables.append({})
print(hashTables)


# // hashTables[2]["100"] = 10
# // console.log(hashTables[2]["100"])
for i in range(numberOfHashtables):
    projections.append([])
    for j in range(hashtableLength):
        projections[i].append([])

for i in range(numberOfHashtables):
    for j in range(hashtableLength):
        for k in range(inputArrayDims):
            projections[i][j].append(np.random.randn())
print(len(projections))
print(len(projections[1]))
print(len(projections[1][1]))
print(np.dot([2,2,3,4,5],[2,3,4,3,1]))
# input()
print("okayyy")
with open('.\\soapStoneTranslatorJs\\hp\\hpTensors.json') as f:
    tensors = json.load(f)
print("tensors loaded")
# // exportToJsonFile(projections);
u = 0
for i, t in enumerate(tensors):
    if u %100 == 0:
        print(u)
    u +=1
    for j in range(numberOfHashtables):
        hash = '';
        for k in range(hashtableLength):
            if(np.dot(t ,projections[j][k]) >0):
                hash += '1';

            else:
                hash += '0'
        if(hash in hashTables[j]):
            hashTables[j][hash].append(i);
        else:
            hashTables[j][hash] = [i];

fnameAdd = str(numberOfHashtables) + "-" + str(hashtableLength)
with open(fnameAdd+'hpProjections.json', 'w') as outfile:
    json.dump(projections, outfile)
with open(fnameAdd+'hpHashes.json', 'w') as outfile:
    json.dump(hashTables, outfile)