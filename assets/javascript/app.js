// Initialize Firebase
var config = {
    apiKey: 'AIzaSyDFB2lMpvsfJ4dDFjeXTZ969EqvLozvrSo',
    authDomain: 'train-time-5df0b.firebaseapp.com',
    databaseURL: 'https://train-time-5df0b.firebaseio.com',
    projectId: 'train-time-5df0b',
    storageBucket: '',
    messagingSenderId: '918678247755',
};
firebase.initializeApp(config);
var trainData = firebase.database();

$(document).on('click', '#add-train-btn', function(event) {
    event.preventDefault();

    var trainName = $('#train-name-input')
        .val()
        .trim();
    var destination = $('#destination-input')
        .val()
        .trim();
    var firstTrain = $('#first-train-input')
        .val()
        .trim();
    var frequency = $('#frequency-input')
        .val()
        .trim();
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    };
    trainData.ref().push(newTrain);
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert('Train successfully added');

    $('#train-name-input').val('');
    $('#destination-input').val('');
    $('#first-train-input').val('');
    $('#frequency-input').val('');

    return false;
});

trainData.ref().on('child_added', function(childSnapshot, prevChildKey) {
    console.log(childSnapshot.val());

    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var timeArr = childSnapshot.val().firstTrain;
    var time = childSnapshot.val().time;
    var trainTime = moment()
        .hours(timeArr[0])
        .minutes(timeArr[1]);
    console.log("trainTime " + trainTime);
    var maxMoment = moment.max(moment(), trainTime);
    console.log("max " + maxMoment);
    var key = childSnapshot.key;
    var remove = "<button class='btn btn-danger rem' id=" + key + '>Remove</button>';
    var currentTime = moment();
    console.log('Current Time: ' + moment(currentTime).format('hh:mm'));
    var firstTimeConverted = moment(timeArr, 'hh:mm').subtract(1, 'years');
    var diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    var tRem = diffTime % tFrequency;
    var tMinNext = tFrequency - tRem;
    var nextTr = moment().add(tMinNext, "minutes");
    var nextTrain = moment(nextTr).format('hh:mm A');


    console.log('firt ' + firstTimeConverted);
    console.log("diff  " + diffTime);
    console.log("rem " + tRem);
    console.log("tMIN " + tMinNext);
    console.log("nextTr" + nextTr);
    console.log(moment(nextTr).format('hh:mm A'));

    $('#curtime').text(currentTime);

    // Add each train's data into the table
    $('tbody').append('<tr><td>' + tName + '</td><td>' + tDestination + '</td><td>' + tFrequency + '</td><td>' + nextTrain + '</td><td>' + tMinNext + '</td><td>' + remove + '</td></tr>');
    $(document).on('click', '.rem', deleteTrain);
    $('#update').click(function() {
        location.reload();
    });

    function deleteTrain() {
        var deleteKey = $(this).attr('id');
        //console.log($(this).attr("id"));
        trainData
            .ref()
            .child(deleteKey)
            .remove();

        location.reload();
    }
});