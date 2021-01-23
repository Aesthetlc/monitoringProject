//时间转换
export function timeFormat(Time) {
    var time = new Date(Time);
    var year = time.getFullYear();
    var month = time.getMonth() + 1;
    var date = time.getDate();
    var hours = time.getHours();
    var minutes = time.getMinutes();
    var seconds = time.getSeconds();
    function add0(m) {
        return m < 10 ? '0' + m : m;
    }
    var startTime = add0(year) + '-' + add0(month) + '-' + add0(date) + ' ' + add0(hours) + '-' + add0(minutes) + '-' + add0(seconds);
    return startTime;
}
