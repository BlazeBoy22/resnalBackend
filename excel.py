
import json
import os
import pprint

import xlsxwriter

workbook = xlsxwriter.Workbook("final.xlsx")

totalSubsCount = []



data = []
with open('./resultnew.json') as f:
    data = json.load(f)


def exportall():
    
    border_format = workbook.add_format({"border": 1})
    border_format_fcd_green = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "green"}
    )
    border_format_fcd_blue = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "blue"}
    )
    border_format_fcd_yellow = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "yellow"}
    )
    border_format_fcd_purple = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "purple"}
    )
    border_format_fcd_red = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "red"}
    )
    border_format_fcd_cyan = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "cyan"}
    )
    border_format_fcd_orange = workbook.add_format(
        {"align": "center", "border": 1, "bg_color": "orange"}
    )        

    worksheet = workbook.add_worksheet()
    heading = workbook.add_format({"bold": True, "border": 1})
    worksheet.write(0, 0, "Student Name", heading)
    merge_format = workbook.add_format({"align": "center", "bold": True, "border": 1})
    worksheet.write(0, 1, "Student USN", heading)
    worksheet.write(0, 2, "Section", heading)

    listofsubnames = []
    for i in data:
        for result in i["results"]:
            listofsubnames.append(result["subjectCode"]+"-"+result["subjectName"])
        break


    subjectGrades = {}

    A_sec_subjectGrades = {}
    B_sec_subjectGrades = {}
    C_sec_subjectGrades = {}

    for student in data:
        for result in student["results"]:
            if ( result["subjectName"] in subjectGrades):
                if ( result["grade"] in subjectGrades[result["subjectName"]]):
                    subjectGrades[result["subjectName"]][result["grade"]] += 1
                else:
                    subjectGrades[result["subjectName"]][result["grade"]] = 1
            else:
                subjectGrades[result["subjectName"]] = {}

    for student in data:
        if ( student["Section"] == "A"):
            for result in student["results"]:
                if ( result["subjectName"] in A_sec_subjectGrades):
                    if ( result["grade"] in A_sec_subjectGrades[result["subjectName"]]):
                        A_sec_subjectGrades[result["subjectName"]][result["grade"]] += 1
                    else:
                        A_sec_subjectGrades[result["subjectName"]][result["grade"]] = 1
                else:
                    A_sec_subjectGrades[result["subjectName"]] = {} 
        elif ( student["Section"] == "B"):
            for result in student["results"]:
                if ( result["subjectName"] in B_sec_subjectGrades):
                    if ( result["grade"] in B_sec_subjectGrades[result["subjectName"]]):
                        B_sec_subjectGrades[result["subjectName"]][result["grade"]] += 1
                    else:
                        B_sec_subjectGrades[result["subjectName"]][result["grade"]] = 1
                else:
                    B_sec_subjectGrades[result["subjectName"]] = {} 
        elif ( student["Section"] == "C"):
            for result in student["results"]:
                if ( result["subjectName"] in C_sec_subjectGrades):
                    if ( result["grade"] in C_sec_subjectGrades[result["subjectName"]]):
                        C_sec_subjectGrades[result["subjectName"]][result["grade"]] += 1
                    else:
                        C_sec_subjectGrades[result["subjectName"]][result["grade"]] = 1
                else:
                    C_sec_subjectGrades[result["subjectName"]] = {}                                     

    

    print("A section" + json.dumps(A_sec_subjectGrades, indent=4))
    print("B section" + json.dumps(B_sec_subjectGrades, indent=4))
    print("C section" + json.dumps(C_sec_subjectGrades, indent=4))
    print("Overall" + json.dumps(subjectGrades, indent=4))
    



    j = 3
    for i in (listofsubnames):
        worksheet.merge_range(0, j, 0, j + 3,i, merge_format)
        worksheet.write(1, j, "Internal Marks", heading)
        j = j + 1
        worksheet.write(1, j, "External Marks", heading)
        j = j + 1
        worksheet.write(1, j, "Total Marks", heading)
        j = j + 1
        worksheet.write(1, j, "Class", heading)
        j = j + 1

    worksheet.write(0, j, "Overall Grade", heading)

    row = 2
    col = 3
    for student in data:
        worksheet.write(row, 0, student["name"], border_format)
        worksheet.write(row, 1, student["USN"], border_format)
        worksheet.write(row, 2, student["Section"], border_format)
        for subresult in student["results"]:
            if subresult:
                if subresult["grade"] == "S":
                    fcd_format = border_format_fcd_green
                elif subresult["grade"] == "A":
                    fcd_format = border_format_fcd_blue
                elif subresult["grade"] == "B":
                    fcd_format = border_format_fcd_yellow
                elif subresult["grade"] == "C":
                    fcd_format = border_format_fcd_purple
                elif subresult["grade"] == "D":
                    fcd_format = border_format_fcd_orange
                elif subresult["grade"] == "E":
                    fcd_format = border_format_fcd_cyan
                elif subresult["grade"] == "F":
                    fcd_format = border_format_fcd_red                                        
                worksheet.write(row, col, subresult["ia"], border_format)
                worksheet.write(row, col + 1, subresult["ea"], border_format)
                worksheet.write(row, col + 2, subresult["total"], border_format)
                worksheet.write(row, col + 3, subresult["grade"], fcd_format)
                col = col + 4
            else:
                worksheet.write(row, col, "-", border_format)
                worksheet.write(row, col + 1, "-", border_format)
                worksheet.write(row, col + 2, "-", border_format)
                worksheet.write(row, col + 3, "-", border_format)
                col = col + 4
        worksheet.write(row, col, student["grade"], border_format)
        row = row + 1
        col = 3

    



    workbook.close()
    


exportall()        