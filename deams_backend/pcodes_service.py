from flask import Flask, jsonify, request
import pyodbc
import json
import pandas as pd
from flask_cors import CORS
pcode_srvc = Flask(__name__)
CORS(pcode_srvc)
# Connect to the database
def connect_to_db():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-C5SSQG8\SQLEXPRESS;DATABASE=ResourceAllocationDB;UID=BlueSQLAdmin2024;PWD=B3tter@w0rk')
    return conn

# Route to retrieve project codes based on project name
@pcode_srvc.route('/get_project_codes', methods=['GET'])
def get_project_codes():
    project_name = request.args.get('project_name')

    if project_name is None:
        return jsonify({'error': 'Project name is required as a query parameter'}), 400
        
    conn = connect_to_db()
    cur = conn.cursor()
    try:
        qry1 = "SELECT * FROM t_pcodes where p_code like '" + project_name + "%' ;"
        print(qry1)
        cur.execute(qry1)
        project_codes = cur.fetchall()
        project_codes_list = [{'p_code': row[0], 'location': row[1], 'code_number': row[2], 'start_date': row[3], 'end_date': row[4],'pend_alloc':row[5]} for row in project_codes]
        return jsonify(project_codes_list)
    except Exception as e:
        return jsonify({'error': str(e)})
    finally:
        cur.close()
        conn.close()
@pcode_srvc.route('/delete_project_code', methods=['DELETE'])
def delete_project_code():
    if request.method == 'DELETE':
        data = request.get_json()
        code_number = data.get('code_number')
        project_name = data.get('project')
        #manual entry to test the functionality insert into t_pcodes(p_code, [location], code_number)values('ABC_jejcd','hyd',100)
        if code_number is None:
            return jsonify({'error': 'code_number is required for deletion'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            # Check if the project code exists
            qry1 = "SELECT * FROM t_pcodes WHERE code_number = " + str(code_number) + " and p_code like '" + project_name +"%' ;"
            print(qry1)
            cur.execute(qry1)
            existing_project_code = cur.fetchone()
            if not existing_project_code:
                return jsonify({'error': 'Project code does not exist'})
            
            # Delete the project code
            qry2 = "DELETE FROM t_pcodes WHERE code_number = " + str(code_number) + " and p_code like '" + project_name +"%' ;"
            print(qry2)
            cur.execute(qry2)
            #conn.commit()
            # Delete related allocations
            qry3 = "DELETE FROM allocations WHERE code_number = " + str(code_number) + " and Project_name ='" + project_name +"' ;"
            print(qry3)
            cur.execute(qry3)
            conn.commit()
            return jsonify({'message': 'Project code deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only DELETE requests are allowed'}), 405

# Route to insert data into t_ABC_Project_codes table
@pcode_srvc.route('/insert_project_code', methods=['POST'])
def insert_project_code():
    if request.method == 'POST':
        data = request.get_json()
        p_code = data.get('p_code')
        location = data.get('location')
        code_number = data.get('code_number')

        if p_code is None or location is None or code_number is None:
            return jsonify({'error': 'All fields (p_code, location, code_number) are required'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            # Check if the project code number already exists
            qry1 = "SELECT * FROM t_pcodes WHERE code_number = " + str(code_number)
            cur.execute(qry1)
            existing_project_code = cur.fetchone()
            if existing_project_code:
                return jsonify({'error': 'Project code already exists'}), 409  # HTTP status code 409 for conflict
            
            # Insert the project code
            qry2 = "insert into t_pcodes (p_code, location, code_number) VALUES ('" + p_code+ "' , '" + location+ "' , " + str(code_number) +")"
            print(qry2)
            cur.execute(qry2)
            conn.commit()
            return jsonify({'message': 'Project code inserted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only POST requests are allowed'}), 405

# Endpoint for uploading files and inserting data
@pcode_srvc.route('/upload_files', methods=['POST'])
def upload_files():
    if request.method == 'POST':
        # Check if the request contains files
        if 'files' not in request.files:
            return jsonify({'error': 'No file part in the request'}), 400

        files = request.files.getlist('files')

        if not files:
            return jsonify({'error': 'No files selected for upload'}), 400

        # Connect to the database
        conn = connect_to_db()
        cur = conn.cursor()

        try:
            for file in files:
                # Assuming the file is a CSV file
                df = pd.read_csv(file)  # Read CSV file

                # Insert data from the DataFrame into the database
                for index, row in df.iterrows():
                    pcode = row['p_code']
                    location = row['Location']
                    code_number = row['code_number']
                    end_date = row['end_date']
                    start_date = row['start_date']
                    pend_alloc = row['pending_allocation']
                    if pd.isnull(pcode) or pd.isnull(location) or pd.isnull(code_number):# or pd.isnull(end_date) or pd.isnull(start_date):
                        return jsonify({'error': 'All fields (emp_id, location, project_name, portfolio, level) are required'}), 400

                    query = f"INSERT INTO t_pcodes (p_code, location, code_number) VALUES (?, ?, ?)"
                    cur.execute(query, (pcode, location, code_number)) #, end_date, start_date))

            # Commit the transaction
            conn.commit()
            return jsonify({'message': 'Data inserted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            cur.close()
            conn.close()

    else:
        return jsonify({'error': 'Only POST requests are allowed'}), 405
if __name__ == '__main__':
    pcode_srvc.run(debug=True, port=5001)
