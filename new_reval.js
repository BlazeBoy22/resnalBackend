"use strict";

console.log('in new_reval.js')
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cheerio = require("cheerio");
var axios = require("axios").default;
var https = require("https");
var Path = require("path");
var csv = require("csvtojson");
//const __dirname="./"
var readLine = require("readline");
var fs = require("fs");
const { spawn } = require("child_process");

const result_link = "https://results.vtu.ac.in/DJcbcs24/index.php";
let result_link_2 = result_link.replace("index", "resultpage");
// console.log(result_link_2);
const filePath = '../result14.json';
let semester = 2;
let last_usn = 0;

var post_payload = {
    Token: "55af47bae3a4104902c28cea54dcce98ae34318b",
    captchacode: "iV4DKr",
    lns: "1BI17CS010",
};
var post_headers = {
    Host: "results.vtu.ac.in",
    Connection: "keep-alive",
    "Content-Length": "80",
    "Cache-Control": "max-age=0",
    "Upgrade-Insecure-Requests": "1",
    Origin: "https://results.vtu.ac.in",
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-User": "?1",
    "Sec-Fetch-Dest": "document",
    Referer: result_link,
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9",
    Cookie: "VISRE=4ldr63bhbo4it7marog3ndqt2c4c6r1o24t90rhhutdd82vm6tlqmitj0bbn22undfndp18pv1c04c3s8ib4472iumg09s2nv55taf2; VISRE=gl48oihilvkotdn96oofnj9ehtsm91gp97jg6ck6snen1btkeob4ru34jjqterit4pl3nldh6tg4uc4r89kdfle40pu17g47dds86s0",
};
var httpsAgent = new https.Agent({
    rejectUnauthorized: false,
});

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function runPythonScript() {
    return new Promise((resolve, reject) => {
        const pythonProcess = spawn('python', ['../captcha.py']);
  
        // Handle errors from the Python script
        pythonProcess.stderr.on('data', (data) => {
            console.error(`Error from Python script: ${data}`);
            reject(data.toString());
        });
  
        // Handle Python script exit/closing
        pythonProcess.on('close', (code) => {
            if (code === 0) {
                resolve(); // Resolve if script exits with code 0 (success)
            } else {
                reject(`Python script exited with non-zero status code: ${code}`);
            }
        });
    });
}

