import { db, doc, setDoc, getDoc } from "./firebase-config.js";

const companyForm = document.getElementById("companyForm");
const alertMessage = document.getElementById("alertMessage");

// Firestore ડોક્યુમેન્ટનો રેફરન્સ (companies કલેક્શનમાં profile નામનું ફિક્સ પેજ)
const compDocRef = doc(db, "companies", "profile");

// 🔄 પેજ લોડ થાય ત્યારે જુનો ડેટા Firestore માંથી લાવીને ફોર્મમાં બતાવવો
async function loadCompanyData() {
    try {
        const docSnap = await getDoc(compDocRef);
        if (docSnap.exists()) {
            const data = docSnap.data();
            document.getElementById("compName").value = data.name || "";
            document.getElementById("compMobile").value = data.mobile || "";
            document.getElementById("compAddress").value = data.address || "";
            document.getElementById("compGSTIN").value = data.gstin || "";
            document.getElementById("compPAN").value = data.pan || "";
            document.getElementById("compHSN").value = data.hsn || "";
            document.getElementById("bankName").value = data.bankName || "";
            document.getElementById("bankAccNo").value = data.bankAccNo || "";
            document.getElementById("bankIFSC").value = data.bankIFSC || "";
        }
    } catch (error) {
        showAlert("ડેટા લોડ કરવામાં ભૂલ આવી: " + error.message, "danger");
    }
}

// 💾 ફોર્મ સબમિટ થાય ત્યારે ડેટા Firestore માં સેવ કરવો
if (companyForm) {
    companyForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const submitBtn = companyForm.querySelector("button");
        submitBtn.disabled = true;
        submitBtn.innerText = "સેવ થઈ રહ્યું છે...";

        // બધો ડેટા ઓબ્જેક્ટમાં ભેગો કરવો
        const companyData = {
            name: document.getElementById("compName").value,
            mobile: document.getElementById("compMobile").value,
            address: document.getElementById("compAddress").value,
            gstin: document.getElementById("compGSTIN").value,
            pan: document.getElementById("compPAN").value,
            hsn: document.getElementById("compHSN").value,
            bankName: document.getElementById("bankName").value,
            bankAccNo: document.getElementById("bankAccNo").value,
            bankIFSC: document.getElementById("bankIFSC").value,
            updatedAt: new Date()
        };

        try {
            // Firestore માં ડેટા અપડેટ અથવા ક્રિએટ કરવો (setDoc)
            await setDoc(compDocRef, companyData);
            showAlert("🎉 કંપનીની વિગતો સફળતાપૂર્વક સેવ થઈ ગઈ છે!", "success");
        } catch (error) {
            showAlert("ડેટા સેવ કરવામાં ભૂલ આવી: " + error.message, "danger");
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-2"></i> માહિતી સેવ કરો';
        }
    });
}

// એલર્ટ મેસેજ બતાવવા માટેનું નાનું ફંક્શન
function showAlert(message, type) {
    alertMessage.className = `alert alert-${type} mt-3`;
    alertMessage.innerText = message;
    alertMessage.classList.remove("d-none");
    // 5 સેકન્ડ પછી મેસેજ ગાયબ કરવો
    setTimeout(() => { alertMessage.classList.add("d-none"); }, 5000);
}

// પેજ ઓપન થતાં જ રન કરવું
loadCompanyData();