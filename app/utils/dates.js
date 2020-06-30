export const convertToYear = date => new Date(date).getFullYear() || '';

export const convertToDate = date => {
  const newDate = new Date(date);

  return (
    `${newDate.getDate() + 1}/${newDate.getMonth() +
      1}/${newDate.getFullYear()}` || 'Sin información'
  );
};

export const getTodayDate = () => new Date().toISOString().slice(0, 10);


export const timeDifference = (current, previous) => {

  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
       return Math.round(elapsed/1000) + ' segundos';   
  }

  else if (elapsed < msPerHour) {
       return Math.round(elapsed/msPerMinute) + ' minutos';   
  }

  else if (elapsed < msPerDay ) {
       return Math.round(elapsed/msPerHour ) + ' horas';   
  }

  else if (elapsed < msPerMonth) {
      return 'aproximadamente ' + Math.round(elapsed/msPerDay) + ' dias';   
  }

  else if (elapsed < msPerYear) {
      return 'aproximadamente ' + Math.round(elapsed/msPerMonth) + ' meses';   
  }

  else {
      return 'aproximadamente ' + Math.round(elapsed/msPerYear ) + ' años';   
  }
}
