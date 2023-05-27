import gzip, shutil
fname = './SMv5-256hashTables.BLB'
src = open(fname, 'rb')
dest = gzip.open(fname+".gz", 'wb', compresslevel=1)

shutil.copyfileobj(src, dest)

src.close()
dest.close()