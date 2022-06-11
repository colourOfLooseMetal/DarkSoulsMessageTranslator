
import json

import nltk
nltk.download('punkt')
tokenizer = nltk.data.load('tokenizers/punkt/english.pickle')

# allSentences = []
# chapterAndBookIndices = {}
#
# for i in range(1,8):
#     print(i)
#     fp = open(str(i)+".txt")
#     data = fp.read()
#     # print('\n-----\n'.join(tokenizer.tokenize(data)))
#     sentences = tokenizer.tokenize(data)
#     allSentences.extend(sentences)
#     chapterAndBookIndices[str(i)] = len(allSentences)
#
# print(len(allSentences))#82757 for harry potter
# with open('hpSentences.json', 'w') as outfile:
#     json.dump(allSentences, outfile)
# with open('hpChapterIndices.json', 'w') as outfile:
#     json.dump(chapterAndBookIndices, outfile)







# with open('hpSentences.json') as f:
#     allSentences = json.load(f)
# with open('hpChapterIndices.json') as f:
#     chapterAndBookIndices = json.load(f)
# newAllSentences = []
# for sentence in allSentences:
#     if (sentence[0:8] == "Chapter "):
#         print(sentence)
#         e = (sentence.split("\n"))
#         print("++++++")
#         print(e[0:2])
#         print("++++++")
#         print(e[2:])
#         newAllSentences.append(' '.join(e[0:2]))
#         newAllSentences.append(' '.join(e[2:]))
#     else:
#         newAllSentences.append(sentence)
# for sentence in newAllSentences:
#     if (sentence[0:8] == "Chapter "):
#         print(sentence)
# with open('hpSentencesFixed.json', 'w') as outfile:
#     json.dump(newAllSentences, outfile)







with open('hpSentencesFixed.json') as f:
    allSentences = json.load(f)
chapterAndBookIndices = {}
chapIterCheck = 0
bookIter = 1

for i, sentence in enumerate(allSentences):
    if (sentence[0:8] == "Chapter "):
        chapIterCheck += 1
        # print(sentence.split(' ')[1])
        e = (sentence.split(' ')[1])
        print(e)
        # print(sentence)
        if (int(e) != chapIterCheck):
            print("NEWBOOK")
            bookIter += 1
            chapIterCheck = 1
        print(i, " ", bookIter, "-", chapIterCheck)
        chapterAndBookIndices[i] = str(bookIter) +"-"+str(chapIterCheck)


for key in chapterAndBookIndices:
    print(chapterAndBookIndices[key])
    print(allSentences[key])

with open('hpChapterIndices.json', 'w') as outfile:
    json.dump(chapterAndBookIndices, outfile)