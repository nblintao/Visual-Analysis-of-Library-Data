import random

fp = open("../libvis/libvis_app/static/data/id_frequency_recommend.csv","w")

fp.write("id,frequency,recommend\n")

id = 0

for i in xrange(1,150):
    id += random.randint(1,100)
    frequency = random.randint(0,50)
    # recommend = random.randint(0,20)/20
    if (frequency * random.random())>30:
        recommend = 1
    else:
        recommend = 0
    fp.write("%d,%d,%d\n"%(id, frequency, recommend))
