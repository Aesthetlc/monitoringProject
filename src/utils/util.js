let util = {}

util.tableRowFormat = function(row, item) {
    if (item.type === 'format') {
        return item.format[row[item.prop]]
    } else if (item.type === 'dateTime') {
        return row[item.prop] ? util.standardToDateTime(row[item.prop]) : '-'
    } else if (item.type === 'stampDateTime') {
        return row[item.prop] ? util.timestampToDateTime(row[item.prop]) : '-'
    } else if (item.type === 'func') {
        return item.func(row, item.prop)
    } else {
        return row[item.prop]
    }
}
// 时间戳转化为格式化时间
util.timestampToDateTime = function(value) {
    if (!value) {
        return ''
    } else {
        var date = new Date(value)
        var YY = date.getFullYear() + '/'
        var MM = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
        var DD = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        var hh = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
        var mm = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
        var ss = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
        return YY + MM + DD + ' ' + hh + mm + ss
    }
}
// 标准时间转化成格式化时间
util.standardToDateTime = function(value) {
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    if (!value) {
        return ''
    } else {
        var datetime = new Date(value)
        let y = datetime.getFullYear()
        let m = datetime.getMonth() + 1
        let d = datetime.getDate()
        let h = datetime.getHours()
        let mm = datetime.getMinutes()
        let s = datetime.getSeconds()
        return y + '-' + add0(m) + '-' + add0(d) + ' ' + add0(h) + ':' + add0(mm) + ':' + add0(s)
    }
}
// 标准时间转化成年月日格式
util.getyymmddDate = function(value) {
    function add0(m) {
        return m < 10 ? '0' + m : m
    }
    if (!value) {
        return ''
    } else {
        var datetime = new Date(value)
        let y = datetime.getFullYear()
        let m = datetime.getMonth() + 1
        let d = datetime.getDate()
        return y + '-' + add0(m) + '-' + add0(d)
    }
}
export default util
