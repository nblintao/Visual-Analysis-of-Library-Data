# coding=utf-8
import random
import json

fp = open("../libvis/libvis_app/static/data/force.json","w")


title = [
"中国金融热点问题研究报告",
"索罗斯旋风 :历史上最伟大金融家的生平与投资秘诀",
"大学英语(泛读) 难点译句解析与课文翻译 :第1-4册",
"Financial market rates and flows = 金融市场利率与流量/",
"Third International Conference on Intelligent Materials : /",
"货币金融学 :第四版",
"Random House Webster's dictionary of American English /",
"西方文化艺术巡礼",
"Director 6.5 快餐",
"证券交易指南",
"风流老顽童",
"实用美学",
"国际贸易与国际投资中的利益分配",
"The Oxford study thesaurus",
"Dictionary of classical mythology",
"Open systems interconnection handbook",
"安全经济学导论",
"A textbook of entomology",
"英语入门",
"一九九零年围棋名局细解",
"The writing reader :short essays for composition",
"The rebirth of history :eastern Europe in the age of democracy",
"A short guide to writing about art",
"市场机制与经济效率",
"解开汉字之谜, 索引",
"背影"
]

call_no = [
"F832/Z3",
"K837.125.3/S6.2",
"H31/Z19-2",
"F830.9/LV1-5",
"TN-532/LS1/2779",
"F820/M3",
"H316/LR1",
"J500.9/Z1",
"TP391.4/M10.10",
"F832.5/862",
"I247.4/639",
"B83/561",
"F014.4/238",
"H313-61/O98/#",
"I17-61/D554/#",
"TP3/M126",
"F069/612",
"Q96/R824-3",
"H319.9/419",
"G891.3/439.12",
"H315/R217",
"D507/G558",
"H315/B261-3",
"F120.2/386",
"H136/BA1-2/f",
"I266/707.01"
]

nodes = []
for i in xrange(0,len(title)):
    book={}
    book['name'] = title[i]
    book['group'] = ord(call_no[i][0])
    nodes.append(book)
output = {}
output['nodes'] = nodes


links = []
for x in xrange(0,len(title)):
    for y in xrange(0,x):
        if call_no[x][0] == call_no[y][0]:
            value = random.randint(0,3)
            # print call_no[x][0],call_no[y][0]
        else:
            value = random.randint(0,1)
        if(value != 0):
            link = {}
            link['source'] = x
            link['target'] = y
            link['value'] = value
            links.append(link)
output['links'] = links

fp.write(json.dumps(output))
