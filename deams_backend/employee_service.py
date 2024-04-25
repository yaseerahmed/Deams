from flask import Flask, render_template, jsonify,request
import pyodbc
import json
import pandas as pd
from flask_cors import CORS
emp_srvc = Flask(__name__)
CORS(emp_srvc)
# Connect to the database
def connect_to_db():
    conn = pyodbc.connect('DRIVER={SQL Server};SERVER=DESKTOP-C5SSQG8\SQLEXPRESS;DATABASE=ResourceAllocationDB;UID=BlueSQLAdmin2024;PWD=B3tter@w0rk')
    return conn

# Route to retrieve employee details for a specific project
@emp_srvc.route('/employee_details', methods=['POST'])
def get_employee_details():
    if request.method == 'POST':
        data = request.get_json()
        project_name = data.get('project_name')
        table_name = "t_" + project_name + "_emp_dtls"
        if project_name is None:
            return jsonify({'error': 'Project name is required'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            query = f"""
SELECT TOP (1000) [Emp_Id]
      ,[Location]
      ,[Project_Name]
      ,[Portfolio]
      ,[Level]
      ,[is_allocated]
FROM [ResourceAllocationDB].[dbo].[{table_name}]
ORDER BY 
    CASE [Level]
        WHEN 'A1' THEN 1
        WHEN 'C3' THEN 2
        WHEN 'C2' THEN 3
        WHEN 'C1' THEN 4
		WHEN 'C1Y' THEN 5
        WHEN 'B1T' THEN 6
        WHEN 'B2' THEN 7
        ELSE 999  -- Handle other cases if necessary
    END;
"""
            #query = "SELECT * FROM "+ table_name + " ;"
            #print(query)
            cur.execute(query)
            employee_details = cur.fetchall()
            # Convert the result into a dictionary for JSON serialization
            employee_details_dict = [{'Emp Id': row[0], 'Location': row[1], 'Project name': row[2], 'portfolio': row[3], 'level': row[4],'is_allocated':row[5]} for row in employee_details]
            return jsonify(employee_details_dict)
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only POST requests are allowed'}), 405

@emp_srvc.route('/insert_employee', methods=['POST'])
def insert_employee():
    if request.method == 'POST':
        data = request.get_json()
        emp_id = data.get('emp_id')
        location = data.get('location')
        project_name = data.get('project_name')
        portfolio = data.get('portfolio')
        level = data.get('level')
        
        if emp_id is None or emp_id is '' or location is None or project_name is None or portfolio is None or level is None:
            return jsonify({'error': 'All fields (emp_id, location, project_name, portfolio, level) are required'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            # Check if the employee already exists
            query = "SELECT emp_id from t_" + project_name + "_emp_dtls where emp_id = " + str(emp_id) +" ;"
            
            cur.execute(query)
            existing_employee = cur.fetchone()
            if existing_employee:
                return jsonify({'error': 'Employee already exists'}), 423

            # Insert the employee if it doesn't exist
            qry2 = "INSERT INTO t_"+project_name+"_emp_dtls (emp_id, location, project_name, portfolio, level) values ( " + str(emp_id) + " , '" + location + "' , '" + project_name+ "' , '" + portfolio + "' , '" + level + "' );"
            #qry2 = "INSERT INTO t_emp_dtls (emp_id, location, project_name, portfolio, level) VALUES (?, ?, ?, ?, ?)"
            print(qry2)

            # Execute the prepared query
            cur.execute(qry2)
            conn.commit()
            return jsonify({'message': 'Record inserted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}) , 424
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only POST requests are allowed'}), 405
@emp_srvc.route('/update_employee', methods=['PUT'])
def update_employee():
    if request.method == 'PUT':
        data = request.get_json()
        emp_id = data.get('emp_id')
        location = data.get('location')
        project_name = data.get('project_name')
        portfolio = data.get('portfolio')
        level = data.get('level')
        
        if emp_id is None or emp_id == '':
            return jsonify({'error': 'emp_id is required'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            # Check if the employee exists
            query = "SELECT emp_id FROM t_" + project_name + "_emp_dtls WHERE emp_id = " + str(emp_id) + ";"
            cur.execute(query)
            existing_employee = cur.fetchone()
            if not existing_employee:
                return jsonify({'error': 'Employee does not exist'}), 404

            # Update the employee details
            update_fields = []
            if location is not None and location !="":
                update_fields.append("location = '" + location + "'")
            if project_name is not None and project_name !="":
                update_fields.append("project_name = '" + project_name + "'")
            if portfolio is not None and portfolio !="":
                update_fields.append("portfolio = '" + portfolio + "'")
            if level is not None and level !="":
                update_fields.append("level = '" + level + "'")
            
            if not update_fields:
                return jsonify({'error': 'At least one field (location, project_name, portfolio, level) must be provided for update'}), 400
            
            update_query = "UPDATE t_" + project_name + "_emp_dtls SET " + ", ".join(update_fields) + " WHERE emp_id = " + str(emp_id) + ";"
            cur.execute(update_query)
            conn.commit()
            return jsonify({'message': 'Record updated successfully'})
        except Exception as e:
            return jsonify({'error': str(e)}), 500
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only PUT requests are allowed'}), 405

@emp_srvc.route('/delete_employee', methods=['DELETE'])
def delete_employee():
    if request.method == 'DELETE':
        data = request.get_json()
        emp_id = data.get('emp_id')
        project_name = data.get('project_name')

        if emp_id is None or project_name is None:
            return jsonify({'error': 'Both emp_id and project_name are required parameters for deletion'}), 400
        
        conn = connect_to_db()
        cur = conn.cursor()
        try:
            # Check if the employee exists
            qry1 = "SELECT * FROM t_" + project_name + "_emp_dtls WHERE emp_id = " + str(emp_id) + " AND project_name = " + "'" + project_name + "';"
            cur.execute(qry1)
            existing_employee = cur.fetchone()
            if not existing_employee:
                return jsonify({'error': 'Employee does not exist for the specified project'})
            
            # Delete the employee record
            qry2 = "DELETE FROM t_" + project_name + "_emp_dtls WHERE emp_id = " + str(emp_id) + " AND project_name = " + "'" + project_name + "';"
            cur.execute(qry2)
            #conn.commit()
            #Delete related allocation as well
            qry3 = "DELETE FROM allocations where Project_name = '" + project_name +"' and Emp_Id = " + str(emp_id) + ";"
            print(qry3)
            cur.execute(qry3)
            conn.commit()
            return jsonify({'message': 'Record deleted successfully'})
        except Exception as e:
            return jsonify({'error': str(e)})
        finally:
            cur.close()
            conn.close()
    else:
        return jsonify({'error': 'Only DELETE requests are allowed'}), 405
# Endpoint for uploading files and inserting data
@emp_srvc.route('/upload_files', methods=['POST'])
def upload_files():
    #print(json.request)
    print(request.files)
    pass
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
                    emp_id = row['Emp_Id']
                    location = row['Location']
                    project_name = row['Project_Name']
                    portfolio = row['Portfolio']
                    level = row['Level']

                    if pd.isnull(emp_id) or pd.isnull(location) or pd.isnull(project_name) or pd.isnull(portfolio) or pd.isnull(level):
                        return jsonify({'error': 'All fields (emp_id, location, project_name, portfolio, level) are required'}), 400

                    query = f"INSERT INTO t_{project_name}_emp_dtls (emp_id, location, project_name, portfolio, level) VALUES (?, ?, ?, ?, ?)"
                    cur.execute(query, (emp_id, location, project_name, portfolio, level))

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
    emp_srvc.run(debug=True)
