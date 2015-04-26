from django.shortcuts import render_to_response
from django.shortcuts import render
from django.http import HttpResponse
from dbconn import Connection
# from django.utils import simplejson
import json

def index(request):

    return render_to_response("index.html")

def testQuery(request):
    conn = Connection()
    response_data = conn.testQuery()     
    return HttpResponse(json.dumps(response_data), content_type="application/json")
    