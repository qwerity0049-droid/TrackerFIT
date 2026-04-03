export const QUOTES = [
  "Единственная плохая тренировка — та, которой не было.",
  "Дисциплина — это решение делать то, чего очень не хочется делать, чтобы достичь того, чего очень хочется.",
  "Твое тело может все. Главное — убедить в этом свой разум.",
  "Не останавливайся, когда устал. Останавливайся, когда закончил.",
  "Каждый день — это еще один шанс стать сильнее.",
  "Результат не приходит за один день. Это ежедневный труд.",
  "Сложно — это не значит невозможно.",
  "Мотивация заставляет начать. Привычка заставляет продолжать.",
  "Боль, которую ты чувствуешь сегодня, превратится в силу, которую ты почувствуешь завтра.",
  "Не сравнивай свое начало с чужой серединой."
];

export function getDailyQuote() {
  // Use the day of the year to pick a quote, so it changes daily but stays consistent for the day
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  return QUOTES[dayOfYear % QUOTES.length];
}
