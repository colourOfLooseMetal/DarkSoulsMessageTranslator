import gzip, shutil
fname = './soapStoneTranslatorJs/er/er5-336projections.BLB'
src = open(fname, 'rb')
dest = gzip.open(fname+".gz", 'wb', compresslevel=1)

shutil.copyfileobj(src, dest)

src.close()
dest.close()