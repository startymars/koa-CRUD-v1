const columnNames = ['id','name', 'tel']; // 資料庫表格欄位名稱
// 判斷資料欄位是否正確
function validateColumnNames(obj) {
    const keys = Object.keys(obj);  //會將物件內的屬性名稱取出來，並重新組成一個陣列
    for (const key of keys) {
      if (!columnNames.includes(key)) {
        return false;
      }
    }
    return true;
}
// 判斷手機格式是否正確
function isValidPhone(phone) {
    const regex = /^09\d{8}$/; //判斷手機號碼必須以09開頭，且後面加上8位數字
    return regex.test(phone);
}

module.exports={
    validateColumnNames,
    isValidPhone
}