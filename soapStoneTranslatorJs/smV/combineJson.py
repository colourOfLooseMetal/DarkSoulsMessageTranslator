import json
import os
import re

def natural_key(string_):
    """See http://www.codinghorror.com/blog/archives/001018.html"""
    return [int(s) if s.isdigit() else s for s in re.split(r'(\d+)', string_)]


folder = "./"
data = []
for file in sorted(os.listdir(folder), key=natural_key):
    # print(file)
    if file.endswith(".json"):
        print(file)
        with open(file) as f:
            singleJsonData = json.load(f)
            for t, tensor in enumerate(singleJsonData):
                # print(tensor)
                for n, num in enumerate(tensor):
                    singleJsonData[t][n] = round(num, 7)
                # print(tensor)
                # input()
            data += singleJsonData
        print("len data ",len(data))
        print("len data[0] ", len(data[0]))
        # input()
print("len data ",len(data))
print("len data[0] ", len(data[0]))

# with open('./tensorsSplit/hpTensors-0-10000.json') as f:
#     d1 = json.load(f)
# with open('./tensorsSplit/hpTensors-10000-20000.json') as f:
#     d2 = json.load(f)
# with open('./tensorsSplit/hpTensors-20000-30000.json') as f:
#     d3 = json.load(f)
# with open('./tensorsSplit/hpTensors-30000-40000.json') as f:
#     d4 = json.load(f)
# with open('./tensorsSplit/hpTensors-40000-50000.json') as f:
#     d5 = json.load(f)
# with open('./tensorsSplit/hpTensors-50000-60000.json') as f:
#     d6 = json.load(f)
# with open('./tensorsSplit/hpTensors-60000-70000.json') as f:
#     d7 = json.load(f)
# with open('./tensorsSplit/hpTensors-70000-80000.json') as f:
#     d8 = json.load(f)
# with open('./tensorsSplit/hpTensors-80000-82956.json') as f:
#     d9 = json.load(f)
# data = d1+d2+d3+d4+d5+d6+d7+d8+d9
# print(len(data))
#
#
#
# #
with open('./smVtensorsCombined.json', 'w') as outfile:
    json.dump(data, outfile)