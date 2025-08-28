export default {
    checkOptionalNumber(value){
        return (/^[0-9;]*$/.test(String(value)));
    },
}