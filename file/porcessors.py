from django_user_agents.utils import get_user_agent
from django.http import JsonResponse


def context(request):
    # user_agent = get_user_agent(request)
    # browser = user_agent.browser.family
    # system = user_agent.os.family

    # if browser == "Other" or system == "Other":
    #     return JsonResponse({'message': 'Access Forbidden: Your IP is blocked.😂'})
    return {}
