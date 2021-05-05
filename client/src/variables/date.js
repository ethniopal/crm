//Getting the date
export const getCurrentMonth = () => {
	const month = new Date().getMonth() + 1
	if (month < 10) {
		return `0${month}`
	} else {
		return month
	}
}
//Getting the date
export const getCurrentDay = () => {
	const day = new Date().getDate()
	if (day < 10) {
		return `0${day}`
	} else {
		return day
	}
}

//Current day/month/year
export const currentYear = new Date().getFullYear()
export const currentMonth = getCurrentMonth()
export const currentDay = getCurrentDay()
export const currentDate = `${currentYear}-${currentMonth}-${currentDay}`
export const lastYear = `${currentYear - 1}-${currentMonth}-${currentDay}`
export const nextYear = `${currentYear + 1}-${currentMonth}-${currentDay}`
