import requests
from requests.packages.urllib3.exceptions import InsecureRequestWarning
import time
import os
import csv
from bs4 import BeautifulSoup
import json

# Suppress only the single InsecureRequestWarning from urllib3 needed to disable SSL verification
requests.packages.urllib3.disable_warnings(InsecureRequestWarning)

file_path = 'result14_reval.json'

post_payload = {
    'Token': '55af47bae3a4104902c28cea54dcce98ae34318b',
    'captchacode': 'iV4DKr',
    'lns': '1BI17CS010',
}
post_headers = {
    'Host': 'results.vtu.ac.in',
    'Connection': 'keep-alive',
    'Content-Length': '80',
    'Cache-Control': 'max-age=0',
    'Upgrade-Insecure-Requests': '1',
    'Origin': 'https://results.vtu.ac.in',
    'Content-Type': 'application/x-www-form-urlencoded',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'Sec-Fetch-Site': 'same-origin',
    'Sec-Fetch-Mode': 'navigate',
    'Sec-Fetch-User': '?1',
    'Sec-Fetch-Dest': 'document',
    'Referer': 'https://results.vtu.ac.in/DJRVcbcs24/index.php',
    'Accept-Encoding': 'gzip, deflate, br',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cookie': 'VISRE=4ldr63bhbo4it7marog3ndqt2c4c6r1o24t90rhhutdd82vm6tlqmitj0bbn22undfndp18pv1c04c3s8ib4472iumg09s2nv55taf2; VISRE=gl48oihilvkotdn96oofnj9ehtsm91gp97jg6ck6snen1btkeob4ru34jjqterit4pl3nldh6tg4uc4r89kdfle40pu17g47dds86s0',
}

def delay(ms):
    time.sleep(ms / 1000)

def run_python_script():
    os.system('python captcha.py')

def get_new_session():
    url = 'https://results.vtu.ac.in/DJRVcbcs24/index.php'
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.365',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': 'b222b1f1-1fed-4490-965a-805f53a28e97',
        'Host': 'results.vtu.ac.in',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    response = requests.get(url, headers=headers, verify=False)
    soup = BeautifulSoup(response.content, 'html.parser')
    token = soup.find('input', {'name': 'Token'})['value']
    img_url = 'https://results.vtu.ac.in' + soup.find('img', {'alt': 'CAPTCHA code'})['src']
    post_payload['Token'] = token or ''
    img_headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36',
        'Accept': '*/*',
        'Cache-Control': 'no-cache',
        'Postman-Token': '063fdb07-fe60-466a-be5e-fe08dec56a21',
        'Host': 'results.vtu.ac.in',
        'Accept-Encoding': 'gzip, deflate, br',
        'Connection': 'keep-alive',
    }
    img_headers['Cookie'] = response.headers['Set-Cookie'].split(';')[0]
    post_headers['Cookie'] = img_headers['Cookie']

    img_response = requests.get(img_url, headers=img_headers, verify=False, stream=True)
    with open('cap.png', 'wb') as f:
        for chunk in img_response.iter_content(1024):
            f.write(chunk)
    
    run_python_script()
    
    with open('output.txt', 'r') as f:
        temp_cap = f.read().strip()
    
    print(temp_cap)
    
    if temp_cap:
        post_payload['captchacode'] = temp_cap
    else:
        print("Empty Captcha - Getting new Session")
        get_new_session()

def get_result(USN, Batch, Sem, Section):
    post_payload['lns'] = USN
    url = 'https://results.vtu.ac.in/DJRVcbcs24/resultpage.php'
    data = f"Token={post_payload['Token']}&lns={post_payload['lns']}&captchacode={post_payload['captchacode']}"
    headers = post_headers

    response = requests.post(url, headers=headers, data=data, verify=False)
    
    if 'Invalid captcha code !!!' in response.text:
        print("Invalid Captcha, getting new session")
        get_new_session()
        return get_result(USN, Batch, Sem, Section)
    
    if 'Redirecting to VTU Results Site' in response.text:
        get_new_session()
        return get_result(USN, Batch, Sem, Section)
    
    if 'University Seat Number is not available or Invalid..!' in response.text:
        raise ValueError("Student Not Found")
    
    if 'Please check website after 2 hour --- !!!' in response.text:
        print("IP Blocked")
        return None
    
    if 'Semester : 5' in response.text:
        results = []
        soup = BeautifulSoup(response.content, 'html.parser')
        rows = soup.select('.divTable .divTableBody .divTableRow')
        
        for row in rows[1:2]:
            cols = row.select('.divTableCell')
            # for col in cols:
            #     print(col)
            # print(cols[0].text.strip())
            # print(cols[1].text.strip())
            # print(cols[2].text.strip())
            # print(cols[7].text.strip())
            # print(cols[8].text.strip())
            result = {
                'subjectCode': cols[0].text.strip(),
                'subjectName': cols[1].text.strip(),
                'ia': int(cols[2].text.strip()),
                'ea': int(cols[7].text.strip()),
                'total': int(cols[2].text.strip()) + int(cols[7].text.strip()),
                'result': cols[8].text.strip(),
            }
            results.append(result)
        
        return {
            'name': soup.select_one('td[style="padding-left:15px"]').text.replace(": ", ""),
            'USN': USN,
            'results': results,
            'Batch': Batch,
            'Sem': Sem,
            'Section': Section,
        }
    
    if "<script type='text/javascript'>alert('Please check website after 2 hour !!!');window.location.href='index.php';</script>" in response.text:
        print("Session broken")
        get_new_session()
        return get_result(USN, Batch, Sem, Section)

def main():
    if os.stat(file_path).st_size == 0:
        with open(file_path, 'w') as f:
            f.write('[\n')
    else:
        with open(file_path, 'r+') as f:
            json_data = f.read()
            modified_json_data = json_data[:-2]
            f.seek(0)
            f.write(modified_json_data)
            f.truncate()
        with open(file_path, 'a') as f:
            f.write(',\n')

    Result = []
    get_new_session()
    
    with open('new_5th_sem_2021.csv', newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        students = list(reader)
    
    for student in students:
        print(f"{students.index(student) + 1}/{len(students)} - Name: {student['USN']} - Section: {student['Section']}")
        try:
            res = get_result(student['USN'], int(student['Batch']), int(student['Sem']), student['Section'])
            if res:
                with open(file_path, 'a') as f:
                    json.dump(res, f)
                    f.write(',\n')
                Result.append(res)
                print("Pushed result")
            get_new_session()
        except Exception as e:
            print(e)
            get_new_session()
    
    with open(file_path, 'r+') as f:
        json_data = f.read()
        modified_json_data = json_data[:-2] + '\n'
        f.seek(0)
        f.write(modified_json_data)
        f.truncate()
    
    with open(file_path, 'a') as f:
        f.write(']')
    
    print("=========================")
    print("Completed")

if __name__ == "__main__":
    main()