function getNewSession() {
    return __awaiter(this, void 0, void 0, function () {
        var url, headers, response, $, token, img_url, img_headers, path, writer, input, temp_cap;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    url = result_link;
                    headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.365",
                        Accept: "*/*",
                        "Cache-Control": "no-cache",
                        "Postman-Token": "b222b1f1-1fed-4490-965a-805f53a28e97",
                        Host: "results.vtu.ac.in",
                        "Accept-Encoding": "gzip, deflate, br",
                        Connection: "keep-alive",
                    };
                    return [4 /*yield*/, axios.get(url, { headers: headers, httpsAgent: httpsAgent })];
                case 1:
                    response = _a.sent();
                    $ = cheerio.load(response.data);
                    token = $("input[name=Token]").attr("value");
                    img_url = "https://results.vtu.ac.in" + $("img[alt='CAPTCHA code']").attr("src");
                    post_payload.Token = token || "";
                    img_headers = {
                        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
                        Accept: "*/*",
                        "Cache-Control": "no-cache",
                        "Postman-Token": "063fdb07-fe60-466a-be5e-fe08dec56a21",
                        Host: "results.vtu.ac.in",
                        "Accept-Encoding": "gzip, deflate, br",
                        Connection: "keep-alive",
                    };
                    img_headers["Cookie"] = response.headers["set-cookie"][0].replace("; path=/; secure; HttpOnly", "");
                    post_headers["Cookie"] = img_headers["Cookie"];
                    // console.log(img_url);
                    return [4 /*yield*/, axios.get(img_url, {
                            headers: img_headers,
                            httpsAgent: httpsAgent,
                            responseType: "stream",
                        })];
                case 2:
                    response = _a.sent();
                    path = Path.resolve(__dirname, "cap.png");
                    writer = fs.createWriteStream(path);
                    response.data.pipe(writer);
                    return [4 /*yield*/, new Promise(function (resolve, reject) {
                            writer.on("finish", resolve);
                            writer.on("error", reject);
                        })];
                case 3:
                    _a.sent();
                    // input = readLine.createInterface({
                    //     input: process.stdin,
                    //     output: process.stdout,
                    // });
                    
                    // const pythonScriptPath = Path.join(__dirname, "captcha.py");
                    // const pythonProcess = spawn("python3", [pythonScriptPath]);

                    return [4 /*yield*/, new Promise(async function (resolve, reject) {
                        // await delay(1000);
                        await runPythonScript();
                        const captchaCode = fs.readFileSync("output.txt", "utf8");
                        return resolve(captchaCode); 
                    })];
                case 4:
                    temp_cap = _a.sent();
                    console.log(temp_cap)
                    if (!(temp_cap != "")) return [3 /*break*/, 5];
                    post_payload["captchacode"] = temp_cap;
                    return [3 /*break*/, 7];
                case 5:
                    console.log("Empty Captcha - Getting new Session");
                    return [4 /*yield*/, getNewSession()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getResult(USN, Batch, Sem, Section) {
    return __awaiter(this, void 0, void 0, function () {
        var url, data, config, res, results_1, $_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    post_payload["lns"] = USN;
                    url = result_link_2;
                    data = "Token=".concat(post_payload.Token, "&lns=").concat(post_payload.lns, "&captchacode=").concat(post_payload.captchacode);
                    config = {
                        method: "post",
                        url: result_link_2,
                        headers: post_headers,
                        data: data,
                        httpsAgent: httpsAgent,
                    };
                    return [4 /*yield*/, axios(config)];
                case 1:
                    res = _a.sent();
                    if (!res.data.includes("Invalid captcha code !!!")) return [3 /*break*/, 3];
                    console.log("Invalid Captcha, getting new session");
                    return [4 /*yield*/, getNewSession()];
                case 2:
                    _a.sent();
                    return [2 /*return*/, getResult(USN, Batch, Sem, Section)];
                case 3:
                    if (!res.data.includes("Redirecting to VTU Results Site")) return [3 /*break*/, 5];
                    return [4 /*yield*/, getNewSession()];
                case 4:
                    _a.sent();
                    return [2 /*return*/, getResult(USN, Batch, Sem, Section)];
                case 5:
                    if (!res.data.includes("University Seat Number is not available or Invalid..!")) return [3 /*break*/, 6];
                    throw new Error("Student Not Found");
                case 6:
                    if (!res.data.includes("Please check website after 2 hour --- !!!")) return [3 /*break*/, 7];
                    console.log("IP Blocked");
                    return [3 /*break*/, 10];
                case 7:
                    if (!res.data.includes(`Semester : ${semester}`)) return [3 /*break*/, 8];
                    results_1 = [];
                    $_1 = cheerio.load(res.data);
                    $_1(".divTable").each(function (idx, v) {
                        if (idx == 0)
                            $_1(v)
                                .find(".divTableBody>.divTableRow")
                                .each(function (index, element) {
                                if (index != 0) {
                                    var result_1 = {};
                                    $_1(element)
                                        .find(".divTableCell")
                                        .each(function (i, ele) {
                                        switch (i) {
                                            case 0:
                                                result_1.subjectCode = $_1(ele).text().trim();
                                            case 1:
                                                result_1.subjectName = $_1(ele).text().trim();
                                            case 2:
                                                result_1.ia = parseInt($_1(ele).text().trim());
                                            case 3:
                                                result_1.ea = parseInt($_1(ele).text().trim());
                                            case 4:
                                                result_1.total = parseInt($_1(ele).text().trim());
                                            case 5:
                                                result_1.result = $_1(ele).text().trim();
                                        }
                                    });
                                    results_1.push(result_1);
                                }
                            });
                    });
                    return [2 /*return*/, {
                            name: $_1("td[style='padding-left:15px']").text().replace(": ", ""),
                            USN: USN,
                            results: results_1,
                            Batch: Batch,
                            Sem: Sem,
                            Section: Section,
                        }];
                case 8:
                    if (!(res.data ==
                        "<script type='text/javascript'>alert('Please check website after 2 hour !!!');window.location.href='index.php';</script>")) return [3 /*break*/, 10];
                    console.log("Session broken");
                    return [4 /*yield*/, getNewSession()];
                case 9:
                    _a.sent();
                    return [2 /*return*/, getResult(USN, Batch, Sem, Section)];
                case 10: return [2 /*return*/];
            }
        });
    });
}
(function () { return __awaiter(void 0, void 0, void 0, function () {
    var Result, json1, _i, json1_1, student, res, stream, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                // console.log("0");

                if (fs.existsSync(filePath))
                {
                    const stats = fs.statSync(filePath);
                    if (stats.size === 0) {
                        fs.appendFileSync(filePath, "[\n", 'utf8')
                    }
                    else{
                        // Read the JSON file synchronously
                        const jsonData = fs.readFileSync(filePath, 'utf8');
                        
                        // Delete last two characters from jsonData
                        const modifiedJsonData = jsonData.slice(0, -2);
                        
                        // Write modified JSON data back to file
                        fs.writeFileSync(filePath, modifiedJsonData, 'utf8');
                    
                        stream = fs.createWriteStream(filePath, { flags: 'a' });
                        stream.write(",\n");
                        stream.end();
                    }
                }

                else
                {
                    fs.writeFileSync(filePath, "[\n", 'utf8');
                }

                Result = [];
                return [4 /*yield*/, getNewSession()];
            case 1:
                // console.log("1");
                _a.sent();
                return [4 /*yield*/, csv().fromFile("5th_sem_2021.csv")];
            case 2:
                // console.log("2");
                json1 = _a.sent();
                _i = 0, json1_1 = json1;
                _a.label = 3;
            case 3:
                // console.log("3");
                if (!(_i < json1_1.length)) return [3 /*break*/, 8];
                student = json1_1[_i];
                console.log("".concat(json1.indexOf(student) + 1, "/").concat(json1.length, " - Name: ").concat(student.USN, " - Section: ").concat(student.Section));
                _a.label = 4;
            case 4:
                // console.log("4");
                _a.trys.push([4, 6, , 7]);
                return [4 /*yield*/, getResult(student.USN, parseInt(student.Batch), parseInt(student.Sem), student.Section)];
            case 5:
                // console.log("5");
                res = _a.sent();
                console.log(res);
                if(res == undefined) {
                    // console.log("check")
                    return [4 /*yield*/, getNewSession()];
                }
                // stream = fs.createWriteStream("result14_reval.json", { flags: 'a' });
                // stream.write(JSON.stringify(res) + ",\n");
                // stream.end();
                fs.appendFileSync(filePath, JSON.stringify(res) + ",\n", 'utf8')
                Result.push(res);
                last_usn = student.USN;
                console.log(res);
                console.log("Pushed result");
                return [3 /*break*/, 7];
            case 6:
                // console.log("6");
                error_1 = _a.sent();
                console.log(error_1);
                return [3 /*break*/, 7];
            case 7:
                // console.log("7");
                _i++;
                return [3 /*break*/, 3];
            case 8:
                // console.log("8");

                // Read the JSON file synchronously
                const jsonData = fs.readFileSync(filePath, 'utf8');
                        
                // Delete last two characters from jsonData
                let modifiedJsonData = jsonData.slice(0, -2);
                modifiedJsonData += '\n';
                        
                // Write modified JSON data back to file
                fs.writeFileSync(filePath, modifiedJsonData, 'utf8');
                
                fs.appendFileSync(filePath, "]", 'utf8')
                console.log("=========================");
                console.log("Completed");
                if(last_usn == 0)
                    console.log("No data Pushed");
                else
                    console.log("Last USN Pushed: ", last_usn);
                return [2 /*return*/];
        }
    });
}); })();

