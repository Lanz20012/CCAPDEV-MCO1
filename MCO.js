class Student{
    //creating an account
    constructor(firstname, lastname, id, password, profilePicture = "default.jpg"){
        this.firstname = firstname
        this.lastname = lastname
        this.password = password
        this.profilePicture = profilePicture
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


//Sample student users
let students = [
    new Student ("Alice","O'Hera","12345678"),
    new Student ("Bob","Co","124idiwhcewbcob"),
    new Student ("Megan","Tan","125eohdwodjo"),
    new Student ("Alex","Smith","126echodoor"),
    new Student ("Hayley","Jacobs","123") //test user for login
]
//how the reservations for all of the students
let globalReservations = []

//Keep track of the student that most recently logged in
let loginStudent = null;

//Keeping track of the remembered user
let rememberedUser = null;

//-------------------Title Page Code -----------------------
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
        event.preventDefault();
        let isValid = true
        let fname = $("#fname").val()
        let lname = $("#lname").val()
        let password = $("#password").val()
        let namePattern = /^[A-Za-z\s]+$/

        if(!namePattern.test(fname)){
            isValid = false
            //message mentioning only letters are available
            $("#error-msg").text("First Name should only consist of letters").removeClass("d-none").fadeIn();
        }

        if(!namePattern.test(lname)){
            isValid = false
            //message mentioning only letters are available
            $("#error-msg").text("Last Name should only consist of letters").removeClass("d-none").fadeIn();
        }

        if(password.length<8){
            isValid = false
            //message to make password longer
            $("#error-msg").text("Password should be longer").removeClass("d-none").fadeIn();
        }

        if(isValid){
            //creation of a new student then added to the student list
            students.push(new Student(fname, lname, password))
            window.location.href = "dashboard.html"
        }
    })
})


//Login Form Validation (NOT FUNCTIONAL)
$(document).ready(function(){
    $("#account-login-info").submit(function(event){
        event.preventDefault();
        let fname = $("#fname").val()
        let lname = $("#lname").val()
        let password = $("#password").val()
        let student = students.find(student => 
            student.firstname === fname && student.lastname === lname && student.password === password
        );

        //if the user is remembered, auto-fill everything
        let rememberedUser = JSON.parse(localStorage.getItem("rememberedUser"));
        if (rememberedUser) {
            $("#fname").val(rememberedUser.firstname);
            $("#lname").val(rememberedUser.lastname);
            $("#password").val(rememberedUser.password);
            $("#remember-signin").prop("checked", true); // Keep checkbox checked
        }

        if(student){
            loginStudent = student
            window.location.href = "dashboard.html"
        } else {
            $("#error-msg").text("Incorrect information, try again.").removeClass("d-none").fadeIn();
        }
    })
})

//-------------------Profile Settings Code -----------------------
//TODO: ADD EDIT PROFILE
//TODO: ADD CHANGE PASSWORD

//Delete Account Button (NOT FUNCTIONAL)
$(document).ready(function () {
    $("#confirm-delete").click(function () {
        let enteredPassword = $("#confirm-password").val();

        if (enteredPassword === loggedInStudent.password) {
            students = students.filter(student => student !== loggedInStudent);
            loggedInStudent = null; // Clears login state
            displayStudents();
            alert("Your account has been deleted!");   
            // Close modal after deletion
            let modalInstance = bootstrap.Modal.getInstance(document.getElementById("confirmDeleteModal"));
            modalInstance.hide();
            //return to the titlepage after account gets deleted
            window.location.href = "titlepage.html"
        } else {
            alert("Incorrect password! Account deletion canceled.");
        }
    });
});

//Logout Account Button
$(document).ready(function(){
    $("#logout-button").click(function(){
        let rememberMe = $("#remember-signin").prop("checked")
        if(rememberMe){
            localStorage.setItem("rememberedUser", JSON.stringify(loginStudent))
        }else{
            localStorage.removeItem("rememberedUser")
        }

        let confirmLogout = confirm("Are you sure you want to log out?")
        if(confirmLogout){
            loginStudent = null
            window.location.href = "titlepage.html"
        }
    })
})

//-------------------Sidebar Features Code -----------------------
//People List Code
$(document).ready(function () {
    students.forEach(student => {
        let studentItem = $("<li>").addClass("list-group-item d-flex align-items-center my-4 bg-info text-white")
            .html(`
                <img src="${student.profilePicture}" class="rounded-circle me-3" width="40">
                <span>${student.firstname} ${student.lastname}</span>
            `);
        $("#people-list").append(studentItem)
    });
});

//People List Search Bar
$(document).ready(function () {
    $("#search-bar").on("keyup", function () {
        let searchValue = $(this).val().toLowerCase();

        $("#people-list li").each(function () {
            let studentName = $(this).find("span").text().toLowerCase(); // Extracts only the name inside <span>
            $(this).toggle(studentName.includes(searchValue)); // Shows/hides items dynamically
        });
    });
});
