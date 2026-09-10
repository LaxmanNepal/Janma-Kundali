import { adToBs, bsToAd, daysInBsMonth } from '@inicrea/bikram-sambat-core';

export const BS_MONTHS=['बैशाख','जेठ','असार','श्रावण','भाद्र','आश्विन','कार्तिक','मंसिर','पुष','माघ','फाल्गुण','चैत्र'];
export const MIN_BS_YEAR=1975;
export const MAX_BS_YEAR=2100;
export const daysInMonth=daysInBsMonth;

export function adStringToBs(date){
  const v=adToBs(String(date));
  return {year:v.year,month:v.month,day:v.day,label:`${v.year} ${BS_MONTHS[v.month-1]} ${v.day}`};
}

export function bsToAdString(year,month,day){
  const d=bsToAd({year:Number(year),month:Number(month),day:Number(day)},{utc:true});
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth()+1).padStart(2,'0')}-${String(d.getUTCDate()).padStart(2,'0')}`;
}

export function bsDateValid(year,month,day){
  year=Number(year);month=Number(month);day=Number(day);
  if(year<MIN_BS_YEAR||year>MAX_BS_YEAR||month<1||month>12||day<1)return false;
  return day<=daysInBsMonth(year,month);
}
