const firebaseConfig = {
    apiKey: "AIzaSyBhptD2TAslKl3GHf42VcAoxqb8i0fzbEU",
    authDomain: "travelmore-hotel-project.firebaseapp.com",
    databaseURL: "https://travelmore-hotel-project-default-rtdb.firebaseio.com",
    projectId: "travelmore-hotel-project",
    storageBucket: "travelmore-hotel-project.appspot.com",
    messagingSenderId: "819567025563",
    appId: "1:819567025563:web:e727ab64a765903071553e",
    measurementId: "G-5FJE91QX92"
};

firebase.initializeApp(firebaseConfig);

function generateFirebaseItem(ID, value) {
    return {
        id: ID,
        data: value
    }
}

function addElementInFirebase(REF, data) {
    firebase.database().ref(`${REF}/${randomID()}`).set(data);
}

function removeElementFromFirebase(REF, id) {
    firebase.database().ref(`${REF}/${id}`).remove();
}

function getRefFromFirebase(REF) {
    const result = [];
    firebase.database().ref(REF).on("value", (response) => {
        response.forEach((element) => {
            result.push(generateFirebaseItem(element.key, element.val()));
        });
    });
    return result;
}

function getElementFromFirebase(REF, id) {
    const array = getRefFromFirebase(REF);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            array.forEach((element) => {
                if (element.id === id) {
                    resolve(element);
                }
            });
            reject("404");
        }, 1000);
    });
}

function randomID() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
        let r = (Math.random() * 16) | 0;
        let v = c == "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}