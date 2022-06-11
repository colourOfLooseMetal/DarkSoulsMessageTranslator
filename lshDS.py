import random

import numpy as np
import json


class HashTable:
    def __init__(self, hash_size, inp_dimensions):
        self.hash_size = hash_size
        self.inp_dimensions = inp_dimensions
        self.hash_table = dict()
        self.projections = np.random.randn(self.hash_size, inp_dimensions)

    def generate_hash(self, inp_vector):
        bools = (np.dot(inp_vector, self.projections.T) > 0).astype('int')
        # print(self.projections[0])
        # print(self.projections[0].T)
        # input()
        return ''.join(bools.astype('str'))

    def __setitem__(self, inp_vec, label):
        hash_value = self.generate_hash(inp_vec)
        # print(hash_value)
        self.hash_table[hash_value] = self.hash_table \
                                          .get(hash_value, list()) + [label]

    def __getitem__(self, inp_vec):
        hash_value = self.generate_hash(inp_vec)
        return self.hash_table.get(hash_value, [])


# hash_table = HashTable(hash_size=4, inp_dimensions=521)

class LSH:
    def __init__(self, num_tables, hash_size, inp_dimensions):
        self.num_tables = num_tables
        self.hash_size = hash_size
        self.inp_dimensions = inp_dimensions
        self.hash_tables = list()
        for i in range(self.num_tables):
            self.hash_tables.append(HashTable(self.hash_size, self.inp_dimensions))

    def __setitem__(self, inp_vec, label):
        for table in self.hash_tables:
            table[inp_vec] = label

    def __getitem__(self, inp_vec):
        results = list()
        for table in self.hash_tables:
            results.extend(table[inp_vec])
        return list(set(results))


with open('dsTensors.json') as f:
    dsTensors = json.load(f)
with open('dsStatements.json') as f:
    sentences = json.load(f)
lsh = LSH(50,5,512)

for i, tensor in enumerate(dsTensors):
    lsh[tensor] = i
for i in range(10):
    e = random.randrange(0,len(dsTensors))
    print(e,sentences[e],lsh[dsTensors[e]])
    for index in lsh[dsTensors[e]]:
        print(sentences[index])

# print(lsh[dsTensors[0]])
# print(lsh[dsTensors[1]])
# print(lsh[dsTensors[2]])
# print(lsh[dsTensors[3]])
# print(lsh[dsTensors[4]])
# print(lsh[dsTensors[220]])

# print(lsh[])
