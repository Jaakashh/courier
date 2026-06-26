import { db, auth, signOut, onAuthStateChanged, collection, onSnapshot, doc, updateDoc } from "./firebase-config.js";

const logoutBtn = document.getElementById("logoutBtn");
const pendingPaymentsTable = document.getElementById("pendingPaymentsTable");

// સમરી કાર્ડ્સના એલિમેન્ટ્સ
const totalBillsCount = document.getElementById("totalBillsCount");
const totalPaidAmount = document.getElementById("totalPaidAmount");
const totalPendingAmount = document.getElementById("totalPendingAmount");

// મોડલ (Pop-up) ના એલિમેન્ટ્સ
const paymentForm = document.getElementById("paymentForm");
const modalBillId = document.getElementById("modalBillId");
const paidDateInput = document.getElementById("paidDate");
const refNoInput = document.getElementById("refNo");
let paymentModalBootstrap;

// 🔒 ૧. સિક્યોરિટી ચેક: જો લોગિન ન હોય તો બહાર કાઢો
onAuthStateChanged(auth, (user) => {
    if (!user) {
        window.location.href = "index.html";
    }
});

// 🚪 ૨. લોગઆઉટ લોજિક
if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
        e.preventDefault();
        if (confirm("શું તમે ખરેખર લોગઆઉટ કરવા માંગો છો?")) {
            signOut(auth).then(() => { window.location.href = "index.html"; });
        }
    });
}

// 🔄 ૩. Firebase માંથી રીઅલ-ટાઇમ બિલ્સ લાવવા અને ગણતરી કરવી
onSnapshot(collection(db, "bills"), (snapshot) => {
    let totalBills = 0;
    let paidSum = 0;
    let pendingSum = 0;
    
    pendingPaymentsTable.innerHTML = "";
    totalBills = snapshot.size;

    if (snapshot.empty) {
        pendingPaymentsTable.innerHTML = `<tr><td colspan="6" class="text-center text-muted py-4">હમણાં કોઈ પેન્ડિંગ પેમેન્ટ નથી! 🎉</td></tr>`;
    }

    snapshot.forEach((docSnap) => {
        const bill = docSnap.data();
        const id = docSnap.id;

        // કાર્ડ્સના ટોટલ માટે ગણતરી
        if (bill.status === "Paid") {
            paidSum += bill.grandTotal;
        } else {
            pendingSum += bill.grandTotal;

            // જો બિલ Pending હોય તો જ નીચેના ટેબલમાં બતાવવું (Feature 10)
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td class="fw-bold">#${bill.billNo}</td>
                <td>${bill.date}</td>
                <td class="fw-bold text-dark">${bill.partyName}</td>
                <td>${bill.partyEmail || "-"}</td>
                <td class="text-danger fw-bold">₹ ${bill.grandTotal.toFixed(2)}</td>
                <td>
                    <button class="btn btn-sm btn-success pay-received-btn" data-id="${id}">
                        <i class="fa-solid fa-check me-1"></i> પેમેન્ટ આવ્યું (✓)
                    </button>
                </td>
            `;
            pendingPaymentsTable.appendChild(tr);
        }
    });

    // કાર્ડ્સમાં કિંમતો સેટ કરવી
    totalBillsCount.innerText = totalBills;
    totalPaidAmount.innerText = paidSum.toFixed(2);
    totalPendingAmount.innerText = pendingSum.toFixed(2);

    // "પેમેન્ટ આવ્યું" બટન પર ક્લિક ઇવેન્ટ આપવી
    document.querySelectorAll(".pay-received-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            modalBillId.value = btn.dataset.id;
            paidDateInput.valueAsDate = new Date(); // આજની તારીખ ડિફોલ્ટ સેટ થશે
            refNoInput.value = "";
            
            // બુટસ્ટ્રેપ મોડલ ઓપન કરવું
            paymentModalBootstrap = new bootstrap.Modal(document.getElementById('paymentModal'));
            paymentModalBootstrap.show();
        });
    });
});

// 💾 ૪. મોડલ ફોર્મ સબમિટ થાય ત્યારે બિલને Paid કરવું અને લિસ્ટમાંથી હટાવવું
if (paymentForm) {
    paymentForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = modalBillId.value;
        const paidDate = paidDateInput.value;
        const refNo = refNoInput.value;

        try {
            // Firestore માં આ બિલનું સ્ટેટ્સ બદલીને 'Paid' કરવું અને રેફરન્સ સેવ કરવો
            const billDocRef = doc(db, "bills", id);
            await updateDoc(billDocRef, {
                status: "Paid",
                paidDate: paidDate,
                paymentRefNo: refNo
            });

            alert("🎉 પેમેન્ટ સફળતાપૂર્વક જમા થઈ ગયું અને લિસ્ટમાંથી નીકળી ગયું!");
            paymentModalBootstrap.hide(); // પોપ-અપ બંધ કરવું
        } catch (error) {
            alert("ભૂલ આવી: " + error.message);
        }
    });
}
