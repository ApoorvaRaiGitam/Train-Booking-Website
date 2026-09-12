const BASE_URL="";

window.onload = function(){
    let user_id = localStorage.getItem("user_id");

    if(user_id){
        // Auto-load tickets
        getTickets();
    }
};

function registerUser(){
    fetch(`/register`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            username: document.getElementById("register_username").value,
            email: document.getElementById("register_email").value,
            password: document.getElementById("register_password").value,
            phone: document.getElementById("register_phone").value
        })
    })
    .then(res=>res.json())
    .then(data => {
        if(data.user_id){
            localStorage.setItem("user_id", data.user_id);
            alert(data.message);
            window.location.href = "/";
        } else {
            alert(data.error);
        }
    });
}

function loginUser(){
    fetch(`/login`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            username: document.getElementById("login_username").value,
            password: document.getElementById("login_password").value
        })
    })
    .then(res=>res.json())
    .then(data=>{
        if(data.user_id){
            localStorage.setItem("user_id", data.user_id);
            alert("Login successful");
            window.location.href = "/";
        } else {
            alert(data.error);
        }
    });
}

function loadTrains(){
    fetch(`/trains`)
    .then(res => res.json())
    .then(data => {
        let list = document.getElementById("trainList");
        list.innerHTML = "";

        data.forEach(train => {
            let li = document.createElement("li");
            li.innerHTML = `
                <b>${train.TrainName}</b><br>
                From: ${train.From} → To: ${train.To} <br>
                Departure: ${train.DepartureDate} ${train.DepartureTime} <br>
                Arrival: ${train.ArrivalDate} ${train.ArrivalTime} <br>
                <button onclick="bookFromTrain(${train.arrivalID}, ${train.departureID})">
                    Book
                </button>
            `;
            list.appendChild(li);
        });
    });
}

function bookFromTrain(trainID){
    let user_id = localStorage.getItem("user_id");

    if(!user_id){
        alert("Please login first");
        return;
    }

    // For now, assume arrival_id & departure_id = trainID
    fetch(`/book`,{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id: user_id,
            arrival_id: trainID,
            departure_id: trainID
        })
    })
    .then(res=>res.json())
    .then(data=>alert(data.message || data.error));
}

function bookTicket(){
    fetch(`/book`,{
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
            user_id: document.getElementById("user_id").value,
            arrival_id: document.getElementById("arrival_id").value,
            departure_id: document.getElementById("departure_id").value
        })
    })
    .then(res=>res.json())
    .then(data=>alert(data.message || data.error));
}

function logoutUser(){
    localStorage.removeItem("user_id");
    alert("Logged out successfully");
    window.location.href = "/login";
}

function getTickets(){
    let userID = localStorage.getItem("user_id");

    if(!userID){
        alert("Please log in first");
        return;
    }

    fetch(`/tickets?user_id=${userID}`)
    .then(res=>res.json())
    .then(data=>{
        let list=document.getElementById("ticketList");
        list.innerHTML="";

        data.forEach(ticket=>{
            let li=document.createElement("li");
            li.innerText=`${ticket.TrainName}: ${ticket.From} → ${ticket.To}`;
            list.appendChild(li);
        });
    });
}