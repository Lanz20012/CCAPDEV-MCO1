class Student{
    //creating an account
    constructor(firstname, lastname, id, password){
        this.firstname = firstname
        this.lastname = lastname
        this.password = password
        this.reservations = []
    }

    makingReservation(date, labNumber, timeSlot){
        const isAvailable = !globalReservations.some(reservation => 
            reservation.date == date && reservation.labNumber == labNumber && reservation.timeSlot == timeSlot
        )

        if(isAvailable){
            //labNumber is available
            const reservation = new Reservation(date, labNumber, timeSlot)
            this.reservations.push(reservation)
            globalReservations.push(reservation)
            labMap.set(date,(labNumber, timeSlot))
            //reservation successfully made message
        } else{
            //message: lab is not available
        }
    }

    checkAccountDetails(){
        return this.firstname, this.lastname
    }

    seeReservations(){
        reservations.forEach(reservation=> {
            //display reservations user has made
        })
    }

    editReservations(oldDate, oldlabNumber, oldTimeSlot, newDate, newlabNumber, newTimeSlot){
        reservations.forEach(reservation=> {
            if(reservation.date == oldDate && reservation.labNumber == oldlabNumber && reservation.timeSlot == oldTimeSlot){
                reservation.date = newDate
                reservation.labNumber = newlabNumber
                reservation.newTimeSlot = newTimeSlot
            }
        })
    }
}

//reservations includes date, time slot, and lab number
class Reservation {
    constructor(date, labNumber, timeSlot, studentName){
        this.date = date
        this.labNumber = labNumber
        this.timeSlot = timeSlot
        this.studentName = studentName
    }

    checkAvailability(date,labNumber,timeSlot){
        return labMap.getDate(date)?.get(labNumber)?.getTimeSlot(timeSlot) ?? false
    }
}


class LabTech{
    constructor(name, password){
        this.name = name
        this.password = password
    }

    //deleting Reservations
    deletingReservation(date, labNumber, timeSlot){
        //deleteing the data from the globalReservation
        globalReservations = globalReservations.filter(res =>
            !(res.date == date && res.labNumber == labNumber && res.timeSlot == timeSlot)
        )

        //deleting the reservation from the Student
        students.forEach(student=>{
                student.reservations = student.reservations.filter(res=>
                    !(res.date ==date && res.labNumber == labNumber && res.timeSlot == timeSlot)
                )
        })
    }

    //making reservation for walk in student
    makeReservation(studentName,date,labNumber,timeSlot){
        
    }
}

const labMap = new Map() // Initializing the lab map with timeslots for 7 days
//generate date for the calendar along with timeslots
const generateDays = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);
        days.push(date.toISOString().split("T")[0]); // Format as YYYY-MM-DD
    }
    return days;
};
generateDays().forEach(date => {
    const labData = new Map();
    
    for (let i = 1; i <= 5; i++) { // 5 labs
        let timeslots = new Map();
        let startTime = new Date();
        startTime.setHours(7, 30, 0, 0); // Start at 7:30 AM

        for (let j = 0; j < 35; j++) { // 35 timeslots, each 30 minutes apart
            let hours = startTime.getHours();
            let minutes = startTime.getMinutes();
            let timeString = `${hours}:${minutes.toString().padStart(2, '0')}`; // Format "HH:MM"

            timeslots.set(timeString, true); // Mark as available
            startTime.setMinutes(startTime.getMinutes() + 30); // Increment by 30 minutes
        }

        labData.set(`${i}`, { available: true, timeslots});
    }

    labMap.set(date, labData);
});


//sample student users
const students = [
    new Student ("Alice","O'Hera","12345678"),
    new Student ("Bob","Co","124idiwhcewbcob"),
    new Student ("Megan","Tan","125eohdwodjo"),
    new Student ("Alex","Smith","126echodoor"),
    new Student ("Hayley","Jacobs","123")
]
//how the reservations for all of the students
const globalReservations = []

//when search a student, display the student's name after search
function displayStudent(name){
    students.forEach(student=>{
        if(student.name == name){
            return name
        }
    })
    return "Student Not Found"
}

//when a student wants to delete their account
function deleteAccount(name){

}


//Handles the buttons in the titlepage giving access to the creating and login forms
$(document).ready(function(){
    $("#button-create-account").click(function(){
        $("#account-creation-container").removeClass("d-none").fadeIn();
        $("#account-login-container").addClass("d-none").fadeOut();
    });

    $("#button-login-account").click(function(){
        $("#account-login-container").removeClass("d-none").fadeIn();
        $("#account-creation-container").addClass("d-none").fadeOut();
    });

    $("#account-creation-container form").submit(function (event) {
        event.preventDefault(); // Stops the default form submission
        $("#account-creation-container").show();
    });
});

//Creation Form Validation
$(document).ready(function(){
    $("#account-creation-info").submit(function(event){
        let fname = $("#fname").val()
        let lname = $("#lname").val()
        let password = $("#password").val()
        let namePattern = /^[A-Za-z\s]+$/

        if(namePattern.test(fname)){
            //alert mentioning only letters are available
        }

        if(namePattern.test(lname)){
            //alert mentioning only letters are available
        }

        if(password.length()<8){
            //message to make password longer
        }

        //creation of a new student then added to the student list
        students = new Student(fname, lname, password)
    })
})

//Login Form Validation
$(document).ready(function(){
    $("#account-login-info").submit(function(event){
        let fname = $("#fname").val()
        let lname = $("#lname").val()
        let password = $("#password").val()

        

    })
})






