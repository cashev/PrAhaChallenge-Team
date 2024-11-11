package util

import "time"

func ParseYearMonth(yearMonth string) (int, int, error) {
	date, err := time.Parse("2006-01", yearMonth)
	if err != nil {
		return 0, 0, err
	}
	return date.Year(), int(date.Month()), nil
}
