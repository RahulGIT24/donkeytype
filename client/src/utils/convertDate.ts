export default function convertToCustomFormat(dateStr:string) {
    const date = new Date(dateStr);

    const options:Intl.DateTimeFormatOptions = { 
        day: '2-digit', 
        month: 'short', 
        year: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
    };

    const formattedDate = date.toLocaleString('en-GB', options);

    const [dayMonthYear, time] = formattedDate.split(", ");
    return `${dayMonthYear} ${time}`;
}
