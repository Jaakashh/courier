import { db, doc, setDoc, getDoc, collection, addDoc, getDocs, updateDoc } from "./firebase-config.js";
// ઈમેઈલ સર્વિસ ઈનિશિયલાઈઝ કરવી (અહીં તમારી Public Key નાખવી)
emailjs.init("FyrMsU0D1ZwH_VDWu");
let partiesList = [];
let nextBillNo = 101;

const txtBillNo = document.getElementById("txtBillNo");
const partyInput = document.getElementById("partyName");
const suggestionsDiv = document.getElementById("suggestions");
const itemsBody = document.getElementById("itemsBody");
const billForm = document.getElementById("billForm");

async function fetchNextBillNo() {
    const counterRef = doc(db, "counters", "billNo");
    const counterSnap = await getDoc(counterRef);
    if (counterSnap.exists()) {
        nextBillNo = counterSnap.data().lastBillNo + 1;
    } else {
        await setDoc(counterRef, { lastBillNo: 100 });
    }
    txtBillNo.innerText = nextBillNo;
}

async function loadParties() {
    try {
        const querySnapshot = await getDocs(collection(db, "parties"));
        partiesList = [];
        querySnapshot.forEach((doc) => { partiesList.push(doc.data()); });
        console.log("પાર્ટીઓ સફળતાપૂર્વક લોડ થઈ ગઈ છે:", partiesList.length);
    } catch (error) {
        console.error("પાર્ટીઓ લોડ કરવામાં ભૂલ આવી:", error);
    }
}

partyInput.addEventListener("input", () => {
    const val = partyInput.value.toLowerCase().trim();
    suggestionsDiv.innerHTML = "";
    if (!val) { suggestionsDiv.classList.add("d-none"); return; }

    const filtered = partiesList.filter(p => p.name && p.name.toLowerCase().includes(val));
    if (filtered.length > 0) {
        suggestionsDiv.classList.remove("d-none");
        filtered.forEach(party => {
            const div = document.createElement("div");
            div.className = "suggestion-item";
            div.innerText = party.name;
            div.addEventListener("click", () => {
                partyInput.value = party.name;
                document.getElementById("partyEmail").value = party.email || "";
                document.getElementById("partyGSTIN").value = party.gstin || "";
                suggestionsDiv.classList.add("d-none");
            });
            suggestionsDiv.appendChild(div);
        });
    } else {
        suggestionsDiv.classList.add("d-none");
    }
});

// બહાર ક્લિક કરવાથી સાજેશન લિસ્ટ બંધ થઈ જાય
document.addEventListener("click", (e) => {
    if (e.target !== partyInput && e.target !== suggestionsDiv) {
        suggestionsDiv.classList.add("d-none");
    }
});

// 🔄 સીધું જ રકમ પ્લસ કરવાનું ફંક્શન (No Multiplication!)
function calculateBill() {
    let subTotal = 0;
    const rows = itemsBody.querySelectorAll("tr");
    rows.forEach(row => {
        const amount = parseFloat(row.querySelector(".item-amount").value) || 0;
        subTotal += amount;
    });

    const cgst = subTotal * 0.09;
    const sgst = subTotal * 0.09;
    const grandTotal = subTotal + cgst + sgst;

    document.getElementById("lblSubTotal").innerText = subTotal.toFixed(2);
    document.getElementById("lblCGST").innerText = cgst.toFixed(2);
    document.getElementById("lblSGST").innerText = sgst.toFixed(2);
    document.getElementById("lblGrandTotal").innerText = grandTotal.toFixed(2);
}

document.getElementById("addMoreItemBtn").addEventListener("click", () => {
    const newRow = document.createElement("tr");
    const todayStr = new Date().toISOString().split('T')[0];

    newRow.innerHTML = `
        <td><input type="date" class="form-control item-date" value="${todayStr}" required></td>
        <td><input type="text" class="form-control item-center" placeholder="Center" required></td>
        <td><input type="text" class="form-control item-docno" placeholder="Doc No." required></td>
        <td><input type="text" class="form-control item-pname" placeholder="Receiver Name"></td>
        <td><input type="text" class="form-control item-weight" placeholder="Wight"></td>
        <td><input type="number" class="form-control item-amount" value="0" step="0.01" min="0" required></td>
        <td><button type="button" class="btn btn-sm btn-outline-danger remove-row-btn"><i class="fa-solid fa-trash"></i></button></td>
    `;
    newRow.classList.add("new-item-row");
    itemsBody.appendChild(newRow);
    addEventToRows(newRow);
});

function addEventToRows(row) {
    row.querySelector(".item-amount").addEventListener("input", calculateBill);
    row.querySelector(".remove-row-btn").addEventListener("click", () => {
        row.remove();
        calculateBill();
    });
}

billForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const pName = partyInput.value;
    const pEmail = document.getElementById("partyEmail").value;
    const pGstin = document.getElementById("partyGSTIN").value;

    const partyExists = partiesList.some(p => p.name && p.name.toLowerCase() === pName.toLowerCase());
    if (!partyExists) {
        await addDoc(collection(db, "parties"), { name: pName, email: pEmail, gstin: pGstin });
    }

    const items = [];
    itemsBody.querySelectorAll("tr").forEach(row => {
        items.push({
            date: row.querySelector(".item-date").value,
            center: row.querySelector(".item-center").value,
            docNo: row.querySelector(".item-docno").value,
            pName: row.querySelector(".item-pname").value,
            weight: row.querySelector(".item-weight").value,
            amount: parseFloat(row.querySelector(".item-amount").value)
        });
    });

    const billData = {
        billNo: nextBillNo,
        date: document.getElementById("billDate").value,
        partyName: pName,
        partyEmail: pEmail,
        partyGSTIN: pGstin,
        items: items,
        subTotal: parseFloat(document.getElementById("lblSubTotal").innerText),
        gstAmount: parseFloat(document.getElementById("lblCGST").innerText) * 2,
        grandTotal: parseFloat(document.getElementById("lblGrandTotal").innerText),
        status: "Pending"
    };

    try {
        await addDoc(collection(db, "bills"), billData);
        await updateDoc(doc(db, "counters", "billNo"), { lastBillNo: nextBillNo });
        
        if (pEmail && pEmail.includes("@")) {
            const emailParams = {
                email: pEmail,
                invoice_number: nextBillNo.toString(),
                amount_due: billData.grandTotal.toFixed(2),
                due_date: document.getElementById("billDate").value,
                invoice_link: `https://jaakashh.github.io/courier/BillLink.html?billNo=${nextBillNo}`,
                pdf_link: `https://jaakashh.github.io/courier/BillLink.html?billNo=${nextBillNo}`
            };

            try {
                const response = await emailjs.send("service_ug8xjao", "template_b3lnkg9", emailParams);
                console.log("📩 ઈમેઈલ સફળતાપૂર્વક મોકલાઈ ગયો!", response.status, response.text);
            } catch (emailError) {
                console.error("❌ EmailJS એરર વિગત:", emailError);
                alert("બિલ સેવ થયું છે, પણ ઈમેઈલ મોકલવામાં ભૂલ આવી: " + JSON.stringify(emailError));
            }
        }
        alert("🎉 Bill Saved and Email Sent Successfully!");
        window.location.href = `print-bill.html?billNo=${nextBillNo}`;
    } catch (err) {
        alert("Error: " + err.message);
    }
});

// ✨ ફૉર્મમાં Enter Key નેવિગેશન સેટ અપ કરો
function setupEnterKeyNavigation() {
    const formInputs = document.querySelectorAll(".form-control");
    const formArray = Array.from(formInputs);
    
    formArray.forEach((input, index) => {
        input.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                e.preventDefault();
                
                if (input.id === "partyName") {
                    suggestionsDiv.classList.add("d-none");
                }
                
                if (index < formArray.length - 1) {
                    formArray[index + 1].focus();
                }
            }
        });
    });
}

// ✨ આઈટમ ટેબલમાં Enter key થી નવી રો જોડવું
function setupItemTableEnterKey() {
    function attachEnterListeners() {
        const allInputs = itemsBody.querySelectorAll("input");
        const inputArray = Array.from(allInputs);
        
        inputArray.forEach((input, idx) => {
            input.addEventListener("keydown", (e) => {
                if (e.key === "Enter") {
                    e.preventDefault();
                    
                    const currentRow = input.closest("tr");
                    
                    if (input === currentRow.querySelector(".item-amount")) {
                        const newRow = document.createElement("tr");
                        const todayStr = new Date().toISOString().split('T')[0];
                        
                        newRow.innerHTML = `
                            <td><input type="date" class="form-control item-date" value="${todayStr}" required></td>
                            <td><input type="text" class="form-control item-center" placeholder="Center" required></td>
                            <td><input type="text" class="form-control item-docno" placeholder="Doc No." required></td>
                            <td><input type="text" class="form-control item-pname" placeholder="Receiver Name"></td>
                            <td><input type="text" class="form-control item-weight" placeholder="Wight"></td>
                            <td><input type="number" class="form-control item-amount" value="0" step="0.01" min="0" required></td>
                            <td><button type="button" class="btn btn-sm btn-outline-danger remove-row-btn"><i class="fa-solid fa-trash"></i></button></td>
                        `;
                        newRow.classList.add("new-item-row");
                        itemsBody.appendChild(newRow);
                        addEventToRows(newRow);
                        calculateBill();
                        
                        newRow.querySelector(".item-date").focus();
                    } else {
                        const inputsInRow = Array.from(currentRow.querySelectorAll("input"));
                        const currentIdx = inputsInRow.indexOf(input);
                        const nextInput = inputsInRow[currentIdx + 1];
                        if (nextInput) {
                            nextInput.focus();
                        }
                    }
                }
            });
        });
    }
    
    attachEnterListeners();
    
    const observer = new MutationObserver(() => {
        attachEnterListeners();
    });
    
    observer.observe(itemsBody, { childList: true });
}

// Document લોડ થાય ત્યારે બધા મહત્વના ફંક્શન એકસાથે રન થશે
document.addEventListener("DOMContentLoaded", () => {
    // Set today's date defaults
    document.getElementById("billDate").valueAsDate = new Date();
    const firstRow = itemsBody.querySelector("tr");
    if (firstRow) {
        firstRow.querySelector(".item-date").valueAsDate = new Date();
        addEventToRows(firstRow);
    }
    setupEnterKeyNavigation();
    setupItemTableEnterKey();
    fetchNextBillNo(); // બિલ નંબર લોડ થશે
    loadParties();     // ફાયરબેઝ માંથી બધી પાર્ટી લોડ થશે
});
