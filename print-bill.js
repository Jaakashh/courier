import { db, doc, getDoc, collection, query, where, getDocs } from "./firebase-config.js";

const urlParams = new URLSearchParams(window.location.search);
const billNoParam = parseInt(urlParams.get('billNo'));

async function loadInvoiceData() {
    if (!billNoParam) { alert("Bill number not found!"); return; }

    try {
        const compSnap = await getDoc(doc(db, "companies", "profile"));
        let upiId = "9898565622@okaxis";
        let compName = "Ma Umiya Enterprise";

        if (compSnap.exists()) {
            const comp = compSnap.data();
            compName = comp.name;
            
            // ✓ Company info
            const compNameEl = document.getElementById("lblCompName");
            if (compNameEl) compNameEl.innerText = comp.name;
            
            const compAddrEl = document.getElementById("lblCompAddress");
            if (compAddrEl) compAddrEl.innerText = comp.address || "";
            
            const compMobileEl = document.getElementById("lblCompMobile");
            if (compMobileEl) compMobileEl.innerText = comp.mobile || "";
            
            const compGstinEl = document.getElementById("lblCompGSTIN");
            if (compGstinEl) compGstinEl.innerText = comp.gstin || "-";
            
            const bankNameEl = document.getElementById("lblBankName");
            if (bankNameEl) bankNameEl.innerText = comp.bankName || "State Bank of India";
            
            const bankAccEl = document.getElementById("lblBankAcc");
            if (bankAccEl) bankAccEl.innerText = comp.bankAccNo || "3874 5678 9012";
            
            const bankIfscEl = document.getElementById("lblBankIFSC");
            if (bankIfscEl) bankIfscEl.innerText = comp.bankIFSC || "SBIN0011234";
        }

        const q = query(collection(db, "bills"), where("billNo", "==", billNoParam));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.empty) { alert("Bill data not found!"); return; }

        querySnapshot.forEach((doc) => {
            const bill = doc.data();
            
            // ✓ Bill info
            const billNoEl = document.getElementById("lblBillNo");
            if (billNoEl) billNoEl.innerText = bill.billNo;
            
            const billDateEl = document.getElementById("lblBillDate");
            if (billDateEl) billDateEl.innerText = bill.date;
            
            // ✓ Party info
            const partyNameEl = document.getElementById("lblPartyName");
            if (partyNameEl) partyNameEl.innerText = bill.partyName;
            
            const partyContactEl = document.getElementById("lblPartyContact");
            if (partyContactEl) partyContactEl.innerText = bill.partyEmail || "-";
            
            const partyGstinEl = document.getElementById("lblPartyGSTIN");
            if (partyGstinEl) partyGstinEl.innerText = bill.partyGSTIN || "-";
            
            // ✓ Totals - Fixed to match HTML IDs
            const subTotalEl = document.getElementById("lblSubTotalFoot");
            if (subTotalEl) subTotalEl.innerText = bill.subTotal.toFixed(2);
            
            const gstEl = document.getElementById("lblGST");
            if (gstEl) gstEl.innerText = bill.gstAmount.toFixed(2);
            
            const grandTotalEl = document.getElementById("lblGrandTotal");
            if (grandTotalEl) grandTotalEl.innerText = bill.grandTotal.toFixed(2);
            
            const qrAmountEl = document.getElementById("lblQrAmount");
            if (qrAmountEl) qrAmountEl.innerText = bill.grandTotal.toFixed(2);

            // ✓ Items table
            const printItemsBody = document.getElementById("printItemsBody");
            if (printItemsBody) {
                printItemsBody.innerHTML = "";
                bill.items.forEach((item, index) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${item.date}</td>
                        <td>${item.center}</td>
                        <td class="td-doc">${item.docNo}</td>
                        <td class="td-party">${item.pName || "-"}</td>
                        <td class="td-weight">${item.weight || "-"}</td>
                        <td class="td-amount">₹${item.amount.toFixed(2)}</td>
                    `;
                    printItemsBody.appendChild(tr);
                });
            }
            
            // ✓ QR Code generation
            const upiUrl = `upi://pay?pa=${upiId}&pn=${encodeURIComponent(compName)}&am=${bill.grandTotal.toFixed(2)}&cu=INR`;
            
            const qrcodeEl = document.getElementById("qrcode");
            if (qrcodeEl) {
                qrcodeEl.innerHTML = "";
                try {
                    new QRCode(qrcodeEl, {
                        text: upiUrl,
                        width: 90,
                        height: 90,
                        colorDark: "#1a56a0",
                        colorLight: "#ffffff",
                        correctLevel: QRCode.CorrectLevel.M
                    });
                } catch(err) {
                    console.log("QR Code generation skipped");
                }
            }
        });

    } catch (err) {
        alert("Error loading bill: " + err.message);
        console.error(err);
    }
}

loadInvoiceData();