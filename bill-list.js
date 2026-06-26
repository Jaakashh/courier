import { db, collection, onSnapshot, doc, deleteDoc } from "./firebase-config.js";

const billsTableBody = document.getElementById("billsTableBody");
const searchInvoice = document.getElementById("searchInvoice");

let allBills = []; // બધો ડેટા લોકલ સ્ટોર કરવા માટે (સર્ચ કરતી વખતે કામ લાગશે)

// 🔄 Firebase Firestore માંથી બધા બિલ લાઈવ લોડ કરવા (Real-time Sync)
const billsCollection = collection(db, "bills");

onSnapshot(billsCollection, (snapshot) => {
    allBills = [];
    snapshot.forEach((doc) => {
        allBills.push({ id: doc.id, ...doc.data() });
    });

    // બિલ નંબર્સને ઉતરતા ક્રમમાં ગોઠવવા (જેથી નવું બિલ સૌથી ઉપર દેખાય)
    allBills.sort((a, b) => b.billNo - a.billNo);

    // ટેબલમાં બતાવવું
    renderBills(allBills);
});

// ટેબલમાં ડેટા રેન્ડર (બતાવવા) માટેનું ફંક્શન
function renderBills(billsToDisplay) {
    billsTableBody.innerHTML = "";

    if (billsToDisplay.length === 0) {
        billsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">કોઈ બિલ મળ્યા નથી.</td></tr>`;
        return;
    }

    billsToDisplay.forEach((bill) => {
        const tr = document.createElement("tr");

        // સ્ટેટ્સ પ્રમાણે બેજ કલર નક્કી કરવો (Pending = લાલ, Paid = લીલો)
        const statusBadge = bill.status === "Paid" 
            ? `<span class="badge bg-success-subtle text-success p-2">✓ Paid</span>`
            : `<span class="badge bg-danger-subtle text-danger p-2">⏳ Pending</span>`;

        tr.innerHTML = `
            <td class="fw-bold">#${bill.billNo}</td>
            <td>${bill.date}</td>
            <td class="text-start fw-bold text-dark">${bill.partyName}</td>
            <td class="fw-bold text-primary">₹ ${bill.grandTotal.toFixed(2)}</td>
            <td>${statusBadge}</td>
            <td>
                <button class="btn btn-sm btn-outline-primary me-1 print-btn" data-billno="${bill.billNo}"><i class="fa-solid fa-print"></i> પ્રિન્ટ</button>
                <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${bill.id}" data-billno="${bill.billNo}"><i class="fa-solid fa-trash"></i> કાઢો</button>
            </td>
        `;
        billsTableBody.appendChild(tr);
    });

    // બટન્સ ઉપર ક્લિક ઇવેન્ટ્સ આપવી
    addActionEvents();
}

// 🛠️ એક્શન બટન્સ (Print & Delete) નું કોડિંગ
function addActionEvents() {
    // પ્રિન્ટ બટન દબાવતા સીધું જૂનું પ્રિન્ટ પેજ ખૂલશે
    document.querySelectorAll(".print-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            window.location.href = `print-bill.html?billNo=${btn.dataset.billno}`;
        });
    });

    // ડિલીટ બટનનું કોડિંગ
    document.querySelectorAll(".delete-btn").forEach(btn => {
        btn.addEventListener("click", async () => {
            const id = btn.dataset.id;
            const bNo = btn.dataset.billno;

            if (confirm(`⚠️ શું તમે ખરેખર બિલ નંબર #${bNo} ને ડિલીટ કરવા માંગો છો? આ ડેટા પાછો નહીં મળે!`)) {
                try {
                    await deleteDoc(doc(db, "bills", id));
                    alert(`બિલ #${bNo} ડિલીટ થઈ ગયું છે.`);
                } catch (err) {
                    alert("ડિલીટ કરવામાં ભૂલ આવી: " + err.message);
                }
            }
        });
    });
}

// 🔍 લાઈવ સર્ચ ફિલ્ટર
searchInvoice.addEventListener("input", () => {
    const keyword = searchInvoice.value.toLowerCase();
    
    const filtered = allBills.filter(bill => {
        return bill.billNo.toString().includes(keyword) || bill.partyName.toLowerCase().includes(keyword);
    });
    
    renderBills(filtered);
});