import { auth, signInWithEmailAndPassword, onAuthStateChanged } from "./firebase-config.js";

const loginForm = document.getElementById("loginForm");
const errorMessage = document.getElementById("errorMessage");

// જો ફોર્મ સબમિટ થાય તો
if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault(); // પેજ રીફ્રેશ થતું અટકાવવા

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        // લોડિંગ બતાવવા માટે બટન ડીસેબલ કરવું
        const submitBtn = loginForm.querySelector("button");
        submitBtn.innerText = "ચેક થઈ રહ્યું છે...";
        submitBtn.disabled = true;
        errorMessage.classList.add("d-none");

        // Firebase Auth દ્વારા સાઇન ઇન
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // લોગિન સફળ થાય તો ડેશબોર્ડ પર જવું
                window.location.href = "dashboard.html";
            })
            .catch((error) => {
                // જો કોઈ ભૂલ આવે તો મેસેજ બતાવવો
                errorMessage.classList.remove("d-none");
                const errSpan = errorMessage.querySelector("span");
                if (error.code === "auth/user-not-found" || error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
                    errSpan.innerText = " ખોટો ઈમેઈલ અથવા પાસવર્ડ!";
                } else {
                    errSpan.innerText = " ભૂલ: " + error.message;
                }
                submitBtn.innerText = "લોગિન કરો";
                submitBtn.disabled = false;
            });
    });
}

// સિક્યોરિટી ચેક: જો યુઝર લોગિન વગર સીધો ડેશબોર્ડ ખોલવાનો પ્રયત્ન કરે
// આ લોજિક આપણે ડેશબોર્ડ પેજ માટે પણ વાપરીશું
export function checkAuthState() {
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // જો લોગિન ન હોય તો પાછા લોગિન પેજ પર મોકલી દેવા
            if (!window.location.href.toLowerCase().includes("index.html")) {
                window.location.href = "index.html";
            }
        }
    });
}
