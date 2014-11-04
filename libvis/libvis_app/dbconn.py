import cx_Oracle

from app_settings import oracle_conn_settings

dsn = cx_Oracle.makedsn(oracle_conn_settings['host'], oracle_conn_settings['port'], service_name = oracle_conn_settings['service_name'])
conn = cx_Oracle.connect(oracle_conn_settings['user'], oracle_conn_settings['password'], dsn)
conn.current_schema = 'ZJU50'


c=conn.cursor()
# c.execute('select Z13_TITLE from Z13 where rownum<=1000')
c.execute("select * from Z309 where Z309_REC_KEY like 'ID207010%'")
rows = c.fetchall()

for row in rows:
    print row[0]
    # print row[0].decode('utf-8').encode('utf-8')
c.close()

conn.close()

# american_america.AL32UTF8
# SIMPLIFIED CHINESE_CHINA.ZHS16GBK