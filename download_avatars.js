var request = require('request');
var fs = require('fs');
var GITHUB_USER = "pachopa";
var GITHUB_TOKEN = "41ea54910b48572dad3235f7e678093e1436b466";

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
    var requestURL = 'https://'+ GITHUB_USER + ':' + GITHUB_TOKEN + '@api.github.com/repos/' + repoOwner + '/' + repoName + '/contributors';
    var requestOptions = {
      url: requestURL,
      headers: {"User-Agent": "pachopa"}
    };
    request(requestOptions, function(err, response, body) {
    if (err) { throw err; }
    cb(err, (JSON.parse(body)));
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
             throw err;
         })
         .on('response', function (response) {
             console.log('Downloading image...')
         })
         .on('end', function() {
             console.log('download complete.')
         })
         .pipe(fs.createWriteStream('./avatars/' + filePath + ".jpg"))
}

getRepoContributors("jquery", "jquery", function(err, result) {
  //console.log("Errors:", err);
  //console.log("Result:", result);
  result.forEach(function(image) {
    var avatar = image.avatar_url;
    var users = image.login;
    downloadImageByURL(avatar, users)
  });
});

