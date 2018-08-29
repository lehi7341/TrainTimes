//firebase configuration
var config = {
    apiKey: "AIzaSyBfbvlluEvcOKZznn3-kcWwHfomzSwUeCg",
    authDomain: "train-times-18f5c.firebaseapp.com",
    databaseURL: "https://train-times-18f5c.firebaseio.com",
    storageBucket: "train-times-18f5c.appspot.com",
    messagingSenderID: "543325536199"
};

firebase.initializeApp(config);

//reference to firebase
var trainInfo = firebase.database();

$("#addTrainBtn").on("click", function () {
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = moment($("#firstTrainInput").val().trim(), "HH:mm").subtract(10, "years").format("X");  // converts everthing in add train to be on one line
    var frequency = $("#frequencyInput").val().trim();

    var nextTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency
    }

    trainInfo.ref().push(nextTrain);

    alert("Train Added");
    console.log(firstTrain);

    $("trainNameInput").val("");
    $("destinationInput").val("");
    $("firstTrainInput").val("");
    $("frequencyInput").val("");

    return false;
})

//collects and stores data to firebase
trainInfo.ref().on("child_added", function (snapshot) {
    var name = snapshot.val().name;
    var destination = snapshot.val().destination;
    var frequency = snapshot.val().frequency;
    var firstTrain = snapshot.val().firstTrain;

    //when is the next train and how many minutes remain until it arrives
    var remainder = moment().diff(moment.unix(firstTrain), "minutes") % frequency;
    var minutes = frequency - remainder;
    var arrival = moment().add(minutes, "m").format("hh:mm A");


    //adds the data to the current train schedule
    $("#trainTable > tbody").append("<tr><td>" + name + "</td><td>" + destination + "</td><td>" + frequency + "</td><td>" + arrival + "</td><td>"
        + minutes + "</td></tr>");

})