Parse.initialize("2RjawbvEzCfQouhgNIeonN2RRBAQ3UbzhDCrIYLo", "qT0fnDQuvD3cTseb2P9yWqmT0DN5McqUu1rKCCrD"); 
var highScoreListP = new Array();
var foundHighScoreListP = false;
function getTopTen()
{
    var GameScore = Parse.Object.extend("bowl");
    var query = new Parse.Query(GameScore);
    query.descending("score");
    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        var siz = Math.min(results.length,12);
        for (var i = 0; i < siz; i++) { 
          var object = results[i];
          highScoreListP.push(object.get('playerName') + ' Score: ' + object.get('score'));
        }
        foundHighScoreListP = true;
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}
