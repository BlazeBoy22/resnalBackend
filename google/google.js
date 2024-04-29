const axios = require('axios');
const qs = require('qs');
let data = qs.stringify({
  '_method': 'post',
  'authenticity_token': 'owe5zap0kpiQiWRlMGnTHi6tBiu8laDlJtwEH2Coed9QNl2TkjrT+SGNir7z1NHjNj2kuvd0uDPXf3iuC2N34Q==' 
});

let videoid = 375733


for (var i = videoid; i < videoid + 200; i++)
{
    let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: `https://www.cloudskillsboost.google/course_sessions/3850926/video/${i}/complete_button`,
  headers: { 
    'authority': 'www.cloudskillsboost.google', 
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7', 
    'accept-language': 'en-GB,en-IN;q=0.9,en-US;q=0.8,en;q=0.7', 
    'cache-control': 'max-age=0', 
    'content-type': 'application/x-www-form-urlencoded', 
    'cookie': 'variant_determinant=946; auto_accept_organization=; __zlcmid=1GElsNTyJ3J6qRr; _gid=GA1.2.1565962187.1688944590; user.id=MTAzOTk0ODc%3D--d13b9778fa93534a509dffe3df97b0678b6626b8; _ga_2X30ZRBDSG=GS1.1.1688944589.30.1.1688944611.38.0.0; _ga=GA1.1.61822636.1686046113; _ga_3BRP57TPMR=GS1.1.1688944590.30.1.1688944611.39.0.0; user.expires_at=IjIwMjMtMDctMDlUMjE6MTY6NTUuOTQ3LTA0OjAwIg%3D%3D--328e495b78a811f917ddf09273934175cbf79fec; _cvl-4_1_14_session=Y2VMbTFLcURXdGwyeHMvSzdtRmNnbHNDU2p6aHFndXA1eXRXMDVadzJhK1lrcCtmTW5NSWZLYmRZVWx5UzlKVmhXRTRpTEF0YTBIYWVjc0FES1ZGT0hEL2s3bXIyQkovNkRKMmtqbFRMQXlWN25rcHB6bSs3Y081ZXJQTy9rUFh0VE1IVjJDeGhZWjVKWmVEMUorRmhTYnUxVkppQnpETTh4RVNUOTN2UkVQUFUzSFVrK1hyTUd2MytFY2JTUEpIcWR2TFRZaERNNHZEQzFUVXJsQlpVMDFRSExKM2xOTy9oK2tkajUvZjhlZlZTQ2dzNVhPeUxBWmFDeS8rVGFqUWxySy9xYzlUN2M4RjQyeGFkbnowMzhvd3l6WGx1TE5TVlFxQklpaUpOdm5Ma1kxWEo4OGZ0L3FuSHZBK2F0R0FFeE9yaWVMVkRlbVdwdVB4clpWRVBVbXIwS3NLc2VkMlRUTWtYaE1nTkZnOW1CM2VmVkh4ZDlqUmkyQ0VSTjJzVDBzYVhnQWdIclZSSDhxWjR6S1ZkMERVT2k2OGdCcldFemNwb092RFFqMGQvbDQvU3plNXZ6MzRSdVpab2s4RlJVVHc3bjZ5dWlabWV1WTBDZlhOeEdkOGgralRXT2tzbXBlM0xyUG5qeXM9LS1HU2E3eDBxYlNGdUxyeXNTb0kwTWhBPT0%3D--3281c7caecc82c247c01e58d9de54c2910037396', 
    'origin': 'https://www.cloudskillsboost.google', 
    'referer': `https://www.cloudskillsboost.google/course_sessions/3850926/video/${i}`, 
    'sec-ch-ua': '"Not.A/Brand";v="8", "Chromium";v="114", "Google Chrome";v="114"', 
    'sec-ch-ua-mobile': '?0', 
    'sec-ch-ua-platform': '"Windows"', 
    'sec-fetch-dest': 'document', 
    'sec-fetch-mode': 'navigate', 
    'sec-fetch-site': 'same-origin', 
    'sec-fetch-user': '?1', 
    'upgrade-insecure-requests': '1', 
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'
  },
  data : data
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});
}


