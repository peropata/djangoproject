from django.shortcuts import render
from django.http import HttpResponse

from .models import Posts

# Create your views here.
def index(request):
    # return HttpResponse('HELLO FROM POSTS')

    posts = Posts.objects.all()[:10]

    contex = {
        'title': 'Latest Posts',
        'posts': posts
    }

    return render(request, 'posts/index.html', contex)

def details(request, id):
    post = Posts.objects.get(id=id)

    contex = {
        'post': post
    }

    return render(request, 'posts/details.html', contex)

