export const convertTime = (time: string) => {
  const unit = time.slice(-1);
  const value = parseInt(time.slice(0, -1), 10);
  const now = new Date();

  switch (unit) {
    case 'y':
      now.setFullYear(now.getFullYear() + value);
      break;

    case 'm':
      now.setMonth(now.getMonth() + value);
      break;

    case 'd':
      now.setDate(now.getDate() + value);
      break;

    case 'h':
      now.setHours(now.getHours() + value);
      break;

    case 's':
      now.setSeconds(now.getSeconds() + value);
      break;

    default:
      throw new Error('Invalid time unit');
  }

  return Math.floor(now.getTime() / 1000);
};
