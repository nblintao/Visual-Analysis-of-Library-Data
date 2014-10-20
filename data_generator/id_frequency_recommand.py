import random

fp = open("id_frequency_recommand.csv","w")

fp.write("id,frequency,recommand\n")

id = 0

for i in xrange(1,10000):
    id += random.randint(1,100)
    frequency = random.randint(0,50)
    recommand = random.randint(0,20)/20
    fp.write("%d,%d,%d\n"%(id, frequency, recommand))
