Parse.initialize("2RjawbvEzCfQouhgNIeonN2RRBAQ3UbzhDCrIYLo", "qT0fnDQuvD3cTseb2P9yWqmT0DN5McqUu1rKCCrD"); 
var queryFound = false;
var highScoreUploaded = false;
var lastUploadID = null;
var foundHighScoreListP = false;
var highScoreListP = new Array();
var session = "bbw";
function queryEntry()
{
    var GameScore = Parse.Object.extend(session);
    var query = new Parse.Query(GameScore);
    query.equalTo("mID", lastUploadID);
    query.find({
      success: function(results) {
            queryFound=true;
        }
      ,
      error: function(error) {
            queryFound = false;
      }
    }
    );
}
function getTopTen()
{
    var GameScore = Parse.Object.extend(session);
    var query = new Parse.Query(GameScore);
    query.descending("score");
    query.find({
      success: function(results) {
        // Do something with the returned Parse.Object values
        var siz = Math.min(results.length,15);
        highScoreListP = new Array();
        for (var i = 0; i < siz; i++) { 
          var object = results[i];
          highScoreListP.push('#'+(i+1)+' '+object.get('playerName') +' Score: ' + object.get('score'));
        }
        foundHighScoreListP = true;
      },
      error: function(error) {
        alert("Error: " + error.code + " " + error.message);
      }
    });
}
function insertToHighscoreDatabase(name)
{
    highScoreUploaded = false;
    var GameScore = Parse.Object.extend(session);
    var gameScore = new GameScore();
     
    gameScore.set("score", lastActualScore);
    lastActualScore = 0;
    gameScore.set("playerName", name);
    gameScore.set("mID", gameScore.id);
    lastUploadID = gameScore.id;
     
    gameScore.save(null, {
      success: function(gameScore) {
        // Execute any logic that should take place after the object is saved.
        highScoreUploaded = true;
      },
      error: function(gameScore, error) {
        // Execute any logic that should take place if the save fails.
        // error is a Parse.Error with an error code and description.
      }
    });
}
