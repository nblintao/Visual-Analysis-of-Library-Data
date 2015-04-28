#coding:utf8
import cx_Oracle

from app_settings import oracle_conn_settings

class Connection():
    def __init__(self):
        dsn = cx_Oracle.makedsn(oracle_conn_settings['host'], oracle_conn_settings['port'], service_name = oracle_conn_settings['service_name'])
        self.conn = cx_Oracle.connect(oracle_conn_settings['user'], oracle_conn_settings['password'], dsn)
        self.conn.current_schema = 'ZJU50'
    
    def __del__(self):
        self.conn.close()
    
    def testQuery(self,keywords):
        c=self.conn.cursor()
        # c.execute('select Z13_TITLE from Z13 where rownum<=1000')
        # keywords = ['Visual','C++',u'学']
        sql = "select Z13_REC_KEY, Z13_TITLE from Z13 where rownum<=1000"
        for keyword in keywords:
            sql += " and Z13_TITLE like '%"+keyword+"%'"
        c.execute(sql)
        # c.execute("select * from Z309 where Z309_REC_KEY like 'ID207010%'")
        rows = c.fetchall()
        r = []
        for row in rows:
            book={}
            book['key'] = row[0]
            book['title'] = row[1]
            sql="select Z309_DATE_X from Z309 where Z309_REC_KEY_3 like '"+book['key']+"%'"
            sql+=" and (Z309_ACTION = 9 or Z309_ACTION = 1)"
            print(sql)
            c.execute(sql)
            ts = c.fetchall()
            book['timeserial'] = [x[0] for x in ts]
            r.append(book)
            # print row[0].decode('utf-8').encode('utf-8')
        c.close()
        return r



# american_america.AL32UTF8
# SIMPLIFIED CHINESE_CHINA.ZHS16GBK