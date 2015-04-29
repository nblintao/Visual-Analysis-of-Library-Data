from django.shortcuts import render_to_response
from django.shortcuts import render
from django.http import HttpResponse
from dbconn import Connection
# from django.utils import simplejson
import json

def index(request):

    return render_to_response("index.html")

def testQuery(request,keys):
    keyList = keys.split("_")
    conn = Connection()
    response_data = conn.testQuery(keyList)     
    return HttpResponse(json.dumps(response_data), content_type="application/json")


def bookList(request,keys):
    keyList = keys.split("_")
    conn = Connection()
    response_data = conn.bookList(keyList)     
    return HttpResponse(json.dumps(response_data), content_type="application/json")   


def timeSerial(request,keys):
    keyList = keys.split("_")
    conn = Connection()
    response_data = conn.timeSerial(keyList)     
    return HttpResponse(json.dumps(response_data), content_type="application/json")   
     