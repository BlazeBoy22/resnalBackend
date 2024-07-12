import json

# Load JSON data from files
with open('result13.json', 'r') as file:
    result13 = json.load(file) # Original result json

with open('result13_reval.json', 'r') as file:
    result13_reval = json.load(file) # Reval result json

# Create a dictionary for quick lookup by USN
result13_dict = {student['USN']: student for student in result13}

# Iterate through the revaluation results and update the original results if needed
for reval_student in result13_reval:
    usn = reval_student['USN']
    if usn in result13_dict:
        original_student = result13_dict[usn]
        for reval_subject in reval_student['results']:
            subject_code = reval_subject['subjectCode']
            for original_subject in original_student['results']:
                if original_subject['subjectCode'] == subject_code:
                    if original_subject['ea'] != reval_subject['ea'] or original_subject['total'] != reval_subject['total']:
                        original_subject['ea'] = reval_subject['ea']
                        original_subject['total'] = reval_subject['total']
                    break

# Write the updated results to a new JSON file
with open('result13_updated.json', 'w') as file:
    json.dump(result13, file, indent=4)
