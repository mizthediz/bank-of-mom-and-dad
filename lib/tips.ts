export const MONEY_TIPS = [
  "Saving even a little bit each week adds up fast!",
  "Money you don't spend is money you still have. 💰",
  "Interest is like a bonus for keeping your money in the bank.",
  "Before buying something, wait a day. If you still want it tomorrow, maybe it's worth it!",
  "Did you know? If you save $5 a week, you'd have $260 by the end of the year!",
  "The best time to start saving is right now.",
  "Goals make saving way more fun. What are you saving up for?",
  "Spending money on experiences (like trips or activities) often feels better than spending it on stuff.",
  "Even a piggy bank is a bank. Every coin counts!",
  "If you earn interest, your money is actually working for you while you sleep!",
  "A budget is just a plan for your money. Plans help!",
  "Rich people aren't rich because they earn a lot — they're rich because they save a lot.",
  "Want something expensive? Break it down: how many weeks of saving does it take?",
  "Every time you choose not to spend, you're choosing your future self.",
  "The more you save, the more interest you earn. It's a great loop!",
  "Needs vs. wants: needs are things you must have, wants are things you'd like to have.",
  "Giving some of your money away feels really good too. Try it sometime!",
  "A penny saved is a penny earned — and then some, with interest!",
  "Small amounts really add up. $1 a day is $365 a year!",
  "The habit of saving matters more than the amount. Start small, stay consistent!",
]

export function getRandomTip(): string {
  return MONEY_TIPS[Math.floor(Math.random() * MONEY_TIPS.length)]
}
