from django.conf.urls import patterns, include, url
from django.contrib import admin

from libvis_app import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'libvis.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^$', 'libvis_app.views.index'),
    # url(r'^testQuery$', 'libvis_app.views.testQuery'),
    url(r'^testQuery/(.*)$', 'libvis_app.views.testQuery'),
)
