import random

fp = open("../libvis/libvis_app/static/data/id_frequency_recommend.csv","w")

fp.write("id,frequency,recommend\n")

id = 0

for i in xrange(1,10000):
    id += random.randint(1,100)
    frequency = random.randint(0,50)
    recommand = random.randint(0,20)/20
    fp.write("%d,%d,%d\n"%(id, frequency, recommand))
