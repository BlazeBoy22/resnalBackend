Files used in updation of revaluation marks:
1. new_reval.js: Fetches the revaluation marks of students using the usn list from the 5th_sem_csv and stores the result in result14.json file.
2. reval_update.py: Used to compared result14.json file with the json file of the original marks and update the results accordingly.
3. json_to_csv.py: Converts reval json to excel sheet.
4. dump.py: The updated marks are dumped to the database.

Initialization steps(Run in terminal):

1. ./install_all.sh
