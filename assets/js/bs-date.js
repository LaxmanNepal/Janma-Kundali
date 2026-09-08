import { adToBs, bsToAd, daysInMonth, MIN_BS_YEAR, MAX_BS_YEAR } from 'nepali-calendar-panchang';

export const BS_MONTHS=['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुण','चैत्र'];
export { MIN_BS_YEAR, MAX_BS_YEAR, daysInMonth };

export function adStringToBs(date){
  const v=adToBs(new Date(`${date}T00:00:00Z`));
  return {year:v.year,month:v.month,day:v.day,label:`${v.year} ${BS_MONTHS[v.month-1]} ${v.day}`};
}

export function bsToAdString(year,month,day){
  const d=bsToAd(Number(year),Number(month),Number(day));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

export function bsDateValid(year,month,day){
  if(year<MIN_BS_YEAR||year>MAX_BS_YEAR||month<1||month>12||day<1)return false;
  return day<=daysInMonth(year,month);
}
