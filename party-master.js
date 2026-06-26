import { db, collection, addDoc, doc, setDoc, getDocs, deleteDoc, onSnapshot } from "./firebase-config.js";

const partyForm = document.getElementById("partyForm");
const partiesTableBody = document.getElementById("partiesTableBody");
const savePartyBtn = document.getElementById("savePartyBtn");
const cancelEditBtn = document.getElementById("cancelEditBtn");

const partiesCollection = collection(db, "parties");

// 🔄 Firestore માંથી લાઈવ ડેટા મેળવીને ટેબલમાં બતાવવો (Real-time Sync)
onSnapshot(partiesCollection, (snapshot) => {
    partiesTableBody.innerHTML = "";
    
    if (snapshot.empty) {
        partiesTableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">કોઈ પાર્ટી સેવ કરેલી નથી.</td></tr>`;
        return;
    }

    snapshot.forEach((documentSnap) => {
        const party = documentSnap.data();
        const id = documentSnap.id;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td class="fw-bold text-dark">${party.name}</td>
            <td>${party.email || "-"}</td>
            <td><span class="badge bg-light text-dark">${party.gstin || "-"}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 edit-btn" data-id="${id}" data-name="${party.name}" data-email="${party.email || ''}" data-gstin="${party.gstin || ''}"><i class="fa-solid fa-pen"></i></button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${id}"><i class="fa-solid fa-trash"></i></button>
            </td>
        `;
        partiesTableBody.appendChild(tr);
    });

    // બટન્સ પર ક્લિક ઇવેન્ટ્સ સેટ કરવી
    addActionEvents();
});

// 💾 નવી પાર્ટી એડ કરવી અથવા જૂની અપડેટ કરવી
partyForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("partyId").value;
    const name = document.getElementById("pName").value;
    const email = document.getElementById("pEmail").value;
    const gstin = document.getElementById("pGstin").value;

    const partyData = { name, email, gstin };

    try {
        if (id) {
            // જો ID હોય તો અપડેટ કરવું
            await setDoc(doc(db, "parties", id), partyData);
            alert("🎉 પાર્ટીની વિગતો અપડેટ થઈ ગઈ!");
        } else {
            // નહીંતર નવું એડ કરવું
            await addDoc(partiesCollection, partyData);
            alert("🎉 નવી પાર્ટી સફળતાપૂર્વક એડ થઈ ગઈ!");
        }
        resetForm();
    } catch (error) {
        alert("ભૂલ આવી: " + error.message);
    }
});

// 🛠️ Edit અને Delete બટનનું લોજિક
function addActionEvents() {
    // એડિટ બટન
    document.querySelectorAll(".edit-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.getElementById("partyId").value = btn.dataset.id;
            document.getElementById("pName").value = btn.dataset.name;
            document.getElementById("pEmail").value = btn.dataset.email;
            document.getElementById("pGstin").value = btn.dataset.gstin;

            savePartyBtn.innerHTML = '<i class="fa-solid fa-pen-to-square me-2"></i> સુધારો સેવ કરો';
            cancelEditBtn.classList.remove("d-none");
        });
    });

    // ડિલીટ બટન
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            if (confirm("શું તમે ખરેખર આ પાર્ટીને લિસ્ટમાંથી કાઢી નાખવા માંગો છો?")) {
                try {
                    await deleteDoc(doc(db, "parties", btn.dataset.id));
                    alert("પાર્ટી ડિલીટ થઈ ગઈ.");
                } catch (error) {
                    alert("ડિલીટ કરવામાં ભૂલ આવી: " + error.message);
                }
            }
        });
    });
}

// ફોર્મ ક્લીન કરવા માટે
cancelEditBtn.addEventListener("click", resetForm);

function resetForm() {
    partyForm.reset();
    document.getElementById("partyId").value = "";
    savePartyBtn.innerHTML = '<i class="fa-solid fa-floppy-disk me-2"></i> પાર્ટી સેવ કરો';
    cancelEditBtn.classList.add("d-none");
}