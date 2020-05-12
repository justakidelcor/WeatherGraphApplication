from random import randint
from random import uniform
from datetime import datetime
from datetime import timedelta
import psycopg2
from psycopg2.extras import RealDictCursor


class SimplePGClass():
    """SimplePGClass docstring"""
    def __init__(self, *arg, **kwargs):
        super(SimplePGClass, self).__init__()
        self.arg = arg
        self.kwargs = kwargs

    def __enter__(self):
        self.connection = psycopg2.connect(**self.kwargs)
        self.cursor = self.connection.cursor(cursor_factory=RealDictCursor)
        self.creatingTable()
        return self

    def __exit__(self, exc_type, exc_value, traceback):
        self.connection.close()
        if exc_value:
            raise


    def creatingTable(self):
        createExampleTable = """
              CREATE TABLE IF NOT EXISTS public.weatherdata (
              id serial PRIMARY KEY,
              created DATE NOT NULL UNIQUE DEFAULT NOW(),
              temperature real NOT NULL,
              pressure integer NOT NULL,
              humidity real NOT NULL
              )
              """
        self.cursor.execute(createExampleTable)
        self.connection.commit()
        self.generateData()


    def generateData(self):
        sqlCount = "SELECT count(*) from weatherdata;"
        self.cursor.execute(sqlCount)
        result = self.cursor.fetchone()
        if len(result) == 1 and result['count'] == 0:
            self.cursor.execute("PREPARE insertsomedata AS INSERT INTO weatherdata (created, temperature, pressure, humidity) VALUES ($1, $2, $3, $4)")
            sqlPrepare = "EXECUTE insertsomedata(%s, %s, %s, %s)"
            for i in range(0,100):
                self.cursor.execute(sqlPrepare, (
                                                    (datetime.now()+timedelta(days=i)).strftime('%Y-%m-%d'),
                                                    round(uniform(10.5,18.9),1),
                                                    randint(730,766),
                                                    round(uniform(0.2,0.3),2)
                                                )
                                    )
        self.connection.commit()


    def getWeather(self, dateFrom, dateTo):
        statement_name = f'getweather_{randint(1000000,9999999)}'
        sqlCreatePrepare = f'PREPARE {statement_name} AS SELECT created::text, temperature, pressure, humidity FROM weatherdata WHERE created between $1 and $2 order by created;'
        self.cursor.execute(sqlCreatePrepare)
        sqlPrepare = f'EXECUTE {statement_name}(%s, %s)'
        self.cursor.execute(sqlPrepare, (dateFrom, dateTo))
        result = self.cursor.fetchall()
        self.cursor.execute(f'deallocate {statement_name}')
        return result


if __name__ == '__main__':
    with SimplePGClass(user='postgres', password='postgres', host='localhost', port='5432', database='weatherdb') as db:
        result = db.getWeather('2020-05-13', '2020-05-23')
        print(result)