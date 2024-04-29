const resultjson = require("./result6.json");
const fs = require('fs');

const gradereturner = (total) => (
  total >= 90 ? 'S' : total >= 80 ? 'A' : total >= 70 ? 'B' : total >= 60 ? 'C' : total >= 45 ? 'D' : total >= 40 ? 'E' : 'F'
)

const result = resultjson.map((student) => {
  const result = student.results;

  const subresults = result.map((subject) => ({
    ...subject,
    grade: gradereturner(subject.total)
  }))
  const subtotals = result.reduce((sum, { total }) => sum + total, 0);
  const overalltotal = 800;
  const percent = (subtotals / overalltotal) * 100;
  const overallgrade = gradereturner(percent);
  return {
    ...student,
    grade: overallgrade,
    results: subresults
  }
})

const listOfSubjectNames = ['BMATS101', 'BPHYS102', 'BPOPS103', 'BENGK106', 'BICOK107', 'BIDTK158', 'BESCK104B', 'BETCK105H'];

// var totalStudentsPerGrade = {
//   'S': 0,
//   'A': 0,
//   'B': 0,
//   'C': 0,
//   'D': 0,
//   'E': 0,
//   'F': 0
// }

// const sections = {
//   'A': {
//     'S': 0,
//     'A': 0,
//     'B': 0,
//     'C': 0,
//     'D': 0,
//     'E': 0,
//     'F': 0
//   },
//   'B': {
//     'S': 0,
//     'A': 0,
//     'B': 0,
//     'C': 0,
//     'D': 0,
//     'E': 0,
//     'F': 0
//   },
//   'C': {
//     'S': 0,
//     'A': 0,
//     'B': 0,
//     'C': 0,
//     'D': 0,
//     'E': 0,
//     'F': 0
//   }
// }

// const findTotalStudentsPerGrade = () => {
//   result.forEach(({ grade }) => {
//     totalStudentsPerGrade[grade] += 1;
//   });
// }

// findTotalStudentsPerGrade();
// fs.writeFileSync("./totalStudentsPerGrade.json", JSON.stringify(totalStudentsPerGrade))

// result.forEach((student) => {
//   const section = student.Section;
//   const grade = student.grade;
//   sections[section][grade] += 1;
// })

//fs.writeFileSync("./totalGradesPerSection.json", JSON.stringify(sections))


fs.writeFileSync("./resultnew.json", JSON.stringify(result));
