const columnNames = ['name', 'tel']; // 資料庫表格欄位名稱
// 判斷資料欄位是否正確
function validateColumnNames(obj) {
    const keys = Object.keys(obj);
    for (const key of keys) {
      if (!columnNames.includes(key)) {
        return false;
      }
    }
    return true;
}
// 判斷手機格式是否正確
function isValidPhone(phone) {
    const regex = /^09\d{8}$/;
    return regex.test(phone);
}

module.exports={
    validateColumnNames,
    isValidPhone
}