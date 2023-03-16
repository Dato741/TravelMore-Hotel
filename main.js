const Email = document.querySelector("#email");
const Password = document.querySelector("#password");
const Repassword = document.querySelector("#repassword");
const RegisterBtn = document.querySelector("#registerbtn");
const Loginemail = document.querySelector("#logindemail");
const Loginpassword = document.querySelector("#loginpassword");
const Loginbtn = document.querySelector("#loginbtn");
const AddHotelbtn = document.querySelector("#addhotel");
const hotelName = document.querySelector("#hotelname");
const hotelDescription = document.querySelector("#hoteldescription");
const hotelPrice = document.querySelector("#hotelprice");
const hotelImginput = document.querySelector("#hotelimage");
const uploadHotelbtn = document.querySelector("#uploadhotelbtn");
const hotelDisplayArea = document.querySelector("#hotel-display");
const logOutbtn = document.querySelector("#logoutbtn");
const RemoveBtn = document.querySelector(".removebtn");

const urlMain = location.href;
const page = urlMain.split("/").pop().split(".")[0];


function actionLogin() {
    let userEmail = Loginemail.value;
    let userPassword = Loginpassword.value;

    const usersArrayUpdated = getRefFromFirebase("users");

    setTimeout(() => {
        const userIndex = usersArrayUpdated.findIndex(users =>
            users.data.email === userEmail &&
            users.data.password === userPassword
        );
        if (userIndex === -1) {
            displayToast("Failed, Wrong data", "error", "red");
        } else {
            displayToast("Successfully authorized", "success", "green");
            const id = usersArrayUpdated[userIndex].id;
            sessionStorage.setItem("user_id", id);
            location.reload();
        }
    }, 1000);
}

function validateData(Email, Password, Repassword) {
    if (Email.value == "" || Password.value == "" || Repassword.value == "" || Password.value != Repassword.value) return false;
    else return true;
}

function logOut() {
    sessionStorage.clear();
    location.reload();
}

if (sessionStorage.getItem("user_id")) {
    const id = sessionStorage.getItem("user_id");
    if (id == "8b10f4b2-172f-40eb-943d-3246291d9eaf") {
        const user = getElementFromFirebase("users", id);
        user.then(() => {
            document.querySelectorAll(".auth").forEach((element) => {
                element.remove();
                AddHotelbtn.style.display = "inline-block";
                logOutbtn.style.display = "inline-block";
            });
            setTimeout(() => {
                document.querySelectorAll(".removebtn").forEach((element) => {
                    element.style.display = "inline-block";
                    element.addEventListener("click", () => {
                        removeElementFromFirebase("Card", element.id);
                        location.reload();
                    })
                })
            }, 2100);
            logOutbtn.addEventListener("click", () => {
                sessionStorage.clear();
                location.reload();
            })
        }).catch(() => {
            logOut();
        });

        if (page == "register") {
            location.href = "index.html"
        }
    } else if (id.length === 36 && id !== "8b10f4b2-172f-40eb-943d-3246291d9eaf") {
        const user = getElementFromFirebase("users", id);
        user.then(() => {
            document.querySelectorAll(".auth").forEach((element) => {
                element.remove();
                AddHotelbtn.style.display = "inline-block";
                logOutbtn.style.display = "inline-block";
            });
            logOutbtn.addEventListener("click", () => {
                sessionStorage.clear();
                location.reload();
            })
        }).catch(() => {
            logOut();
        });

        if (page == "register") {
            location.href = "index.html"
        }

    } else {
        logOut();
    }
}

if (page == "index") {
    Loginbtn.addEventListener("click", () => {
        actionLogin();
    })
    const cardsarray = getRefFromFirebase("Card");
    setTimeout(() => {
        document.querySelector("#spinner").remove();
        cardsarray.forEach((card) => {
            hotelDisplayArea.innerHTML += `
            <div class="card position-relative ms-4" style="width: 18rem;">
                <a href="#" class="text-decoration-none text-dark d-inline-block mb-5">
                    <div class="card-picture">
                        <img src="${card.data.imgSrc}"
                            class="card-img-top" alt="...">
                    </div>
                    <div class="card-body">
                        <h5 class="card-title fw-bold">${card.data.title}</h5>
                        <p class="card-text mb-1">${card.data.description}</p>
                        <span class="fw-semibold">${card.data.price}$</span>
                    </div>
                </a>
                <i class="bi bi-x-circle-fill removebtn" id="${card.id}"></i>
            </div>
            `
        });
    }, 2000);
}

if (page == "register") {
    RegisterBtn.addEventListener("click", () => {
        if (validateData(Email, Password, Repassword)) {
            addElementInFirebase("users", {
                email: Email.value,
                password: Password.value
            })
            displayToast("Successfully registered", "success", "green");
            RegisterBtn.disabled = true;
            const usersArrayUpdated = getRefFromFirebase("users");
            setTimeout(() => {
                const userIndex = usersArrayUpdated.findIndex(users =>
                    users.data.email === Email.value &&
                    users.data.password === Password.value
                );
                const id = usersArrayUpdated[userIndex].id;
                sessionStorage.setItem("user_id", id);
                location.href = "index.html";
            }, 2000);
        }
    })
}

if (page == "hotel") {
    uploadHotelbtn.addEventListener("click", () => {
        if (hotelName.value == "" || hotelDescription.value == "" || hotelPrice.value == "" || hotelImginput.value == "") {
            displayToast("Fill all fields", "error", "red");
        } else {
            imageToString(hotelName.value, hotelDescription.value, hotelPrice.value);
        }
    })
}

function clearvalues() {
    hotelName.value = "";
    hotelDescription.value = "";
    hotelPrice.value = "";
    hotelImginput.value = "";
    uploadHotelbtn.disabled = true;
}

function imageToString(title, text, price) {
    const reader = new FileReader();
    try {
        reader.readAsDataURL(hotelImginput.files[0]);
        reader.onload = () => {
            addElementInFirebase("Card", {
                title: title,
                description: text,
                price: price,
                imgSrc: reader.result
            });
            displayToast("Hotel Uploaded", "success", "green");
            clearvalues();
        }
    } catch (err) { }
    setTimeout(() => {
        location.href = "index.html";
    }, 2000);
}