import json
from pymongo import MongoClient
import re
client = MongoClient("localhost", 27017)
db = client.data
student = db.students
marks = db.marks

# Helper Methods


def getGrade(USN, batch, sem):
    selected_student = student.find(
        {"usn": USN, "batch": batch, "sem": sem})[0]
    for i in marks.find({"sid": str(selected_student["_id"])}):
        grade = 0
        if int(i["totalMarks"]) >= 90:
            grade = 10
        elif 80 <= int(i["totalMarks"]) <= 89:
            grade = 9
        elif 70 <= int(i["totalMarks"]) <= 79:
            grade = 8
        elif 60 <= int(i["totalMarks"]) <= 69:
            grade = 7
        elif 50 <= int(i["totalMarks"]) <= 59:
            grade = 6
        elif 45 <= int(i["totalMarks"]) <= 49:
            grade = 5
        elif 40 <= int(i["totalMarks"]) <= 44:
            grade = 4
        elif int(i["totalMarks"]) < 40:
            grade = 0
        marks.update_one({"_id": i["_id"]}, {"$set": {"grade": grade}})


def totalFCD(USN, batch, sem):
    selected_student = student.find(
        {"usn": USN, "batch": batch, "sem": sem})[0]
    total = 0
    total_marks = 0
    FCD = ""
    for j in marks.find({"sid": str(selected_student["_id"])}):
        if j["fcd"] == "F":
            student.update_one(
                {"_id": selected_student["_id"]}, {"$set": {"totalFCD": "F"}}
            )
            return
        total += int(j["totalMarks"])
        if j['subjectCode']=="15CSP85":
            total_marks += 200
        else:
            total_marks += 100
    if total >= 70/100*total_marks:
        FCD = "FCD"
    elif total >= 60/100*total_marks:
        FCD = "FC"
    elif  total >= 50/100*total_marks:
        FCD = "SC"
    else:
        FCD = "P"
    student.update_one({"_id": selected_student["_id"]}, {
                       "$set": {"totalFCD": FCD}})


def FCD(USN, batch, sem):
    selected_student = student.find(
        {"usn": USN, "batch": batch, "sem": sem})[0]
    for i in marks.find({"sid": str(selected_student["_id"])}):
        if i["result"] == "F" or i["result"] == "A" or i["result"] == "X":
            FCD = "F"
        else:
            if 70 <= int(i["totalMarks"]) <= 100:
                FCD = "FCD"
            elif 60 <= int(i["totalMarks"]) <= 69:
                FCD = "FC"
            elif 50 <= int(i["totalMarks"]) <= 59:
                FCD = "SC"
            elif 40 <= int(i["totalMarks"]) <= 49:
                FCD = "P"
            else:
                FCD = "F"
        marks.update_one({"_id": i["_id"]}, {"$set": {"fcd": FCD}})


def GPA(USN, batch, sem):
    selected_student = student.find(
        {"usn": USN, "batch": batch, "sem": sem})[0]
    totalgrade = 0
    totalCredit = 0
    gpa = 0
    roundoff = 0
    for j in marks.find({"sid": str(selected_student["_id"])}):
        totalgrade += j["grade"] * getCredit(j["subjectCode"])
        totalCredit += 10 * getCredit(j["subjectCode"])
    gpa = (totalgrade / totalCredit) * 10
    roundoff = round(gpa, 2)
    student.update_one({"_id": selected_student["_id"]}, {
                       "$set": {"gpa": roundoff}})


def getCredit(subcode):
    if subcode == "18CS52":
        return 4
    if subcode == "18CS53":
        return 4
    if subcode == "18CIV59":
        return 1
    elif re.search("^..[A-Z][A-Z][A-Z]?(L|P)[0-9][0-9]$", subcode) is not None:  # Lab
        return 2
    elif re.search("^18[A-Z][A-Z][A-Z]?[0-9][0-9]$", subcode) is not None:  # Subject
        return 3
    elif (
        re.search("^(15|16|17)[A-Z][A-Z][A-Z]?[0-9][0-9]$",
                  subcode) is not None
    ):  # Subject
        return 4
    elif (
        re.search("^..[A-Z][A-Z][A-Z]?[0-9][0-9][0-9]$", subcode) is not None
    ):  # Elective
        return 3
    elif re.search("^..MATDIP[0-9][0-9]$", subcode) is not None:  # MATDIP
        return 0

def calculateTotal(USN, batch, sem):
    print(USN)
    selected_student = student.find(
        {"usn": USN, "batch": batch, "sem": sem})[0]
    total = 0
    for j in marks.find({"sid": str(selected_student["_id"])}):
        total += int(j["totalMarks"])
    student.update_one({"_id": selected_student["_id"]}, {
                       "$set": {"totalmarks": total}})

data = []
with open('./result.json') as f:
    data = json.load(f)

if __name__ == "__main__":
    for s in data:
        USN = s["USN"]
        print("USN:-" + USN)
        stu = {
            "usn": USN,
            "section": s["Section"],
            "batch": str(int(s["Batch"])),
            "sem": int(s["Sem"]),
        }
        try:
            stu_id = student.insert_one(stu).inserted_id
        except:
            print("Student Data Already Exists")
            continue
        res = s["results"]
        student.update({"_id": stu_id}, {"$set": {"name": s["name"]}})
        print(s["name"])
        for r in res:
            mark = {
                "sid": str(stu_id),
                "subjectCode": r["subjectCode"],
                "subjectName": r["subjectName"],
                "internalMarks": r["ia"],
                "externalMarks": r["ea"],
                "totalMarks": r["total"],
                "result": r["result"],
            }
            marks.insert_one(mark)
        getGrade(USN, str(int(s["Batch"])), s["Sem"])
        FCD(USN, str(int(s["Batch"])), s["Sem"])
        totalFCD(USN, str(int(s["Batch"])), s["Sem"])
        GPA(USN, str(int(s["Batch"])), s["Sem"])
        calculateTotal(USN, str(int(s["Batch"])), s["Sem"]  )
    print("Done")
