// selector input
const pro_name = document.querySelector(".input-box #name");
const pro_amut = document.querySelector(".input-box #amut");
const pro_label = document.querySelector(".input-box #label");
const pro_alert = document.querySelector(".input-box #alert");
const btnSave = document.querySelector(".input-box #btnSave");
btnSave.addEventListener("click",OrderList); // Save Button
// selector output
const goods = document.querySelector(".goods");
//Add Element in Production List
function OrderList(){
    let order = document.createElement("div");
    order.className = "product"
    order.innerText = "kuy Yai"
    goods.appendChild(order);
}
// pro_name.addEventListener("keyup",() => console.log(pro_name.value));
// pro_amut.addEventListener("keyup",() => console.log(pro_amut.value));
// pro_label.addEventListener("keyup",() => console.log(pro_label.value));
// pro_alert.addEventListener("keyup",() => console.log(pro_alert.value));
