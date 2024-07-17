import json
import openpyxl
from openpyxl.utils import get_column_letter
from openpyxl.styles import Alignment, Font, Border, Side


# Load the JSON data
with open('result14.json', 'r') as file:
    data = json.load(file)

# Create a new workbook and select the active worksheet
workbook = openpyxl.Workbook()
sheet = workbook.active

border_style = Border(left=Side(style='thin', color='000000'),
                      right=Side(style='thin', color='000000'),
                      top=Side(style='thin', color='000000'),
                      bottom=Side(style='thin', color='000000'))

def create_headers():
    # Prepare the headers for the Excel sheet
    headers = ["Name", "USN", "Section"]
    subject_codes = [subject["subjectCode"] for subject in data[0]["results"]]
    for subject in subject_codes:
        headers.append(f"{subject}")

    # Define the header and write it to the first row
    # header = ["Student Name", "Student USN", "Section", 
    #         "21CIV57", "21CS51", "21CS52", "21CS53", "21CS54", 
    #         "21CSL55", "21CSL581", "21CSL582", "21RMI56"]

    col_num = 1
    for header_title in headers:
        cell = sheet.cell(row=1, column=col_num)
        cell.value = header_title
        cell.font = Font(bold=True)
        cell.border = border_style
        cell.alignment = Alignment(horizontal='center', vertical='center')
        if(col_num < 4):
            cell = sheet.cell(row=2, column=col_num)
            cell.border = border_style
            col_num += 1
        else:
            cell = sheet.cell(row=2, column=col_num)
            cell.value = "IA"
            cell.font = Font(bold=True)
            cell.border = border_style
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell = sheet.cell(row=2, column=col_num+1)
            cell.value = "EA"
            cell.font = Font(bold=True)
            cell.border = border_style
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell = sheet.cell(row=2, column=col_num+2)
            cell.value = "TOTAL"
            cell.font = Font(bold=True)
            cell.border = border_style
            cell.alignment = Alignment(horizontal='center', vertical='center')
            cell = sheet.cell(row=2, column=col_num+3)
            cell.value = "CLASS"
            cell.font = Font(bold=True)
            cell.border = border_style
            cell.alignment = Alignment(horizontal='center', vertical='center')
            col_num += 4

    # Merge cells for each subject starting from D1
    for col_num in range(4, 3 + 4*(len(headers)-3) + 1, 4):
        start_col = col_num
        end_col = start_col + 3
        sheet.merge_cells(start_row=1, start_column=start_col, end_row=1, end_column=end_col)
    
    sheet.column_dimensions["A"].width = 30
    sheet.column_dimensions["B"].width = 20

create_headers()

# Save the workbook
workbook.save("student_marks.xlsx")
