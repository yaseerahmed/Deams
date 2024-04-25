from flask import Flask, jsonify, request
import pyodbc
import json
from flask_cors import CORS
alloc_srvc = Flask(__name__)
CORS(alloc_srvc)
# Connect to the database
def connect_to_db():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-C5SSQG8\SQLEXPRESS;DATABASE=ResourceAllocationDB;UID=BlueSQLAdmin2024;PWD=B3tter@w0rk')
    return conn

import requests

def get_employee_details(project_name):
    url = "http://127.0.0.1:5000/employee_details"
    payload = {"project_name": project_name}
    response = requests.post(url, json=payload)
    if response.status_code == 200:
        return response.json()  # Parse JSON response into a dictionary
    else:
        print("Failed to fetch employee details.")
        return None

def get_pcodes_details(project_name):
    url = "http://127.0.0.1:5001/get_project_codes?project_name="+ project_name
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()  # Parse JSON response into a dictionary
    else:
        print("Failed to fetch employee details.")
        return None

loc = { "Bangalore": "Bng",
        "Chennai" : "Chn",
        "Coimbatore" : "Cmb",
        "Delhi" : "Del",
        "Hyderabad" : "Hyd",
        "Indore" : "Ind",
        "Kolkata" : "Kol",
        "Mumbai" : "Mum",
        "Noida" : "Nda",
        "Pune" : "Pun"
        }

alloc_percentage = {
    "A1" :25,
    "C3" : 16.66,
    "C2" :12.5,
    "C1" : 10,
    "C1Y" : 8.33,
    "B1T" : 6.66,
    "B2" : 8.33
}
@alloc_srvc.route('/generate_allocation', methods=['POST'])
def get_project_codes():
    try:
        print("JSON Input:", request.json)
        data = request.get_json()
        project_name = data.get('project_name')
        # Check if project_name is None or empty
        if not project_name:
            return jsonify({'error': 'Project name is missing or empty'})
        employee_details = get_employee_details(project_name)
        conn = connect_to_db()
        cur = conn.cursor()
        print(project_name)
        pcodes = get_pcodes_details(project_name)
        unavialable_pcodes = []
        unallocated_emps = []
        #print("update t_pcodes set pending_allocation = 100 where p_code like '" + project_name+"%' ;")
        cur.execute("update t_pcodes set pending_allocation = 100 where p_code like '" + project_name+"%' ;")

        cur.execute("DELETE FROM allocations WHERE Project_Name = '"+ project_name +"';")
        cur.execute("update t_"+project_name +"_emp_dtls set is_allocated = 'No' ;")
        
        if employee_details:
            for i in employee_details:
                qry = "SELECT top 1 * from t_pcodes where p_code like '" + project_name + "_" + loc[i['Location']] + "_" + i['portfolio'] + "%' and pending_allocation >= "+ str(alloc_percentage[i['level']]) + ";"
                cur.execute(qry)
                project_codes = cur.fetchall()
                project_codes_list = [{'p_code': row[0], 'location': row[1], 'code_number': row[2], 'start_date': row[3], 'end_date': row[4],'pend_alloc':row[5]} for row in project_codes]
                
                if len(project_codes_list) == 0:
                    unavialable_pcodes.append(str(project_name + "_" + loc[i['Location']] + "_" + i['portfolio'] ))
                    unallocated_emps.append(i['Emp Id'])
                else:
                    for project in project_codes_list:
                        qry2 = "INSERT into [ResourceAllocationDB].[dbo].[allocations] values(" + str(i['Emp Id']) + " , '" + i['Location'] +  "' , " + str(project['code_number']) + " , '" + project_name + "' , '" + i['level'] + "' , '" + project['p_code'] + "');"
                        try:
                            cur.execute(qry2)
                            conn.commit()  # Commit the transaction if necessary
                            #print("Insertion successful")
                        except Exception as e:
                            conn.rollback()  # Rollback the transaction in case of error
                            print("Error occurred during insertion:", e)

                        qry3 = "UPDATE t_pcodes set pending_allocation =" + str(project['pend_alloc'] - alloc_percentage[i['level']]) + " where code_number = " + str(project['code_number'])+ ";"
                        cur.execute(qry3)
                        cur.execute("UPDATE t_" + project_name + "_emp_dtls set is_allocated = 'YES' where Emp_id=" + str(i['Emp Id']))

        else:
            print("No employee details retrieved.")
        print(len(unavialable_pcodes))
        print(len(unallocated_emps))
        if pcodes:
            for i in pcodes:
                pass
        else:
            print("No pcodes details retrieved.")
        #for i in set(unavialable_pcodes):
        #    print(i)
        #for i in unallocated_emps:
        #    print(i)

        #project_name = "SKF"
        
        return jsonify({'message': 'Allocation generated successfully'})

    except Exception as e:
        return jsonify({'error': str(e)})

@alloc_srvc.route('/get_allocation_details', methods=['GET'])
def get_allocation_details():
    try:
        # Get the code_number from the query parameters
        #data = request.get_json()
        #code_number = data.get('code_number')
        #print(request.args)
        code_number = request.args.get('code_number')

        # Check if code_number is provided
        if not code_number:
            return jsonify({'error': 'Code number is missing'})

        # Connect to the database
        conn = connect_to_db()
        cur = conn.cursor()

        # Fetch allocation details based on code_number
        query = f"SELECT * FROM allocations WHERE code_number = {code_number};"
        cur.execute(query)
        allocation_details = cur.fetchall()

        # Check if any details are retrieved
        if not allocation_details:
            return jsonify({'error': 'No allocation details found for the provided code number'})

        # Prepare the response
        result = []
        for row in allocation_details:
            allocation = {
                'emp_id': row[0],
                'location': row[1],
                'code_number': row[2],
                'project_name': row[3],
                'level': row[4],
                'p_code': row[5]
            }
            result.append(allocation)

        return jsonify({'allocation_details': result})

    except Exception as e:
        return jsonify({'error': str(e)})

if __name__ == '__main__':
    alloc_srvc.run(debug=True, port=5002)