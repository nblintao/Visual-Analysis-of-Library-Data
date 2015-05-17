#coding:utf8
import cx_Oracle

from app_settings import oracle_conn_settings

class Connection():
    def __init__(self):
        dsn = cx_Oracle.makedsn(oracle_conn_settings['host'], oracle_conn_settings['port'], service_name = oracle_conn_settings['service_name'])
        self.conn = cx_Oracle.connect(oracle_conn_settings['user'], oracle_conn_settings['password'], dsn)
        self.conn.current_schema = 'ZJU50'
        self.c = self.conn.cursor()
    
    def __del__(self):
        self.c.close()
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

    def bookList(self,keywords):
        print "Enter bookList"
        limit = 1000
        sql = "select Z13_REC_KEY, Z13_TITLE, Z13_AUTHOR, Z13_IMPRINT, Z13_ISBN_ISSN, Z13_CALL_NO from Z13 where rownum<="+str(limit)
        ISBNScope = []
        for keyword in keywords:
            if keyword.startswith('CALL:'):
                ISBNScope.append(str(keyword[5:]))
            else:
                sql += " and Z13_TITLE like '%"+keyword+"%'"
        print(ISBNScope)
        if len(ISBNScope):
            sql += ' and ('
            for i in xrange(0,len(ISBNScope)):
                if i!=0:
                    sql += ' or '
                sql += " Z13_CALL_NO like '" + ISBNScope[i] + "%' "
            sql += ')'
        print(sql)
        self.c.execute(sql)
        rows = self.c.fetchall()
        r = []
        for row in rows:
            book={}
            book['key'] = row[0]
            book['title'] = row[1]
            book['author'] = row[2]
            book['imprint'] = row[3]
            book['isbn'] = row[4]
            book['callno'] = row[5]
            r.append(book)
        print "Exit bookList"
        return r

    def timeSerial(self,keywords):
        print "Enter timeSerial"
        r = self.bookList(keywords)
        # print r
        for book in r:
            sql="select Z309_DATE_X from Z309 where Z309_REC_KEY_3 like '"+book['key']+"%'"
            sql+=" and (Z309_ACTION = 9 or Z309_ACTION = 1)"
            self.c.execute(sql)
            ts = self.c.fetchall()
            book['timeserial'] = [x[0] for x in ts]
        print "Exit timeSerial"
        return r


# american_america.AL32UTF8
# SIMPLIFIED CHINESE_CHINA.ZHS16GBK